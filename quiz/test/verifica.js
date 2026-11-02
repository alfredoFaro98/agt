// Collaudo delle banche e dei generatori:  node quiz/test/verifica.js
// 1) struttura di ogni domanda; 2) copertura delle sezioni; 3) valori noti degli appunti;
// 4) ogni generatore eseguito molte volte; 5) istanze salvate per il controllo in Python.
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const radice = path.join(__dirname, "..");
const ctx = { console, Math, JSON };
ctx.window = ctx;
vm.createContext(ctx);
const file = ["motore.js", ...fs.readdirSync(path.join(radice, "banche")).sort().map((f) => "banche/" + f)];
file.forEach((f) => vm.runInContext(fs.readFileSync(path.join(radice, f), "utf8"), ctx, { filename: f }));
const Q = ctx.QUIZ;

let errori = 0;
const male = (msg) => { errori++; console.log("  ERRORE " + msg); };

// ------------------------------------------------------------ 1. struttura
const visti = new Set();
const controllaDomanda = (d, dove) => {
  if (!["scelta", "multi", "vf", "numero"].includes(d.tipo)) male(dove + ": tipo " + d.tipo);
  if (!d.q || !d.perche) male(dove + ": manca testo o spiegazione");
  if (/``/.test(d.q + d.perche + (d.o || []).join(""))) male(dove + ": virgolette LaTeX rimaste");
  if (/\u0001/.test(d.q + d.perche + (d.o || []).join(""))) male(dove + ": carattere di controllo");
  if (d.tipo === "scelta" || d.tipo === "multi") {
    if (!Array.isArray(d.o) || d.o.length < 2) male(dove + ": opzioni");
    if (new Set(d.o).size !== d.o.length) male(dove + ": opzioni duplicate");
  }
  if (d.tipo === "scelta" && !(Number.isInteger(d.ok) && d.ok >= 0 && d.ok < d.o.length)) male(dove + ": ok fuori range");
  if (d.tipo === "multi") {
    if (!Array.isArray(d.ok) || !d.ok.length || d.ok.some((k) => !(k >= 0 && k < d.o.length)) || new Set(d.ok).size !== d.ok.length)
      male(dove + ": ok multi");
    if (d.ok && d.ok.length === d.o.length) male(dove + ": tutte le opzioni giuste");
  }
  if (d.tipo === "vf" && typeof d.ok !== "boolean") male(dove + ": ok vf");
  if (d.tipo === "numero" && !Number.isFinite(d.ok)) male(dove + ": ok numero");
};

let nDomande = 0, nGen = 0;
const perTipo = {}, trappole = {};
Q.lezioni.forEach((l) => {
  l.domande.forEach((d, i) => {
    nDomande++;
    perTipo[d.tipo] = (perTipo[d.tipo] || 0) + 1;
    if (d.trappola) trappole[l.numero] = (trappole[l.numero] || 0) + 1;
    const dove = "L" + l.numero + "#" + i + " (" + d.sez + ")";
    if (visti.has(d.id)) male(dove + ": id duplicato " + d.id);
    visti.add(d.id);
    if (!l.sezioni[d.sez]) male(dove + ": sezione sconosciuta");
    controllaDomanda(d, dove);
  });
  (l.generatori || []).forEach((g) => {
    nGen++;
    if (!l.sezioni[g.sez]) male("generatore " + g.id + ": sezione sconosciuta");
  });
});

// ------------------------------------------------------------ 2. copertura
console.log("Copertura delle sezioni:");
Q.lezioni.forEach((l) => {
  const conta = {};
  Object.keys(l.sezioni).forEach((s) => (conta[s] = 0));
  l.domande.forEach((d) => conta[d.sez]++);
  (l.generatori || []).forEach((g) => conta[g.sez]++);
  const vuote = Object.keys(conta).filter((s) => conta[s] === 0);
  console.log("  Lezione " + l.numero + ": " + l.domande.length + " domande, " + (l.generatori || []).length + " generatori, " +
    Object.keys(l.sezioni).length + " sezioni" + (vuote.length ? " — SCOPERTE: " + vuote.join(", ") : " — tutte coperte"));
  if (vuote.length) male("lezione " + l.numero + " sezioni scoperte");
});

// ------------------------------------------------------------ 3. valori noti
const M = Q.M;
const vicino = (a, b) => Math.abs(a - b) < 1e-9;
const atteso = (nome, ok) => { if (!ok) male("valore noto: " + nome); };
atteso("minimax esempio = 3", M.minimaxAlbero([[3, 12, 8], [2, 4, 6], [14, 5, 2]]).valore === 3);
atteso("alpha-beta esempio: 2 foglie potate", M.alphaBetaAlbero([[3, 12, 8], [2, 4, 6], [14, 5, 2]]).potate === 2);
const BoS = M.misto2x2([[2, 0], [0, 1]], [[1, 0], [0, 2]]);
atteso("BoS p = 2/3, q = 1/3", vicino(BoS.p, 2 / 3) && vicino(BoS.q, 1 / 3));
const attr = M.misto2x2([[-10, 5], [0, -1]], [[-10, 0], [5, -1]]);
atteso("attraversamento 3/8", vicino(attr.p, 0.375) && vicino(attr.q, 0.375));
atteso("Test 6 del notebook", (() => { const e = M.misto2x2([[2, 3], [3, -1]], [[-5, -6], [-2, 0]]); return vicino(e.p, 2 / 3) && vicino(e.q, 0.8); })());
atteso("PD senza misto", M.misto2x2([[-1, -4], [0, -3]], [[-1, 0], [-4, -3]]) === null);
atteso("RPS BR (1/2,1/2,0) = carta", (() => { const u = M.mulMv([[0, -1, 1], [1, 0, -1], [-1, 1, 0]], [0.5, 0.5, 0]); return u.indexOf(Math.max(...u)) === 1; })());
atteso("gioco 3x3: unico PNE (R,C)", JSON.stringify(M.equilibriPuri([[0, 4, 5], [4, 0, 5], [3, 3, 8]], [[4, 0, 3], [0, 4, 3], [5, 5, 8]])) === "[[2,2]]");
atteso("matching pennies valore 0", vicino(M.valoreSommaZero2x2([[1, -1], [-1, 1]]).valore, 0));
atteso("gioco −5/3", vicino(M.valoreSommaZero2x2([[-2, -1], [-1, -3]]).valore, -5 / 3));
const gelato = { A: 0, B: 0, C: 0, AB: 750, AC: 750, BC: 0, ABC: 1000 };
const sh = M.shapley3(gelato).phi;
atteso("Shapley gelato", vicino(sh.A, 3500 / 6) && vicino(sh.B, 1250 / 6) && vicino(sh.C, 1250 / 6));
const soloA = M.shapley3({ A: 0, B: 0, C: 0, AB: 750, AC: 750, BC: 0, ABC: 750 }).phi;
atteso("Shapley conta solo A", vicino(soloA.A, 500) && vicino(soloA.B, 125));
atteso("core gelato (500,250,250)", M.nelCore(gelato, { A: 500, B: 250, C: 250 }));
atteso("core gelato (1000,0,0)", M.nelCore(gelato, { A: 1000, B: 0, C: 0 }));
atteso("core gelato (200,200,600) no", !M.nelCore(gelato, { A: 200, B: 200, C: 600 }));
atteso("core vuoto 7,6,5,8", !M.coreNonVuoto3({ A: 0, B: 0, C: 0, AB: 7, AC: 6, BC: 5, ABC: 8 }));
atteso("superadditivo gelato", M.superadditivo3(gelato).ok);
atteso("DP 1050", M.strutturaOttima3({ A: 0, B: 300, C: 0, AB: 750, AC: 750, BC: 400, ABC: 1000 }).best.w === 1050);
atteso("rimpianto attraversamento → Stop", M.rimpianti([[-10, 5], [0, -1]]).scelta === 1);
atteso("semaforo è CE", M.vincoliCE([[-10, 5], [0, -1]], [[-10, 0], [5, -1]], [[0, 0.5], [0.5, 0]]).every((v) => v.valore >= 0));
atteso("leggiNumero", vicino(Q.leggiNumero("2/3"), 2 / 3) && Q.leggiNumero("0,25") === 0.25 && Q.leggiNumero("−1,5") === -1.5 && isNaN(Q.leggiNumero("abc")));
atteso("numeroGiusto 0,33 ≈ 1/3", Q.numeroGiusto(0.33, 1 / 3) && !Q.numeroGiusto(0.3, 1 / 3));

// ------------------------------------------------------------ 4. generatori
console.log("Generatori (" + nGen + "):");
const istanze = {};
const N = 3000;
Q.lezioni.forEach((l) => (l.generatori || []).forEach((g) => {
  const t0 = Date.now();
  const lista = [];
  const risposte = {};
  for (let s = 1; s <= N; s++) {
    let d;
    try {
      d = g.crea(Q.rng(s * 7919));
    } catch (e) {
      male(g.id + " seme " + s + ": " + e.message);
      break;
    }
    controllaDomanda(d, g.id + " seme " + s);
    if (!d.dati) male(g.id + ": mancano i dati per il controllo");
    const chiave = String(d.ok);
    risposte[chiave] = (risposte[chiave] || 0) + 1;
    if (s <= 400) lista.push({ dati: d.dati, ok: d.ok, tipo: d.tipo, o: d.o });
  }
  istanze[g.id] = lista;
  const ms = Date.now() - t0;
  const diverse = Object.keys(risposte).length;
  let equilibrio = "";
  if (g.crea && (lista[0] || {}).tipo === "vf") {
    const veri = risposte["true"] || 0;
    equilibrio = " · vero " + Math.round((100 * veri) / N) + "%";
    if (veri < N * 0.2 || veri > N * 0.8) male(g.id + ": vero/falso sbilanciato (" + veri + "/" + N + ")");
  }
  console.log("  " + g.id.padEnd(28) + N + " istanze in " + ms + " ms, " + diverse + " risposte diverse" + equilibrio);
  if (ms > 15000) male(g.id + ": troppo lento");
}));
fs.writeFileSync(path.join(__dirname, "istanze.json"), JSON.stringify(istanze));

console.log("\nTotale: " + nDomande + " domande fisse (" + Object.entries(perTipo).map(([k, v]) => k + " " + v).join(", ") +
  "), " + nGen + " generatori; trappole per lezione: " + JSON.stringify(trappole));
console.log(errori ? "\n" + errori + " ERRORI" : "\nTutto a posto.");
process.exit(errori ? 1 : 0);
