import { createPortal } from "react-dom";
import { useState } from "react";

import "./modalAddCapas.css";

export default function ModalAdicionarCapas({
  isOpen,
  onClose,
  layouts,
  onAddCapas,
}) {
  const [capas, setCapas] = useState([
    {
      nome: "",
      vencimento: "2001-09-01",
      cheque: "",
      codigo: "",
      estilo: "1",
    },
  ]);

  if (!isOpen) return null;

  function handleChange(index, field, value) {
    setCapas((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    );
  }

  function handleSelectNome(index, nome) {
    const layout = layouts.find((l) => l.nome === nome);

    setCapas((prev) =>
      prev.map((c, i) =>
        i === index
          ? {
              ...c,
              nome,
              codigo: layout ? layout.codigo : "",
            }
          : c,
      ),
    );
  }

  function addLinha() {
    setCapas((prev) => [
      ...prev,
      {
        nome: "",
        vencimento: "2001-09-01",
        cheque: "",
        codigo: "",
        estilo: "1",
      },
    ]);
  }

  function removeLinha(index) {
    setCapas((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAddFila() {
    const validas = capas.filter((c) => c.nome && c.codigo);

    if (!validas.length) return;

    const comId = validas.map((c) => ({
      ...c,
      id: Date.now() + Math.random(),
    }));

    onAddCapas(comId);
    setCapas([capas[0]]);
    onClose();
  }

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Adicionar capas à fila</h3>

        <div className="linhas">
          {capas.map((capa, index) => (
            <div key={index} className="linha">
              <select
                value={capa.nome}
                onChange={(e) => handleSelectNome(index, e.target.value)}
              >
                <option value="">Nome</option>
                {layouts.map((l) => (
                  <option key={l.id} value={l.nome}>
                    {l.nome}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={capa.vencimento}
                onChange={(e) =>
                  handleChange(index, "vencimento", e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Cheque"
                value={capa.cheque}
                onChange={(e) => handleChange(index, "cheque", e.target.value)}
              />

              <input
                type="number"
                placeholder="Código"
                value={capa.codigo}
                onChange={(e) => handleChange(index, "codigo", e.target.value)}
              />

              <select
                value={capa.estilo}
                onChange={(e) => handleChange(index, "estilo", e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
              </select>

              {capas.length > 1 && (
                <button
                  className="icon-btn danger"
                  onClick={() => removeLinha(index)}
                >
                  -
                </button>
              )}
            </div>
          ))}
        </div>

        <button className="add-btn" onClick={addLinha}>
          + Nova capa
        </button>

        <div className="modal-actions">
          <button onClick={handleAddFila}>Adicionar à fila</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root"),
  );
}
