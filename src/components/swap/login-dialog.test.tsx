import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LoginDialog } from "@/components/swap/login-dialog";

describe("LoginDialog", () => {
  it("validates the demo flow and returns only a temporary profile", () => {
    const onDemoLogin = vi.fn();
    render(<LoginDialog onClose={vi.fn()} onDemoLogin={onDemoLogin} />);

    fireEvent.change(screen.getByLabelText("E-mail institucional"), {
      target: { value: "aluna@edu.unifor.br" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    fireEvent.change(screen.getByLabelText("Código"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: "Confirmar código" }));

    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Ana Silva" } });
    fireEvent.change(screen.getByLabelText("Curso"), { target: { value: "Design" } });
    fireEvent.change(screen.getByLabelText("Semestre"), { target: { value: "3" } });
    fireEvent.change(screen.getByLabelText("WhatsApp com DDD"), {
      target: { value: "85999999999" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Usar perfil demo" }));

    expect(onDemoLogin).toHaveBeenCalledWith({
      name: "Ana Silva",
      course: "Design",
      semester: "3",
      whatsapp: "85999999999",
      email: "aluna@edu.unifor.br",
    });
  });

  it("rejects a non-institutional email without sending or storing anything", () => {
    const onDemoLogin = vi.fn();
    render(<LoginDialog onClose={vi.fn()} onDemoLogin={onDemoLogin} />);
    fireEvent.change(screen.getByLabelText("E-mail institucional"), {
      target: { value: "aluna@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByRole("alert")).toHaveTextContent("@edu.unifor.br");
    expect(onDemoLogin).not.toHaveBeenCalled();
  });
});
