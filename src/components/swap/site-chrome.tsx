import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  ArrowUpRight,
  Gift,
  Menu,
  Moon,
  Plus,
  Sun,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { categories } from "@/components/swap/data";
import type { DemoUser } from "@/components/swap/data";

export function Logo() {
  return (
    <a href="#" className="logo" aria-label="SWAP, início">
      <ArrowLeftRight className="logo-mark" />
      SWAP<span className="logo-dot">.</span>
    </a>
  );
}

type SiteHeaderProps = {
  onLogin: () => void;
  onSignOut: () => void;
  onCreateListing: () => void;
  user: DemoUser | null;
  onChooseCategory: (name: string) => void;
};

export function SiteHeader({
  onLogin,
  onSignOut,
  onCreateListing,
  user,
  onChooseCategory,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"auto" | "light" | "dark">("auto");
  const [sound, setSound] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("troca-theme");
      if (saved === "dark" || saved === "light" || saved === "auto") {
        setTheme(saved);
        document.documentElement.dataset.theme = saved;
      }
      setSound(localStorage.getItem("troca-snd") !== "off");
    } catch {
      document.documentElement.dataset.theme = "auto";
    }
  }, []);

  useEffect(() => {
    if (!sound) return;
    let context: AudioContext | null = null;
    const playButtonTone = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest("button")) return;
      try {
        context ??= new AudioContext();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.frequency.value = 660;
        gain.gain.setValueAtTime(0.025, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.06);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.07);
      } catch {
        // Audio is an optional browser effect.
      }
    };
    document.addEventListener("click", playButtonTone);
    return () => {
      document.removeEventListener("click", playButtonTone);
      void context?.close();
    };
  }, [sound]);

  const chooseCategory = (name: string) => {
    onChooseCategory(name);
    setMenuOpen(false);
  };

  const toggleTheme = () => {
    const next = theme === "auto" ? "dark" : theme === "dark" ? "light" : "auto";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("troca-theme", next);
    } catch {
      // Theme selection still works for the current page when storage is unavailable.
    }
  };
  const toggleSound = () => {
    setSound((enabled) => !enabled);
    try {
      localStorage.setItem("troca-snd", sound ? "off" : "on");
    } catch {
      // The sound preference remains active for the current page.
    }
  };

  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>FEITO POR ALUNOS. PARA ALUNOS.</span>
          <div className="topbar-links">
            <a href="/presente">PRESENTE DO EVENTO</a>
            <a href="https://www.unifor.br" target="_blank" rel="noreferrer">
              COMUNIDADE UNIFOR <ArrowUpRight size={11} />
            </a>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container nav">
          <div className="nav-left">
            <Logo />
            <nav className="nav-links" aria-label="Principal">
              {categories.map((category) => (
                <a key={category.id} href="#anuncios" onClick={() => chooseCategory(category.name)}>
                  {category.name}
                </a>
              ))}
            </nav>
          </div>
          <Link to="/presente" className="nav-gift">
            <Gift size={13} /> ASSINATURAS GRÁTIS
          </Link>
          <div className="nav-actions">
            <Button variant="ghost" className="nav-login" onClick={user ? onSignOut : onLogin}>
              {user ? `Sair (${user.name.split(" ")[0]})` : "Entrar"} <ArrowUpRight />
            </Button>
            <Button variant="ink" onClick={onCreateListing}>
              Anunciar <Plus />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Alternar tema"
              title={`Tema: ${theme}`}
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={sound ? "Desligar sons" : "Ligar sons"}
              aria-pressed={sound}
              onClick={toggleSound}
            >
              {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="menu-trigger"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {menuOpen && (
          <nav className="mobile-menu" aria-label="Menu móvel">
            {categories.map((category) => (
              <a key={category.id} href="#anuncios" onClick={() => chooseCategory(category.name)}>
                {category.name}
              </a>
            ))}
            <a href="#vender" onClick={() => setMenuOpen(false)}>
              Serviços & projetos
            </a>
            <button
              type="button"
              className="mobile-menu-action"
              onClick={() => {
                setMenuOpen(false);
                onCreateListing();
              }}
            >
              <Plus size={15} /> Anunciar
            </button>
            <a href="#como-funciona" onClick={() => setMenuOpen(false)}>
              Como funciona
            </a>
            <Link to="/presente" className="mobile-menu-gift" onClick={() => setMenuOpen(false)}>
              <Gift size={15} /> Assinaturas grátis
            </Link>
            <button
              type="button"
              className="mobile-menu-action"
              onClick={() => {
                setMenuOpen(false);
                if (user) onSignOut();
                else onLogin();
              }}
            >
              {user ? "Sair do perfil demo" : "Entrar na demonstração"}
            </button>
          </nav>
        )}
      </header>
    </>
  );
}

export function SiteFooter({ onChooseCategory }: { onChooseCategory: (name: string) => void }) {
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p>
              Trocas, serviços e projetos entre alunos da Unifor. Conexões que fazem a vida
              universitária render mais.
            </p>
          </div>
          <div className="footer-col">
            <h3>Explore</h3>
            {categories.map((category) => (
              <a href="#anuncios" key={category.id} onClick={() => onChooseCategory(category.name)}>
                {category.name}
              </a>
            ))}
          </div>
          <div className="footer-col">
            <h3>Na comunidade</h3>
            <a href="#vender">Serviços & projetos</a>
            <a href="#anuncios" onClick={() => onChooseCategory("Todos")}>
              Mural de trocas
            </a>
            <a href="#indique">Programa de indicação</a>
            <a href="#loja">Loja e carrinho demo</a>
            <a href="#combos">Combos de jogos</a>
            <a href="#gift">Presente de boas-vindas</a>
          </div>
          <div className="footer-col">
            <h3>TROCA</h3>
            <a href="#como-funciona">Como funciona</a>
            <a href="#seguranca">Segurança</a>
            <a href="https://www.unifor.br" target="_blank" rel="noreferrer">
              Conheça a Unifor ↗
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 TROCA. FEITO POR ALUNOS DA UNIFOR.</span>
          <span>
            FORTALEZA — CE <span aria-hidden="true">↗</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
