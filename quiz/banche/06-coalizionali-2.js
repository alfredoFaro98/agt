// Lezione 6 — Giochi coalizionali: aspetti computazionali (aeroporto, ISG, MC-Nets, Monte Carlo).
(function () {
  const { T, M, fmt } = QUIZ;

  const pedice = (k) => String(k).split("").map((c) => "₀₁₂₃₄₅₆₇₈₉"[+c]).join("");
  const lett = (g) => "x" + pedice(g);
  const regolaHTML = (r) =>
    r.pos.map(lett).concat(r.neg.map((g) => "¬" + lett(g))).join(" ∧ ") + " → " + String(r.x).replace("-", "−");
  const regoleHTML = (regole) => '<div class="formula">' + regole.map(regolaHTML).join("<br>") + "</div>";
  const insieme = (S) => "{" + S.join(", ") + "}";
  const archiHTML = (archi) =>
    T.tabella(["Arco", "Peso"], archi.map(([i, j, w]) => [i === j ? "cappio su " + i : i + " – " + j, w]));

  // Grafo casuale su 5 nodi: 6-7 archi distinti, pesi interi, cappi facoltativi.
  const grafo = (r, cappi) => {
    const tutte = [];
    for (let i = 1; i <= 5; i++) for (let j = i + 1; j <= 5; j++) tutte.push([i, j]);
    const archi = r.shuffle(tutte).slice(0, r.int(6, 7)).map(([i, j]) => [i, j, r.int(1, 9)]);
    if (cappi) r.shuffle([1, 2, 3, 4, 5]).slice(0, r.int(1, 2)).forEach((i) => archi.push([i, i, r.int(1, 6)]));
    return archi.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  };

  // MC-Net casuale su 3 giocatori: 3-4 regole, almeno una con un letterale negativo.
  const mcnet = (r) => {
    const regole = [];
    const k = r.int(3, 4);
    for (let t = 0; t < k; t++) {
      const giocatori = r.shuffle([1, 2, 3]);
      const quanti = r.int(1, 3);
      const usati = giocatori.slice(0, quanti);
      const nNeg = t === 0 ? 1 : r.next() < 0.3 ? 1 : 0;
      const neg = quanti > 1 ? usati.slice(0, Math.min(nNeg, quanti - 1)) : [];
      const pos = usati.filter((g) => !neg.includes(g)).sort();
      let x = r.int(1, 8) * (r.next() < 0.25 ? -1 : 1);
      regole.push({ pos, neg: neg.sort(), x });
    }
    if (!regole.some((q) => q.neg.length)) {
      regole[0] = { pos: [2], neg: [3], x: regole[0].x };
    }
    return regole;
  };

  QUIZ.aggiungi({
    numero: 6,
    titolo: "Coalizionali: il calcolo",
    pdf: "lezione-06-coalizionali-2.pdf",
    sezioni: {
      "6.1": "Il problema computazionale",
      "6.2": "Il gioco dell'aeroporto",
      "6.3": "Giochi su sottografo indotto",
      "6.4": "Rappresentazioni compatte",
      "6.4.1": "Marginal Contribution Nets",
      "6.4.2": "MC-Nets con formule generali",
      "6.5": "Approssimazione Monte Carlo del valore di Shapley",
      "6.6": "Riepilogo delle tecniche",
      "6.7.1": "Lab: il gioco dell'aeroporto",
      "6.7.2": "Lab: approssimazione Monte Carlo",
      "6.7.3": "Lab: giochi su sottografo indotto",
      "6.7.4": "Lab: MC-Nets",
    },
    domande: [
      // ---------------------------------------------------------------- 6.1
      {
        sez: "6.1",
        q: "Perché i giochi coalizionali sono difficili da trattare con molti giocatori?",
        o: [
          "La funzione caratteristica ha un valore per ogni sottoinsieme, cioè 2<sup>n</sup> valori, e i concetti di soluzione come Shapley li usano tutti",
          "Perché il core è sempre vuoto con molti giocatori",
          "Perché il valore di Shapley non è definito per più di 10 giocatori",
          "Perché l'utilità smette di essere trasferibile",
        ],
        perche: "v : 2<sup>N</sup> → ℝ è esponenziale già come dato in ingresso; la formula di Shapley somma su n! permutazioni (o 2<sup>n−1</sup> coalizioni per giocatore).",
      },
      {
        sez: "6.1",
        tipo: "multi",
        q: "Quali sono le tre strade della lezione per scalare il valore di Shapley a molti giocatori?",
        o: [
          "Classi speciali di giochi con formule chiuse (es. aeroporto)",
          "Rappresentazioni compatte della funzione caratteristica (ISG, MC-Nets)",
          "Approssimazione Monte Carlo campionando permutazioni",
          "Sostituire Shapley con il nucleolo, che si calcola in tempo costante",
          "Limitarsi alle coalizioni di due giocatori",
        ],
        ok: [0, 1, 2],
        perche: "Il nucleolo richiede una sequenza di programmi lineari con un vincolo per coalizione: non è una scorciatoia. Ignorare le coalizioni grandi cambierebbe il gioco.",
      },
      {
        sez: "6.1",
        q: "Che cosa promettono le rappresentazioni compatte, secondo la lezione?",
        o: [
          "Funzione caratteristica in spazio polinomiale e valore di Shapley in tempo polinomiale",
          "Valore di Shapley esatto per qualunque gioco in tempo costante",
          "Il calcolo del core senza programmazione lineare",
          "Un'approssimazione del valore di Shapley con errore 1/√m",
        ],
        perche: "L'errore 1/√m è la promessa del Monte Carlo, che è approssimato; le rappresentazioni compatte danno valori esatti.",
      },
      // ---------------------------------------------------------------- 6.2
      {
        sez: "6.2",
        q: "Qual è la funzione caratteristica del gioco dell'aeroporto con costi c<sub>1</sub> < … < c<sub>n</sub>?",
        o: [
          "v(S) = max<sub>i∈S</sub> c<sub>i</sub>",
          "v(S) = Σ<sub>i∈S</sub> c<sub>i</sub>",
          "v(S) = min<sub>i∈S</sub> c<sub>i</sub>",
          "v(S) = c<sub>n</sub> per ogni S non vuota",
        ],
        perche: "Una coalizione costruisce una sola pista, lunga quanto serve al suo membro più esigente.",
      },
      {
        sez: "6.2",
        q: "Qual è il valore di Shapley del giocatore i nel gioco dell'aeroporto (c<sub>0</sub> = 0)?",
        o: [
          "φ<sub>i</sub> = Σ<sub>j=1..i</sub> (c<sub>j</sub> − c<sub>j−1</sub>) / (n − j + 1)",
          "φ<sub>i</sub> = c<sub>i</sub> / n",
          "φ<sub>i</sub> = Σ<sub>j=i..n</sub> (c<sub>j</sub> − c<sub>j−1</sub>) / j",
          "φ<sub>i</sub> = (c<sub>i</sub> − c<sub>i−1</sub>) / (n − i + 1)",
        ],
        perche: "Il tratto j costa c<sub>j</sub> − c<sub>j−1</sub> e serve ai giocatori j, …, n, che sono n − j + 1: se lo dividono. Il giocatore i paga la sua quota di tutti i tratti fino al proprio. L'ultima opzione è solo la quota dell'ultimo tratto.",
      },
      {
        sez: "6.2",
        q: "Costi (8, 11, 13, 18). Quale vettore di Shapley è corretto?",
        o: ["(2, 3, 4, 9)", "(4,5; 4,5; 4,5; 4,5)", "(8, 3, 2, 5)", "(2, 2,75; 3,25; 4,5)"],
        perche: "8/4 = 2; poi 2 + 3/3 = 3; poi 3 + 2/2 = 4; poi 4 + 5/1 = 9. Somma 18 = v(N). (8, 3, 2, 5) sono i costi marginali dei tratti, non le quote.",
      },
      {
        sez: "6.2",
        q: "Nella dimostrazione del teorema di Littlechild e Owen, come si scompone il gioco?",
        o: [
          "In n giochi v<sub>j</sub>, uno per tratto: v<sub>j</sub>(S) = c<sub>j</sub> − c<sub>j−1</sub> se S contiene almeno un giocatore di P<sub>j</sub> = {j, …, n}, altrimenti 0",
          "In n giochi a un solo giocatore",
          "In tutte le n! permutazioni",
          "In una coppia di giochi: uno con i giocatori pari e uno con i dispari",
        ],
        perche: "La somma dei v<sub>j</sub> ridà v(S) = c<sub>k</sub> (k il membro più esigente di S). In ogni v<sub>j</sub> si applicano nullo, simmetria ed efficienza; poi additività.",
      },
      {
        sez: "6.2",
        tipo: "multi",
        q: "Quali assiomi di Shapley usa la dimostrazione della formula dell'aeroporto?",
        o: ["Additività", "Giocatore nullo", "Simmetria", "Efficienza", "Nessuno: usa le permutazioni"],
        ok: [0, 1, 2, 3],
        perche: "Fuori da P<sub>j</sub> i giocatori sono nulli (0); dentro sono simmetrici, ed efficienza dice che si dividono c<sub>j</sub> − c<sub>j−1</sub> in parti uguali; additività somma i pezzi.",
      },
      {
        sez: "6.2",
        q: "Qual è la complessità migliore per calcolare tutti i valori di Shapley dell'aeroporto con costi già ordinati?",
        o: [
          "O(n): ogni φ<sub>i</sub> è il precedente più una quota (somma cumulativa)",
          "O(n<sup>2</sup>) e non si può fare meglio",
          "O(2<sup>n</sup>)",
          "O(n!)",
        ],
        perche: "La formula come scritta costa O(n<sup>2</sup>), ma φ<sub>i</sub> = φ<sub>i−1</sub> + (c<sub>i</sub> − c<sub>i−1</sub>)/(n − i + 1). Se i costi non sono ordinati serve anche O(n log n) per ordinarli.",
      },
      {
        sez: "6.2",
        tipo: "multi",
        q: "Quali ingredienti indicano che un problema si può modellare come gioco dell'aeroporto?",
        o: [
          "Una sola struttura o risorsa condivisa",
          "Esigenze annidate: chi chiede di più ha bisogno anche di tutto ciò che serve a chi chiede di meno",
          "Il costo cresce con la richiesta",
          "L'obiettivo è dividere i costi in modo equo",
          "Ogni giocatore usa una risorsa diversa dagli altri",
        ],
        ok: [0, 1, 2, 3],
        perche: "Esempi dalla lezione: car sharing, banda di rete, condotte d'acqua, spazio in cloud con quote diverse, livelli di abbonamento a un software.",
      },
      {
        sez: "6.2",
        q: "A ha bisogno di 10 km, B di 15 km, C di 18 km. Come si divide il tratto fra 10 e 15 km?",
        o: ["A metà fra B e C", "In tre parti fra A, B e C", "Lo paga tutto C", "Lo paga tutto B"],
        perche: "Quel tratto serve solo a B e C. I primi 10 km si dividono fra tre, gli ultimi 3 li paga solo C.",
      },
      {
        sez: "6.2",
        tipo: "vf",
        trappola: true,
        q: "Nel gioco dell'aeroporto v(S) è un guadagno della coalizione, come nel gioco del gelato.",
        ok: false,
        perche: "È un gioco di <b>costo</b>: v(S) è una spesa da ripartire. Per questo, se si studia il core, i vincoli hanno il verso opposto: ogni coalizione deve pagare al più v(S).",
      },
      {
        sez: "6.2",
        tipo: "vf",
        q: "Nel gioco dell'aeroporto la ripartizione di Shapley sta nel core: nessun gruppo pagherebbe meno costruendo la pista da solo.",
        ok: true,
        perche: "Approfondimento degli appunti: un gruppo con membro più esigente k paga al più la somma delle quote dei giocatori 1..k, che è ≤ c<sub>k</sub> = v(S). Il gioco è concavo per i costi, e lì Shapley sta sempre nel core.",
      },
      // ---------------------------------------------------------------- 6.3
      {
        sez: "6.3",
        q: "In un gioco su sottografo indotto (ISG), come si calcola v(C)?",
        o: [
          "Sommando i pesi degli archi che hanno entrambi gli estremi in C (cappi compresi)",
          "Sommando i pesi di tutti gli archi che toccano almeno un nodo di C",
          "Prendendo il peso massimo fra gli archi interni a C",
          "Contando i nodi di C",
        ],
        perche: "v(C) = Σ<sub>{i,j}⊆C</sub> w<sub>ij</sub>: è il peso del sottografo indotto da C. Un cappio w<sub>ii</sub> è il valore di i da solo.",
      },
      {
        sez: "6.3",
        q: "Qual è il valore di Shapley del giocatore i in un ISG?",
        o: [
          "φ<sub>i</sub> = w<sub>ii</sub> + ½ Σ<sub>j∈Γ(i)</sub> w<sub>ij</sub>",
          "φ<sub>i</sub> = Σ<sub>j∈Γ(i)</sub> w<sub>ij</sub>",
          "φ<sub>i</sub> = w<sub>ii</sub> + Σ<sub>j∈Γ(i)</sub> w<sub>ij</sub> / |Γ(i)|",
          "φ<sub>i</sub> = ½ w<sub>ii</sub> + ½ Σ<sub>j∈Γ(i)</sub> w<sub>ij</sub>",
        ],
        perche: "Ogni arco è un gioco a sé in cui i due estremi sono simmetrici: si dividono il peso a metà. Il cappio è tutto di i. Poi additività.",
      },
      {
        sez: "6.3",
        q: "Nel grafo della lezione (archi 1–3: 6, 1–2: 4, 2–3: 3, 3–4: 4, 2–4: 3, 4–5: 4), quanto vale v({1, 2, 3, 4})?",
        o: ["20", "24", "13", "17"],
        perche: "Archi interni: 1–2 (4), 1–3 (6), 2–3 (3), 3–4 (4), 2–4 (3): totale 20. Resta fuori solo 4–5. 24 è il totale di tutti gli archi, cioè v(N).",
      },
      {
        sez: "6.3",
        q: "Nello stesso grafo, quanto vale φ<sub>3</sub>?",
        o: ["6,5", "13", "5", "4,33"],
        perche: "Archi di 3: 1–3 (6), 2–3 (3), 3–4 (4). φ<sub>3</sub> = ½(6 + 3 + 4) = 6,5. 13 dimentica il fattore ½.",
      },
      {
        sez: "6.3",
        tipo: "vf",
        q: "Gli ISG possono rappresentare qualunque gioco coalizionale.",
        ok: false,
        perche: "Contano solo singoli e coppie: un effetto che compare con tre giocatori insieme non si esprime. Per esempio l'aeroporto (5, 7, 10) come ISG darebbe v({A,B,C}) = 5 invece di 10.",
      },
      {
        sez: "6.3",
        q: "Che cosa modellano pesi positivi e negativi in un ISG?",
        o: [
          "Positivi: sinergie fra i due giocatori; negativi: conflitti",
          "Positivi: giocatori ricchi; negativi: giocatori poveri",
          "Positivi: archi orientati; negativi: archi non orientati",
          "Niente: i pesi devono essere positivi",
        ],
        perche: "Gli ISG sono un modello naturale di reti sociali e di formazione di coalizioni (anche con tecniche di clustering di grafi).",
      },
      // ---------------------------------------------------------------- 6.4
      {
        sez: "6.4",
        q: "Qual è il prezzo di una rappresentazione compatta rispetto alla tabella completa?",
        o: [
          "Il valore di una coalizione non si legge più in O(1) ma si calcola in tempo polinomiale",
          "Il valore di Shapley diventa approssimato",
          "Non si può più calcolare il valore della grande coalizione",
          "Serve sempre la programmazione lineare",
        ],
        perche: "In cambio la memoria scende da 2<sup>n</sup> valori a una struttura polinomiale, e Shapley si calcola in tempo polinomiale grazie all'additività.",
      },
      {
        sez: "6.4",
        q: "Quale proprietà del valore di Shapley rende veloci ISG e MC-Nets?",
        o: ["L'additività: si calcola Shapley su ogni arco o regola e si somma", "L'efficienza", "Il giocatore nullo da solo", "La stabilità nel core"],
        perche: "Ogni arco o regola è un gioco semplice con soluzione immediata; per additività il valore del gioco intero è la somma.",
      },
      // ---------------------------------------------------------------- 6.4.1
      {
        sez: "6.4.1",
        q: "Quando si applica una regola {a ∧ b} → x di una MC-Net con sole congiunzioni?",
        o: [
          "Quando la coalizione contiene sia a sia b",
          "Quando la coalizione contiene a oppure b",
          "Quando la coalizione è esattamente {a, b}",
          "Quando la coalizione non contiene né a né b",
        ],
        perche: "La regola si applica a ogni sovrainsieme del pattern; v(S) è la somma dei valori delle regole che si applicano.",
      },
      {
        sez: "6.4.1",
        q: "MC-Net {a ∧ b} → 5, {b} → 2. Quanto vale v({a, b})?",
        o: ["7", "5", "2", "10"],
        perche: "Si applicano entrambe le regole: 5 + 2. Invece v({a}) = 0 e v({b}) = 2.",
      },
      {
        sez: "6.4.1",
        q: "Nella stessa MC-Net, quanto valgono φ<sub>a</sub> e φ<sub>b</sub>?",
        o: ["φ<sub>a</sub> = 2,5; φ<sub>b</sub> = 4,5", "φ<sub>a</sub> = 3,5; φ<sub>b</sub> = 3,5", "φ<sub>a</sub> = 0; φ<sub>b</sub> = 7", "φ<sub>a</sub> = 5; φ<sub>b</sub> = 2"],
        perche: "φ<sub>i</sub> = Σ x/|φ| sulle regole che contengono i: φ<sub>a</sub> = 5/2, φ<sub>b</sub> = 5/2 + 2/1. Somma 7 = v(N).",
      },
      {
        sez: "6.4.1",
        tipo: "vf",
        q: "Le MC-Nets con sole congiunzioni, ma valori sia positivi sia negativi, possono rappresentare qualunque gioco.",
        ok: true,
        perche: "I valori delle regole sono i dividendi di Harsanyi d(S) = Σ<sub>T⊆S</sub> (−1)<sup>|S|−|T|</sup> v(T), che esistono per ogni gioco. Completo però non vuol dire compatto.",
      },
      {
        sez: "6.4.1",
        q: "Come si scrive un ISG come MC-Net?",
        o: [
          "Ogni arco {i, j} di peso w diventa la regola {i ∧ j} → w, ogni cappio diventa {i} → w<sub>ii</sub>",
          "Ogni nodo diventa una regola con il proprio grado",
          "Serve una regola per ogni coalizione",
          "Non si può: gli ISG non sono MC-Nets",
        ],
        perche: "Le MC-Nets generalizzano gli ISG: una regola può collegare più di due giocatori (un iperarco).",
      },
      {
        sez: "6.4.1",
        trappola: true,
        q: "La slide “Induced subgraph games as MC-Nets” elenca {4 ∧ 5} → 5. Che cosa c'è che non va?",
        o: [
          "Nel grafo l'arco 4–5 pesa 4: con la regola della slide verrebbero φ<sub>4</sub> = 6, φ<sub>5</sub> = 2,5 e v(N) = 25 invece di 5,5, 2 e 24",
          "Niente: la regola è corretta",
          "La regola dovrebbe essere {4 ∨ 5} → 4",
          "Mancano le regole per i singoli nodi",
        ],
        perche: "È un refuso della slide: la traduzione corretta di un arco di peso w è {i ∧ j} → w. Il grafo non ha cappi, quindi non servono regole sui singoli.",
      },
      {
        sez: "6.4.1",
        trappola: true,
        q: "Quante regole con congiunzioni servono per scrivere come MC-Net il gioco dell'aeroporto con n giocatori (costi distinti)?",
        o: [
          "2<sup>n</sup> − 1: ogni dividendo è d(S) = (−1)<sup>|S|+1</sup> min<sub>i∈S</sub> c<sub>i</sub>, mai zero",
          "n, una per giocatore",
          "n − 1, una per tratto",
          "n(n − 1)/2, una per coppia",
        ],
        perche: "Verificato fino a n = 10 (1023 regole). Con costi (5, 7, 10) è la MC-Net del notebook: 5, 7, 10, −5, −5, −7, +5. Con formule disgiuntive bastano invece n regole.",
      },
      // ---------------------------------------------------------------- 6.4.2
      {
        sez: "6.4.2",
        q: "Con formule generali, quando una regola φ → x si applica alla coalizione S?",
        o: [
          "Quando S ⊨ φ: assegnando vero ai giocatori di S e falso a tutti gli altri, la formula è vera",
          "Quando S contiene tutti i giocatori nominati in φ, positivi o negativi",
          "Quando almeno un giocatore di φ è in S",
          "Quando S è il complemento di φ",
        ],
        perche: "Un letterale negativo ¬j richiede che j <b>non</b> sia in S.",
      },
      {
        sez: "6.4.2",
        q: "MC-Net x₁ ∧ x₂ → 5, x₂ → 2, x₃ → 4, x₂ ∧ ¬x₃ → −2. Quanto vale v({x₂})?",
        o: ["0", "2", "−2", "4"],
        perche: "Si applicano x₂ → 2 e x₂ ∧ ¬x₃ → −2 (x₃ manca): 2 − 2 = 0.",
      },
      {
        sez: "6.4.2",
        q: "Nella stessa MC-Net, quanto vale v({x₂, x₃})?",
        o: ["6", "4", "8", "11"],
        perche: "Si applicano x₂ → 2 e x₃ → 4; la regola negativa no, perché x₃ c'è. 2 + 4 = 6.",
      },
      {
        sez: "6.4.2",
        q: "Regola con p letterali positivi e n negativi e valore x. Quanto riceve un giocatore che compare in forma positiva?",
        o: ["(p − 1)! n! / (p + n)! · x", "p! (n − 1)! / (p + n)! · x", "x / p", "x / (p + n)"],
        perche: "Riceve x quando arriva dopo tutti gli altri positivi e prima di tutti i negativi: frazione (p − 1)! n! / (p + n)! degli ordini. Con n = 0 si ritrova x/p.",
      },
      {
        sez: "6.4.2",
        trappola: true,
        q: "Un giocatore che compare in forma negativa in una regola di valore x > 0 che cosa riceve da quella regola?",
        o: [
          "Una quota negativa: p! (n − 1)! / (p + n)! · (−x), perché quando arriva può “spegnere” la regola",
          "Zero, perché non è nel pattern",
          "La stessa quota dei positivi",
          "x / n",
        ],
        perche: "Se arriva dopo tutti i positivi e prima degli altri negativi, la sua entrata toglie x: contributo marginale −x. Con x negativo la quota diventa positiva (es. φ<sub>x₃</sub> = 4 + 1 nell'esempio della lezione).",
      },
      {
        sez: "6.4.2",
        q: "Valori di Shapley della MC-Net x₁ ∧ x₂ → 5, x₂ → 2, x₃ → 4, x₂ ∧ ¬x₃ → −2?",
        o: ["(2,5; 3,5; 5)", "(2,5; 4,5; 4)", "(2,5; 2,5; 6)", "(3; 3; 5)"],
        perche: "φ₁ = 5/2. φ₂ = 5/2 + 2 + ½·(−2) = 3,5. φ₃ = 4 + ½·(+2) = 5. Somma 11 = v(N).",
      },
      {
        sez: "6.4.2",
        tipo: "multi",
        q: "Quali affermazioni sulle MC-Nets sono corrette?",
        o: [
          "Sono una rappresentazione completa (universale)",
          "Il valore di Shapley si calcola in tempo lineare nel numero di regole",
          "Nel caso peggiore servono ancora O(2<sup>n</sup>) regole",
          "Rappresentano solo giochi superadditivi",
          "Danno sempre meno regole di un ISG",
        ],
        ok: [0, 1, 2],
        perche: "Riepilogo della lezione. Il contro principale: i contributi marginali (i valori delle regole) vanno precalcolati, e possono essere esponenziali in numero.",
      },
      {
        sez: "6.4.2",
        q: "Come si scrive il gioco dell'aeroporto con sole n regole?",
        o: [
          "Con regole disgiuntive (x<sub>j</sub> ∨ … ∨ x<sub>n</sub>) → c<sub>j</sub> − c<sub>j−1</sub>, una per tratto",
          "Con regole {i} → c<sub>i</sub>, una per giocatore",
          "Con regole {i ∧ j} → max(c<sub>i</sub>, c<sub>j</sub>)",
          "Non si può: servono 2<sup>n</sup> − 1 regole in ogni caso",
        ],
        perche: "“Almeno uno di quelli che hanno bisogno del tratto j”: sono esattamente i giochi v<sub>j</sub> della dimostrazione. Il linguaggio delle formule decide quanto è compatta la rappresentazione.",
      },
      // ---------------------------------------------------------------- 6.5
      {
        sez: "6.5",
        q: "Su che cosa si basa l'approssimazione Monte Carlo del valore di Shapley?",
        o: [
          "Shapley è la media del contributo marginale su permutazioni uniformi: si fa la media su m permutazioni estratte a caso",
          "Si calcola il valore solo delle coalizioni piccole",
          "Si arrotonda la funzione caratteristica",
          "Si risolve un programma lineare rilassato",
        ],
        perche: "φ̃(i) = (1/m) Σ<sub>π∈𝒫</sub> [v(B(π,i) ∪ {i}) − v(B(π,i))], con 𝒫 un sottoinsieme casuale di m permutazioni.",
      },
      {
        sez: "6.5",
        q: "Come diminuisce l'errore della stima Monte Carlo al crescere del numero m di permutazioni?",
        o: ["Come 1/√m", "Come 1/m", "Come 1/m<sup>2</sup>", "Esponenzialmente in m"],
        perche: "La stima è una media di m termini indipendenti: deviazione standard σ/√m. Nel lab la pendenza log-log misurata è −0,505.",
      },
      {
        sez: "6.5",
        q: "Con m = 1000 permutazioni l'errore è circa il 6%. Quante permutazioni servono, circa, per scendere al 3%?",
        o: ["4000", "2000", "1 000 000", "1500"],
        perche: "Errore ∝ 1/√m: per dimezzarlo serve m quattro volte più grande.",
      },
      {
        sez: "6.5",
        tipo: "vf",
        q: "La stima Monte Carlo del valore di Shapley è non distorta: in media coincide con il valore esatto.",
        ok: true,
        perche: "Ogni permutazione campionata uniformemente dà un contributo marginale con media esatta φ<sub>i</sub>. L'errore è solo varianza, e cala con m.",
      },
      {
        sez: "6.5",
        tipo: "multi",
        q: "Quali sono tecniche citate per ridurre la varianza della stima più in fretta?",
        o: ["Antithetic sampling", "Estensione multilineare", "Metodi kernel", "Alpha-beta pruning", "Regret matching"],
        ok: [0, 1, 2],
        perche: "Riferimento delle slide: Mitchell et al. (2022), Sampling Permutations for Shapley Value Estimation, JMLR.",
      },
      {
        sez: "6.5",
        trappola: true,
        q: "Nello pseudocodice MC_Shapley delle slide, l'ultimo ciclo è “for k = 1 … n: φ̃<sub>i</sub> = φ̃<sub>i</sub> / m”. Che cosa c'è da correggere?",
        o: [
          "L'indice: il ciclo deve scorrere i giocatori i = 1 … n",
          "Bisogna dividere per n invece che per m",
          "Bisogna dividere per n!",
          "Niente",
        ],
        perche: "Si divide per m (il numero di permutazioni) la somma di ogni giocatore; la variabile del ciclo è i, non k.",
      },
      {
        sez: "6.5",
        q: "Se i contributi marginali stanno in un intervallo di ampiezza r, che garanzia dà la disuguaglianza di Hoeffding?",
        o: [
          "P(|φ̃<sub>i</sub> − φ<sub>i</sub>| ≥ ε) ≤ 2 exp(−2mε²/r²)",
          "L'errore è sempre minore di r/m",
          "Con m = n la stima è esatta",
          "Nessuna: Monte Carlo non ha garanzie",
        ],
        perche: "Approfondimento degli appunti: con m ≥ r²/(2ε²)·ln(2/δ) l'errore è sotto ε con probabilità almeno 1 − δ.",
      },
      // ---------------------------------------------------------------- 6.6
      {
        sez: "6.6",
        q: "Quale tecnica si applica a qualunque gioco e a qualunque rappresentazione, ma non è esatta?",
        o: ["L'approssimazione Monte Carlo", "Gli ISG", "Le MC-Nets", "La formula dell'aeroporto"],
        perche: "Contro dichiarato nelle slide: non c'è un modo esatto di fissare m; in pratica m fra 1000 e 10 000 dà buoni risultati.",
      },
      {
        sez: "6.6",
        q: "Qual è il contro principale degli ISG nella tabella riassuntiva?",
        o: ["Non sono completi: non rappresentano qualunque gioco", "Il valore di Shapley è lento da calcolare", "Occupano O(2<sup>n</sup>) memoria", "Sono approssimati"],
        perche: "Pro: rappresentano molti giochi, Shapley veloce, poca memoria.",
      },
      {
        sez: "6.6",
        q: "Qual è il contro delle classi speciali di giochi come l'aeroporto?",
        o: ["Espressività limitata: la formula vale solo per quella struttura", "Non sono esatte", "Richiedono molta memoria", "Non soddisfano l'efficienza"],
        perche: "Pro: rappresentazione compatta (n costi) e Shapley veloce.",
      },
      // ---------------------------------------------------------------- 6.7.1
      {
        sez: "6.7.1",
        q: "Con n = 20 giocatori, quanto hanno impiegato nel lab la formula generale e quella dell'aeroporto?",
        o: ["Circa 19 s contro 16 µs, con valori identici", "Circa 2 s contro 1 s", "Tempi uguali", "La generale non termina"],
        perche: "La funzione caratteristica ha 1 048 576 coalizioni (già costruirla richiede 3,7 s); la formula dedicata scorre 20 costi.",
      },
      {
        sez: "6.7.1",
        trappola: true,
        q: "Il notebook confronta la memoria con <code>sys.getsizeof</code>. Perché il confronto va preso con cautela?",
        o: [
          "getsizeof misura solo il contenitore e non gli oggetti contenuti (i frozenset chiave, i nodi del grafo): getsizeof(G) dà 48 byte qualunque sia il grafo",
          "getsizeof restituisce kilobyte e non byte",
          "getsizeof funziona solo sulle liste",
          "Non c'è nessun problema",
        ],
        perche: "La memoria vera del dizionario con un milione di frozenset è molto più grande dei 42 MB misurati. Il confronto è indicativo.",
      },
      {
        sez: "6.7.1",
        trappola: true,
        q: "Nel calcolo passo per passo del notebook, il giocatore 4 paga “(18000 − 13000)/2 = 5000”. Che cosa c'è che non va?",
        o: [
          "L'ultimo tratto lo usa solo il giocatore 4: si divide per 1, e infatti il risultato 5000 è giusto",
          "Il risultato dovrebbe essere 2500",
          "Il tratto dovrebbe dividersi fra tre giocatori",
          "Niente",
        ],
        perche: "Refuso del notebook: il numeratore e il risultato sono corretti, il “/2” no.",
      },
      // ---------------------------------------------------------------- 6.7.2
      {
        sez: "6.7.2",
        trappola: true,
        q: "La cella di test del notebook ordina le stime Monte Carlo per valore prima di confrontarle con i valori esatti. Che effetto ha?",
        o: [
          "Riassegna stime a giocatori sbagliati quando due sono vicine, e l'errore misurato risulta più basso del vero (6,8% contro 9,3% sullo stesso campione)",
          "Nessuno: l'ordine non conta",
          "Fa risultare l'errore più alto del vero",
          "Rende il test più rigoroso",
        ],
        perche: "Funziona solo perché nell'aeroporto φ<sub>i</sub> cresce con i; il confronto corretto è giocatore per giocatore.",
      },
      {
        sez: "6.7.2",
        q: "Come si calcolano in un'unica passata i contributi marginali di una permutazione nel gioco dell'aeroporto?",
        o: [
          "Chi entra paga max(0, c<sub>i</sub> − pista costruita finora), e la pista si allunga se serve",
          "Ognuno paga c<sub>i</sub>",
          "Ognuno paga c<sub>i</sub>/n",
          "Il primo paga tutto, gli altri zero",
        ],
        perche: "Così non serve la funzione caratteristica completa: costo O(m·n) senza mai costruire 2<sup>n</sup> valori.",
      },
      {
        sez: "6.7.2",
        q: "Nel lab, con n = 20 e m = 1000, quale giocatore ha l'errore relativo più grande?",
        o: [
          "Quello con la pista più corta (24% contro 1,1% del più grande): contribuisce solo quando arriva per primo",
          "Quello con la pista più lunga",
          "Tutti hanno lo stesso errore",
          "Quello di mezzo",
        ],
        perche: "Il suo contributo è c<sub>1</sub> in 1/n delle permutazioni e zero altrimenti: varianza alta rispetto alla media. Per questo con n = 100 il MAPE è più alto a parità di m.",
      },
      // ---------------------------------------------------------------- 6.7.3
      {
        sez: "6.7.3",
        trappola: true,
        q: "Con networkx, perché scrivere φ<sub>i</sub> = w<sub>ii</sub> + ½ Σ<sub>j ∈ neighbors(i)</sub> w<sub>ij</sub> alla lettera dà un risultato sbagliato se ci sono cappi?",
        o: [
          "Perché un nodo con un cappio è vicino di se stesso: il cappio viene contato una volta e mezza, e l'efficienza fallisce",
          "Perché neighbors() restituisce solo i vicini con peso positivo",
          "Perché networkx non supporta i cappi",
          "Non dà un risultato sbagliato",
        ],
        perche: "Sul grafo del lab la somma ingenua è 1920,5 invece di v(N) = 1633. Serve il filtro if j != i.",
      },
      {
        sez: "6.7.3",
        q: "Come si ottiene v(C) di un ISG con networkx in una riga?",
        o: [
          "graph.subgraph(C).size(weight='weight')",
          "graph.degree(C)",
          "len(graph.edges(C))",
          "nx.shortest_path_length(graph, C)",
        ],
        perche: "subgraph tiene solo gli archi interni a C (cappi compresi), size(weight=...) ne somma i pesi. edges(C) includerebbe anche gli archi verso l'esterno.",
      },
      {
        sez: "6.7.3",
        trappola: true,
        q: "Quanti archi può avere al massimo un grafo non orientato con 10 nodi, cappi compresi?",
        o: ["55", "65", "45", "100"],
        perche: "45 = 10·9/2 senza cappi, più 10 cappi: 55 = 10·11/2. Il commento del notebook dice 65 (e N(N+1)/2 senza cappi), sbagliando.",
      },
      // ---------------------------------------------------------------- 6.7.4
      {
        sez: "6.7.4",
        q: "Nella MC-Net del notebook (aeroporto con costi 5, 7, 10), quanto vale φ<sub>A</sub>?",
        o: ["5/3 ≈ 1,67", "5", "2,5", "10/3"],
        perche: "Regole con A: 5/1 − 5/2 − 5/2 + 5/3 = 5/3. Coincide con la formula dell'aeroporto: 5/3, poi 5/3 + 2/2, poi + 3/1.",
      },
      {
        sez: "6.7.4",
        trappola: true,
        q: "from_MC_net_to_CFG ricava i giocatori con <code>max(MC_net)[0]</code>. Quando fallisce?",
        o: [
          "Quando nessuna regola contiene tutti i giocatori: max confronta i pattern come sovrainsiemi e restituisce un pattern parziale, perdendo giocatori senza errori",
          "Mai",
          "Quando ci sono valori negativi",
          "Quando i giocatori sono numeri",
        ],
        perche: "Con {A,B} → 5, {B} → 2, {C} → 1 restituisce {A, B} e C sparisce. Il modo robusto è l'unione dei pattern.",
      },
      {
        sez: "6.7.4",
        q: "Come si verifica nel lab che le funzioni MC-Net sono giuste?",
        o: [
          "Si converte la MC-Net in funzione caratteristica completa e si confronta con la formula esponenziale di Shapley della lezione 5",
          "Si controlla che tutti i valori siano positivi",
          "Si confronta con il nucleolo",
          "Non si può verificare",
        ],
        perche: "Lo stesso schema vale per ISG e aeroporto: rappresentazione compatta contro formula generale, sempre gli stessi valori.",
      },
    ],

    generatori: [
      {
        nome: "aeroporto",
        sez: "6.2",
        titolo: "Shapley nel gioco dell'aeroporto",
        crea(r) {
          const n = r.int(3, 5);
          const passi = [];
          for (let j = 0; j < n; j++) passi.push(r.int(1, 6) * (n - j));
          const c = [];
          passi.reduce((s, p) => (c.push(s + p), s + p), 0);
          const phi = M.aeroportoShapley(c);
          const k = r.int(1, n);
          const righe = c.map((cj, j) => {
            const prima = j ? c[j - 1] : 0;
            return ["Tratto " + (j + 1), cj - prima, n - j, fmt((cj - prima) / (n - j))];
          });
          return {
            tipo: "numero",
            q: n + " compagnie aeree con costi delle piste (in ordine) c = (" + c.join(", ") +
              "). Quanto paga la compagnia <b>" + k + "</b> secondo il valore di Shapley?",
            ok: phi[k - 1],
            tol: 0.01,
            perche: "Ogni tratto si divide fra chi lo usa:" + T.tabella(["Tratto", "Costo", "Lo usano", "Quota"], righe) +
              "La compagnia " + k + " paga le quote dei tratti 1.." + k + ": φ<sub>" + k + "</sub> = <b>" + fmt(phi[k - 1]) +
              "</b>. Controllo: Σφ = " + fmt(phi.reduce((s, x) => s + x, 0)) + " = c<sub>" + n + "</sub>.",
            dati: { c, k },
          };
        },
      },
      {
        nome: "isg-valore",
        sez: "6.3",
        titolo: "Valore di una coalizione in un ISG",
        crea(r) {
          const archi = grafo(r, false);
          const C = r.shuffle([1, 2, 3, 4, 5]).slice(0, r.int(3, 4)).sort();
          const v = M.isgValore(archi, C);
          const interni = archi.filter(([i, j]) => C.includes(i) && C.includes(j));
          return {
            tipo: "numero",
            q: "Gioco su sottografo indotto con nodi 1..5 e archi pesati:" + archiHTML(archi) +
              "Quanto vale v(" + insieme(C) + ")?",
            ok: v,
            tol: 0,
            perche: "Si sommano solo gli archi con entrambi gli estremi in " + insieme(C) + ": " +
              (interni.length ? interni.map(([i, j, w]) => i + "–" + j + " (" + w + ")").join(", ") : "nessuno") +
              ". Totale <b>" + v + "</b>.",
            dati: { archi, C },
          };
        },
      },
      {
        nome: "isg-shapley",
        sez: "6.3",
        titolo: "Valore di Shapley in un ISG",
        crea(r) {
          const archi = grafo(r, r.next() < 0.6);
          const toccati = [...new Set(archi.flatMap(([i, j]) => [i, j]))];
          const i = r.pick(toccati);
          const phi = M.isgShapley(archi, i);
          const suoi = archi.filter(([a, b]) => a === i || b === i);
          const cappio = suoi.find(([a, b]) => a === b);
          const altri = suoi.filter(([a, b]) => a !== b);
          return {
            tipo: "numero",
            q: "Gioco su sottografo indotto con nodi 1..5 e archi pesati:" + archiHTML(archi) +
              "Qual è il valore di Shapley del nodo <b>" + i + "</b>?",
            ok: phi,
            tol: 0.01,
            perche: "φ<sub>i</sub> = w<sub>ii</sub> + ½ Σ<sub>j∈Γ(i)</sub> w<sub>ij</sub>. Cappio: " + (cappio ? cappio[2] : "nessuno (0)") +
              "; archi verso i vicini: " + (altri.length ? altri.map(([a, b, w]) => a + "–" + b + " (" + w + ")").join(", ") : "nessuno") +
              ". φ<sub>" + i + "</sub> = " + (cappio ? cappio[2] : 0) + " + ½·" + altri.reduce((s, x) => s + x[2], 0) + " = <b>" + fmt(phi) + "</b>.",
            dati: { archi, i },
          };
        },
      },
      {
        nome: "mcnet-valore",
        sez: "6.4.2",
        titolo: "Valore di una coalizione in una MC-Net",
        crea(r) {
          const regole = mcnet(r);
          const S = r.pick([[1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]);
          const v = M.mcnetValore(regole, S);
          const applicate = regole.filter((q) => q.pos.every((g) => S.includes(g)) && !q.neg.some((g) => S.includes(g)));
          return {
            tipo: "numero",
            q: "MC-Net sui giocatori x₁, x₂, x₃:" + regoleHTML(regole) + "Quanto vale v(" + insieme(S.map(lett)) + ")?",
            ok: v,
            tol: 0,
            perche: "Una regola si applica se tutti i suoi letterali positivi sono in S e nessuno dei negativi lo è. Si applicano: " +
              (applicate.length ? applicate.map(regolaHTML).join("; ") : "nessuna") + ". Totale <b>" + fmt(v) + "</b>.",
            dati: { regole, S },
          };
        },
      },
      {
        nome: "mcnet-shapley",
        sez: "6.4.2",
        titolo: "Valore di Shapley in una MC-Net",
        crea(r) {
          const regole = mcnet(r);
          const i = r.int(1, 3);
          const phi = M.mcnetShapley(regole, i);
          const pezzi = regole
            .filter((q) => q.pos.includes(i) || q.neg.includes(i))
            .map((q) => {
              const quota = M.mcnetQuote(q);
              return regolaHTML(q) + ": " + (q.pos.includes(i) ? "positivo, " + fmt(quota.pos) : "negativo, " + fmt(quota.neg));
            });
          return {
            tipo: "numero",
            q: "MC-Net sui giocatori x₁, x₂, x₃:" + regoleHTML(regole) + "Qual è il valore di Shapley di <b>" + lett(i) + "</b>? (Due decimali o frazione.)",
            ok: phi,
            tol: 0.01,
            perche: "Per ogni regola con p positivi e n negativi: ai positivi (p−1)! n!/(p+n)! · x, ai negativi p! (n−1)!/(p+n)! · (−x). " +
              "Regole che coinvolgono " + lett(i) + ":<br>" + (pezzi.length ? pezzi.join("<br>") : "nessuna") +
              "<br>Somma: φ = <b>" + fmt(phi) + "</b>.",
            dati: { regole, i },
          };
        },
      },
      {
        nome: "montecarlo-stima",
        sez: "6.5",
        titolo: "Stima Monte Carlo da permutazioni date",
        crea(r) {
          const c = [];
          let s = 0;
          for (let j = 0; j < 3; j++) { s += r.int(1, 5) * 2; c.push(s); }
          const nomi = ["A", "B", "C"];
          const m = r.int(3, 4);
          const perm = [];
          for (let t = 0; t < m; t++) perm.push(r.shuffle([0, 1, 2]));
          const g = r.int(0, 2);
          const contributi = perm.map((p) => {
            let cur = 0, mio = 0;
            p.forEach((k) => {
              const mc = Math.max(0, c[k] - cur);
              if (k === g) mio = mc;
              cur = Math.max(cur, c[k]);
            });
            return mio;
          });
          const stima = contributi.reduce((a, b) => a + b, 0) / m;
          const esatto = M.aeroportoShapley(c)[g];
          return {
            tipo: "numero",
            q: "Gioco dell'aeroporto con costi c<sub>A</sub> = " + c[0] + ", c<sub>B</sub> = " + c[1] + ", c<sub>C</sub> = " + c[2] +
              ". Sono state estratte " + m + " permutazioni: " + perm.map((p) => p.map((k) => nomi[k]).join("")).join(", ") +
              ". Quanto vale la stima Monte Carlo φ̃ di <b>" + nomi[g] + "</b>?",
            ok: stima,
            tol: 0.01,
            perche: "Contributo marginale di " + nomi[g] + " in ogni permutazione (paga quanto allunga la pista già costruita da chi lo precede): " +
              perm.map((p, t) => p.map((k) => nomi[k]).join("") + " → " + contributi[t]).join(", ") +
              ". Media: <b>" + fmt(stima) + "</b>. Il valore esatto è " + fmt(esatto) + ": con poche permutazioni la stima può essere lontana.",
            dati: { c, perm, g },
          };
        },
      },
      {
        nome: "montecarlo-campioni",
        sez: "6.5",
        titolo: "Quante permutazioni servono",
        crea(r) {
          const m = r.pick([100, 200, 500, 1000, 2000]);
          const e = r.pick([4, 6, 8, 10, 12]);
          const k = r.pick([2, 3, 4]);
          const ok = m * k * k;
          return {
            tipo: "numero",
            q: "Con m = " + m + " permutazioni campionate l'errore della stima Monte Carlo del valore di Shapley è circa " + e +
              "%. Circa quante permutazioni servono per ridurlo a " + fmt(e / k) + "%?",
            ok,
            tol: 0,
            perche: "L'errore scende come 1/√m: dividerlo per " + k + " richiede m moltiplicato per " + k + "² = " + k * k + ". " +
              m + " · " + k * k + " = <b>" + ok + "</b>.",
            dati: { m, k },
          };
        },
      },
    ],
  });
})();
