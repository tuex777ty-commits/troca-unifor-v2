import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { categories, type Listing, type ListingKind } from "@/components/swap/data";

type ListingDraft = Pick<
  Listing,
  "cat" | "type" | "name" | "wants" | "price" | "delivery" | "description" | "kind"
>;

export function CreateListingDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (draft: ListingDraft) => void;
}) {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const wants = String(form.get("wants") ?? "").trim();
    const type = String(form.get("kind") ?? "both") as ListingKind;
    const rawPrice = String(form.get("price") ?? "").trim();
    const price = rawPrice ? Number(rawPrice) : null;

    if (name.length < 3) {
      setMessage("O título precisa ter pelo menos 3 caracteres.");
      return;
    }
    if (type !== "trade" && (price === null || !Number.isFinite(price) || price < 0)) {
      setMessage("Informe um valor válido para venda.");
      return;
    }
    if (type === "trade" && !wants) {
      setMessage("Diga o que você procura em troca.");
      return;
    }
    if (!form.get("terms")) {
      setMessage("Aceite os termos para publicar.");
      return;
    }

    onSubmit({
      cat: String(form.get("cat")),
      type: String(form.get("type")).trim() || "Anúncio",
      name,
      wants,
      price,
      kind: type,
      delivery: String(form.get("delivery")) === "automatic" ? "automatic" : "manual",
      description: String(form.get("description") ?? "").trim(),
    });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="transaction-dialog">
        <DialogHeader>
          <DialogTitle>Anunciar no mural</DialogTitle>
          <DialogDescription>
            Crie um anúncio de demonstração. Ele só fica nesta sessão do navegador.
          </DialogDescription>
        </DialogHeader>
        <form className="proposal-form" onSubmit={handleSubmit}>
          <div className="listing-form-row">
            <label>
              Categoria
              <select name="cat" defaultValue={categories[0].name}>
                {categories.map((category) => (
                  <option key={category.id}>{category.name}</option>
                ))}
              </select>
            </label>
            <label>
              Tipo de anúncio
              <select name="kind" defaultValue="both">
                <option value="trade">Troca</option>
                <option value="sale">Venda</option>
                <option value="both">Troca ou venda</option>
              </select>
            </label>
          </div>
          <label>
            O que você tem
            <input
              name="name"
              maxLength={80}
              required
              placeholder="Ex.: Convite de plano família"
            />
          </label>
          <div className="listing-form-row">
            <label>
              O que você procura
              <input name="wants" maxLength={80} placeholder="Ex.: Curso de espanhol" />
            </label>
            <label>
              Valor estimado (R$)
              <input name="price" type="number" min="0" step="0.01" placeholder="Opcional" />
            </label>
          </div>
          <div className="listing-form-row">
            <label>
              Tipo / subcategoria
              <input name="type" maxLength={35} placeholder="Ex.: Idiomas" />
            </label>
            <label>
              Entrega
              <select name="delivery" defaultValue="manual">
                <option value="automatic">Código ou convite</option>
                <option value="manual">Presencial ou envio pelo vendedor</option>
              </select>
            </label>
          </div>
          <label>
            Descrição
            <textarea
              name="description"
              rows={3}
              maxLength={500}
              placeholder="Duração, vagas e condições"
            />
          </label>
          <p className="prototype-note">
            Não anuncie compartilhamento de senhas nem contas revendidas. Planos família só por
            convite oficial.
          </p>
          <label className="listing-terms">
            <input name="terms" type="checkbox" />
            Li e aceito os termos de uso da comunidade.
          </label>
          {message && (
            <p className="login-feedback" role="alert">
              {message}
            </p>
          )}
          <div className="transaction-actions">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="brand">
              Publicar anúncio
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
