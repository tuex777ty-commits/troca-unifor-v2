import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Listing } from "@/components/swap/data";

export function ListingDialog({
  listing,
  onClose,
  onContact,
  onReport,
}: {
  listing: Listing;
  onClose: () => void;
  onContact: (listing: Listing) => void;
  onReport: () => void;
}) {
  const [mode, setMode] = useState<"details" | "proposal" | "purchase">("details");
  const [submitted, setSubmitted] = useState(false);
  const amount = `R$ ${listing.price.toFixed(2).replace(".", ",")}`;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="transaction-dialog">
        <DialogHeader>
          <DialogTitle>
            {mode === "proposal"
              ? "Fazer proposta"
              : mode === "purchase"
                ? "Comprar anúncio"
                : listing.name}
          </DialogTitle>
          <DialogDescription>
            {listing.cat} · {listing.type} · valor pedido {amount}
          </DialogDescription>
        </DialogHeader>
        {mode === "details" && (
          <>
            <div className="transaction-summary">
              <p>{listing.description}</p>
              <p>
                <strong>Anunciante:</strong> {listing.owner}
              </p>
              <p>
                {listing.kind === "trade"
                  ? "O anunciante busca uma troca."
                  : listing.kind === "sale"
                    ? "O anunciante aceita venda."
                    : "O anunciante aceita venda ou troca."}{" "}
                Você pode oferecer um item e sugerir um complemento em dinheiro; a decisão é do
                anunciante.
              </p>
              <p>
                <strong>Entrega:</strong>{" "}
                {listing.delivery === "automatic"
                  ? "Automática para produto digital (planejada; ainda indisponível)."
                  : "Envio feito pelo vendedor."}
              </p>
            </div>
            <p className="prototype-note">
              Prévia local. Conversas abrem o WhatsApp do anunciante; negociação e pagamentos não
              são gerenciados por este app.
            </p>
            <div className="transaction-actions">
              <Button variant="outline" onClick={onReport}>
                Denunciar
              </Button>
              <Button variant="outline" onClick={() => onContact(listing)}>
                Chamar no WhatsApp
              </Button>
              <Button
                variant="brand"
                onClick={() => {
                  setSubmitted(false);
                  setMode("proposal");
                }}
              >
                Fazer proposta
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setMode("purchase");
                }}
              >
                Comprar
              </Button>
            </div>
          </>
        )}
        {mode === "proposal" &&
          (submitted ? (
            <div className="prototype-note" role="status">
              Esta é apenas uma prévia. A proposta não foi enviada nem salva.
            </div>
          ) : (
            <form
              className="proposal-form"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <label>
                Item que você oferece
                <input required name="offered-item" placeholder="Ex.: outro jogo de tabuleiro" />
              </label>
              <label>
                Valor que você atribui ao item (R$)
                <input
                  required
                  name="offered-value"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex.: 25,00"
                />
              </label>
              <label>
                Complemento em dinheiro (R$)
                <input
                  name="cash-difference"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Opcional"
                />
              </label>
              <p className="prototype-note">
                Você pode sugerir valores; o anunciante avalia e pode aceitar, recusar ou fazer uma
                contraproposta. A proposta não será enviada nem armazenada.
              </p>
              <div className="transaction-actions">
                <Button type="button" variant="outline" onClick={() => setMode("details")}>
                  Voltar
                </Button>
                <Button type="submit" variant="brand">
                  Pré-visualizar proposta
                </Button>
              </div>
            </form>
          ))}
        {mode === "purchase" && (
          <div className="transaction-summary">
            <p>
              Preço anunciado: <strong>{amount}</strong>
            </p>
            <p className="prototype-note">
              O SWAP ainda não processa pagamentos. Esta ação é apenas demonstrativa e não inicia
              uma compra.
            </p>
            <Button variant="outline" onClick={() => setMode("details")}>
              Voltar ao anúncio
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
