import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DemoUser } from "@/components/swap/data";

export function LoginDialog({
  onClose,
  onDemoLogin,
}: {
  onClose: () => void;
  onDemoLogin: (user: DemoUser) => void;
}) {
  const [step, setStep] = useState<"email" | "code" | "profile">("email");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (step === "email") {
      const value = email.trim().toLowerCase();
      if (!/^[^@\s]+@edu\.unifor\.br$/.test(value)) {
        setMessage("Use um endereço terminado em @edu.unifor.br.");
        return;
      }
      setEmail(value);
      setMessage("");
      setStep("code");
      return;
    }
    if (step === "code") {
      if (form.get("code") !== "123456") {
        setMessage("Código incorreto. Nesta demonstração, use 123456.");
        return;
      }
      setMessage("");
      setStep("profile");
      return;
    }

    const digits = whatsapp.replace(/\D/g, "");
    if (name.trim().length < 2) {
      setMessage("Informe seu nome.");
      return;
    }
    if (!course.trim() || !semester) {
      setMessage("Informe curso e semestre.");
      return;
    }
    if (digits.length < 10 || digits.length > 11) {
      setMessage("O WhatsApp precisa ter DDD e 10 ou 11 dígitos.");
      return;
    }
    onDemoLogin({
      name: name.trim(),
      course: course.trim(),
      semester,
      whatsapp: digits,
      email,
    });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="login-dialog">
        <DialogHeader>
          <DialogTitle>
            {step === "email"
              ? "Entrar na demonstração"
              : step === "code"
                ? "Código de demonstração"
                : "Complete seu perfil"}
          </DialogTitle>
          <DialogDescription>
            {step === "email"
              ? "Use um e-mail @edu.unifor.br para iniciar um perfil temporário."
              : step === "code"
                ? `O código local é 123456. Nenhum e-mail será enviado para ${email}.`
                : "Este perfil existe apenas enquanto a página estiver aberta."}
          </DialogDescription>
        </DialogHeader>
        <form className="login-form" onSubmit={submit}>
          {step === "email" && (
            <label className="login-field">
              E-mail institucional
              <input
                autoComplete="email"
                name="email"
                placeholder="voce@edu.unifor.br"
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
          )}
          {step === "code" && (
            <label className="login-field">
              Código
              <input
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                name="code"
                placeholder="123456"
                required
              />
            </label>
          )}
          {step === "profile" && (
            <>
              <label className="login-field">
                Nome
                <input
                  maxLength={40}
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <div className="listing-form-row">
                <label className="login-field">
                  Curso
                  <input
                    required
                    value={course}
                    onChange={(event) => setCourse(event.target.value)}
                  />
                </label>
                <label className="login-field">
                  Semestre
                  <input
                    type="number"
                    min="1"
                    max="12"
                    required
                    value={semester}
                    onChange={(event) => setSemester(event.target.value)}
                  />
                </label>
              </div>
              <label className="login-field">
                WhatsApp com DDD
                <input
                  inputMode="tel"
                  placeholder="85999999999"
                  required
                  value={whatsapp}
                  onChange={(event) => setWhatsapp(event.target.value)}
                />
              </label>
            </>
          )}
          {message && (
            <p className="login-feedback" role="alert">
              {message}
            </p>
          )}
          <div className="transaction-actions">
            {step === "code" && (
              <Button type="button" variant="outline" onClick={() => setStep("email")}>
                Voltar
              </Button>
            )}
            <Button className="login-submit" type="submit" variant="brand">
              {step === "email"
                ? "Continuar"
                : step === "code"
                  ? "Confirmar código"
                  : "Usar perfil demo"}
            </Button>
          </div>
          <p className="prototype-note">
            Prévia local: o código não verifica sua conta. Nenhum dado é enviado ou guardado após
            sair da página.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
