import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, TrendingDown, ShoppingCart, RefreshCw } from "lucide-react";

const SUPABASE_URL = "https://mgfzsafdfmcgyqlsomez.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nZnpzYWZkZm1jZ3lxbHNvbWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNjcwODEsImV4cCI6MjEwMDc0MzA4MX0.5_1rl0gr3NI54tRycs1NYh9vCpoJPmnVONFVsV6shz4";

const DIAS = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

export default function AppCompras() {
  const [precos, setPrecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [item, setItem] = useState("");
  const [dia, setDia] = useState(DIAS[0]);
  const [preco, setPreco] = useState("");

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro("");
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/precos?select=*&order=created_at.desc`,
        { headers }
      );
      if (!res.ok) throw new Error("Falha ao carregar dados");
      const data = await res.json();
      setPrecos(data);
    } catch (e) {
      setErro("Não foi possível carregar os preços. Puxe para atualizar.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const adicionar = async () => {
    if (!item.trim() || !preco) return;
    setSalvando(true);
    setErro("");
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/precos`, {
        method: "POST",
        headers,
        body: JSON.stringify([
          {
            item: item.trim(),
            dia_semana: dia,
            preco: parseFloat(preco.replace(",", ".")),
          },
        ]),
      });
      if (!res.ok) throw new Error("Falha ao salvar");
      const [novo] = await res.json();
      setPrecos((prev) => [novo, ...prev]);
      setItem("");
      setPreco("");
    } catch (e) {
      setErro("Não foi possível salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  const remover = async (id) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/precos?id=eq.${id}`, {
        method: "DELETE",
        headers,
      });
      setPrecos((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setErro("Não foi possível remover o registro.");
    }
  };

  const itensAgrupados = precos.reduce((acc, p) => {
    if (!acc[p.item]) acc[p.item] = [];
    acc[p.item].push(p);
    return acc;
  }, {});

  const melhorDia = (registros) => {
    const porDia = {};
    registros.forEach((r) => {
      if (!porDia[r.dia_semana]) porDia[r.dia_semana] = [];
      porDia[r.dia_semana].push(r.preco);
    });
    let melhor = null;
    let menorMedia = Infinity;
    Object.entries(porDia).forEach(([d, precosArr]) => {
      const media = precosArr.reduce((a, b) => a + b, 0) / precosArr.length;
      if (media < menorMedia) {
        menorMedia = media;
        melhor = d;
      }
    });
    return { dia: melhor, preco: menorMedia };
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerRow}>
          <ShoppingCart size={28} color="#1F5B5B" />
          <h1 style={styles.title}>Preço da Feira</h1>
        </div>
        <p style={styles.subtitle}>
          Anote o preço de cada item e descubra o melhor dia pra comprar.
        </p>
      </header>

      <section style={styles.formCard}>
        <label style={styles.label}>Item</label>
        <input
          style={styles.input}
          placeholder="Ex: Tomate, Arroz, Leite..."
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />

        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Dia da compra</label>
            <select
              style={styles.input}
              value={dia}
              onChange={(e) => setDia(e.target.value)}
            >
              {DIAS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div style={{ width: 130 }}>
            <label style={styles.label}>Preço (R$)</label>
            <input
              style={styles.input}
              placeholder="0,00"
              inputMode="decimal"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />
          </div>
        </div>

        <button
          style={{
            ...styles.button,
            opacity: !item.trim() || !preco || salvando ? 0.6 : 1,
          }}
          disabled={!item.trim() || !preco || salvando}
          onClick={adicionar}
        >
          <Plus size={20} />
          {salvando ? "Salvando..." : "Salvar preço"}
        </button>
      </section>

      {erro && <div style={styles.erro}>{erro}</div>}

      <div style={styles.listHeader}>
        <h2 style={styles.sectionTitle}>Seus itens</h2>
        <button style={styles.refreshBtn} onClick={carregar} title="Atualizar">
          <RefreshCw size={18} color="#1F5B5B" />
        </button>
      </div>

      {loading ? (
        <p style={styles.info}>Carregando...</p>
      ) : Object.keys(itensAgrupados).length === 0 ? (
        <p style={styles.info}>
          Nenhum item ainda. Adicione o primeiro preço acima.
        </p>
      ) : (
        Object.entries(itensAgrupados).map(([nomeItem, registros]) => {
          const { dia: diaBom, preco: precoBom } = melhorDia(registros);
          return (
            <div key={nomeItem} style={styles.itemCard}>
              <div style={styles.itemHeader}>
                <span style={styles.itemNome}>{nomeItem}</span>
                <span style={styles.badge}>
                  <TrendingDown size={14} />
                  Melhor dia: {diaBom} (R$ {precoBom.toFixed(2)})
                </span>
              </div>
              {registros
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map((r) => (
                  <div key={r.id} style={styles.registro}>
                    <span style={styles.registroDia}>{r.dia_semana}</span>
                    <span style={styles.registroPreco}>
                      R$ {Number(r.preco).toFixed(2)}
                    </span>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => remover(r.id)}
                      aria-label="Remover"
                    >
                      <Trash2 size={16} color="#B0453D" />
                    </button>
                  </div>
                ))}
            </div>
          );
        })
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F7F5F0",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "20px 16px 60px",
    maxWidth: 480,
    margin: "0 auto",
  },
  header: { marginBottom: 20 },
  headerRow: { display: "flex", alignItems: "center", gap: 10 },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: "#1F5B5B",
    margin: 0,
  },
  subtitle: {
    fontSize: 15,
    color: "#5A5A52",
    marginTop: 6,
    lineHeight: 1.4,
  },
  formCard: {
    background: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#5A5A52",
    display: "block",
    marginBottom: 4,
    marginTop: 10,
  },
  row: { display: "flex", gap: 12 },
  input: {
    width: "100%",
    fontSize: 17,
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #E0DDD3",
    background: "#FBFAF7",
    boxSizing: "border-box",
    color: "#2B2B26",
  },
  button: {
    marginTop: 18,
    width: "100%",
    fontSize: 17,
    fontWeight: 700,
    color: "#FFFFFF",
    background: "#1F5B5B",
    border: "none",
    borderRadius: 12,
    padding: "14px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
  },
  erro: {
    background: "#FBE9E7",
    color: "#B0453D",
    padding: "10px 14px",
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 16,
  },
  listHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 19, fontWeight: 700, color: "#2B2B26", margin: 0 },
  refreshBtn: {
    background: "#FFFFFF",
    border: "1px solid #E0DDD3",
    borderRadius: 10,
    padding: 8,
    cursor: "pointer",
    display: "flex",
  },
  info: { fontSize: 15, color: "#7A7A70", textAlign: "center", marginTop: 30 },
  itemCard: {
    background: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  itemHeader: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: "1px solid #F0EEE7",
  },
  itemNome: { fontSize: 18, fontWeight: 700, color: "#2B2B26" },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 13,
    fontWeight: 600,
    color: "#8A6416",
    background: "#FBF1DC",
    padding: "4px 10px",
    borderRadius: 20,
    width: "fit-content",
  },
  registro: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 0",
  },
  registroDia: { fontSize: 15, color: "#4A4A42", flex: 1 },
  registroPreco: { fontSize: 15, fontWeight: 700, color: "#2B2B26", marginRight: 10 },
  deleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
  },
};
