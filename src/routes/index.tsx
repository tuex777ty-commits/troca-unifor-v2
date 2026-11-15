import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import {
  AffiliateSection,
  CategoryGrid,
  HeroSection,
  HowItWorksSection,
  MarketplaceSection,
  Ticker,
  TrustSection,
} from "@/components/swap/landing-sections";
import {
  categories,
  filterListings,
  listings,
  type DemoUser,
  type Listing,
  type ListingKind,
  type ListingStatus,
} from "@/components/swap/data";
import { CommunityFeatures } from "@/components/swap/community-features";
import { CreateListingDialog } from "@/components/swap/create-listing-dialog";
import { LoginDialog } from "@/components/swap/login-dialog";
import { ListingDialog } from "@/components/swap/listing-dialog";
import { ListingsSection } from "@/components/swap/listings-section";
import { QuickActions } from "@/components/swap/quick-actions";
import { SiteFooter, SiteHeader } from "@/components/swap/site-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TROCA — Trocas, serviços e projetos da Unifor" },
      {
        name: "description",
        content:
          "Sua assinatura parada vale mais trocada. Explore streaming, estudos, ferramentas e projetos na comunidade Unifor.",
      },
      { property: "og:title", content: "TROCA — Conexões que valem mais" },
      {
        property: "og:description",
        content:
          "Trocas, serviços e projetos entre alunos da Unifor. Encontre o que você precisa no mural da comunidade.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [allListings, setAllListings] = useState<Listing[]>(listings);
  const [view, setView] = useState<"mural" | "saved" | "mine">("mural");
  const [kind, setKind] = useState<ListingKind | "">("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<"newest" | "price">("newest");
  const [loginOpen, setLoginOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [user, setUser] = useState<DemoUser | null>(null);
  const [activeListing, setActiveListing] = useState<Listing | null>(null);
  const [notice, setNotice] = useState("");
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);

  const toast = useCallback((message: string) => {
    setNotice(message);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("troca-favs") ?? "[]") as unknown;
      if (Array.isArray(saved) && saved.every((id) => Number.isInteger(id))) {
        setSavedIds(saved as number[]);
      }
    } catch {
      setSavedIds([]);
    } finally {
      setFavoritesLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!favoritesLoaded) return;
    try {
      localStorage.setItem("troca-favs", JSON.stringify(savedIds));
    } catch {
      toast("Não foi possível salvar favoritos neste navegador.");
    }
  }, [favoritesLoaded, savedIds, toast]);

  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.1 },
    );

    document.querySelectorAll(".scroll-reveal").forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  const visibleListings = filterListings(allListings, filter, search, savedIds, {
    kind,
    maxPrice: maxPrice.trim() ? Number(maxPrice) : undefined,
    sort,
    view,
    owner: user?.name,
  });
  const chooseCategory = (category: string) => {
    setView("mural");
    setFilter(category);
  };
  const resetFilters = () => {
    setFilter("Todos");
    setSearch("");
    setKind("");
    setMaxPrice("");
    setSort("newest");
  };
  const selectView = (next: "mural" | "saved" | "mine") => {
    if (next !== "mural" && !user) {
      setLoginOpen(true);
      return;
    }
    setView(next);
    setFilter("Todos");
  };
  const createListing = () => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    setCreateOpen(true);
  };
  const toggleSaved = (id: number) => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    setSavedIds((current) =>
      current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id],
    );
  };
  const addListing = (
    draft: Omit<Listing, "id" | "owner" | "whatsapp" | "icon" | "color" | "status" | "createdAt">,
  ) => {
    if (!user) return;
    const category = categories.find((item) => item.name === draft.cat) ?? categories[0];
    const listing: Listing = {
      ...draft,
      id: Math.max(0, ...allListings.map((item) => item.id)) + 1,
      owner: user.name,
      whatsapp: user.whatsapp,
      icon: category.icon,
      color: category.color,
      status: "active",
      createdAt: Date.now(),
    };
    setAllListings((current) => [listing, ...current]);
    setCreateOpen(false);
    setView("mine");
    setFilter("Todos");
    toast("Anúncio criado nesta sessão de demonstração");
  };
  const manageListing = (id: number, status: ListingStatus) => {
    setAllListings((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
    toast(
      status === "active"
        ? "Anúncio reativado"
        : status === "paused"
          ? "Anúncio pausado"
          : status === "completed"
            ? "Anúncio marcado como concluído"
            : "Anúncio excluído desta sessão",
    );
  };
  const contactListing = (listing: Listing) => {
    if (!user) {
      setActiveListing(null);
      setLoginOpen(true);
      return;
    }
    const message = `Oi! Vi seu anúncio "${listing.name}" na TROCA e tenho interesse.`;
    window.open(
      `https://wa.me/55${listing.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    toast("Conversa aberta no WhatsApp");
  };
  const discoverListing = () => {
    const available = allListings.filter((item) => item.status === "active");
    if (available.length) setActiveListing(available[Math.floor(Math.random() * available.length)]);
  };

  return (
    <>
      <SiteHeader
        onLogin={() => setLoginOpen(true)}
        onSignOut={() => {
          setUser(null);
          setView("mural");
          toast("Perfil de demonstração encerrado");
        }}
        onCreateListing={createListing}
        user={user}
        onChooseCategory={chooseCategory}
      />
      <main>
        <HeroSection
          onChooseCategory={chooseCategory}
          onDiscover={discoverListing}
          onCreate={createListing}
        />
        <Ticker />
        <CategoryGrid onChooseCategory={chooseCategory} />
        <ListingsSection
          view={view}
          filter={filter}
          search={search}
          savedIds={savedIds}
          listings={visibleListings}
          signedIn={!!user}
          kind={kind}
          maxPrice={maxPrice}
          sort={sort}
          onFilterChange={chooseCategory}
          onViewChange={selectView}
          onSearchChange={setSearch}
          onKindChange={setKind}
          onMaxPriceChange={setMaxPrice}
          onSortChange={setSort}
          onResetFilters={resetFilters}
          onSavedToggle={toggleSaved}
          onListingSelect={setActiveListing}
          onManageListing={manageListing}
          onCreateListing={createListing}
          onLogin={() => setLoginOpen(true)}
        />
        <HowItWorksSection />
        <TrustSection />
        <MarketplaceSection onAction={createListing} />
        <AffiliateSection
          onAction={() =>
            document.getElementById("partners")?.scrollIntoView({ behavior: "smooth" })
          }
        />
        <CommunityFeatures user={user} onLogin={() => setLoginOpen(true)} onToast={toast} />
      </main>
      <SiteFooter onChooseCategory={chooseCategory} />
      {activeListing && (
        <ListingDialog
          listing={activeListing}
          onClose={() => setActiveListing(null)}
          onContact={contactListing}
          onReport={() => {
            setActiveListing(null);
            toast("Denúncia registrada apenas nesta demonstração");
          }}
        />
      )}
      {loginOpen && (
        <LoginDialog
          onClose={() => setLoginOpen(false)}
          onDemoLogin={(profile) => {
            setUser(profile);
            setLoginOpen(false);
            toast(`Perfil de demonstração iniciado. Bem-vindo, ${profile.name}!`);
          }}
        />
      )}
      {createOpen && (
        <CreateListingDialog onClose={() => setCreateOpen(false)} onSubmit={addListing} />
      )}
      <QuickActions
        onView={selectView}
        onCreate={createListing}
        onLogin={() => setLoginOpen(true)}
        onDiscover={discoverListing}
        onCategory={chooseCategory}
      />
      {notice && (
        <div className="app-toast" role="status">
          {notice}
        </div>
      )}
    </>
  );
}
