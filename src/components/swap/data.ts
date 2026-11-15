import {
  AudioLines,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  FileText,
  Gamepad2,
  GraduationCap,
  Monitor,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const categories = [
  {
    name: "Streaming",
    desc: "Vídeo, música e leitura. Troque o que você não usa mais.",
    count: 38,
    icon: AudioLines,
    color: "stream-bg",
    id: "streaming",
  },
  {
    name: "Estudos",
    desc: "Cursos, idiomas e novas possibilidades para aprender.",
    count: 29,
    icon: BookOpen,
    color: "study-bg",
    id: "estudos",
  },
  {
    name: "Ferramentas",
    desc: "IA, design e produtividade. Dê um upgrade na sua rotina.",
    count: 52,
    icon: Sparkles,
    color: "tool-bg",
    id: "ferramentas",
  },
  {
    name: "Jogos",
    desc: "Jogos de tabuleiro e acessórios para jogar com a galera.",
    count: 24,
    icon: Gamepad2,
    color: "game-bg",
    id: "jogos",
  },
  {
    name: "Serviços",
    desc: "Freelas, aulas e consultorias entre alunos.",
    count: 0,
    icon: BriefcaseBusiness,
    color: "study-bg",
    id: "servicos",
  },
  {
    name: "Projetos",
    desc: "Código, scripts e templates para reaproveitar.",
    count: 0,
    icon: Code2,
    color: "tool-bg",
    id: "projetos",
  },
  {
    name: "Infoprodutos",
    desc: "E-books, resumos e materiais de estudo.",
    count: 0,
    icon: FileText,
    color: "game-bg",
    id: "infoprodutos",
  },
];

export type ListingStatus = "active" | "paused" | "completed" | "removed";
export type ListingKind = "trade" | "sale" | "both";
export type DemoUser = {
  name: string;
  course: string;
  semester: string;
  whatsapp: string;
  email: string;
};

export type Listing = {
  id: number;
  cat: string;
  type: string;
  name: string;
  wants: string;
  price: number | null;
  delivery: "automatic" | "manual";
  icon: LucideIcon;
  color: string;
  description: string;
  owner: string;
  whatsapp: string;
  kind: ListingKind;
  status: ListingStatus;
  createdAt: number;
};

export const listings: Listing[] = [
  {
    id: 1,
    cat: "Streaming",
    type: "Vídeo",
    name: "Plano família 4 telas",
    wants: "Spotify",
    price: 30,
    delivery: "automatic",
    icon: Monitor,
    color: "stream-bg",
    description: "Vaga no plano família até dezembro. Convite oficial.",
    owner: "Aline M.",
    whatsapp: "85999990001",
    kind: "both",
    status: "active",
    createdAt: 8,
  },
  {
    id: 2,
    cat: "Ferramentas",
    type: "Inteligência artificial",
    name: "Assistente de escrita Pro",
    wants: "Notion Pro",
    price: 25,
    delivery: "automatic",
    icon: Sparkles,
    color: "tool-bg",
    description: "Três meses restantes. Código ou cupom.",
    owner: "Pedro S.",
    whatsapp: "85999990002",
    kind: "both",
    status: "active",
    createdAt: 7,
  },
  {
    id: 3,
    cat: "Estudos",
    type: "Idiomas",
    name: "Curso de inglês avançado",
    wants: "curso de espanhol",
    price: 40,
    delivery: "automatic",
    icon: GraduationCap,
    color: "study-bg",
    description: "Acesso por 6 meses, com certificado.",
    owner: "Camila R.",
    whatsapp: "85999990003",
    kind: "both",
    status: "active",
    createdAt: 6,
  },
  {
    id: 4,
    cat: "Streaming",
    type: "Música",
    name: "Assinatura de música",
    wants: "plano de vídeo",
    price: 20,
    delivery: "automatic",
    icon: AudioLines,
    color: "stream-bg",
    description: "Plano duo, uma vaga. Convite oficial.",
    owner: "Lucas P.",
    whatsapp: "85999990004",
    kind: "trade",
    status: "active",
    createdAt: 5,
  },
  {
    id: 5,
    cat: "Jogos",
    type: "Jogo de tabuleiro",
    name: "Jogo cooperativo para jogar em grupo",
    wants: "jogo de cartas",
    price: 40,
    delivery: "manual",
    icon: Gamepad2,
    color: "game-bg",
    description: "Completo, jogado duas vezes. Encontro no campus.",
    owner: "Beatriz L.",
    whatsapp: "85999990005",
    kind: "both",
    status: "active",
    createdAt: 4,
  },
  {
    id: 6,
    cat: "Jogos",
    type: "Acessório gamer",
    name: "Controle USB para PC",
    wants: "headset gamer",
    price: 60,
    delivery: "manual",
    icon: Gamepad2,
    color: "game-bg",
    description: "Funciona em qualquer PC. Encontro no campus.",
    owner: "Rafael T.",
    whatsapp: "85999990006",
    kind: "both",
    status: "active",
    createdAt: 3,
  },
  {
    id: 7,
    cat: "Serviços",
    type: "Aulas particulares",
    name: "Aulas de cálculo 1",
    wants: "Ajuda com design",
    price: null,
    delivery: "manual",
    icon: GraduationCap,
    color: "study-bg",
    description: "Duas horas por semana na biblioteca.",
    owner: "Sofia A.",
    whatsapp: "85999990007",
    kind: "trade",
    status: "active",
    createdAt: 2,
  },
  {
    id: 8,
    cat: "Ferramentas",
    type: "Design e vídeo",
    name: "Editor de vídeo (licença estudante)",
    wants: "Curso de inglês",
    price: 35,
    delivery: "automatic",
    icon: Sparkles,
    color: "tool-bg",
    description: "Licença de 1 ano. Entrega por código ou cupom.",
    owner: "Davi N.",
    whatsapp: "85999990008",
    kind: "trade",
    status: "active",
    createdAt: 1,
  },
  {
    id: 9,
    cat: "Projetos",
    type: "Template",
    name: "Template de landing page",
    wants: "Revisão de código",
    price: 35,
    delivery: "manual",
    icon: Code2,
    color: "tool-bg",
    description: "HTML e CSS responsivo, pronto para adaptar.",
    owner: "Marcos V.",
    whatsapp: "85999990009",
    kind: "both",
    status: "active",
    createdAt: 9,
  },
  {
    id: 10,
    cat: "Infoprodutos",
    type: "Resumos",
    name: "Resumos de cálculo 1 (PDF)",
    wants: "Resumos de física",
    price: 15,
    delivery: "manual",
    icon: FileText,
    color: "game-bg",
    description: "Fórmulas e exercícios resolvidos.",
    owner: "Larissa B.",
    whatsapp: "85999990010",
    kind: "both",
    status: "active",
    createdAt: 10,
  },
];

export const events = [
  "Aline trocou Canva Pro por Duolingo Plus",
  "Pedro anunciou ChatGPT Plus em Ferramentas",
  "Camila trocou plano família por assinatura de música",
  "Novo anúncio: editor de vídeo por curso de inglês",
];

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export function filterListings(
  allListings: readonly Listing[],
  filter: string,
  search: string,
  savedIds: readonly number[],
  options: {
    kind?: ListingKind | "";
    maxPrice?: number;
    sort?: "newest" | "price";
    view?: "mural" | "saved" | "mine";
    owner?: string;
  } = {},
) {
  const normalizedSearch = normalizeSearch(search.trim());

  const visible = allListings.filter((listing) => {
    const matchesView =
      options.view === "mine"
        ? listing.owner === options.owner && listing.status !== "removed"
        : listing.status === "active" &&
          (options.view !== "saved" || savedIds.includes(listing.id));
    const matchesFilter =
      filter === "Todos" ||
      listing.cat === filter ||
      (filter === "Salvos" && savedIds.includes(listing.id));
    const searchableText = normalizeSearch(
      `${listing.name} ${listing.cat} ${listing.type} ${listing.wants} ${listing.description}`,
    );

    return (
      matchesView &&
      matchesFilter &&
      (!options.kind ||
        options.kind === "both" ||
        listing.kind === "both" ||
        listing.kind === options.kind) &&
      (options.maxPrice === undefined ||
        (listing.price !== null && listing.price <= options.maxPrice)) &&
      (!normalizedSearch || searchableText.includes(normalizedSearch))
    );
  });
  return visible.sort((a, b) =>
    options.sort === "price"
      ? (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY)
      : b.createdAt - a.createdAt,
  );
}
