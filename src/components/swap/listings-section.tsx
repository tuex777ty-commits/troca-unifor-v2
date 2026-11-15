import { ArrowLeftRight, Heart, Search, Truck, X, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  categories,
  type Listing,
  type ListingKind,
  type ListingStatus,
} from "@/components/swap/data";

type ListingsSectionProps = {
  view: "mural" | "saved" | "mine";
  filter: string;
  search: string;
  savedIds: number[];
  listings: readonly Listing[];
  signedIn: boolean;
  kind: ListingKind | "";
  maxPrice: string;
  sort: "newest" | "price";
  onFilterChange: (filter: string) => void;
  onViewChange: (view: "mural" | "saved" | "mine") => void;
  onSearchChange: (search: string) => void;
  onKindChange: (kind: ListingKind | "") => void;
  onMaxPriceChange: (price: string) => void;
  onSortChange: (sort: "newest" | "price") => void;
  onResetFilters: () => void;
  onSavedToggle: (id: number) => void;
  onListingSelect: (listing: Listing) => void;
  onManageListing: (id: number, status: ListingStatus) => void;
  onCreateListing: () => void;
  onLogin: () => void;
};

export function ListingsSection({
  view,
  filter,
  search,
  savedIds,
  listings,
  signedIn,
  kind,
  maxPrice,
  sort,
  onFilterChange,
  onViewChange,
  onSearchChange,
  onKindChange,
  onMaxPriceChange,
  onSortChange,
  onResetFilters,
  onSavedToggle,
  onListingSelect,
  onManageListing,
  onCreateListing,
  onLogin,
}: ListingsSectionProps) {
  const filters = ["Todos", ...categories.map((category) => category.name)];

  return (
    <section className="listings scroll-reveal" id="anuncios">
      <div className="container">
        <div className="section-eyebrow">O mural da comunidade</div>
        <div className="section-head">
          <div>
            <h2>
              {view === "mine"
                ? "Meus anúncios."
                : view === "saved"
                  ? "Seus salvos."
                  : "Encontre o seu próximo match."}
            </h2>
            <p>O que alguém não usa pode ser exatamente o que você precisa.</p>
          </div>
          <div className="listing-tools">
            <Button variant="outline" onClick={signedIn ? onCreateListing : onLogin}>
              Anunciar
            </Button>
            <Button variant="ghost" onClick={() => onFilterChange("Todos")}>
              Ver todos <ArrowLeftRight />
            </Button>
          </div>
        </div>
        <div className="listing-view-tabs" aria-label="Visualização dos anúncios">
          {(["mural", "saved", "mine"] as const).map((item) => (
            <Button
              key={item}
              variant="outline"
              className={view === item ? "selected" : ""}
              aria-pressed={view === item}
              onClick={() => {
                if (item !== "mural" && !signedIn) {
                  onLogin();
                  return;
                }
                onViewChange(item);
              }}
            >
              {item === "mural" ? "Mural" : item === "saved" ? "Salvos" : "Meus anúncios"}
              {item === "saved" ? ` (${savedIds.length})` : ""}
            </Button>
          ))}
        </div>
        <ListingSearch value={search} onChange={onSearchChange} />
        <div className="listing-extra-filters">
          <label>
            Tipo
            <select
              value={kind}
              onChange={(event) => onKindChange(event.target.value as ListingKind | "")}
            >
              <option value="">Troca ou venda</option>
              <option value="trade">Só troca</option>
              <option value="sale">Só venda</option>
            </select>
          </label>
          <label>
            Preço máximo (R$)
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => onMaxPriceChange(event.target.value)}
              placeholder="Sem limite"
            />
          </label>
          <label>
            Ordenar
            <select
              value={sort}
              onChange={(event) => onSortChange(event.target.value as "newest" | "price")}
            >
              <option value="newest">Mais recentes</option>
              <option value="price">Menor preço</option>
            </select>
          </label>
        </div>
        <div className="filter-row" aria-label="Filtrar anúncios">
          {filters.map((item) => (
            <Button
              key={item}
              variant="outline"
              className={filter === item ? "selected" : ""}
              onClick={() => onFilterChange(item)}
              aria-pressed={filter === item}
            >
              {item}
              {item === "Todos" && <span>{String(listings.length).padStart(2, "0")}</span>}
            </Button>
          ))}
          {(filter !== "Todos" || search || kind || maxPrice || sort === "price") && (
            <Button variant="ghost" onClick={onResetFilters}>
              Limpar filtros
            </Button>
          )}
        </div>
        <div className="listing-grid">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              saved={savedIds.includes(listing.id)}
              managed={view === "mine"}
              onSavedToggle={() => onSavedToggle(listing.id)}
              onSelect={() => onListingSelect(listing)}
              onManage={(status) => onManageListing(listing.id, status)}
            />
          ))}
        </div>
        {listings.length === 0 && (
          <p className="listing-empty" role="status">
            {view === "saved" && !search
              ? "Você ainda não salvou nenhum anúncio."
              : view === "mine"
                ? "Você ainda não anunciou. Publique o que não usa e diga o que procura."
                : "Nenhum anúncio encontrado. Tente outro termo ou filtro."}
          </p>
        )}
        <p className="prototype-note mt-5">
          Prévia local: anúncios e perfil não são enviados nem salvos em um servidor. Combine tudo
          com cuidado e nunca compartilhe senhas.
        </p>
      </div>
    </section>
  );
}

function ListingSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="listing-search">
      <Search size={17} />
      <input
        id="listing-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por anúncio, categoria ou item desejado..."
        aria-label="Buscar anúncios"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Limpar pesquisa"
          onClick={() => onChange("")}
        >
          <X size={15} />
        </Button>
      )}
    </label>
  );
}

function ListingCard({
  listing,
  saved,
  managed,
  onSavedToggle,
  onSelect,
  onManage,
}: {
  listing: Listing;
  saved: boolean;
  managed: boolean;
  onSavedToggle: () => void;
  onSelect: () => void;
  onManage: (status: ListingStatus) => void;
}) {
  return (
    <article className="listing-card">
      <div className={`listing-media ${listing.color}`}>
        <span className="badge">{listing.cat.toUpperCase()}</span>
        {!managed && (
          <Button
            variant="ghost"
            size="icon"
            className={`save-button ${saved ? "saved" : ""}`}
            aria-label={`${saved ? "Remover dos salvos" : "Salvar"}: ${listing.name}`}
            aria-pressed={saved}
            onClick={onSavedToggle}
          >
            <Heart size={15} />
          </Button>
        )}
        <listing.icon />
      </div>
      <div className="listing-body">
        <small>{listing.type}</small>
        <h3>{listing.name}</h3>
        <strong className="listing-price">
          {listing.price === null
            ? "Sem valor"
            : `R$ ${listing.price.toFixed(2).replace(".", ",")}`}
        </strong>
        <div className="listing-meta">
          <ArrowLeftRight size={12} /> Procura: {listing.wants}
        </div>
        <div className="listing-options">
          <span className="listing-option">
            <ArrowLeftRight size={12} />{" "}
            {listing.kind === "trade"
              ? "Troca"
              : listing.kind === "sale"
                ? "Venda"
                : "Troca ou venda"}
          </span>
          <span className="listing-option">
            {listing.delivery === "automatic" ? <Zap size={12} /> : <Truck size={12} />}
            {listing.delivery === "automatic"
              ? "Produto digital · não conectado"
              : "Envio ou encontro a combinar"}
          </span>
        </div>
        <div className="listing-status">
          <i className={`status-${listing.status}`} /> {statusLabel(listing.status)}
        </div>
        {managed ? (
          <div className="listing-manage">
            <Button
              variant="outline"
              onClick={() => onManage(listing.status === "paused" ? "active" : "paused")}
            >
              {listing.status === "paused" ? "Reativar" : "Pausar"}
            </Button>
            <Button variant="outline" onClick={() => onManage("completed")}>
              Concluir
            </Button>
            <Button variant="ghost" onClick={() => onManage("removed")}>
              Excluir
            </Button>
          </div>
        ) : (
          <Button variant="outline" className="listing-view" onClick={onSelect}>
            Ver anúncio
          </Button>
        )}
      </div>
    </article>
  );
}

function statusLabel(status: ListingStatus) {
  const labels: Record<ListingStatus, string> = {
    active: "DISPONÍVEL",
    paused: "PAUSADO",
    completed: "CONCLUÍDO",
    removed: "EXCLUÍDO",
  };
  return labels[status];
}
