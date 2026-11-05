// Motore comune: registro delle lezioni, numeri casuali, formattazione,
// rendering di tabelle e funzioni di calcolo usate dai generatori di esercizi.
(function (root) {
  "use strict";

  // ------------------------------------------------------------ registro
  const lezioni = [];

  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
  }

  function aggiungi(lez) {
    lez.domande.forEach((d) => {
      d.lezione = lez.numero;
      d.tipo = d.tipo || "scelta";
      if (d.tipo === "scelta" && d.ok === undefined) d.ok = 0;
      d.id = d.id || "L" + lez.numero + "-" + hash(d.q);
    });
    (lez.generatori || []).forEach((g) => {
      g.lezione = lez.numero;
      g.id = "G" + lez.numero + "-" + g.nome;
    });
    lezioni.push(lez);
    lezioni.sort((a, b) => a.numero - b.numero);
  }

  // ------------------------------------------------------------ casualità
  function rng(seed) {
    let a = seed >>> 0;
    const next = () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return {
      next,
      int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
      pick: (arr) => arr[Math.floor(next() * arr.length)],
      shuffle: (arr) => {
        const a2 = arr.slice();
        for (let i = a2.length - 1; i > 0; i--) {
          const j = Math.floor(next() * (i + 1));
          [a2[i], a2[j]] = [a2[j], a2[i]];
        }
        return a2;
      },
    };
  }

  // ------------------------------------------------------------ numeri
  function frazione(x, maxDen) {
    maxDen = maxDen || 64;
    for (let q = 1; q <= maxDen; q++) {
      const p = Math.round(x * q);
      if (Math.abs(p / q - x) < 1e-9) return [p, q];
    }
    return null;
  }

  function decimale(x, cifre) {
    cifre = cifre === undefined ? 3 : cifre;
    const s = (Math.round(x * Math.pow(10, cifre)) / Math.pow(10, cifre)).toString();
    return s.replace(".", ",").replace("-", "−");
  }

  // Forma leggibile: intero, frazione esatta (con decimale) o decimale.
  function fmt(x) {
    if (Math.abs(x - Math.round(x)) < 1e-9) return String(Math.round(x)).replace("-", "−");
    const f = frazione(x);
    if (f) return (f[0] < 0 ? "−" : "") + Math.abs(f[0]) + "/" + f[1] + " ≈ " + decimale(x);
    return decimale(x);
  }

  function leggiNumero(s) {
    if (typeof s !== "string") return NaN;
    const t = s.trim().replace(/\s+/g, "").replace(/−/g, "-").replace(",", ".");
    if (!t) return NaN;
    const m = t.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
    if (m) return parseFloat(m[1]) / parseFloat(m[2]);
    if (!/^-?(\d+\.?\d*|\.\d+)(e-?\d+)?$/i.test(t)) return NaN;
    return parseFloat(t);
  }

  function numeroGiusto(dato, atteso, tol) {
    if (!isFinite(dato)) return false;
    const t = tol === undefined ? 0.005 * Math.max(1, Math.abs(atteso)) : tol;
    return Math.abs(dato - atteso) <= t + 1e-12;
  }

  // ------------------------------------------------------------ tabelle HTML
  const neg = (v) => String(v).replace("-", "−");

  function bimatrice(righe, colonne, A, B, giocatori) {
    giocatori = giocatori || ["Riga", "Colonna"];
    let h = '<div class="tab-scroll"><table class="gioco"><thead><tr><th class="angolo">' +
      giocatori[0] + " \\ " + giocatori[1] + "</th>";
    colonne.forEach((c) => (h += "<th>" + c + "</th>"));
    h += "</tr></thead><tbody>";
    righe.forEach((r, i) => {
      h += "<tr><th>" + r + "</th>";
      colonne.forEach((_, j) => {
        h += "<td>" + (B ? neg(A[i][j]) + ", " + neg(B[i][j]) : neg(A[i][j])) + "</td>";
      });
      h += "</tr>";
    });
    return h + "</tbody></table></div>";
  }

  function tabella(intestazione, righe) {
    let h = '<div class="tab-scroll"><table class="dati"><thead><tr>';
    intestazione.forEach((c) => (h += "<th>" + c + "</th>"));
    h += "</tr></thead><tbody>";
    righe.forEach((r) => {
      h += "<tr>";
      r.forEach((c) => (h += "<td>" + c + "</td>"));
      h += "</tr>";
    });
    return h + "</tbody></table></div>";
  }

  function vettore(v) {
    return "(" + v.map((x) => fmtBreve(x)).join("; ") + ")";
  }

  function fmtBreve(x) {
    if (Math.abs(x - Math.round(x)) < 1e-9) return String(Math.round(x)).replace("-", "−");
    const f = frazione(x, 12);
    if (f) return (f[0] < 0 ? "−" : "") + Math.abs(f[0]) + "/" + f[1];
    return decimale(x);
  }

  // ------------------------------------------------------------ calcoli
  const M = {};

  // Albero a due livelli: radice MAX, figli MIN, foglie numeriche.
  M.minimaxAlbero = function (gruppi) {
    const mins = gruppi.map((g) => Math.min.apply(null, g));
    return { mins, valore: Math.max.apply(null, mins), mossa: mins.indexOf(Math.max.apply(null, mins)) };
  };

  // Alpha-beta da sinistra a destra, potatura appena alpha >= beta.
  M.alphaBetaAlbero = function (gruppi) {
    let alpha = -Infinity, visitate = 0;
    const dettagli = [];
    for (const g of gruppi) {
      let beta = Infinity, best = Infinity, viste = 0;
      for (const foglia of g) {
        visitate++; viste++;
        best = Math.min(best, foglia);
        beta = Math.min(beta, best);
        if (alpha >= beta) break;
      }
      dettagli.push({ viste, valore: best, potate: g.length - viste });
      alpha = Math.max(alpha, best);
    }
    return { visitate, potate: gruppi.reduce((s, g) => s + g.length, 0) - visitate, dettagli, valore: alpha };
  };

  M.dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
  M.mulMv = (A, v) => A.map((r) => M.dot(r, v));
  M.mulVm = (v, A) => A[0].map((_, j) => A.reduce((s, r, i) => s + v[i] * r[j], 0));

  M.equilibriPuri = function (A, B) {
    const out = [];
    for (let i = 0; i < A.length; i++) {
      for (let j = 0; j < A[0].length; j++) {
        const colMax = Math.max.apply(null, A.map((r) => r[j]));
        const rigaMax = Math.max.apply(null, B[i]);
        if (A[i][j] === colMax && B[i][j] === rigaMax) out.push([i, j]);
      }
    }
    return out;
  };

  // Equilibrio completamente misto di un 2x2 (null se non esiste).
  M.misto2x2 = function (A, B) {
    const dq = A[0][0] - A[0][1] - A[1][0] + A[1][1];
    const dp = B[0][0] - B[0][1] - B[1][0] + B[1][1];
    if (dq === 0 || dp === 0) return null;
    const q = (A[1][1] - A[0][1]) / dq;
    const p = (B[1][1] - B[1][0]) / dp;
    if (!(p > 0 && p < 1 && q > 0 && q < 1)) return null;
    return { p, q };
  };

  // Valore di un gioco a somma zero 2x2 (A = payoff della riga).
  M.valoreSommaZero2x2 = function (A) {
    const maxmin = Math.max(Math.min(A[0][0], A[0][1]), Math.min(A[1][0], A[1][1]));
    const minmax = Math.min(Math.max(A[0][0], A[1][0]), Math.max(A[0][1], A[1][1]));
    if (maxmin === minmax) return { sella: true, valore: maxmin };
    const den = A[0][0] - A[0][1] - A[1][0] + A[1][1];
    const p = (A[1][1] - A[1][0]) / den;
    const valore = (A[0][0] * A[1][1] - A[0][1] * A[1][0]) / den;
    return { sella: false, valore, p };
  };

  // Equilibrio correlato in un 2x2: p = [[p11,p12],[p21,p22]].
  M.vincoliCE = function (A, B, p) {
    const v = [];
    for (let i = 0; i < 2; i++) {
      const k = 1 - i;
      v.push({ chi: "riga", racc: i, dev: k, valore: p[i][0] * (A[i][0] - A[k][0]) + p[i][1] * (A[i][1] - A[k][1]) });
    }
    for (let j = 0; j < 2; j++) {
      const l = 1 - j;
      v.push({ chi: "colonna", racc: j, dev: l, valore: p[0][j] * (B[0][j] - B[0][l]) + p[1][j] * (B[1][j] - B[1][l]) });
    }
    return v;
  };

  M.rimpianti = function (A) {
    // A[i][j]: payoff della riga. Rimpianto di i contro j = max_k A[k][j] - A[i][j].
    const colMax = A[0].map((_, j) => Math.max.apply(null, A.map((r) => r[j])));
    const R = A.map((r) => r.map((x, j) => colMax[j] - x));
    const peggiore = R.map((r) => Math.max.apply(null, r));
    return { R, peggiore, scelta: peggiore.indexOf(Math.min.apply(null, peggiore)) };
  };

  // Giochi coalizionali a 3 giocatori: v è un oggetto con chiavi "A","B","AB",...
  const tutte3 = ["A", "B", "C", "AB", "AC", "BC", "ABC"];
  const chiave = (insieme) => insieme.slice().sort().join("");
  M.coalizioni3 = tutte3;
  M.val = (v, S) => (S.length === 0 ? 0 : v[chiave(S.split ? S.split("") : S)] || 0);

  M.shapley3 = function (v) {
    const ordini = [["A", "B", "C"], ["A", "C", "B"], ["B", "A", "C"], ["B", "C", "A"], ["C", "A", "B"], ["C", "B", "A"]];
    const phi = { A: 0, B: 0, C: 0 };
    const contributi = [];
    ordini.forEach((o) => {
      let prima = "";
      const riga = {};
      o.forEach((g) => {
        const mc = M.val(v, prima + g) - M.val(v, prima);
        phi[g] += mc / 6;
        riga[g] = mc;
        prima += g;
      });
      contributi.push({ ordine: o.join(","), mc: riga });
    });
    return { phi, contributi };
  };

  M.eccesso = (v, S, x) => M.val(v, S) - S.split("").reduce((s, g) => s + x[g], 0);

  M.violazioniCore = function (v, x) {
    const out = [];
    tutte3.forEach((S) => {
      if (S.length < 3 && M.eccesso(v, S, x) > 1e-9) out.push(S);
    });
    return out;
  };

  M.nelCore = function (v, x) {
    const somma = x.A + x.B + x.C;
    return ["A", "B", "C"].every((g) => x[g] >= -1e-9) &&
      Math.abs(somma - v.ABC) < 1e-9 && M.violazioniCore(v, x).length === 0;
  };

  M.superadditivo3 = function (v) {
    const coppie = [["A", "B"], ["A", "C"], ["B", "C"], ["A", "BC"], ["B", "AC"], ["C", "AB"]];
    for (const [s, t] of coppie) {
      if (M.val(v, chiave((s + t).split(""))) < M.val(v, s) + M.val(v, t)) return { ok: false, s, t };
    }
    return { ok: true };
  };

  M.strutturaOttima3 = function (v) {
    const partizioni = [["ABC"], ["AB", "C"], ["AC", "B"], ["BC", "A"], ["A", "B", "C"]];
    let best = null;
    partizioni.forEach((p) => {
      const w = p.reduce((s, S) => s + M.val(v, S), 0);
      if (!best || w > best.w + 1e-9) best = { p, w };
    });
    return { best, valori: partizioni.map((p) => ({ p, w: p.reduce((s, S) => s + M.val(v, S), 0) })) };
  };

  // Con v({i}) = 0: core non vuoto sse v(AB)+v(AC)+v(BC) <= 2 v(N) e ogni coppia <= v(N).
  M.coreNonVuoto3 = function (v) {
    const coppie = v.AB + v.AC + v.BC;
    return coppie <= 2 * v.ABC + 1e-9 && Math.max(v.AB, v.AC, v.BC) <= v.ABC + 1e-9;
  };

  // Gioco dell'aeroporto: costi in ordine crescente, quote cumulative (Littlechild-Owen).
  M.aeroportoShapley = function (c) {
    const n = c.length, phi = [];
    let acc = 0, prima = 0;
    c.forEach((cj, j) => {
      acc += (cj - prima) / (n - j);
      phi.push(acc);
      prima = cj;
    });
    return phi;
  };

  // ISG: archi [i, j, w] (i === j per un cappio); coalizione = array di nodi.
  M.isgValore = (archi, C) => archi.reduce((s, [i, j, w]) => s + (C.includes(i) && C.includes(j) ? w : 0), 0);
  M.isgShapley = (archi, i) =>
    archi.reduce((s, [a, b, w]) => s + (a === i && b === i ? w : a === i || b === i ? w / 2 : 0), 0);

  // MC-Net: regole { pos: [...], neg: [...], x }.
  M.mcnetValore = (regole, S) =>
    regole.reduce((s, r) => s + (r.pos.every((g) => S.includes(g)) && !r.neg.some((g) => S.includes(g)) ? r.x : 0), 0);
  const fatt = (k) => (k <= 1 ? 1 : k * fatt(k - 1));
  M.mcnetQuote = function (r) {
    const p = r.pos.length, n = r.neg.length;
    return {
      pos: p ? (fatt(p - 1) * fatt(n)) / fatt(p + n) * r.x : 0,
      neg: n ? (fatt(p) * fatt(n - 1)) / fatt(p + n) * -r.x : 0,
    };
  };
  M.mcnetShapley = function (regole, i) {
    return regole.reduce((s, r) => {
      const q = M.mcnetQuote(r);
      return s + (r.pos.includes(i) ? q.pos : 0) + (r.neg.includes(i) ? q.neg : 0);
    }, 0);
  };

  const QUIZ = {
    lezioni, aggiungi, rng, fmt, fmtBreve, decimale, frazione, leggiNumero, numeroGiusto,
    T: { bimatrice, tabella, vettore }, M, hash,
  };
  root.QUIZ = QUIZ;
  if (typeof module !== "undefined") module.exports = QUIZ;
})(typeof window !== "undefined" ? window : globalThis);
