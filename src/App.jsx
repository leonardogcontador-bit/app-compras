import { useState, useEffect } from "react";
import { ShoppingCart, Trash2, X } from "lucide-react";

const SUPABASE_URL = "https://mgfzsafdfmcgyqlsomez.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nZnpzYWZkZm1jZ3lxbHNvbWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNjcwODEsImV4cCI6MjEwMDc0MzA4MX0.5_1rl0gr3NI54tRycs1NYh9vCpoJPmnVONFVsV6shz4";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const PAPER = "#FAFAF8";
const INK = "#1A1A1A";
const INK_SOFT = "#5A5A5A";
const LINE = "#E2E0DA";
const STAMP_GREEN = "#009246";
const STAMP_RED = "#CE2B37";
const STAMP_BLUE = "#0055A4";
const CARD = "#FFFFFF";

const TODAY_VIRTUAL_ID = "hoje-virtual";

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function weekdayOf(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return WEEKDAYS[d.getDay()];
}

function shortDate(dateStr) {
  const [, m, day] = dateStr.split("-");
  return `${day}/${m}`;
}

function formatPrice(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  if (Number.isNaN(n)) return null;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function DoodleIcon({ type, color = "#5B5F4E", size = 34 }) {
  const common = {
    viewBox: "0 0 40 40",
    width: size,
    height: size,
    fill: "none",
    stroke: color,
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (type) {
    case "cenoura":
      return (
        <svg {...common}>
          <path d="M14 8 Q20 6 17 12" />
          <path d="M18 7 Q22 5 20 11" />
          <path d="M21 9 Q24 8 22 13" />
          <path d="M16 12 Q26 14 24 24 Q22 34 15 32 Q10 30 12 20 Q13 14 16 12 Z" />
        </svg>
      );
    case "pao":
      return (
        <svg {...common}>
          <path d="M6 22 Q6 12 20 12 Q34 12 34 22 Q34 30 20 30 Q6 30 6 22 Z" />
          <path d="M13 15 Q13 20 13 26" />
          <path d="M20 14 Q20 20 20 27" />
          <path d="M27 15 Q27 20 27 26" />
        </svg>
      );
    case "tomate":
      return (
        <svg {...common}>
          <path d="M20 12 C28 12 32 18 32 24 C32 30 26 33 20 33 C14 33 8 30 8 24 C8 18 12 12 20 12 Z" />
          <path d="M17 11 Q20 7 23 11" />
          <path d="M20 8 L20 11" />
        </svg>
      );
    case "banana":
      return (
        <svg {...common}>
          <path d="M9 12 Q8 24 16 30 Q26 34 33 26" />
          <path d="M33 26 Q35 28 32 30 Q26 36 15 32 Q6 26 8 12" />
        </svg>
      );
    case "maca":
      return (
        <svg {...common}>
          <path d="M20 14 C13 12 8 17 8 23 C8 29 13 33 18 33 C19 33 19.5 32.5 20 32.5 C20.5 32.5 21 33 22 33 C27 33 32 29 32 23 C32 17 27 12 20 14 Z" />
          <path d="M20 14 Q20 9 24 7" />
          <path d="M20 10 Q17 8 15 10" />
        </svg>
      );
    case "ovos":
      return (
        <svg {...common}>
          <ellipse cx="14" cy="24" rx="6" ry="8" />
          <ellipse cx="25" cy="22" rx="6.5" ry="8.5" />
        </svg>
      );
    case "sacola":
      return (
        <svg {...common}>
          <path d="M10 15 L30 15 L28 34 L12 34 Z" />
          <path d="M15 15 Q15 8 20 8 Q25 8 25 15" />
          <circle cx="20" cy="23" r="1.6" fill={color} stroke="none" />
        </svg>
      );
    case "uva":
      return (
        <svg {...common}>
          <path d="M20 8 L20 13" />
          <circle cx="16" cy="16" r="4" />
          <circle cx="24" cy="16" r="4" />
          <circle cx="13" cy="23" r="4" />
          <circle cx="20" cy="23" r="4" />
          <circle cx="27" cy="23" r="4" />
          <circle cx="16" cy="30" r="4" />
          <circle cx="24" cy="30" r="4" />
        </svg>
      );
    default:
      return null;
  }
}

const DOODLE_ORDER = ["cenoura", "pao", "tomate", "banana", "maca", "ovos", "uva", "sacola"];
const DOODLE_COLORS = [STAMP_GREEN, STAMP_BLUE, STAMP_RED, INK_SOFT];

function DoodleStrip({ flip = false }) {
  return (
    <div
      className="flex items-center justify-around px-2"
      style={{ transform: flip ? "scaleX(-1)" : "none" }}
    >
      {DOODLE_ORDER.map((type, i) => (
        <div key={type} style={{ transform: flip ? "scaleX(-1)" : "none" }}>
          <DoodleIcon type={type} color={DOODLE_COLORS[i % DOODLE_COLORS.length]} size={28} />
        </div>
      ))}
    </div>
  );
}

export default function MeuMercadoApp() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [precos, setPrecos] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [editingCell, setEditingCell] = useState(null);
  const [cellDraft, setCellDraft] = useState("");

  const carregar = async () => {
    setLoading(true);
    setErro("");
    try {
      const [resProdutos, resPrecos] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/produtos?select=*&order=created_at.asc`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/precos?select=*&order=dia_data.asc`, { headers }),
      ]);
      if (!resProdutos.ok) {
        const txt = await resProdutos.text();
        throw new Error(`produtos ${resProdutos.status}: ${txt}`);
      }
      if (!resPrecos.ok) {
        const txt = await resPrecos.text();
        throw new Error(`precos ${resPrecos.status}: ${txt}`);
      }
      setProdutos(await resProdutos.json());
      setPrecos((await resPrecos.json()).filter((p) => p.produto_id && p.dia_data));
    } catch (e) {
      setErro("Erro ao carregar: " + (e?.message || "desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  async function addItem() {
    const nome = newItemName.trim();
    if (!nome) return;
    setErro("");
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/produtos`, {
        method: "POST",
        headers,
        body: JSON.stringify([{ nome }]),
      });
      if (!res.ok) throw new Error();
      const [novo] = await res.json();
      setProdutos((prev) => [...prev, novo]);
      setNewItemName("");
    } catch (e) {
      setErro("Não foi possível salvar o produto. Tente novamente.");
    }
  }

  async function deleteItem(id) {
    setErro("");
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/produtos?id=eq.${id}`, {
        method: "DELETE",
        headers,
      });
      setProdutos((prev) => prev.filter((p) => p.id !== id));
      setPrecos((prev) => prev.filter((p) => p.produto_id !== id));
    } catch (e) {
      setErro("Não foi possível remover o produto.");
    }
  }

  async function deleteDia(diaData) {
    setErro("");
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/precos?dia_data=eq.${diaData}`, {
        method: "DELETE",
        headers,
      });
      setPrecos((prev) => prev.filter((p) => p.dia_data !== diaData));
    } catch (e) {
      setErro("Não foi possível remover essa coluna.");
    }
  }

  async function deletePreco(id) {
    setErro("");
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/precos?id=eq.${id}`, {
        method: "DELETE",
        headers,
      });
      setPrecos((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setErro("Não foi possível remover o preço.");
    }
  }

  function openCell(produtoId, diaData) {
    setEditingCell(`${produtoId}:${diaData}`);
    const atual = precos.find((p) => p.produto_id === produtoId && p.dia_data === diaData);
    setCellDraft(atual ? String(atual.preco) : "");
  }

  async function commitCell(produtoId, diaData) {
    const n = parseFloat(cellDraft.replace(",", "."));
    const vazio = cellDraft.trim() === "" || Number.isNaN(n);
    setErro("");

    if (vazio) {
      setEditingCell(null);
      setCellDraft("");
      return;
    }

    const diaReal = diaData === TODAY_VIRTUAL_ID ? todayISO() : diaData;
    const existente = precos.find(
      (p) => p.produto_id === produtoId && p.dia_data === diaReal
    );

    try {
      if (existente) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/precos?id=eq.${existente.id}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ preco: n }),
        });
        if (!res.ok) throw new Error();
        const [atualizado] = await res.json();
        setPrecos((prev) => prev.map((p) => (p.id === existente.id ? atualizado : p)));
      } else {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/precos`, {
          method: "POST",
          headers,
          body: JSON.stringify([{ produto_id: produtoId, dia_data: diaReal, preco: n }]),
        });
        if (!res.ok) throw new Error();
        const [novo] = await res.json();
        setPrecos((prev) => [...prev, novo]);
      }
    } catch (e) {
      setErro("Não foi possível salvar o preço. Tente novamente.");
    }
    setEditingCell(null);
    setCellDraft("");
  }

  function bestFor(produtoId) {
    const doItem = precos.filter((p) => p.produto_id === produtoId);
    if (doItem.length === 0) return null;
    let best = doItem[0];
    for (const p of doItem) {
      if (p.preco < best.preco) best = p;
    }
    return { price: best.preco, weekday: weekdayOf(best.dia_data) };
  }

  if (loading) {
    return (
      <div
        style={{ background: PAPER, color: INK }}
        className="min-h-screen flex items-center justify-center font-mono text-sm"
      >
        carregando...
      </div>
    );
  }

  const diasUnicos = [...new Set(precos.map((p) => p.dia_data))].sort();
  const todayIsOpen = diasUnicos.includes(todayISO());
  const colunas = todayIsOpen
    ? diasUnicos.map((date) => ({ id: date, date, virtual: false }))
    : [...diasUnicos.map((date) => ({ id: date, date, virtual: false })), { id: TODAY_VIRTUAL_ID, date: todayISO(), virtual: true }];

  return (
    <div style={{ background: PAPER, color: INK }} className="min-h-screen flex flex-col relative">
      <style>{`
        @keyframes shimmerGold {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes borderGlow {
          0%, 100% { box-shadow: 0 0 3px rgba(212,175,55,0.35), inset 0 0 0 rgba(0,0,0,0); }
          50% { box-shadow: 0 0 10px rgba(212,175,55,0.9), inset 0 0 4px rgba(212,175,55,0.25); }
        }
        .produto-input {
          border: 1.5px solid #D4AF37 !important;
          animation: borderGlow 2.4s ease-in-out infinite;
        }
        .produto-input::placeholder {
          background: linear-gradient(90deg, #B8860B, #FFE9A8, #D4AF37, #FFF3C4, #B8860B);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          animation: shimmerGold 3.2s linear infinite;
          font-weight: 600;
          opacity: 1;
        }
      `}</style>
      <svg
        viewBox="0 0 30 21"
        width="26"
        height="18"
        style={{ position: "absolute", top: 6, right: 6, zIndex: 10 }}
      >
        <rect x="0" y="0" width="30" height="21" fill="#F2C230" />
        <polygon points="15,2 28,10.5 15,19 2,10.5" fill="#F2C230" stroke="#F2C230" />
        <circle cx="15" cy="10.5" r="4.2" fill="#F2C230" stroke="#FAFAF8" strokeWidth="0.4" />
      </svg>
      <header style={{ borderBottom: `2px dashed ${LINE}` }} className="pt-4 pb-4">
        <div className="pb-2">
          <DoodleStrip />
        </div>
        <div className="flex items-center justify-between gap-2 px-4">
          <h1 style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }} className="text-2xl font-bold">
            Meu Mercado
          </h1>
        </div>
        <p style={{ color: INK, fontFamily: "Georgia, serif" }} className="text-sm mt-1 font-semibold px-4">
          Itens que preciso comprar
        </p>
        <p style={{ color: INK_SOFT }} className="text-xs mt-1 font-mono px-4">
          {produtos.length} {produtos.length === 1 ? "item" : "itens"} · {diasUnicos.length}{" "}
          {diasUnicos.length === 1 ? "dia registrado" : "dias registrados"}
        </p>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex gap-2 mb-2">
          <input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="escreva aqui o produto/alimento"
            style={{ background: CARD, color: INK }}
            className="produto-input flex-1 rounded-md px-3 py-2 text-sm font-mono outline-none"
          />
          <button
            onClick={addItem}
            style={{ background: STAMP_GREEN }}
            className="text-white rounded-md px-3 flex items-center justify-center"
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        {erro && (
          <div
            style={{ background: "#FBE9E7", color: STAMP_RED }}
            className="text-xs font-mono rounded-md px-3 py-2 mb-3"
          >
            {erro}
          </div>
        )}

        {produtos.length === 0 ? (
          <p style={{ color: INK_SOFT }} className="text-sm font-mono text-center mt-10">
            adicione seus itens acima
            <br />
            para começar o caderno.
          </p>
        ) : (
          <div style={{ border: `1px solid ${LINE}` }} className="rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="border-collapse" style={{ minWidth: "100%" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        background: CARD,
                        borderBottom: `1.5px solid ${LINE}`,
                        position: "sticky",
                        left: 0,
                        zIndex: 2,
                      }}
                      className="text-left text-xs font-mono px-3 py-2 min-w-[110px]"
                    >
                      item
                    </th>
                    {colunas.map((d) => (
                      <th
                        key={d.id}
                        style={{
                          background: d.virtual ? "#EAF2FB" : CARD,
                          borderBottom: `1.5px solid ${d.virtual ? STAMP_BLUE : LINE}`,
                          borderLeft: `1px solid ${LINE}`,
                        }}
                        className="text-xs font-mono px-2 py-2 min-w-[72px] relative"
                      >
                        <div className="flex flex-col items-center">
                          <span style={{ color: d.virtual ? STAMP_BLUE : INK_SOFT, fontWeight: d.virtual ? 700 : 400 }}>
                            {d.virtual ? "hoje" : weekdayOf(d.date)}
                          </span>
                          <span className="font-semibold">{shortDate(d.date)}</span>
                          <span style={{ color: STAMP_GREEN, fontSize: 9, fontWeight: 700, opacity: 0.75 }}>R$</span>
                        </div>
                        {!d.virtual && (
                          <button
                            onClick={() => deleteDia(d.date)}
                            style={{ color: INK_SOFT }}
                            className="absolute top-0.5 right-0.5"
                          >
                            <X size={10} />
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((it) => {
                    const best = bestFor(it.id);
                    return (
                      <tr key={it.id}>
                        <td
                          style={{
                            background: PAPER,
                            borderBottom: `1px solid ${LINE}`,
                            position: "sticky",
                            left: 0,
                            zIndex: 1,
                          }}
                          className="px-3 py-2 align-top"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-sm font-medium">{it.nome}</span>
                            <button onClick={() => deleteItem(it.id)} style={{ color: STAMP_RED }} className="shrink-0">
                              <Trash2 size={13} />
                            </button>
                          </div>
                          {best && (
                            <div style={{ color: STAMP_GREEN, fontFamily: "monospace" }} className="text-[10px] mt-1">
                              melhor: {formatPrice(best.price)} · {best.weekday}
                            </div>
                          )}
                        </td>
                        {colunas.map((d) => {
                          const cellKey = `${it.id}:${d.id}`;
                          const registro = d.virtual
                            ? undefined
                            : precos.find((p) => p.produto_id === it.id && p.dia_data === d.date);
                          const val = registro ? registro.preco : undefined;
                          const isBest = best && val === best.price;
                          return (
                            <td
                              key={d.id}
                              style={{ borderBottom: `1px solid ${LINE}`, borderLeft: `1px solid ${LINE}` }}
                              className="px-1 py-2 text-center"
                            >
                              {editingCell === cellKey ? (
                                <div
                                  style={{ border: `1px solid ${STAMP_GREEN}`, background: "white" }}
                                  className="flex items-center rounded px-1 w-16 mx-auto"
                                >
                                  <span style={{ color: STAMP_GREEN, fontSize: 11, fontWeight: 700 }}>R$</span>
                                  <input
                                    autoFocus
                                    inputMode="decimal"
                                    value={cellDraft}
                                    onChange={(e) => setCellDraft(e.target.value)}
                                    onBlur={() => commitCell(it.id, d.id)}
                                    onKeyDown={(e) => e.key === "Enter" && commitCell(it.id, d.id)}
                                    placeholder="0,00"
                                    style={{ background: "transparent" }}
                                    className="w-full rounded px-1 py-1 text-xs font-mono text-center outline-none"
                                  />
                                </div>
                              ) : (
                                <button
                                  onClick={() => openCell(it.id, d.id)}
                                  style={{
                                    color: isBest ? STAMP_GREEN : val != null ? INK : INK_SOFT,
                                    fontWeight: isBest ? 700 : 400,
                                  }}
                                  className="w-16 text-xs font-mono py-1"
                                >
                                  {val != null ? formatPrice(val).replace("R$", "") : "—"}
                                </button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p style={{ color: INK_SOFT }} className="text-[11px] font-mono text-center mt-4">
          toque na coluna "hoje" para registrar o preço do dia.
          <br />
          o melhor preço de cada item fica destacado em verde.
        </p>
      </main>

      <div className="pt-4 pb-1 -mx-0">
        <DoodleStrip flip />
      </div>
      <p style={{ color: INK_SOFT }} className="text-[10px] font-mono text-right pr-3 pb-1">
        Arte por Claudia Gusberti
      </p>
      <p style={{ color: INK_SOFT }} className="text-[10px] font-mono text-right pr-3 pb-3">
        Aplicativo idealizado e criado por Leonardo Gusberti
        <br />
        Florianópolis/Brasil
      </p>
    </div>
  );
}


