// Lezione 8 — Teoria del matching: dittatura seriale, TTC, matrimonio stabile, flussi.
(function () {
  const { T, M, fmt } = QUIZ;

  const lista = (p) => "[" + p.join(", ") + "]";
  const prefsHTML = (prefs) =>
    T.tabella(["Agente", "Preferenze (dalla migliore)"], Object.keys(prefs).sort().map((a) => [a, lista(prefs[a])]));
  const dueLatiHTML = (uomini, donne) =>
    T.tabella(
      ["Uomo", "Preferenze", "Donna", "Preferenze"],
      Object.keys(uomini).sort().map((m, i) => {
        const w = Object.keys(donne).sort()[i];
        return [m, lista(uomini[m]), w, lista(donne[w])];
      })
    );
  const passiHTML = (passi) =>
    T.tabella(["Passo", "Proposta", "Esito"], passi.map(([m, w, e], i) => [i + 1, m + " → " + w, e]));
  const coppie = (partner) => Object.keys(partner).sort().map((m) => "(" + m + ", " + partner[m] + ")").join(", ");

  // Istanza casuale a due lati: uomini A, B, C(, D) e donne W, X, Y(, Z).
  const dueLati = (r, n) => {
    const U = ["A", "B", "C", "D"].slice(0, n), D = ["W", "X", "Y", "Z"].slice(0, n);
    const uomini = {}, donne = {};
    U.forEach((m) => (uomini[m] = r.shuffle(D)));
    D.forEach((w) => (donne[w] = r.shuffle(U)));
    return { U, D, uomini, donne };
  };

  // Tutti i matching stabili (forza bruta sulle permutazioni).
  const stabili = (U, D, uomini, donne) =>
    M.permutazioni(D)
      .map((p) => { const mu = {}; U.forEach((m, i) => (mu[m] = p[i])); return mu; })
      .filter((mu) => M.coppieBloccanti(uomini, donne, mu).length === 0);

  QUIZ.aggiungi({
    numero: 8,
    titolo: "Teoria del matching",
    pdf: "lezione-08-matching.pdf",
    sezioni: {
      "8.1": "Il panorama dei problemi di matching",
      "8.2": "Dittatura seriale",
      "8.2.1": "Estensioni: capacità e round robin",
      "8.3": "Top Trading Cycle",
      "8.4": "Il matrimonio stabile",
      "8.5": "L'algoritmo di Gale–Shapley",
      "8.6": "Chi propone vince: ottimalità",
      "8.6.1": "Nessun meccanismo stabile è strategyproof",
      "8.7": "Estensioni del matrimonio stabile",
      "8.7.1": "Matching stabile con capacità",
      "8.8": "Oltre la stabilità: matching e flussi",
      "8.8.1": "Reti di flusso e flusso massimo",
      "8.8.2": "Matching massimo come flusso",
      "8.8.3": "Flusso a costo minimo",
      "8.9.1": "Lab: dittatura seriale e TTC",
      "8.9.2": "Lab: Gale–Shapley e stabilità",
      "8.9.3": "Lab: capacità",
      "8.9.4": "Lab: flussi con NetworkX",
    },
    domande: [
      // ---------------------------------------------------------------- 8.1
      {
        sez: "8.1",
        q: "Che cosa distingue le tre famiglie di problemi di matching della lezione?",
        o: [
          "Chi ha le preferenze (un lato, entrambi) oppure l'assenza di preferenze a favore di un obiettivo globale da ottimizzare",
          "Il numero di agenti: pochi, molti, infiniti",
          "Se gli oggetti sono divisibili o no",
          "Se l'algoritmo è esatto o approssimato",
        ],
        perche: "Preferenze da un lato (dittatura seriale, TTC), da due lati (matrimonio stabile), ottimizzazione (flussi). Cambia il significato di “buon matching”: efficienza e incentivi, stabilità, valore dell'obiettivo.",
      },
      {
        sez: "8.1",
        tipo: "vf",
        q: "In un matching ogni elemento di U e di V compare al più una volta.",
        ok: true,
        perche: "È la definizione. Il matching è perfetto se ogni elemento compare esattamente una volta (serve |U| = |V|). Con le capacità si generalizza: un nodo può comparire fino alla sua capacità.",
      },
      // ---------------------------------------------------------------- 8.2
      {
        sez: "8.2",
        q: "Con A = [X, Y, Z], B = [Z, X, Y], C = [Z, Y, X] e ordine A, B, C, che cosa dà la dittatura seriale?",
        o: ["(A, X), (B, Z), (C, Y)", "(A, X), (B, Y), (C, Z)", "(A, Y), (B, X), (C, Z)", "(A, Z), (B, X), (C, Y)"],
        perche: "A prende X; B prende Z, la sua prima scelta ancora libera; a C resta Y. È l'esempio delle slide.",
      },
      {
        sez: "8.2",
        q: "Stesse preferenze (A = [X, Y, Z], B = [Z, X, Y], C = [Z, Y, X]) ma ordine C, B, A. Che oggetto riceve A?",
        o: ["Y", "X", "Z", "Nessuno"],
        perche: "C prende Z, B prende X (Z non c'è più), ad A resta Y. Con l'ordine A, B, C avrebbe avuto X: l'ordine decide chi resta deluso.",
      },
      {
        sez: "8.2",
        tipo: "multi",
        q: "Quali proprietà ha la dittatura seriale secondo le slide?",
        o: [
          "Pareto efficiente",
          "Strategyproof",
          "Equa in valore atteso se l'ordine è estratto a caso",
          "Massimizza il benessere sociale",
          "Garantisce a tutti la prima scelta",
        ],
        ok: [0, 1, 2],
        perche: "Non massimizza il benessere: usa solo gli ordinamenti e non vede quanto conta una differenza per ciascuno.",
      },
      {
        sez: "8.2",
        q: "Perché nella dittatura seriale mentire non conviene?",
        o: [
          "Quando arriva il proprio turno gli oggetti rimasti non dipendono da ciò che si dichiara, e con la lista vera si prende il migliore",
          "Perché l'ordine viene ricalcolato in base alle preferenze dichiarate",
          "Perché chi mente viene escluso",
          "Mentire conviene a chi è ultimo nell'ordine",
        ],
        perche: "Chi sceglie prima di me non guarda la mia lista. Dichiarare il falso può solo farmi prendere un oggetto peggiore del migliore disponibile.",
      },
      {
        sez: "8.2",
        trappola: true,
        q: "A dà valore 10 a X e 9 a Y; B dà valore 10 a X e 0 a Y. Con l'ordine A, B, qual è il benessere ottenuto dalla dittatura seriale e quale il massimo?",
        o: ["10 contro 19", "19 contro 19", "20 contro 20", "9 contro 10"],
        perche: "A prende X (10), B resta con Y (0): totale 10. Dando Y ad A e X a B si ottiene 9 + 10 = 19. Pareto efficiente non vuol dire massimo benessere.",
      },
      {
        sez: "8.2",
        tipo: "vf",
        q: "La dittatura seriale casuale è equa anche a posteriori: dopo l'estrazione tutti hanno la stessa probabilità di ottenere la prima scelta.",
        ok: false,
        perche: "È equa solo ex ante: prima dell'estrazione tutti sono trattati allo stesso modo. Dopo, il primo ha la prima scelta garantita e l'ultimo prende ciò che resta.",
      },
      // ---------------------------------------------------------------- 8.2.1
      {
        sez: "8.2.1",
        q: "Con le capacità, in che cosa differiscono la dittatura seriale fino alla capacità e il round robin?",
        o: [
          "La prima fa prendere a ciascuno tutti i suoi oggetti in un turno (strategyproof, iniqua); il round robin uno per turno (più equo, manipolabile)",
          "Sono lo stesso algoritmo",
          "Il round robin è strategyproof, l'altra no",
          "La prima richiede utilità cardinali",
        ],
        perche: "Nel round robin conviene a volte prendere prima l'oggetto conteso e lasciare per dopo quello che nessun altro vuole.",
      },
      {
        sez: "8.2.1",
        trappola: true,
        q: "Round robin, ordine 1, 2, 1, 2. Preferenze vere: 1: a ≻ b ≻ c ≻ d, 2: b ≻ c ≻ a ≻ d. Che cosa ottiene l'agente 1 dichiarando b ≻ a ≻ c ≻ d invece del vero?",
        o: ["{a, b} invece di {a, c}", "{a, c} come con la verità", "{b, c} invece di {a, c}", "{a, d} invece di {a, c}"],
        perche: "Dichiarando il vero: 1 prende a, 2 b, 1 c, 2 d. Mentendo: 1 prende b, 2 (che voleva b) prende c, 1 prende a. Il round robin non è strategyproof.",
      },
      {
        sez: "8.2.1",
        tipo: "vf",
        q: "La dittatura seriale funziona anche con un numero di agenti diverso dal numero di oggetti.",
        ok: true,
        perche: "Senza modifiche: con più oggetti alcuni restano liberi, con più agenti gli ultimi restano senza.",
      },
      // ---------------------------------------------------------------- 8.3
      {
        sez: "8.3",
        q: "Nel grafo del Top Trading Cycle, dove puntano gli archi?",
        o: [
          "Ogni agente al suo oggetto preferito fra quelli rimasti, ogni oggetto al suo proprietario",
          "Ogni agente al proprio oggetto",
          "Ogni oggetto all'agente che lo preferisce di più",
          "Ogni agente all'agente che possiede l'oggetto peggiore",
        ],
        perche: "Si esegue un ciclo (ognuno riceve l'oggetto a cui punta), si tolgono agenti e oggetti del ciclo e si ripete.",
      },
      {
        sez: "8.3",
        q: "Perché a ogni giro del TTC c'è almeno un ciclo?",
        o: [
          "Ogni nodo ha esattamente un arco uscente: seguendo gli archi da un nodo qualunque prima o poi si ripassa da un nodo già visto",
          "Perché le preferenze sono transitive",
          "Perché il numero di agenti è pari",
          "Non è sempre vero: a volte il TTC si blocca",
        ],
        perche: "In un grafo finito in cui tutti hanno un successore non si può proseguire all'infinito senza ripetersi. Il ciclo può essere lungo uno: un agente che punta al proprio oggetto se lo tiene.",
      },
      {
        sez: "8.3",
        q: "Esempio delle slide: A (i₁): [i₃, i₂, i₄, i₁], B (i₂): [i₄, i₁, i₂, i₃], C (i₃): [i₁, i₄, i₃, i₂], D (i₄): [i₃, i₂, i₁, i₄]. Qual è il risultato del TTC?",
        o: [
          "(A, i₃), (C, i₁), (B, i₄), (D, i₂)",
          "(A, i₃), (B, i₄), (C, i₁), (D, i₄)",
          "(A, i₁), (B, i₂), (C, i₃), (D, i₄)",
          "(A, i₂), (B, i₄), (C, i₁), (D, i₃)",
        ],
        perche: "Primo giro: A → i₃ → C → i₁ → A. Secondo: B → i₄ → D → i₂ → B (i₃ non c'è più, D punta a i₂).",
      },
      {
        sez: "8.3",
        tipo: "multi",
        q: "Quali proprietà ha il TTC con preferenze strette?",
        o: [
          "Individualmente razionale: nessuno riceve un oggetto peggiore del proprio",
          "Il risultato è l'unica allocazione nel core",
          "Strategyproof",
          "Ogni agente riceve un oggetto strettamente migliore del proprio",
          "Massimizza la somma delle utilità",
        ],
        ok: [0, 1, 2],
        perche: "Roth e Postlewaite (1977) per l'unicità del core, Roth (1982) per la strategyproofness. Se tutti preferiscono il proprio oggetto, nessuno scambia.",
      },
      {
        sez: "8.3",
        trappola: true,
        q: "La slide dice che lo scopo del TTC è che “ogni agente ottenga un oggetto migliore”. Che cosa garantisce davvero?",
        o: [
          "Che nessuno peggiori e che nessun gruppo possa fare meglio scambiandosi solo i propri oggetti",
          "Che ognuno migliori strettamente",
          "Che almeno metà degli agenti migliori",
          "Che nessuno tenga il proprio oggetto",
        ],
        perche: "Individuale razionalità più core. Se tutti preferiscono ciò che hanno, il TTC fa solo cicli di lunghezza uno e nessuno scambia.",
      },
      {
        sez: "8.3",
        q: "Che cosa vuol dire che il risultato del TTC è nel core?",
        o: [
          "Nessuna coalizione di agenti, riallocando fra loro solo i propri oggetti, può far stare meglio tutti i suoi membri",
          "Ogni coppia di agenti è stabile nel senso di Gale–Shapley",
          "Il risultato massimizza il benessere",
          "Ogni agente riceve l'oggetto in cima alla lista",
        ],
        perche: "È lo stesso concetto della lezione 5 applicato a uno scambio. Con la coalizione di tutti gli agenti dà la Pareto efficienza.",
      },
      {
        sez: "8.3",
        q: "Perché nello scambio di reni reale non si usa il TTC così com'è?",
        o: [
          "Ogni ciclo richiede operazioni simultanee: i cicli vanno limitati a lunghezza 2 o 3, e il problema diventa NP-difficile",
          "Perché i pazienti non hanno preferenze",
          "Perché il TTC non è strategyproof",
          "Perché il TTC richiede pagamenti",
        ],
        perche: "Approfondimento degli appunti: con cicli corti si usa la programmazione lineare intera. Roth e Shapley: Nobel 2012.",
      },
      // ---------------------------------------------------------------- 8.4
      {
        sez: "8.4",
        q: "Quando una coppia (m, w) blocca un matching?",
        o: [
          "Quando m preferisce w alla sua partner e w preferisce m al suo partner",
          "Quando m preferisce w alla sua partner, comunque la pensi w",
          "Quando m e w sono l'uno in cima alla lista dell'altra",
          "Quando m e w sono abbinati fra loro",
        ],
        perche: "Servono entrambe le preferenze strette: se solo uno dei due vuole cambiare, la coppia non si forma. Un matching è stabile se non ha coppie bloccanti.",
      },
      {
        sez: "8.4",
        trappola: true,
        q: "La slide descrive la stabilità come “non si può riassegnare una coppia per migliorarla senza peggiorare qualcun altro”. Che cosa c'è da precisare?",
        o: [
          "Quella è la Pareto efficienza: stabilità vuol dire assenza di coppie bloccanti; con preferenze strette stabile implica Pareto efficiente, non il contrario",
          "Niente, sono la stessa cosa",
          "La stabilità è più debole della Pareto efficienza",
          "Un matching stabile non è mai Pareto efficiente",
        ],
        perche: "Se μ′ migliorasse m senza peggiorare nessuno, anche la nuova partner w di m starebbe strettamente meglio, e (m, w) bloccherebbe μ. Esistono però matching efficienti instabili.",
      },
      {
        sez: "8.4",
        tipo: "vf",
        q: "Con preferenze strette, ogni matching stabile è anche Pareto efficiente.",
        ok: true,
        perche: "Chi migliorerebbe in un altro matching formerebbe una coppia bloccante con il suo nuovo partner, che a sua volta non può peggiorare e ha cambiato partner, quindi sta strettamente meglio.",
      },
      // ---------------------------------------------------------------- 8.5
      {
        sez: "8.5",
        q: "Che cosa afferma il teorema di Gale e Shapley (1962)?",
        o: [
          "Per qualunque profilo di preferenze di n uomini e n donne esiste un matching stabile",
          "Il matching stabile è sempre unico",
          "Esiste un meccanismo stabile e strategyproof",
          "Il matching stabile massimizza la somma delle utilità",
        ],
        perche: "La dimostrazione è costruttiva: l'accettazione differita ne trova uno.",
      },
      {
        sez: "8.5",
        q: "Perché l'algoritmo si chiama “accettazione differita”?",
        o: [
          "Nessuna accettazione è definitiva: una donna tiene il fidanzato solo finché non riceve una proposta che preferisce",
          "Perché le donne rispondono solo alla fine",
          "Perché le proposte si fanno in ordine casuale",
          "Perché gli uomini possono ritirare le proposte",
        ],
        perche: "Il fidanzamento è provvisorio fino alla fine. Per questo le donne migliorano sempre, mentre gli uomini scendono lungo la loro lista.",
      },
      {
        sez: "8.5",
        q: "Esempio delle slide: A = [X, Y, Z], B = [Z, X, Y], C = [Z, Y, X]; X = [A, B, C], Y = [B, C, A], Z = [A, C, B]. Che matching restituisce Gale–Shapley (propongono gli uomini)?",
        o: ["(A, X), (B, Y), (C, Z)", "(A, X), (B, Z), (C, Y)", "(A, Y), (B, X), (C, Z)", "(A, Z), (B, X), (C, Y)"],
        perche: "A → X accettato; B → Z; C → Z, Z preferisce C e lascia B; B → X rifiutato (X preferisce A); B → Y accettato. Cinque proposte.",
      },
      {
        sez: "8.5",
        q: "Quante proposte fa al più l'accettazione differita con n uomini e n donne?",
        o: ["n²", "n", "n!", "2ⁿ"],
        perche: "Ogni uomo propone a ogni donna al più una volta. Le slide dicono O(n²) passi.",
      },
      {
        sez: "8.5",
        q: "Perché alla fine dell'algoritmo nessun uomo resta solo (liste complete, n uomini e n donne)?",
        o: [
          "Una donna che ha ricevuto una proposta resta fidanzata; un uomo rifiutato da tutte avrebbe reso fidanzate tutte le n donne con al più n − 1 uomini",
          "Perché gli uomini propongono a caso",
          "Perché le donne devono accettare la prima proposta",
          "Non è vero: qualcuno può restare solo",
        ],
        perche: "È il passaggio che garantisce un matching perfetto. Con liste incomplete invece qualcuno può restare solo.",
      },
      {
        sez: "8.5",
        q: "Come si dimostra che il risultato è stabile?",
        o: [
          "Se m preferisse w alla sua partner, le avrebbe proposto prima; w l'ha rifiutato per qualcuno che preferiva e da allora è solo migliorata: non può preferire m al partner finale",
          "Perché ogni donna ottiene la prima scelta",
          "Perché il numero di proposte è finito",
          "Perché ogni uomo ottiene la prima scelta",
        ],
        perche: "O m non ha proposto a w (impossibile, propone in ordine) o w l'ha rifiutato per uno migliore: in entrambi i casi (m, w) non blocca.",
      },
      {
        sez: "8.5",
        tipo: "vf",
        q: "Cambiando l'ordine in cui gli uomini liberi fanno le proposte, l'accettazione differita può restituire matching diversi.",
        ok: false,
        perche: "Qualunque ordine si scelga, il risultato è sempre il matching stabile M-ottimale. Le slide usano turni simultanei, l'esempio una proposta alla volta: stesso risultato.",
      },
      // ---------------------------------------------------------------- 8.6
      {
        sez: "8.6",
        q: "Che cosa vuol dire che un matching stabile è M-ottimale?",
        o: [
          "Ogni uomo lo preferisce almeno quanto ogni altro matching stabile: ha la migliore fra le sue partner stabili",
          "Ogni uomo ha la donna in cima alla sua lista",
          "La somma dei rank degli uomini è minima fra tutti i matching",
          "Gli uomini sono indifferenti fra i matching stabili",
        ],
        perche: "Il confronto è solo con i matching stabili. La donna in cima alla lista può non essere una partner stabile.",
      },
      {
        sez: "8.6",
        q: "Con gli uomini che propongono, l'accettazione differita restituisce il matching…",
        o: ["M-ottimale e W-pessimale", "W-ottimale e M-pessimale", "ottimale per tutti", "scelto a caso fra quelli stabili"],
        perche: "Chi propone vince. Facendo proporre le donne si ottiene il W-ottimale, che è M-pessimale.",
      },
      {
        sez: "8.6",
        q: "Qual è il passo chiave nella dimostrazione della M-ottimalità?",
        o: [
          "Si prende il primo rifiuto di un uomo da parte di una sua partner stabile e si mostra che chi ha preso il suo posto formerebbe una coppia bloccante nell'altro matching stabile",
          "Si mostra che ogni uomo ottiene la prima scelta",
          "Si usa il teorema del flusso massimo",
          "Si conta il numero di proposte",
        ],
        perche: "Se w rifiuta m (partner stabile) per m′, in un matching stabile μ′ con (m, w) l'uomo m′ sta con w′; non essendo ancora stato rifiutato da partner stabili, preferisce w a w′: (m′, w) blocca μ′.",
      },
      {
        sez: "8.6",
        trappola: true,
        q: "Nella dimostrazione della W-pessimalità la slide scrive che m “preferisce w a ogni altra donna della sua lista”. Qual è la versione corretta?",
        o: [
          "m preferisce w a ogni altra sua partner stabile",
          "È corretta così",
          "m preferisce w a ogni donna che lo preferisce",
          "w preferisce m a ogni altro uomo",
        ],
        perche: "Per la M-ottimalità w è la migliore partner stabile di m, non necessariamente la migliore donna in assoluto.",
      },
      {
        sez: "8.6",
        tipo: "vf",
        q: "Se la versione con proposte degli uomini e quella con proposte delle donne danno lo stesso matching, il matching stabile è unico.",
        ok: true,
        perche: "Ogni matching stabile sta “fra” il M-ottimale e il W-ottimale: se coincidono, ogni uomo ha la stessa partner in tutti i matching stabili. È il caso dell'esempio A, B, C / X, Y, Z delle slide.",
      },
      // ---------------------------------------------------------------- 8.6.1
      {
        sez: "8.6.1",
        q: "Che cosa dice il teorema di Roth (1982) sui meccanismi di matching?",
        o: [
          "Nessun meccanismo è sempre stabile e strategyproof",
          "Ogni meccanismo stabile è strategyproof",
          "L'accettazione differita è strategyproof per tutti",
          "Esistono sempre almeno due matching stabili",
        ],
        perche: "La dimostrazione usa un profilo con due soli matching stabili: qualunque dei due si scelga, qualcuno può mentire e ottenere l'altro.",
      },
      {
        sez: "8.6.1",
        q: "Nell'esempio di Roth (m₁: w₁, w₂, w₃; m₂: w₂, w₁, w₃; m₃: w₁, w₂, w₃; w₁: m₂, m₁, m₃; w₂: m₁, m₂, m₃; w₃: m₁, m₂, m₃), quali sono i matching stabili?",
        o: [
          "(m₁, w₁), (m₂, w₂), (m₃, w₃) e (m₁, w₂), (m₂, w₁), (m₃, w₃)",
          "Solo (m₁, w₁), (m₂, w₂), (m₃, w₃)",
          "Tutti i sei matching",
          "(m₁, w₃), (m₂, w₁), (m₃, w₂)",
        ],
        perche: "m₃ e w₃ sono ultimi per tutti e restano insieme. Il primo è M-ottimale, il secondo W-ottimale. Verificato provando le 6 assegnazioni.",
      },
      {
        sez: "8.6.1",
        q: "Nell'esempio di Roth il meccanismo sceglie (m₁, w₁), (m₂, w₂), (m₃, w₃). Come manipola w₁?",
        o: [
          "Dichiara m₂, m₃, m₁: ora (m₃, w₁) blocca quel matching e l'unico stabile le dà m₂",
          "Dichiara m₁, m₂, m₃",
          "Non può manipolare",
          "Dichiara m₃, m₁, m₂ e ottiene m₃",
        ],
        perche: "Con la nuova lista w₁ dichiara di preferire m₃ a m₁, e m₃ preferisce w₁ a w₃: la coppia blocca. L'unico stabile rimasto le dà la vera prima scelta.",
      },
      {
        sez: "8.6.1",
        q: "E se il meccanismo sceglie (m₁, w₂), (m₂, w₁), (m₃, w₃)? Chi manipola, e come?",
        o: [
          "m₁, dichiarando w₁, w₃, w₂: (m₁, w₃) blocca e l'unico stabile gli dà w₁",
          "w₂, dichiarando m₂, m₁, m₃",
          "m₃, dichiarando w₃, w₁, w₂",
          "Nessuno",
        ],
        perche: "w₃ preferisce m₁ a m₃, e ora m₁ dichiara di preferire w₃ a w₂. Il meccanismo stabile deve restituire il matching M-ottimale.",
      },
      {
        sez: "8.6.1",
        tipo: "vf",
        q: "Con gli uomini che propongono, nessun uomo può ottenere una partner migliore mentendo.",
        ok: true,
        perche: "Dubins e Freedman (1981), Roth (1982): l'accettazione differita è strategyproof per chi propone. Possono manipolare solo le donne, il lato che riceve.",
      },
      {
        sez: "8.6.1",
        q: "Perché nei sistemi di ammissione reali si fanno proporre gli studenti?",
        o: [
          "Perché l'accettazione differita è strategyproof per chi propone: agli studenti conviene dichiarare il vero, e ottengono il loro ottimo stabile",
          "Perché le scuole non hanno preferenze",
          "Perché è più veloce",
          "Perché così il matching è unico",
        ],
        perche: "Il lato che propone ottiene il miglior matching stabile e non ha incentivi a mentire.",
      },
      // ---------------------------------------------------------------- 8.7
      {
        sez: "8.7",
        q: "Come si gestisce n ≠ m (numero diverso di uomini e donne)?",
        o: [
          "Cambiando il criterio di arresto (chi è rifiutato da tutti resta solo) oppure aggiungendo individui fittizi in fondo alle liste",
          "Non si può: l'algoritmo richiede n = m",
          "Eliminando a caso gli agenti in eccesso",
          "Facendo proporre il lato più piccolo due volte",
        ],
        perche: "Le slide citano entrambe le soluzioni.",
      },
      {
        sez: "8.7",
        q: "Come si adatta l'algoritmo alle liste incomplete?",
        o: [
          "Gli uomini non propongono alle donne inaccettabili e le donne non accettano uomini inaccettabili",
          "Si completano le liste a caso",
          "Si escludono gli agenti con liste incomplete",
          "Non serve nessuna modifica",
        ],
        perche: "Ora qualcuno può restare solo, e una coppia blocca anche se entrambi preferiscono stare insieme che soli.",
      },
      {
        sez: "8.7",
        trappola: true,
        q: "Con pareggi nelle preferenze, che cosa si ottiene rompendoli a caso ed eseguendo l'accettazione differita?",
        o: [
          "Un matching debolmente stabile, ma rotture diverse possono dare matching di dimensioni diverse",
          "Sempre lo stesso matching",
          "Un matching non stabile",
          "Il matching debolmente stabile più grande possibile",
        ],
        perche: "Trovare il più grande matching debolmente stabile con pareggi e liste incomplete è NP-difficile (Manlove et al., 2002).",
      },
      // ---------------------------------------------------------------- 8.7.1
      {
        sez: "8.7.1",
        q: "Con capacità, quando una coppia studente–scuola è bloccante?",
        o: [
          "Lo studente preferisce quella scuola alla sua e la scuola ha un posto libero oppure preferisce lo studente al peggiore dei suoi ammessi",
          "Lo studente preferisce quella scuola, in ogni caso",
          "La scuola è piena",
          "La scuola preferisce lo studente al migliore dei suoi ammessi",
        ],
        perche: "È la stabilità del matrimonio estesa: la scuola “ci guadagna” se ha posto o se lo studente sostituisce uno peggiore.",
      },
      {
        sez: "8.7.1",
        q: "Esempio delle slide: tutti gli studenti A–E hanno [X, Y]; X = [A, E, B, C, D] con c_X = 2, Y = [E, A, B, C, D] con c_Y = 3. Che cosa restituisce l'accettazione differita?",
        o: ["X = {A, E}, Y = {B, C, D}", "X = {A, B}, Y = {C, D, E}", "X = {E, A}, Y = {B, C}, D senza scuola", "X = {A, B}, Y = {E, C, D}"],
        perche: "X tiene A e B, rifiuta C e D; arriva E e X lascia B. B, C, D vanno a Y, che ha tre posti.",
      },
      // ---------------------------------------------------------------- 8.8
      {
        sez: "8.8",
        q: "Perché ridurre un problema di matching a un flusso su rete?",
        o: [
          "Quando la stabilità non si può ottenere o interessa un obiettivo globale (più coppie, meno costo), e per i flussi esistono algoritmi polinomiali",
          "Perché i flussi garantiscono la stabilità",
          "Perché i flussi risolvono anche i problemi NP-difficili",
          "Perché i flussi sono strategyproof",
        ],
        perche: "Il flusso ottimizza ma non si chiede se qualcuno vorrebbe deviare.",
      },
      {
        sez: "8.8",
        tipo: "vf",
        q: "Il generalized assignment problem si risolve esattamente con un algoritmo di flusso massimo.",
        ok: false,
        perche: "È NP-difficile. Gli algoritmi di flusso possono aiutare a costruire soluzioni approssimate, non a risolverlo esattamente.",
      },
      // ---------------------------------------------------------------- 8.8.1
      {
        sez: "8.8.1",
        tipo: "multi",
        q: "Quali vincoli deve rispettare un flusso?",
        o: [
          "Su ogni arco, flusso ≤ capacità (e ≥ 0)",
          "In ogni nodo diverso da s e t, flusso entrante = flusso uscente",
          "Ogni arco deve portare flusso",
          "Il flusso uscente da s è uguale alla somma delle capacità",
        ],
        ok: [0, 1],
        perche: "Capacità e conservazione. Il valore del flusso è quanto esce da s.",
      },
      {
        sez: "8.8.1",
        q: "Come si calcola la capacità di un taglio (S, T)?",
        o: [
          "Si sommano le capacità degli archi che vanno da S a T; quelli da T a S non contano",
          "Si sommano le capacità di tutti gli archi fra S e T, in entrambe le direzioni",
          "Si conta il numero di archi fra S e T",
          "Si sommano le capacità degli archi dentro S",
        ],
        perche: "Il teorema max-flow min-cut: il flusso massimo è uguale alla capacità minima di un taglio.",
      },
      {
        sez: "8.8.1",
        q: "Nella rete delle slide, quanto vale il flusso massimo?",
        o: ["25", "28", "30", "20"],
        perche: "Un taglio minimo è S = {s, c, f}: archi s → a (10), s → b (5), f → t (10). Totale 25.",
      },
      {
        sez: "8.8.1",
        trappola: true,
        q: "La slide del taglio minimo evidenzia S = {s, b, c, f} e scrive 5 sull'arco b → e. Che cosa non torna?",
        o: [
          "Nelle slide precedenti b → e ha capacità 8: con quella capacità il taglio vale 28 e non è minimo",
          "Niente: il taglio vale 25",
          "Il flusso massimo è 28",
          "S deve contenere t",
        ],
        perche: "Il taglio minimo è S = {s, c, f}, con capacità 25. Il valore del flusso massimo non cambia con nessuna delle due capacità di b → e.",
      },
      {
        sez: "8.8.1",
        q: "Il primo cammino delle slide è s → a → b → e → t. Quante unità porta e perché?",
        o: ["4: l'arco a → b ha capacità 4 ed è il collo di bottiglia", "10: la capacità di s → a", "8: la capacità di b → e", "1"],
        perche: "Un cammino porta il minimo delle capacità (residue) dei suoi archi.",
      },
      {
        sez: "8.8.1",
        q: "Perché nella rete residua di Ford–Fulkerson ci sono anche archi all'indietro?",
        o: [
          "Per poter disfare flusso mandato prima su una strada sbagliata",
          "Per rendere il grafo non orientato",
          "Per contare due volte il flusso",
          "Perché il pozzo deve rimandare flusso alla sorgente",
        ],
        perche: "Un arco con flusso f e capacità c ha ancora c − f in avanti e f all'indietro. Senza gli archi all'indietro una scelta golosa può bloccarsi sotto l'ottimo.",
      },
      // ---------------------------------------------------------------- 8.8.2
      {
        sez: "8.8.2",
        q: "Come si costruisce la rete per il matching massimo in un grafo bipartito?",
        o: [
          "s → ogni u ∈ U, u → v per ogni coppia ammessa, ogni v ∈ V → t, tutto con capacità 1",
          "s → ogni v ∈ V con capacità infinita",
          "Un arco fra ogni coppia di nodi con capacità 1",
          "u → v con capacità pari al numero di vicini di u",
        ],
        perche: "La capacità 1 verso s e t limita ogni nodo a un partner; le coppie con flusso 1 sono il matching.",
      },
      {
        sez: "8.8.2",
        trappola: true,
        q: "Perché il flusso massimo trovato corrisponde a un matching e non a “mezze coppie” con flusso 0,5?",
        o: [
          "Per il teorema di integralità: con capacità intere esiste un flusso massimo intero, e Ford–Fulkerson lo trova",
          "Perché il flusso è sempre 0 o 1 in qualunque rete",
          "Perché si arrotonda alla fine",
          "Non è garantito",
        ],
        perche: "È il passaggio che rende corretta la riduzione: con valori 0 e 1 su ogni arco, le coppie con flusso 1 formano un matching.",
      },
      {
        sez: "8.8.2",
        q: "Nell'esempio delle slide con capacità 2 su s → uᵢ e su v₂ → t, quanto vale il flusso massimo?",
        o: ["4", "3", "6", "5"],
        perche: "Gli archi verso t portano in tutto 1 + 2 + 1 = 4, e il flusso {u₁v₁, u₁v₂, u₂v₂, u₃v₃} li satura.",
      },
      // ---------------------------------------------------------------- 8.8.3
      {
        sez: "8.8.3",
        q: "Che cosa aggiunge il flusso a costo minimo al flusso massimo?",
        o: [
          "Un costo per unità su ogni arco: si manda la quantità richiesta minimizzando Σ c(e)·f(e)",
          "Un limite al numero di archi usati",
          "Le preferenze degli agenti",
          "La stabilità del matching",
        ],
        perche: "Con i costi sugli archi u → v si ottengono i problemi di assegnamento: persone a compiti, revisori ad articoli.",
      },
      {
        sez: "8.8.3",
        q: "Esempio delle slide: costi u₁v₁ = 1, u₁v₂ = 5, u₂v₂ = 1, u₂v₃ = 1, u₃v₃ = 5, capacità 1. Quanto costa mandare 3 unità?",
        o: ["7", "3", "5", "11"],
        perche: "C'è un solo matching perfetto: u₃ può andare solo con v₃, quindi u₂ con v₂ e u₁ con v₁. Costo 1 + 1 + 5.",
      },
      {
        sez: "8.8.3",
        q: "E se l'arco s → u₂ ha capacità 2?",
        o: ["Il costo scende a 3: u₂ prende v₂ e v₃, u₃ resta senza partner", "Il costo resta 7", "Il costo sale a 11", "Il flusso scende a 2"],
        perche: "Il flusso u₁v₁, u₂v₂, u₂v₃ costa 1 + 1 + 1. Il flusso a costo minimo non si preoccupa che u₃ resti solo.",
      },
      // ---------------------------------------------------------------- 8.9.1
      {
        sez: "8.9.1",
        q: "Nel codice del TTC, come si trova un ciclo a ogni giro?",
        o: [
          "Si parte da un agente e si seguono le frecce agente → oggetto preferito → proprietario finché si ripassa da un agente già visto",
          "Si ordina la lista degli agenti",
          "Si prova ogni sottoinsieme di agenti",
          "Si usa l'algoritmo di Gale–Shapley",
        ],
        perche: "Il primo agente ripetuto chiude il ciclo; la parte della lista da lì in poi è il ciclo da eseguire.",
      },
      {
        sez: "8.9.1",
        q: "Come si è verificata la strategyproofness del TTC nel lab?",
        o: [
          "Su 200 istanze con 4 agenti, per ogni agente si sono provate tutte le 24 liste false: nessuna gli dà un oggetto migliore",
          "Con una dimostrazione formale nel codice",
          "Confrontando con la dittatura seriale",
          "Non si può verificare",
        ],
        perche: "Verifica esaustiva sulle manipolazioni di un singolo agente: zero successi, come prevede il teorema di Roth (1982).",
      },
      // ---------------------------------------------------------------- 8.9.2
      {
        sez: "8.9.2",
        q: "A che cosa serve la tabella rank nel codice di Gale–Shapley?",
        o: [
          "A confrontare due uomini in O(1) dal punto di vista di una donna; senza, ogni confronto costa O(n) e l'algoritmo O(n³)",
          "A ordinare le donne",
          "A contare le proposte",
          "A rompere i pareggi",
        ],
        perche: "rank[w][m] è la posizione di m nella lista di w.",
      },
      {
        sez: "8.9.2",
        q: "Con preferenze casuali, quante proposte fa in media Gale–Shapley con n = 1000 nel lab?",
        o: ["Circa 6700, vicino a n ln n ≈ 6900", "Circa 1 000 000 = n²", "Esattamente 1000", "Circa 500 000"],
        perche: "Il limite n² è il caso peggiore. Con preferenze casuali le proposte crescono come n ln n.",
      },
      {
        sez: "8.9.2",
        q: "Nel lab, su 300 istanze casuali con n = 4 e uomini che propongono, chi è riuscito a manipolare?",
        o: [
          "Nessun uomo; almeno una donna in 12 istanze (4%)",
          "Uomini e donne in metà dei casi",
          "Solo gli uomini",
          "Nessuno, in nessun caso",
        ],
        perche: "Strategyproof per chi propone; manipolabile, ma raramente su istanze casuali, per chi riceve.",
      },
      {
        sez: "8.9.2",
        q: "Come si sono trovati tutti i matching stabili di un'istanza piccola per verificare la M-ottimalità?",
        o: [
          "Provando tutte le n! assegnazioni e tenendo quelle senza coppie bloccanti",
          "Eseguendo Gale–Shapley con ordini diversi",
          "Con il flusso massimo",
          "Non si possono trovare",
        ],
        perche: "Con n ≤ 6 sono al più 720 assegnazioni. Su 1000 istanze il risultato è sempre M-ottimale e W-pessimale.",
      },
      // ---------------------------------------------------------------- 8.9.3
      {
        sez: "8.9.3",
        q: "Che cosa cambia nel codice dell'accettazione differita con le capacità?",
        o: [
          "Ogni scuola tiene una lista ordinata di ammessi e, se supera c_i, rimanda indietro il peggiore",
          "Si esegue Gale–Shapley una volta per ogni posto",
          "Gli studenti propongono a tutte le scuole insieme",
          "Le scuole propongono agli studenti",
        ],
        perche: "Il resto è identico. Il controllo “lista finita” gestisce anche le liste incomplete.",
      },
      // ---------------------------------------------------------------- 8.9.4
      {
        sez: "8.9.4",
        q: "In NetworkX, quale attributo degli archi rappresenta il costo unitario per nx.max_flow_min_cost?",
        o: ["weight", "capacity", "cost", "flow"],
        perche: "capacity è la capacità, weight il costo per unità. nx.cost_of_flow(H, F) calcola Σ costo·flusso.",
      },
      {
        sez: "8.9.4",
        q: "Che cosa restituisce nx.minimum_cut(G, 's', 't')?",
        o: [
          "Il valore del taglio minimo e la partizione (S, T) dei nodi",
          "Solo la lista degli archi tagliati",
          "Il flusso su ogni arco",
          "Il cammino più corto da s a t",
        ],
        perche: "Sulla rete delle slide: 25 e S = {s, c, f}.",
      },
    ],

    generatori: [
      {
        nome: "dittatura-seriale",
        sez: "8.2",
        titolo: "Dittatura seriale",
        crea(r) {
          const agenti = ["A", "B", "C", "D"], oggetti = ["W", "X", "Y", "Z"];
          const prefs = {};
          agenti.forEach((a) => (prefs[a] = r.shuffle(oggetti)));
          const ordine = r.shuffle(agenti);
          const k = ordine[r.int(2, 3)];
          const out = M.dittaturaSeriale(prefs, ordine);
          return {
            tipo: "scelta",
            q: "Quattro agenti con preferenze sugli oggetti:" + prefsHTML(prefs) +
              "Con la dittatura seriale nell'ordine <b>" + ordine.join(", ") + "</b>, che oggetto riceve <b>" + k + "</b>?",
            o: oggetti,
            ok: oggetti.indexOf(out[k]),
            ordine: true,
            perche: "Nell'ordine, ognuno prende il migliore fra gli oggetti rimasti: " +
              ordine.map((a) => a + " → " + out[a]).join(", ") + ". " + k + " riceve <b>" + out[k] + "</b>.",
            dati: { prefs, ordine, k },
          };
        },
      },
      {
        nome: "ttc",
        sez: "8.3",
        titolo: "Top Trading Cycle",
        crea(r) {
          const agenti = ["A", "B", "C", "D"], oggetti = ["i₁", "i₂", "i₃", "i₄"];
          const owner = {};
          oggetti.forEach((o, j) => (owner[o] = agenti[j]));
          let prefs, ris;
          do {
            prefs = {};
            agenti.forEach((a) => (prefs[a] = r.shuffle(oggetti)));
            ris = M.ttc(prefs, owner);
          } while (ris.giri.length === 4);
          const k = r.pick(agenti);
          const desc = ris.giri.map((c, g) =>
            "giro " + (g + 1) + ": " + (c.length === 1 ? c[0] + " punta al proprio oggetto e se lo tiene" :
              c.map((a) => a + " → " + ris.assegnazione[a]).join(", "))).join("; ");
          return {
            tipo: "scelta",
            q: "Ogni agente possiede un oggetto: A ha i₁, B ha i₂, C ha i₃, D ha i₄." + prefsHTML(prefs) +
              "Che oggetto riceve <b>" + k + "</b> con il Top Trading Cycle?",
            o: oggetti,
            ok: oggetti.indexOf(ris.assegnazione[k]),
            ordine: true,
            perche: "Ogni agente punta al preferito fra gli oggetti rimasti, ogni oggetto al proprietario; si eseguono i cicli. " +
              desc + ". " + k + " riceve <b>" + ris.assegnazione[k] + "</b>, mai peggio del proprio oggetto.",
            dati: { prefs, owner, k },
          };
        },
      },
      {
        nome: "gale-shapley",
        sez: "8.5",
        titolo: "Gale–Shapley: chi sposa chi",
        crea(r) {
          const n = r.int(3, 4);
          const { U, D, uomini, donne } = dueLati(r, n);
          const gs = M.galeShapley(uomini, donne);
          const m = r.pick(U);
          return {
            tipo: "scelta",
            q: "Propongono gli uomini." + dueLatiHTML(uomini, donne) +
              "Con l'accettazione differita, con chi finisce <b>" + m + "</b>?",
            o: D,
            ok: D.indexOf(gs.partner[m]),
            ordine: true,
            perche: "Proposte (si parte in ordine alfabetico, chi viene rifiutato torna in fondo alla coda):" + passiHTML(gs.passi) +
              "Risultato: " + coppie(gs.partner) + ". " + m + " finisce con <b>" + gs.partner[m] +
              "</b>. Qualunque ordine delle proposte dà lo stesso matching, il M-ottimale.",
            dati: { uomini, donne, m },
          };
        },
      },
      {
        nome: "proposte",
        sez: "8.5",
        titolo: "Gale–Shapley: numero di proposte",
        crea(r) {
          const { uomini, donne } = dueLati(r, 4);
          const gs = M.galeShapley(uomini, donne);
          return {
            tipo: "numero",
            q: "Propongono gli uomini." + dueLatiHTML(uomini, donne) +
              "Quante proposte in tutto fa l'accettazione differita?",
            ok: gs.passi.length,
            tol: 0,
            perche: passiHTML(gs.passi) + "Totale <b>" + gs.passi.length + "</b> proposte (al più n² = 16). " +
              "Il numero non dipende dall'ordine: ogni uomo propone a tutte le donne della sua lista fino alla partner finale.",
            dati: { uomini, donne },
          };
        },
      },
      {
        nome: "bloccanti",
        sez: "8.4",
        titolo: "Contare le coppie bloccanti",
        crea(r) {
          const { U, D, uomini, donne } = dueLati(r, 3);
          const p = r.shuffle(D);
          const mu = {};
          U.forEach((m, i) => (mu[m] = p[i]));
          const b = M.coppieBloccanti(uomini, donne, mu);
          return {
            tipo: "numero",
            q: dueLatiHTML(uomini, donne) + "Matching: " + coppie(mu) + ". Quante coppie bloccanti ha?",
            ok: b.length,
            tol: 0,
            perche: "Per ogni uomo si guardano le donne che preferisce alla sua partner; la coppia blocca se anche lei lo preferisce al suo partner. " +
              (b.length ? "Bloccanti: " + b.map(([m, w]) => "(" + m + ", " + w + ")").join(", ") : "Nessuna: il matching è stabile") +
              ". Totale <b>" + b.length + "</b>.",
            dati: { uomini, donne, mu },
          };
        },
      },
      {
        nome: "chi-propone",
        sez: "8.6",
        titolo: "Proposte delle donne",
        crea(r) {
          let ist, st;
          do {
            ist = dueLati(r, 3);
            st = stabili(ist.U, ist.D, ist.uomini, ist.donne);
          } while (st.length < 2);
          const { D, U, uomini, donne } = ist;
          const gsM = M.galeShapley(uomini, donne);
          const gsW = M.galeShapley(donne, uomini);
          // Una donna che cambia partner fra i due estremi: esiste, perché i matching stabili sono almeno due.
          const maritoM = {};
          Object.keys(gsM.partner).forEach((m) => (maritoM[gsM.partner[m]] = m));
          const w = r.pick(D.filter((x) => gsW.partner[x] !== maritoM[x]));
          return {
            tipo: "scelta",
            q: dueLatiHTML(uomini, donne) + "Questa istanza ha " + st.length +
              " matching stabili. Se a proporre sono le <b>donne</b>, con chi finisce <b>" + w + "</b>?",
            o: U,
            ok: U.indexOf(gsW.partner[w]),
            ordine: true,
            perche: "Proponendo le donne si ottiene il matching W-ottimale: " +
              Object.keys(gsW.partner).sort().map((x) => "(" + gsW.partner[x] + ", " + x + ")").join(", ") +
              ". " + w + " ha <b>" + gsW.partner[w] + "</b>. Con le proposte degli uomini il risultato sarebbe " + coppie(gsM.partner) +
              ": chi propone ottiene il suo ottimo stabile.",
            dati: { uomini, donne, w },
          };
        },
      },
      {
        nome: "flusso-massimo",
        sez: "8.8.1",
        titolo: "Flusso massimo",
        crea(r) {
          const archi = [
            ["s", "a", r.int(3, 12)], ["s", "b", r.int(3, 12)],
            ["a", "c", r.int(2, 9)], ["a", "d", r.int(2, 9)], ["b", "c", r.int(2, 9)], ["b", "d", r.int(2, 9)],
            ["c", "t", r.int(3, 12)], ["d", "t", r.int(3, 12)],
          ];
          if (r.next() < 0.6) archi.push(["a", "b", r.int(1, 6)]);
          if (r.next() < 0.6) archi.push(["c", "d", r.int(1, 6)]);
          const { valore, S } = M.flussoMassimo(archi, "s", "t");
          const tagliati = archi.filter(([u, v]) => S.includes(u) && !S.includes(v));
          return {
            tipo: "numero",
            q: "Rete con sorgente s e pozzo t:" + T.tabella(["Arco", "Capacità"], archi.map(([u, v, c]) => [u + " → " + v, c])) +
              "Quanto vale il flusso massimo da s a t?",
            ok: valore,
            tol: 0,
            perche: "Flusso massimo = taglio minimo. Un taglio minimo è S = {" + S.join(", ") + "}: archi da S a T " +
              tagliati.map(([u, v, c]) => u + " → " + v + " (" + c + ")").join(", ") + ", in tutto <b>" + valore + "</b>. " +
              "Nessun flusso può superarlo, e i cammini aumentanti lo raggiungono.",
            dati: { archi },
          };
        },
      },
      {
        nome: "matching-massimo",
        sez: "8.8.2",
        titolo: "Matching massimo",
        crea(r) {
          const U = ["u₁", "u₂", "u₃", "u₄"], V = ["v₁", "v₂", "v₃", "v₄"];
          const amm = [];
          U.forEach((u) => r.shuffle(V).slice(0, r.int(1, 2)).forEach((v) => amm.push([u, v])));
          const ok = (u, v) => amm.some(([a, b]) => a === u && b === v);
          let best = [];
          M.permutazioni(V).forEach((p) => {
            const m = U.map((u, i) => [u, p[i]]).filter(([u, v]) => ok(u, v));
            if (m.length > best.length) best = m;
          });
          const rete = [...U.map((u) => ["s", u, 1]), ...amm.map(([u, v]) => [u, v, 1]), ...V.map((v) => [v, "t", 1])];
          const f = M.flussoMassimo(rete, "s", "t").valore;
          return {
            tipo: "numero",
            q: "Coppie ammesse: " + amm.map(([u, v]) => u + "–" + v).join(", ") +
              ". Quante coppie ha il matching più grande?",
            ok: f,
            tol: 0,
            perche: "Si costruisce la rete s → uᵢ → vⱼ → t con capacità 1: il flusso massimo vale <b>" + f +
              "</b>. Un matching di quella dimensione: " + best.map(([u, v]) => u + "–" + v).join(", ") + ".",
            dati: { amm },
          };
        },
      },
      {
        nome: "assegnamento",
        sez: "8.8.3",
        titolo: "Assegnamento a costo minimo",
        crea(r) {
          const C = [0, 1, 2].map(() => [0, 1, 2].map(() => r.int(1, 9)));
          let best = null;
          M.permutazioni([0, 1, 2]).forEach((p) => {
            const c = p.reduce((s, j, i) => s + C[i][j], 0);
            if (!best || c < best.c) best = { p, c };
          });
          return {
            tipo: "numero",
            q: "Tre persone e tre compiti; costo di assegnare la persona i al compito j:" +
              T.tabella(["", "Compito 1", "Compito 2", "Compito 3"], C.map((riga, i) => ["Persona " + (i + 1)].concat(riga))) +
              "Ogni persona fa un compito. Qual è il costo totale minimo?",
            ok: best.c,
            tol: 0,
            perche: "È un flusso a costo minimo di 3 unità con capacità 1 (un matching perfetto). Provando le 3! = 6 assegnazioni, la migliore è " +
              best.p.map((j, i) => "P" + (i + 1) + " → C" + (j + 1) + " (" + C[i][j] + ")").join(", ") + ": costo <b>" + best.c + "</b>.",
            dati: { C },
          };
        },
      },
    ],
  });
})();
