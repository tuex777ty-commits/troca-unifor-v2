import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Gift, ShoppingBag, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DemoUser } from "@/components/swap/data";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  regularPrice: number;
  description: string;
  image: string;
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Plano de jogos para PC (1 mês)",
    category: "Assinaturas",
    price: 29.9,
    regularPrice: 39.9,
    description: "Entrega por código ou convite.",
    image: "",
  },
  {
    id: 2,
    name: "Plano de jogos para console (3 meses)",
    category: "Assinaturas",
    price: 79,
    regularPrice: 109,
    description: "Entrega por código ou convite.",
    image: "",
  },
  {
    id: 3,
    name: "Streaming de vídeo (1 mês)",
    category: "Assinaturas",
    price: 14.9,
    regularPrice: 24.9,
    description: "Entrega por código ou convite.",
    image: "",
  },
  {
    id: 4,
    name: "Streaming de música (3 meses)",
    category: "Assinaturas",
    price: 39,
    regularPrice: 59,
    description: "Entrega por código ou convite.",
    image: "",
  },
  {
    id: 5,
    name: "Jogo de aventura (código)",
    category: "Jogos",
    price: 59.9,
    regularPrice: 89.9,
    description: "Código para baixar e jogar quando quiser.",
    image: "",
  },
  {
    id: 6,
    name: "Jogo cooperativo (código)",
    category: "Jogos",
    price: 39.9,
    regularPrice: 59.9,
    description: "Código para jogar com a galera.",
    image: "",
  },
  {
    id: 7,
    name: "Curso de inglês (6 meses)",
    category: "Cursos",
    price: 49,
    regularPrice: 89,
    description: "Acesso por 6 meses, com certificado.",
    image: "",
  },
  {
    id: 8,
    name: "Curso de programação",
    category: "Cursos",
    price: 69,
    regularPrice: 120,
    description: "Aulas gravadas e projetos práticos.",
    image: "",
  },
];

const gameCatalog = [
  "Plano de jogos para PC",
  "Plano de jogos para console A",
  "Plano de jogos para console B",
  "Jogos na nuvem",
  "Plano de jogos mobile",
  "Catálogo de jogos indie",
  "Pacote de expansões",
  "Plano de jogos de corrida",
];
const rewardGames = [
  "Jogo de aventura",
  "Jogo de corrida",
  "Jogo cooperativo",
  "Jogo de estratégia",
  "Jogo de puzzle",
];
const tierPrices = [
  { count: 4, official: 120, price: 79 },
  { count: 5, official: 150, price: 95 },
  { count: 6, official: 180, price: 109 },
  { count: 7, official: 210, price: 122 },
  { count: 8, official: 240, price: 134 },
];
const eventGifts = [
  "1 mês de streaming",
  "1 mês de ferramenta de IA, design ou produtividade",
  "1 mês de curso ou preparação para provas",
];

function brl(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function CommunityFeatures({
  user,
  onLogin,
  onToast,
}: {
  user: DemoUser | null;
  onLogin: () => void;
  onToast: (message: string) => void;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [gameItems, setGameItems] = useState(gameCatalog);
  const [rewardItems, setRewardItems] = useState(rewardGames);
  const [tiers, setTiers] = useState(tierPrices);
  const [shopCategory, setShopCategory] = useState("Todos");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [tier, setTier] = useState(4);
  const [combo, setCombo] = useState<string[]>([]);
  const [welcomeGift, setWelcomeGift] = useState<string[]>([]);
  const [claimedWelcomeGift, setClaimedWelcomeGift] = useState<string[] | null>(null);
  const [eventGift, setEventGift] = useState<string | null>(null);
  const [referrals, setReferrals] = useState(0);
  const [sales, setSales] = useState(0);
  const [reward, setReward] = useState<string | null>(null);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [ownerUnlocked, setOwnerUnlocked] = useState(false);
  const [ownerPin, setOwnerPin] = useState("");
  const [ownerMessage, setOwnerMessage] = useState("");
  const [storeWhatsapp, setStoreWhatsapp] = useState("5585999990000");
  const [ownerCatalog, setOwnerCatalog] = useState("");
  const [ownerGames, setOwnerGames] = useState("");
  const [ownerRewards, setOwnerRewards] = useState("");
  const [ownerTiers, setOwnerTiers] = useState("");
  const [commission, setCommission] = useState(10);
  const [referralTarget, setReferralTarget] = useState(1);
  const [salesTarget, setSalesTarget] = useState(2);
  const [ownerImageUrls, setOwnerImageUrls] = useState<Record<number, string>>({});
  const [ownerImageFiles, setOwnerImageFiles] = useState<Record<number, string>>({});
  const [quickGiftOpen, setQuickGiftOpen] = useState(false);

  const categories = useMemo(
    () => ["Todos", ...new Set(products.map((product) => product.category))],
    [products],
  );
  const visibleProducts = products.filter(
    (product) => shopCategory === "Todos" || product.category === shopCategory,
  );
  const cartItems = products.filter((product) => cart[product.id]);
  const cartTotal = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0);
  const currentTier = tiers.find((item) => item.count === tier) ?? tiers[0];
  const referralCode = user
    ? `${
        user.name
          .split(" ")[0]
          .toUpperCase()
          .replace(/[^A-Z]/g, "")
          .slice(0, 6) || "TROCA"
      }-DEMO`
    : "";

  useEffect(() => {
    setCart({});
    setClaimedWelcomeGift(null);
    setEventGift(null);
    setReferrals(0);
    setSales(0);
    setReward(null);
    setWelcomeGift([]);
  }, [user?.email]);

  function requireUser(action: () => void) {
    if (!user) {
      onLogin();
      return;
    }
    action();
  }

  function updateCart(id: number, amount: number) {
    setCart((current) => {
      const count = (current[id] ?? 0) + amount;
      const next = { ...current };
      if (count < 1) delete next[id];
      else next[id] = count;
      return next;
    });
  }

  function checkout() {
    if (!cartItems.length) return;
    requireUser(() => {
      const message = [
        "Oi! Quero comprar na loja de demonstração TROCA:",
        ...cartItems.map(
          (product) =>
            `${cart[product.id]}x ${product.name} - ${brl(product.price * cart[product.id])}`,
        ),
        `Total: ${brl(cartTotal)}`,
        `Nome: ${user?.name ?? ""}`,
      ].join("\n");
      window.open(
        `https://wa.me/${storeWhatsapp}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer",
      );
      setCart({});
      onToast("Pedido de demonstração aberto no WhatsApp");
    });
  }

  function orderCombo() {
    if (combo.length !== tier) return;
    requireUser(() => {
      const message = `Oi! Quero o combo de ${tier} itens (${brl(currentTier.price)} por mês): ${combo.join(", ")}`;
      window.open(
        `https://wa.me/${storeWhatsapp}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer",
      );
      onToast("Pedido de demonstração aberto no WhatsApp");
    });
  }

  function saveOwnerSettings() {
    const digits = storeWhatsapp.replace(/\D/g, "");
    if (digits.length < 12) {
      setOwnerMessage("Informe um WhatsApp com código do país e DDD.");
      return;
    }
    const lines = ownerCatalog
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const nextGames = ownerGames
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const nextRewards = ownerRewards
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const nextTiers = ownerTiers
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length < (tiers[tiers.length - 1]?.count ?? 8)) {
      setOwnerMessage(
        `O catálogo precisa de ao menos ${tiers[tiers.length - 1]?.count ?? 8} itens para o maior combo.`,
      );
      return;
    }
    if (!nextGames.length || !nextRewards.length || !nextTiers.length) {
      setOwnerMessage("Inclua ao menos um item no catálogo e uma recompensa para parceiros.");
      return;
    }
    if (Object.values(ownerImageUrls).some((url) => url && !/^https:\/\//i.test(url))) {
      setOwnerMessage("Os links de imagem precisam começar com https://.");
      return;
    }
    const parsedProducts: Product[] = [];
    for (const [index, line] of lines.entries()) {
      const [name, category, priceText, regularText, description] = line
        .split("|")
        .map((part) => part.trim());
      const price = Number(priceText?.replace(",", "."));
      const regularPrice = Number(regularText?.replace(",", "."));
      if (
        !name ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isFinite(regularPrice) ||
        regularPrice <= price
      ) {
        setOwnerMessage(`Linha ${index + 1}: revise nome, preço e preço oficial.`);
        return;
      }
      parsedProducts.push({
        id: index + 1,
        name,
        category: category || "Outros",
        price,
        regularPrice,
        description: description || "Produto ilustrativo.",
        image:
          ownerImageFiles[index + 1] ?? ownerImageUrls[index + 1] ?? products[index]?.image ?? "",
      });
    }
    const parsedTiers = nextTiers.map((line, index) => {
      const [countText, officialText, priceText] = line.split("|").map((part) => part.trim());
      return {
        count: Number(countText),
        official: Number(officialText?.replace(",", ".")),
        price: Number(priceText?.replace(",", ".")),
        line: index + 1,
      };
    });
    if (
      parsedTiers.some(
        (item) =>
          !Number.isInteger(item.count) ||
          item.count < 1 ||
          !Number.isFinite(item.official) ||
          !Number.isFinite(item.price) ||
          item.price <= 0 ||
          item.price >= item.official,
      )
    ) {
      setOwnerMessage(
        "Revise os combos no formato quantidade | preço oficial | preço TROCA; o preço TROCA deve ser menor.",
      );
      return;
    }
    if (
      parsedTiers.some((item, index) => index > 0 && item.count <= parsedTiers[index - 1].count)
    ) {
      setOwnerMessage("As quantidades dos combos devem estar em ordem crescente.");
      return;
    }
    if (nextGames.length < parsedTiers[parsedTiers.length - 1].count) {
      setOwnerMessage(
        "O catálogo de combos precisa ter ao menos tantos itens quanto o maior combo.",
      );
      return;
    }
    const nextReferralTarget = Math.max(1, Number(referralTarget) || 1);
    const nextSalesTarget = Math.max(1, Number(salesTarget) || 1);
    const nextCommission = Math.min(100, Math.max(0, Number(commission) || 0));
    setOwnerMessage("");
    setStoreWhatsapp(digits);
    setProducts(parsedProducts);
    setGameItems(nextGames);
    setRewardItems(nextRewards);
    setTiers(parsedTiers);
    setTier(parsedTiers[0].count);
    setReferralTarget(nextReferralTarget);
    setSalesTarget(nextSalesTarget);
    setCommission(nextCommission);
    setCart({});
    setOwnerOpen(false);
    onToast("Configurações de demonstração atualizadas");
  }

  return (
    <>
      <section className="market community-shop" id="loja">
        <div className="container">
          <div className="section-eyebrow">Produtos ilustrativos</div>
          <div className="section-head">
            <div>
              <h2>Loja do TROCA</h2>
              <p>Catálogo de exemplo. Compras e pagamentos não são processados aqui.</p>
            </div>
            <Button variant="outline" onClick={() => setQuickGiftOpen(true)}>
              <ShoppingBag size={15} /> Carrinho ({Object.values(cart).reduce((a, b) => a + b, 0)})
            </Button>
          </div>
          <div className="feature-chip-row" aria-label="Categorias da loja">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className={shopCategory === category ? "selected" : ""}
                onClick={() => setShopCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-cover">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt=""
                      onError={(event) => event.currentTarget.remove()}
                    />
                  ) : (
                    <span>{product.name.slice(0, 1)}</span>
                  )}
                  {product.regularPrice > product.price && (
                    <small>-{Math.round((1 - product.price / product.regularPrice) * 100)}%</small>
                  )}
                </div>
                <div className="product-card-body">
                  <span className="tag">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <strong>{brl(product.price)}</strong>
                  {product.regularPrice > product.price && <del>{brl(product.regularPrice)}</del>}
                  <Button
                    variant={cart[product.id] ? "outline" : "brand"}
                    onClick={() => updateCart(product.id, 1)}
                  >
                    {cart[product.id]
                      ? `No carrinho (${cart[product.id]})`
                      : "Adicionar ao carrinho"}
                  </Button>
                </div>
              </article>
            ))}
          </div>
          <div className="cart-panel">
            <h3>Seu carrinho</h3>
            {cartItems.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              <>
                {cartItems.map((product) => (
                  <div className="cart-line" key={product.id}>
                    <span>{product.name}</span>
                    <span>{brl(product.price * cart[product.id])}</span>
                    <div className="cart-quantity">
                      <Button
                        variant="outline"
                        aria-label={`Diminuir ${product.name}`}
                        onClick={() => updateCart(product.id, -1)}
                      >
                        −
                      </Button>
                      {cart[product.id]}
                      <Button
                        variant="outline"
                        aria-label={`Aumentar ${product.name}`}
                        onClick={() => updateCart(product.id, 1)}
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setCart((current) => {
                          const next = { ...current };
                          delete next[product.id];
                          return next;
                        })
                      }
                    >
                      Remover
                    </Button>
                  </div>
                ))}
                <div className="cart-total">
                  <b>Total</b>
                  <b>{brl(cartTotal)}</b>
                </div>
                <Button variant="brand" onClick={checkout}>
                  Finalizar pelo WhatsApp
                </Button>
              </>
            )}
            <p className="prototype-note">
              Finalizar apenas abre uma mensagem no WhatsApp; nenhum pagamento é iniciado pelo site.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              setOwnerMessage("");
              setOwnerOpen(true);
            }}
          >
            Área de configuração da loja <ArrowUpRight size={14} />
          </Button>
        </div>
      </section>

      <section className="market community-extras" id="combos">
        <div className="container">
          <div className="section-eyebrow">Monte do seu jeito</div>
          <h2>Combos de jogos</h2>
          <p>Escolha o tamanho do combo e os itens. Valores de exemplo, sem cobrança.</p>
          <div className="feature-chip-row">
            {tiers.map((item) => (
              <Button
                key={item.count}
                variant="outline"
                className={tier === item.count ? "selected" : ""}
                onClick={() => {
                  setTier(item.count);
                  setCombo((current) => current.slice(0, item.count));
                }}
              >
                {item.count} itens · {brl(item.price)}
              </Button>
            ))}
          </div>
          <div className="combo-options">
            {gameItems.map((item) => {
              const checked = combo.includes(item);
              return (
                <button
                  className={`combo-option${checked ? " selected" : ""}`}
                  type="button"
                  key={item}
                  disabled={!checked && combo.length >= tier}
                  aria-pressed={checked}
                  onClick={() =>
                    setCombo((current) =>
                      checked ? current.filter((entry) => entry !== item) : [...current, item],
                    )
                  }
                >
                  {item}
                </button>
              );
            })}
          </div>
          <div className="combo-summary">
            <h3>
              Combo de {tier} itens · {brl(currentTier.price)} por mês
            </h3>
            <p>
              Preço oficial somado: <del>{brl(currentTier.official)}</del> · economia de{" "}
              {Math.round((1 - currentTier.price / currentTier.official) * 100)}%
            </p>
            <p>
              {combo.length < tier
                ? `Escolha mais ${tier - combo.length} item(ns).`
                : combo.join(" · ")}
            </p>
            <Button variant="brand" disabled={combo.length !== tier} onClick={orderCombo}>
              Pedir pelo WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <section className="market community-extras" id="gift">
        <div className="container">
          <div className="section-eyebrow">
            <Gift size={14} /> Presente de boas-vindas
          </div>
          <h2>Escolha 2 assinaturas de demonstração</h2>
          <p>Uma escolha por perfil local. Nenhuma assinatura será entregue automaticamente.</p>
          {claimedWelcomeGift ? (
            <p className="prototype-note">
              Seleção de demonstração: {claimedWelcomeGift.join(" e ")}.
            </p>
          ) : (
            <>
              <div className="combo-options">
                {gameItems.map((item) => {
                  const checked = welcomeGift.includes(item);
                  return (
                    <button
                      className={`combo-option${checked ? " selected" : ""}`}
                      key={item}
                      type="button"
                      aria-pressed={checked}
                      disabled={!checked && welcomeGift.length >= 2}
                      onClick={() =>
                        setWelcomeGift((current) =>
                          checked ? current.filter((entry) => entry !== item) : [...current, item],
                        )
                      }
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="brand"
                disabled={welcomeGift.length !== 2}
                onClick={() =>
                  requireUser(() => {
                    setClaimedWelcomeGift(welcomeGift);
                    onToast("Presente salvo nesta sessão de demonstração");
                  })
                }
              >
                Resgatar meu presente
              </Button>
            </>
          )}
        </div>
      </section>

      <section className="market community-extras" id="presente-evento">
        <div className="container event-panel">
          <div className="section-eyebrow">
            <Gift size={14} /> Ação no campus
          </div>
          <h2>Presente do evento</h2>
          {eventGift ? (
            <p>Você escolheu: {eventGift}.</p>
          ) : (
            <>
              <p>Escolha 1 opção de demonstração. Uma escolha local por perfil.</p>
              <div className="combo-options">
                {eventGifts.map((item) => (
                  <button
                    className="combo-option"
                    key={item}
                    type="button"
                    onClick={() =>
                      requireUser(() => {
                        setEventGift(item);
                        onToast("Presente escolhido nesta sessão");
                      })
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="affiliate community-affiliate" id="partners">
        <div className="container">
          <div className="affiliate-layout">
            <div>
              <div className="section-eyebrow">
                <Users size={14} /> Programa de parceiros
              </div>
              <h2>
                Indique. Conecte.
                <br />
                <em>Ganhe com a comunidade.</em>
              </h2>
              <p>
                Progresso e recompensas são apenas uma simulação local, sem vendas nem comissão
                reais.
              </p>
              {!user ? (
                <Button variant="brand" onClick={onLogin}>
                  Entrar na demonstração
                </Button>
              ) : (
                <div className="partner-progress">
                  <strong>Seu código: {referralCode}</strong>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (navigator.clipboard)
                        void navigator.clipboard.writeText(referralCode).then(
                          () => onToast("Código copiado"),
                          () => onToast(`Seu código: ${referralCode}`),
                        );
                      else onToast(`Seu código: ${referralCode}`);
                    }}
                  >
                    Copiar código
                  </Button>
                  <Button variant="outline" onClick={() => setReferrals((value) => value + 1)}>
                    Simular indicação
                  </Button>
                  <p>
                    Indicações: {referrals}/{referralTarget} · vendas: {sales}/{salesTarget} ·
                    comissão demonstrativa: {commission}%
                  </p>
                  <Button variant="outline" onClick={() => setSales((value) => value + 1)}>
                    Simular venda confirmada
                  </Button>
                  {referrals >= referralTarget && !reward && (
                    <div className="combo-options">
                      <p>Escolha sua recompensa de demonstração:</p>
                      {rewardItems.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className="combo-option"
                          onClick={() => {
                            setReward(item);
                            onToast("Recompensa escolhida nesta sessão");
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                  {reward && <p>Recompensa selecionada: {reward}.</p>}
                </div>
              )}
            </div>
            <div className="affiliate-stat">
              2×<small>VENDAS PARA LIBERAR A COMISSÃO</small>
            </div>
          </div>
        </div>
      </section>

      {quickGiftOpen && (
        <Dialog open onOpenChange={(open) => !open && setQuickGiftOpen(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Carrinho de demonstração</DialogTitle>
              <DialogDescription>
                Revise produtos e quantidades antes de abrir o WhatsApp.
              </DialogDescription>
            </DialogHeader>
            <p>
              {cartItems.length
                ? `${cartItems.length} produto(s) · ${brl(cartTotal)}`
                : "Seu carrinho está vazio."}
            </p>
            <div className="transaction-actions">
              <Button variant="outline" onClick={() => setQuickGiftOpen(false)}>
                Continuar comprando
              </Button>
              <Button
                variant="brand"
                disabled={!cartItems.length}
                onClick={() => {
                  setQuickGiftOpen(false);
                  checkout();
                }}
              >
                Finalizar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {ownerOpen && (
        <Dialog open onOpenChange={(open) => !open && setOwnerOpen(false)}>
          <DialogContent className="transaction-dialog">
            <DialogHeader>
              <DialogTitle>Configurações locais da loja</DialogTitle>
              <DialogDescription>
                PIN de demonstração: 1234. Alterações não são persistidas.
              </DialogDescription>
            </DialogHeader>
            {!ownerUnlocked ? (
              <form
                className="proposal-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (ownerPin !== "1234") {
                    setOwnerMessage("PIN incorreto.");
                    return;
                  }
                  setOwnerUnlocked(true);
                  setOwnerCatalog(
                    products
                      .map((product) =>
                        [
                          product.name,
                          product.category,
                          product.price,
                          product.regularPrice,
                          product.description,
                        ].join(" | "),
                      )
                      .join("\n"),
                  );
                  setOwnerGames(gameItems.join("\n"));
                  setOwnerRewards(rewardItems.join("\n"));
                  setOwnerTiers(
                    tiers
                      .map((item) => [item.count, item.official, item.price].join(" | "))
                      .join("\n"),
                  );
                  setOwnerMessage("");
                }}
              >
                <label>
                  PIN de demonstração
                  <input
                    type="password"
                    value={ownerPin}
                    onChange={(event) => setOwnerPin(event.target.value)}
                  />
                </label>
                {ownerMessage && (
                  <p className="login-feedback" role="alert">
                    {ownerMessage}
                  </p>
                )}
                <Button variant="brand" type="submit">
                  Abrir configurações
                </Button>
              </form>
            ) : (
              <div className="proposal-form">
                <label>
                  WhatsApp da loja
                  <input
                    value={storeWhatsapp}
                    onChange={(event) => setStoreWhatsapp(event.target.value)}
                  />
                </label>
                <label>
                  Produtos: Nome | Categoria | Preço | Preço oficial | Descrição
                  <textarea
                    rows={10}
                    value={ownerCatalog}
                    onChange={(event) => setOwnerCatalog(event.target.value)}
                  />
                </label>
                <label>
                  Catálogo de combos, um item por linha
                  <textarea
                    rows={6}
                    value={ownerGames}
                    onChange={(event) => setOwnerGames(event.target.value)}
                  />
                </label>
                <label>
                  Jogos de recompensa, um por linha
                  <textarea
                    rows={4}
                    value={ownerRewards}
                    onChange={(event) => setOwnerRewards(event.target.value)}
                  />
                </label>
                <label>
                  Combos: quantidade | preço oficial | preço TROCA
                  <textarea
                    rows={5}
                    value={ownerTiers}
                    onChange={(event) => setOwnerTiers(event.target.value)}
                  />
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const last = ownerTiers.trim().split("\n").at(-1)?.split("|")[0]?.trim();
                    const count = Number(last);
                    if (Number.isInteger(count) && count > 0)
                      setOwnerTiers(
                        (value) =>
                          `${value.trimEnd()}\n${count + 1} | ${30 * (count + 1)} | ${13 * (count + 1)}`,
                      );
                  }}
                >
                  Adicionar um tamanho de combo
                </Button>
                <div className="listing-form-row">
                  <label>
                    Indicações para desbloquear recompensa
                    <input
                      type="number"
                      min="1"
                      value={referralTarget}
                      onChange={(event) => setReferralTarget(Number(event.target.value))}
                    />
                  </label>
                  <label>
                    Comissão por venda (%)
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={commission}
                      onChange={(event) => setCommission(Number(event.target.value))}
                    />
                  </label>
                  <label>
                    Vendas para liberar comissão
                    <input
                      type="number"
                      min="1"
                      value={salesTarget}
                      onChange={(event) => setSalesTarget(Number(event.target.value))}
                    />
                  </label>
                </div>
                <label>
                  URLs https de imagem (uma por linha, na ordem dos produtos)
                  <textarea
                    rows={3}
                    value={products
                      .map(
                        (product) =>
                          ownerImageUrls[product.id] ??
                          (product.image.startsWith("https://") ? product.image : ""),
                      )
                      .join("\n")}
                    onChange={(event) => {
                      const urls = event.target.value.split("\n");
                      setOwnerImageUrls(
                        Object.fromEntries(
                          urls.flatMap((url, index) =>
                            products[index] ? [[products[index].id, url.trim()]] : [],
                          ),
                        ),
                      );
                    }}
                  />
                </label>
                <div className="listing-image-upload">
                  {products.map((product) => (
                    <label key={product.id}>
                      Imagem de {product.name}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          if (!file.type.startsWith("image/")) {
                            setOwnerMessage("Selecione um arquivo de imagem.");
                            return;
                          }
                          if (file.size > 8 * 1024 * 1024) {
                            setOwnerMessage("A imagem deve ter até 8 MB.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => {
                            const result = reader.result;
                            if (typeof result === "string") {
                              setOwnerImageFiles((current) => ({
                                ...current,
                                [product.id]: result,
                              }));
                              setOwnerMessage("");
                            }
                          };
                          reader.onerror = () => setOwnerMessage("Não foi possível ler a imagem.");
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  ))}
                </div>
                {ownerMessage && (
                  <p className="login-feedback" role="alert">
                    {ownerMessage}
                  </p>
                )}
                <div className="transaction-actions">
                  <Button variant="outline" onClick={() => setOwnerUnlocked(false)}>
                    Bloquear
                  </Button>
                  <Button variant="brand" onClick={saveOwnerSettings}>
                    Salvar prévia
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
