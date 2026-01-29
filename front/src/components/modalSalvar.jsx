import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";

// import { api } from "../utils/db";
import { db } from "../utils/db"

import "./modalSalvar.css";

export default function ModalSalvar({
  isOpen,
  onClose,
  onSaved,
  mode = "create", // "create" | "update"
  registroInicial = null, // { nome }
}) {
  const [linhas, setLinhas] = useState([{ nome: "", codigo: "" }]);

  useEffect(() => {
    if (mode === "update" && registroInicial) {
      setLinhas([{ nome: registroInicial.nome, codigo: "" }]);
    } else {
      setLinhas([{ nome: "", codigo: "" }]);
    }
  }, [mode, registroInicial, isOpen]);

  if (!isOpen) return null;

  function handleChange(index, field, value) {
    setLinhas((prev) =>
      prev.map((linha, i) =>
        i === index ? { ...linha, [field]: value } : linha,
      ),
    );
  }

  function addLinha() {
    setLinhas((prev) => [...prev, { nome: "", codigo: "" }]);
  }

  async function handleSave() {
    try {
      if (mode === "create") {
        const validas = linhas.filter((l) => l.nome.trim() && l.codigo.trim());

        if (validas.length === 0) return;

        // await api.post("", { registros: validas });
        await db.layouts.bulkAdd(validas)

        Swal.fire({
          icon: "success",
          title: "Salvo com sucesso!",
          text: "Os registros foram cadastrados.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      if (mode === "update") {
        const { nome, codigo } = linhas[0];

        if (!codigo.trim()) return;

        // await api.put("", {
        //   nome,
        //   novoCodigo: codigo,
        // });

        const registro = await db.layouts
          .where("nome")
          .equals(nome)
          .first();

        if (!registro) {
          Swal.fire({
            icon: "error",
            title: "Não encontrado",
            text: "Registro não encontrado no banco local",
          });
          return;
        }

        await db.layouts.update(registro.id, {
          codigo,
        });

        Swal.fire({
          icon: "success",
          title: "Código atualizado!",
          text: `Novo código salvo para ${nome}`,
          timer: 1500,
          showConfirmButton: false,
        });
      }

      onSaved?.();
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: err.response?.data || "Erro inesperado",
      });
    }
  }

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>
          {mode === "create" ? "Salvar nomes e códigos" : "Atualizar código"}
        </h3>

        <div className="linhas">
          {linhas.map((linha, index) => (
            <div key={index} className="linha">
              <div className="campo nome">
                <input
                  type="text"
                  placeholder="Nome"
                  value={linha.nome}
                  disabled={mode === "update"}
                  onChange={(e) => handleChange(index, "nome", e.target.value)}
                />
              </div>

              <div className="campo codigo">
                <input
                  type="number"
                  placeholder={mode === "update" ? "Novo código" : "Código"}
                  value={linha.codigo}
                  onChange={(e) =>
                    handleChange(index, "codigo", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {mode === "create" && (
          <button className="add-btn" onClick={addLinha}>
            <Plus size={18} /> Adicionar linha
          </button>
        )}

        <div className="modal-actions">
          <button onClick={handleSave}>
            {mode === "create" ? "Salvar tudo" : "Atualizar"}
          </button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root"),
  );
}
