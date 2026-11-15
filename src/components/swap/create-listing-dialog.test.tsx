import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CreateListingDialog } from "@/components/swap/create-listing-dialog";

describe("CreateListingDialog", () => {
  it("submits a valid local trade listing", () => {
    const onSubmit = vi.fn();
    render(<CreateListingDialog onClose={vi.fn()} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("O que você tem"), {
      target: { value: "Aulas de inglês" },
    });
    fireEvent.change(screen.getByLabelText("O que você procura"), {
      target: { value: "Ajuda com design" },
    });
    fireEvent.change(screen.getByLabelText("Tipo de anúncio"), {
      target: { value: "trade" },
    });
    fireEvent.change(screen.getByLabelText("Tipo / subcategoria"), {
      target: { value: "Idiomas" },
    });
    fireEvent.click(screen.getByLabelText("Li e aceito os termos de uso da comunidade."));
    fireEvent.click(screen.getByRole("button", { name: "Publicar anúncio" }));

    expect(onSubmit).toHaveBeenCalledWith({
      cat: "Streaming",
      type: "Idiomas",
      name: "Aulas de inglês",
      wants: "Ajuda com design",
      price: null,
      kind: "trade",
      delivery: "manual",
      description: "",
    });
  });

  it("does not submit until community terms are accepted", () => {
    const onSubmit = vi.fn();
    render(<CreateListingDialog onClose={vi.fn()} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("O que você tem"), {
      target: { value: "Aulas de inglês" },
    });
    fireEvent.change(screen.getByLabelText("O que você procura"), {
      target: { value: "Ajuda com design" },
    });
    fireEvent.change(screen.getByLabelText("Tipo de anúncio"), {
      target: { value: "trade" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Publicar anúncio" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Aceite os termos");
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
