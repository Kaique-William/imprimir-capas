import { useState, useEffect } from "react";
import img from "./assets/LogoPaz.jpeg";
import ModalSalvar from "./components/modalSalvar";
import ModalAdicionarCapas from "./components/modalAddCapas";

import { api } from "./utils/db";

// import { db } from "./utils/db"

import "./App.css";

function App() {
  const [modalSalvarOpen, setModalSalvarOpen] = useState(false);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [modalCapasOpen, setModalCapasOpen] = useState(false);

  const [filaCapas, setFilaCapas] = useState([]);
  const [layouts, setLayouts] = useState([]);

  async function carregarLayouts() {
    try {
      // const dados = await db.layouts.toArray();
      const response = await api.get();
      const dados = response.data;

      const ordenados = dados.sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }),
      );

      setLayouts(ordenados);
    } catch (err) {
      console.error("ERRO AO CARREGAR:", err);
    }
  }

  useEffect(() => {
    carregarLayouts();
  }, []);

  const [form, setForm] = useState({
    nome: "",
    vencimento: "2001-09-11",
    cheque: "",
    codigo: "",
    estilo: "1",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "estilo") {
        return {
          ...prev,
          estilo: value,
          nome: "",
          codigo: "",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  }

  function handleSave() {
    setFilaCapas((prev) => [...prev, { ...form, id: Date.now() }]);
  }

  function handleRemove(id) {
    setFilaCapas((prev) => prev.filter((capa) => capa.id !== id));
  }

  function handlePrintScreen() {
    window.print();

    window.onafterprint = () => {
      setFilaCapas([]);
    };
  }

  function formatarDataBR(dataISO) {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function handleSelectNome(e) {
    const nomeSelecionado = e.target.value;

    const layout = layouts.find((l) => l.nome === nomeSelecionado);

    setForm((prev) => ({
      ...prev,
      nome: nomeSelecionado,
      codigo: layout ? layout.codigo : "",
    }));
  }

  return (
    <>
      <div className="formulario">
        <div className="top-bar">
          <select name="estilo" value={form.estilo} onChange={handleChange}>
            <option value="1">Estilo 1</option>
            <option value="2">Estilo 2</option>
          </select>
        </div>

        <img src={img} alt="logo" />
        <h1>COMPROVANTE DE PAGAMENTO</h1>

        <h3>
          {form.estilo === "1" ? "ALUGUEL:" : "NOME:"}

          <select value={form.nome} onChange={handleSelectNome}>
            <option value="">Selecione</option>

            {layouts.map((l) => (
              <option key={l.id} value={l.nome}>
                {l.nome}
              </option>
            ))}
          </select>
        </h3>

        <h3>
          VENC.:
          <input
            type="date"
            name="vencimento"
            value={form.vencimento}
            onChange={handleChange}
          />
        </h3>

        <h3>
          CHEQUE:
          <input
            type="text"
            name="cheque"
            value={form.cheque}
            onChange={handleChange}
          />
        </h3>

        <h4>
          <input
            type="number"
            name="codigo"
            placeholder="Código"
            value={form.codigo}
            onChange={handleChange}
          />
        </h4>

        <button onClick={handleSave}>Salvar na fila</button>
        <button onClick={handlePrintScreen}>Imprimir fila</button>
        <button onClick={() => setModalSalvarOpen(true)}>
          {" "}
          Salvar novo nome/código{" "}
        </button>
        <button onClick={() => setModalUpdateOpen(true)} disabled={!form.nome}>
          {" "}
          Atualizar código{" "}
        </button>

        <button onClick={() => setModalCapasOpen(true)}>
          {" "}
          Adicionar capas à fila{" "}
        </button>

        {filaCapas.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h3>Fila de impressão</h3>
            {filaCapas.map((capa, index) => (
              <div key={capa.id}>
                Capa {index + 1} — Estilo {capa.estilo}
                <button
                  style={{ marginLeft: 10 }}
                  onClick={() => handleRemove(capa.id)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Area de impressão */}
      <div className="area-print">
        {filaCapas.map((capa) => (
          <div key={capa.id} className={`capa estilo-${capa.estilo}`}>
            <img src={img} alt="logo" />
            <h1>COMPROVANTE DE PAGAMENTO</h1>

            <p>
              {capa.estilo === "1" ? "ALUGUEL:" : ""} {capa.nome}
            </p>

            <p>VENC.: {formatarDataBR(capa.vencimento)}</p>
            <p>CHEQUE: {capa.cheque}</p>
            <p>{capa.codigo}</p>
          </div>
        ))}
      </div>

      <ModalSalvar
        isOpen={modalSalvarOpen}
        onClose={() => setModalSalvarOpen(false)}
        onSaved={carregarLayouts}
        mode="create"
      />

      <ModalSalvar
        isOpen={modalUpdateOpen}
        onClose={() => setModalUpdateOpen(false)}
        onSaved={carregarLayouts}
        mode="update"
        registroInicial={{
          nome: form.nome,
          codigo: form.codigo,
        }}
      />

      <ModalAdicionarCapas
        isOpen={modalCapasOpen}
        onClose={() => setModalCapasOpen(false)}
        layouts={layouts}
        onAddCapas={(novas) => setFilaCapas((prev) => [...prev, ...novas])}
      />
    </>
  );
}

export default App;
