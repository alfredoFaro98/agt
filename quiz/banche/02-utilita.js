// Lezione 2 — Teoria dell'utilità; Lab 2 — battaglia navale e ricerca bayesiana.
(function () {
  const { T, fmt, fmtBreve } = QUIZ;

  const lotteria = (ps, xs) =>
    "(" + ps.map((p, i) => fmtBreve(p) + ": " + String(xs[i]).replace("-", "−")).join("; ") + ")";

  QUIZ.aggiungi({
    numero: 2,
    titolo: "Teoria dell'utilità",
    pdf: "lezione-02-utilita.pdf",
    sezioni: {
      "2.1.1": "Alternative",
      "2.1.2": "Preferenze",
      "2.2": "Rappresentare le preferenze: utilità ordinale",
      "2.2.1": "Le condizioni sono necessarie",
      "2.2.2": "Le condizioni sono sufficienti",
      "2.2.3": "L'utilità ordinale non è interpretabile",
      "2.3": "Le lotterie",
      "2.3.1": "Lotterie composte",
      "2.3.2": "Valore atteso",
      "2.3.3": "Utilità attesa",
      "2.4": "L'utilità di Von Neumann–Morgenstern",
      "2.4.1": "Necessità degli assiomi",
      "2.4.2": "Sufficienza: dimostrazione del teorema VNM",
      "2.5": "Il paradosso di Allais",
      "2.6": "Atteggiamento verso il rischio",
      "2.7.1": "Condivisione del rischio",
      "2.7.2": "Assicurazione",
      "2.8": "Riepilogo sulla teoria VNM",
      "2.9.1": "Lab: regole e impostazione",
      "2.9.2": "Lab: tiro casuale",
      "2.9.3": "Lab: hunt and target",
      "2.9.4": "Lab: la teoria della ricerca bayesiana",
      "2.9.5": "Lab: ricerca bayesiana per la battaglia navale",
      "2.9.6": "Lab: risultati misurati",
      "2.9.7": "Lab: analisi in teoria dell'informazione",
    },
    domande: [
      // ---------------------------------------------------------------- 2.1.1
      {
        sez: "2.1.1",
        q: "Quali due proprietà devono avere le alternative dell'insieme X tra cui un agente sceglie?",
        o: [
          "Mutuamente esclusive ed esaustive",
          "Finite e ordinate",
          "Indipendenti ed equiprobabili",
          "Complete e transitive",
        ],
        perche: "Se ne realizza <b>una sola</b> (mutuamente esclusive) e coprono <b>tutti</b> i casi (esaustive). Completezza e transitività sono proprietà delle preferenze, non delle alternative.",
      },
      {
        sez: "2.1.1",
        tipo: "numero",
        q: "Uno studente può seguire o no, liberamente, ciascuno di 3 corsi a scelta. Quante sono le alternative dell'insieme X?",
        ok: 8,
        tol: 0,
        perche: "Ogni corso si segue o no: 2<sup>3</sup> = 8 alternative, compresa “nessun corso”. Nell'esempio della lezione con 2 corsi (DL, AGT) erano 4: DL, AGT, entrambi, nessuno. Le opzioni non sono le alternative.",
      },
      // ---------------------------------------------------------------- 2.1.2
      {
        sez: "2.1.2",
        q: "Quando una relazione di preferenza ≽ è <b>completa</b>?",
        o: [
          "Quando per ogni coppia x, y vale x ≽ y oppure y ≽ x",
          "Quando x ≽ y e y ≽ z implicano x ≽ z",
          "Quando l'agente preferisce strettamente un'alternativa a tutte le altre",
          "Quando è definita su un insieme finito",
        ],
        perche: "Completezza = ogni coppia si può confrontare. La seconda opzione è la transitività.",
      },
      {
        sez: "2.1.2",
        trappola: true,
        q: "Che cosa <b>esclude</b> la completezza?",
        o: [
          "Che due alternative siano incomparabili (“non so dire”)",
          "Che due alternative siano indifferenti",
          "Che le preferenze cambino nel tempo",
          "Che ci siano più di due alternative",
        ],
        perche: "La completezza non obbliga a preferire strettamente: l'indifferenza x ∼ y è ammessa. Esclude solo il caso in cui l'agente non sa confrontare.",
      },
      {
        sez: "2.1.2",
        q: "Come si definisce la preferenza stretta x ≻ y a partire da ≽?",
        o: ["x ≽ y e non y ≽ x", "x ≽ y e y ≽ x", "x ≽ y oppure y ≽ x", "non x ≽ y"],
        perche: "x ≻ y se x è almeno buono quanto y ma non viceversa. “x ≽ y e y ≽ x” è l'indifferenza x ∼ y.",
      },
      {
        sez: "2.1.2",
        tipo: "vf",
        q: "Una preferenza è una <i>relazione di preferenza</i> se e solo se è completa e transitiva.",
        ok: true,
        perche: "È la definizione data a lezione.",
      },
      // ---------------------------------------------------------------- 2.2
      {
        sez: "2.2",
        q: "Che cosa significa che u : X → ℝ <b>rappresenta</b> la relazione ≽?",
        o: [
          "x ≽ y se e solo se u(x) ≥ u(y), per ogni x, y",
          "u(x) è la probabilità che l'agente scelga x",
          "u(x) misura di quanto l'agente preferisce x alle altre alternative",
          "x ≽ y implica u(x) = u(y)",
        ],
        perche: "La rappresentazione riproduce solo l'<b>ordine</b>: x almeno buono quanto y ⇔ u(x) almeno alto quanto u(y). L'agente si comporta <i>come se</i> massimizzasse u.",
      },
      {
        sez: "2.2",
        q: "Teorema 1 (rappresentazione ordinale): quale enunciato è corretto?",
        o: [
          "Se X è finito, ≽ è rappresentabile da una funzione di utilità se e solo se è completa e transitiva",
          "Ogni relazione completa e transitiva, su qualunque insieme X, è rappresentabile",
          "Se X è finito, ogni relazione su X è rappresentabile",
          "≽ è rappresentabile se e solo se soddisfa continuità e indipendenza",
        ],
        perche: "Serve X finito: su insiemi infiniti completezza e transitività non bastano. Continuità e indipendenza sono gli assiomi di VNM, per le lotterie.",
      },
      {
        sez: "2.2",
        tipo: "multi",
        q: "u rappresenta ≽ e assume anche valori negativi. Quali funzioni f danno una f ∘ u che rappresenta ancora ≽?",
        o: ["f(t) = t³", "f(t) = 2t + 5", "f(t) = e<sup>t</sup>", "f(t) = t²", "f(t) = −t", "f(t) = |t|"],
        ok: [0, 1, 2],
        perche: "Va bene qualunque f <b>strettamente crescente</b>: t³, 2t + 5, e<sup>t</sup>. t² e |t| non sono crescenti sui negativi (−3 diventa “meglio” di −1); −t inverte l'ordine. Per questo le utilità ordinali si dicono invarianti per trasformazioni crescenti.",
      },
      {
        sez: "2.2",
        q: "La lezione dice che l'agente si comporta “come se” massimizzasse u. Come va letta la relazione tra preferenza e utilità?",
        o: [
          "Un'alternativa ha utilità più alta perché è preferita, non è preferita perché ha utilità più alta",
          "Un'alternativa è preferita perché ha utilità più alta",
          "Preferenze e utilità sono due fenomeni indipendenti",
          "L'utilità misura il piacere che l'alternativa procura",
        ],
        perche: "L'utilità è una <b>descrizione</b> delle preferenze, non la loro causa. La frase torna nel riepilogo su VNM.",
      },
      // ---------------------------------------------------------------- 2.2.1
      {
        sez: "2.2.1",
        q: "Perché la transitività è una condizione <b>necessaria</b> per avere una funzione di utilità?",
        o: [
          "Perché un ciclo a ≻ b ≻ c ≻ a darebbe u(a) > u(b) > u(c) > u(a), cioè u(a) > u(a)",
          "Perché altrimenti l'insieme X sarebbe infinito",
          "Perché senza transitività non esistono lotterie",
          "Perché la funzione di utilità deve essere continua",
        ],
        perche: "I numeri reali sono ordinati transitivamente: un ciclo di preferenze non si può tradurre in numeri.",
      },
      {
        sez: "2.2.1",
        tipo: "numero",
        q: "Money pump: un agente ha le preferenze cicliche a ≻ b ≻ c ≻ a, possiede c ed è disposto a pagare ε per ogni scambio verso un'alternativa che preferisce. Dopo quanti scambi torna a possedere c? (Rispondi con il numero di scambi.)",
        ok: 3,
        tol: 0,
        perche: "c → b (paga ε), b → a (paga ε), a → c (paga ε): dopo 3 scambi è di nuovo al punto di partenza e ha pagato 3ε. Il giro si può ripetere all'infinito: chi viola la transitività si fa svuotare le tasche.",
      },
      {
        sez: "2.2.1",
        q: "Perché la completezza è una condizione necessaria per la rappresentazione?",
        o: [
          "Perché, dati due numeri reali u(x) e u(y), vale sempre u(x) ≥ u(y) oppure u(y) ≥ u(x)",
          "Perché ogni agente sa sempre che cosa preferisce",
          "Perché altrimenti non si potrebbero costruire le classi di indifferenza",
          "Perché lo richiede l'assioma di continuità",
        ],
        perche: "La completezza è “ereditata” dal fatto che l'ordine ≥ su ℝ è totale: se esiste u, ogni coppia è automaticamente confrontabile.",
      },
      // ---------------------------------------------------------------- 2.2.2
      {
        sez: "2.2.2",
        q: "Come si costruisce u nella dimostrazione della sufficienza del Teorema 1?",
        o: [
          "Si partiziona X in classi di indifferenza C₁ ≻ … ≻ C<sub>k</sub> e si pone u = k sulla classe migliore, k − 1 sulla successiva, …, 1 sull'ultima",
          "Si pone u(x) uguale al numero di alternative peggiori di x, senza raggruppare",
          "Si usa la probabilità q che rende x indifferente a una lotteria tra estremi",
          "Si sceglie u(x) a caso e la si corregge finché rispetta l'ordine",
        ],
        perche: "Completezza e transitività permettono di raggruppare le alternative indifferenti e di ordinare i gruppi; poi basta numerarli. La costruzione con q è quella del teorema VNM.",
      },
      {
        sez: "2.2.2",
        trappola: true,
        q: "Perché nel Teorema 1 serve l'ipotesi che X sia finito?",
        o: [
          "Perché con X infinito esistono preferenze complete e transitive non rappresentabili, come quelle lessicografiche su ℝ²",
          "Perché su un insieme infinito nessuna preferenza è transitiva",
          "Perché con X infinito l'indifferenza smette di essere transitiva",
          "Non serve: è un'ipotesi di comodo",
        ],
        perche: "Esempio classico: (a₁, a₂) ≽ (b₁, b₂) se a₁ > b₁, oppure a₁ = b₁ e a₂ ≥ b₂. È completa e transitiva ma non esiste nessuna u reale che la rappresenti. Con X finito il problema non si pone: le classi di indifferenza si contano e si numerano.",
      },
      // ---------------------------------------------------------------- 2.2.3
      {
        sez: "2.2.3",
        tipo: "multi",
        q: "Preferenze: a ≻ b ≻ c. Quali terne (u(a), u(b), u(c)) le rappresentano?",
        o: ["(−1, −2, −3)", "(30, 20, 10)", "(90, 2, 1)", "(1, 2, 3)", "(5, 5, 1)"],
        ok: [0, 1, 2],
        perche: "Va bene qualunque terna strettamente decrescente. (1, 2, 3) inverte l'ordine; (5, 5, 1) renderebbe a e b indifferenti.",
      },
      {
        sez: "2.2.3",
        tipo: "vf",
        q: "Con un'utilità ordinale, se u(a) − u(b) è molto più grande di u(b) − u(c), allora l'agente preferisce a a b molto più di quanto preferisca b a c.",
        ok: false,
        perche: "Le differenze di un'utilità ordinale non hanno significato: (30, 20, 10) e (90, 2, 1) rappresentano le stesse preferenze. Per dare significato all'intensità servono le lotterie e l'utilità cardinale di VNM.",
      },
      // ---------------------------------------------------------------- 2.3
      {
        sez: "2.3",
        q: "Perché per decidere in condizioni di incertezza non basta l'utilità ordinale?",
        o: [
          "Perché per confrontare un premio certo con una lotteria serve sapere quanto un premio intermedio sta tra quello migliore e quello peggiore",
          "Perché in presenza di incertezza le preferenze non sono transitive",
          "Perché le lotterie hanno infiniti esiti",
          "Perché l'utilità ordinale non è definita per premi monetari",
        ],
        perche: "Tra b certo e una lotteria 50/50 tra a e c, la scelta dipende da quanto b è “vicino” ad a o a c: serve un'utilità <b>cardinale</b>.",
      },
      // ---------------------------------------------------------------- 2.3.1
      {
        sez: "2.3.1",
        tipo: "numero",
        q: "L₁ = (0,9: −1 $; 0,1: 5 $), L₂ = (0,75: −1 $; 0,25: 2 $). La lotteria composta L<sub>c</sub> = (0,5: L₁; 0,5: L₂) equivale a una lotteria semplice. Che probabilità ha il premio <b>−1 $</b>?",
        ok: 0.825,
        tol: 0.0005,
        perche: "Si moltiplicano le probabilità lungo i rami e si sommano quelle che portano allo stesso premio: 0,5 × 0,9 + 0,5 × 0,75 = 0,825. Gli altri premi: 2 $ con 0,125 e 5 $ con 0,05.",
      },
      {
        sez: "2.3.1",
        q: "Su quale ipotesi si basa la riduzione di una lotteria composta a una semplice?",
        o: [
          "Che al giocatore interessi solo la distribuzione finale sui premi, non il modo in cui ci si arriva",
          "Che le due estrazioni siano dipendenti",
          "Che il giocatore sia neutrale al rischio",
          "Che i premi siano monetari",
        ],
        perche: "È un'assunzione di modello: grazie a essa basta studiare l'insieme ℒ delle lotterie semplici.",
      },
      // ---------------------------------------------------------------- 2.3.2
      {
        sez: "2.3.2",
        tipo: "numero",
        q: "Qual è il valore atteso di L = (0,3: 10; 0,2: 5; 0,1: 0; 0,4: −5)?",
        ok: 2,
        perche: "E(L) = 0,3·10 + 0,2·5 + 0,1·0 + 0,4·(−5) = 3 + 1 + 0 − 2 = 2. Giocando molte volte si vince in media 2.",
      },
      {
        sez: "2.3.2",
        trappola: true,
        q: "Paradosso di San Pietroburgo: si lancia una moneta finché non esce testa e, se esce al lancio k, si vincono 2<sup>k</sup> euro. Che cosa insegna?",
        o: [
          "Che il valore atteso non basta a decidere: è infinito, eppure nessuno pagherebbe più di poche decine di euro. Bisogna applicare l'utilità ai premi",
          "Che il valore atteso di quel gioco è 2 euro",
          "Che i giocatori sono amanti del rischio",
          "Che le probabilità di quel gioco non sommano a 1",
        ],
        perche: "Σ 2<sup>−k</sup> · 2<sup>k</sup> = Σ 1 = ∞. La soluzione è l'utilità attesa con una u concava: il guadagno in più vale sempre meno.",
      },
      // ---------------------------------------------------------------- 2.3.3
      {
        sez: "2.3.3",
        q: "Quando U : ℒ → ℝ è una funzione di <b>utilità attesa</b>?",
        o: [
          "Quando si può scrivere U(L) = Σ p<sub>i</sub> u(x<sub>i</sub>) per qualche funzione u sui premi",
          "Quando U(L) è uguale al valore atteso dei premi",
          "Quando U è crescente nelle probabilità dei premi migliori",
          "Quando U rappresenta una preferenza completa e transitiva su ℒ",
        ],
        perche: "La u sui premi si chiama funzione di utilità di <b>Bernoulli</b>. U è lineare nelle probabilità; il valore atteso è il caso particolare u(x) = x.",
      },
      {
        sez: "2.3.3",
        trappola: true,
        q: "Qual è la differenza tra u e U?",
        o: [
          "u è definita sui premi, U sulle lotterie e deve essere lineare nelle probabilità",
          "u è ordinale, U è cardinale, ma sono definite sugli stessi oggetti",
          "u si usa per i guadagni, U per le perdite",
          "Non c'è differenza: sono due nomi della stessa funzione",
        ],
        perche: "Non ogni U che rappresenta preferenze su ℒ ha forma di utilità attesa: il teorema VNM dice quando ce l'ha.",
      },
      // ---------------------------------------------------------------- 2.4
      {
        sez: "2.4",
        tipo: "multi",
        q: "Quali sono gli assiomi del teorema di Von Neumann–Morgenstern?",
        o: [
          "Ordine di preferenza (completezza e transitività)",
          "Continuità",
          "Indipendenza",
          "Avversione al rischio",
          "Monotonia nel denaro",
        ],
        ok: [0, 1, 2],
        perche: "Tre assiomi: ordine, continuità, indipendenza. L'atteggiamento verso il rischio non è un assioma: dipende dalla forma di u.",
      },
      {
        sez: "2.4",
        q: "Che cosa dice l'assioma di <b>continuità</b>?",
        o: [
          "Se L ≻ M ≻ N, esiste p ∈ [0,1] tale che pL + (1−p)N ∼ M",
          "Se L ≽ M, allora pL + (1−p)N ≽ pM + (1−p)N",
          "La funzione u è continua nei premi",
          "Piccole variazioni di probabilità danno piccole variazioni di preferenza",
        ],
        perche: "Non esistono premi “infinitamente” migliori di altri: un esito intermedio equivale sempre a una miscela dei due estremi. La seconda opzione è l'indipendenza.",
      },
      {
        sez: "2.4",
        q: "Che cosa dice l'assioma di <b>indipendenza</b>?",
        o: [
          "Per ogni N e p, L ≽ M se e solo se pL + (1−p)N ≽ pM + (1−p)N",
          "Le estrazioni delle lotterie sono indipendenti",
          "Le preferenze di un giocatore non dipendono da quelle degli altri",
          "Se L ≻ M ≻ N esiste una miscela di L e N equivalente a M",
        ],
        perche: "Un esito <b>comune</b> (N, con la stessa probabilità 1−p da entrambe le parti) non deve cambiare il confronto. È l'assioma che il paradosso di Allais mette in crisi.",
      },
      {
        sez: "2.4",
        q: "In che senso la rappresentazione VNM è unica?",
        o: [
          "A meno di trasformazioni affini: se U e V la rappresentano, U = aV + b con a > 0",
          "A meno di trasformazioni strettamente crescenti",
          "È unica: c'è una sola U possibile",
          "A meno di una costante moltiplicativa positiva",
        ],
        perche: "Molto più stretta dell'unicità ordinale: si possono scegliere solo l'origine (b) e l'unità di misura (a).",
      },
      {
        sez: "2.4",
        tipo: "multi",
        q: "U è una rappresentazione VNM di ≽. Quali di queste sono ancora rappresentazioni VNM della stessa ≽?",
        o: ["3U + 7", "U/2 − 1", "U³", "−U", "e<sup>U</sup>"],
        ok: [0, 1],
        perche: "Solo le trasformazioni affini con coefficiente positivo. U³ ed e<sup>U</sup> conservano l'ordine (rappresentano la stessa preferenza in senso ordinale) ma non la forma di utilità attesa; −U inverte l'ordine.",
      },
      {
        sez: "2.4",
        q: "L'utilità VNM è su una “scala a intervalli”. Che cosa ha senso dire?",
        o: [
          "Che il salto da a a b è il doppio del salto da b a c",
          "Che a vale il doppio di b",
          "Che a vale 0 in assoluto",
          "Nulla di quantitativo: conta solo l'ordine",
        ],
        perche: "Come per i gradi Celsius: i rapporti tra differenze sono invarianti per trasformazioni affini, i rapporti tra valori no.",
      },
      // ---------------------------------------------------------------- 2.4.1
      {
        sez: "2.4.1",
        tipo: "numero",
        q: "Con utilità attesa, u(L) = 10, u(M) = 4, u(N) = 0. Per quale p vale pL + (1−p)N ∼ M?",
        ok: 0.4,
        perche: "p = (u(M) − u(N)) / (u(L) − u(N)) = 4/10 = 0,4. È la costruzione con cui si dimostra che la continuità è necessaria.",
      },
      {
        sez: "2.4.1",
        q: "Nella dimostrazione che l'indipendenza è necessaria, che cosa succede al termine (1−p)u(N)?",
        o: [
          "Si cancella sottraendo u(L₁) − u(L₂), che resta uguale a p(u(L) − u(M))",
          "Diventa zero perché u(N) = 0 per convenzione",
          "Si somma ai due membri e cambia il confronto",
          "Viene trascurato perché piccolo",
        ],
        perche: "Per linearità dell'attesa il termine comune compare in entrambe le lotterie e si cancella: il segno di u(L₁) − u(L₂) è quello di u(L) − u(M).",
      },
      // ---------------------------------------------------------------- 2.4.2
      {
        sez: "2.4.2",
        q: "Nella dimostrazione del teorema VNM, come si definisce u(o<sub>i</sub>) per un esito intermedio?",
        o: [
          "È la probabilità q<sub>i</sub> che rende o<sub>i</sub> certo indifferente alla lotteria q<sub>i</sub>·o<sub>n</sub> + (1−q<sub>i</sub>)·o₁",
          "È la posizione di o<sub>i</sub> nell'ordine dal peggiore al migliore",
          "È la media tra u(o₁) = 0 e u(o<sub>n</sub>) = 1",
          "È il valore monetario di o<sub>i</sub>",
        ],
        perche: "Fissati u(peggiore) = 0 e u(migliore) = 1, l'utilità di un esito è la probabilità di vincere il premio migliore che lo rende indifferente. È una misura operativa: si può ottenere chiedendolo a una persona.",
      },
      {
        sez: "2.4.2",
        q: "Nella parte 2 della dimostrazione, a che cosa è equivalente ogni lotteria M?",
        o: [
          "A una lotteria sui soli due esiti estremi, che dà il migliore con probabilità U(M)",
          "Al suo valore atteso",
          "Al suo esito più probabile",
          "A una lotteria uniforme su tutti gli esiti",
        ],
        perche: "Sostituendo ogni esito con la lotteria tra estremi che gli è indifferente (continuità + indipendenza), M diventa U(M)·o<sub>n</sub> + (1 − U(M))·o₁. Tra lotterie di questa forma si preferisce quella con probabilità più alta del premio migliore.",
      },
      {
        sez: "2.4.2",
        tipo: "numero",
        q: "Esiti o₁ (peggiore, u = 0), o₂ (q₂ = 0,6), o₃ (migliore, u = 1). La lotteria M dà o₃ con probabilità 0,2, o₂ con 0,5 e o₁ con 0,3. Quanto vale U(M)?",
        ok: 0.5,
        perche: "U(M) = 0,2·1 + 0,5·0,6 + 0,3·0 = 0,5. M è indifferente alla lotteria che dà il premio migliore con probabilità 0,5.",
      },
      // ---------------------------------------------------------------- 2.5
      {
        sez: "2.5",
        q: "Paradosso di Allais: L = 1M certo, M = (0,89: 1M; 0,10: 5M; 0,01: 0), N = (0,89: 0; 0,11: 1M), O = (0,90: 0; 0,10: 5M). La maggior parte delle persone sceglie L e O. Perché è incompatibile con l'utilità attesa?",
        o: [
          "Perché L ≻ M dà 0,11·u(1M) > 0,10·u(5M) e O ≻ N dà il contrario: viola l'indipendenza",
          "Perché viola la transitività",
          "Perché le probabilità delle lotterie non sommano a 1",
          "Perché le persone sono neutrali al rischio",
        ],
        perche: "Le coppie (L, M) e (N, O) differiscono solo per un esito comune con probabilità 0,89 (1M nella prima coppia, 0 nella seconda): per l'indipendenza l'ordine deve restare lo stesso. Nessuna u giustifica entrambe le scelte.",
      },
      {
        sez: "2.5",
        q: "Che cosa insegna il paradosso di Allais sulla teoria VNM?",
        o: [
          "Che è normativa e non descrittiva: dice come si dovrebbe decidere per essere coerenti, non come decidono le persone",
          "Che è sbagliata e va abbandonata",
          "Che vale solo per premi piccoli",
          "Che le persone sono sempre amanti del rischio",
        ],
        perche: "L'effetto è il <i>certainty effect</i>: il salto da 0,99 a 1 pesa più di quello da 0,10 a 0,11. Da qui nascono teorie descrittive come la prospect theory.",
      },
      // ---------------------------------------------------------------- 2.6
      {
        sez: "2.6",
        trappola: true,
        q: "Quando una lotteria L = (p: x; 1−p: y) è <b>equa</b>?",
        o: [
          "Quando il suo valore atteso è nullo: px + (1−p)y = 0",
          "Quando p = 1/2",
          "Quando x = −y",
          "Quando l'utilità attesa è nulla",
        ],
        perche: "Le slide scrivono “L = px + (1−p)y = 0”: è il <b>valore atteso</b> a essere nullo, non la lotteria, che è una distribuzione. Una lotteria con p = 1/2 e x = −y è equa, ma non tutte le lotterie eque sono così.",
      },
      {
        sez: "2.6",
        tipo: "multi",
        q: "Quali associazioni tra forma di u e atteggiamento verso il rischio sono corrette?",
        o: [
          "u lineare (ax + b, a > 0) → neutrale al rischio",
          "u concava → avverso al rischio",
          "u convessa → amante del rischio",
          "u concava → amante del rischio",
          "u convessa → neutrale al rischio",
        ],
        ok: [0, 1, 2],
        perche: "La curvatura di u decide tutto: concava = avverso, lineare = neutrale, convessa = amante.",
      },
      {
        sez: "2.6",
        tipo: "vf",
        q: "Un giocatore strettamente avverso al rischio rifiuta qualunque lotteria equa.",
        ok: true,
        perche: "Con u strettamente concava, E[u(w + L)] < u(w + E[L]) = u(w): giocare è peggio che non giocare. Simmetricamente, un giocatore strettamente amante del rischio le accetta tutte.",
      },
      {
        sez: "2.6",
        q: "Per una u concava, che cosa dice la disuguaglianza di Jensen?",
        o: [
          "E[u(L)] ≤ u(E[L]): l'utilità del gioco è al più l'utilità del valore atteso incassato con certezza",
          "E[u(L)] ≥ u(E[L])",
          "E[u(L)] = u(E[L])",
          "u(E[L]) ≤ E[L]",
        ],
        perche: "È il motivo per cui concavità = avversione al rischio: l'avverso preferisce sempre il certo all'aleatorio con la stessa media.",
      },
      {
        sez: "2.6",
        q: "Che cos'è l'equivalente certo CE(L)?",
        o: [
          "Il premio certo che dà la stessa utilità della lotteria: u(CE) = E[u(L)]",
          "Il valore atteso della lotteria",
          "Il premio più probabile della lotteria",
          "La differenza tra valore atteso e utilità attesa",
        ],
        perche: "E[L] − CE(L) è il <b>premio per il rischio</b>: quanto si rinuncia per eliminare l'incertezza. Per un avverso al rischio è positivo.",
      },
      // ---------------------------------------------------------------- 2.7.1
      {
        sez: "2.7.1",
        tipo: "numero",
        q: "Risk sharing: due giocatori con u(x) = √x possiedono due attività indipendenti A₁ = A₂ = (0,5: 100; 0,5: 0). Formano un fondo comune e ciascuno ne possiede metà. Qual è l'utilità attesa di ciascuno? (Due decimali.)",
        ok: 2.5 + 0.5 * Math.sqrt(50),
        tol: 0.01,
        perche: "Metà del fondo vale 100, 50, 50, 0 nei quattro casi equiprobabili, quindi A<sub>m</sub> = (0,25: 100; 0,5: 50; 0,25: 0) e u = 0,25·10 + 0,5·√50 ≈ 2,5 + 3,54 = <b>6,04</b>, contro 5 dell'attività da sola.",
      },
      {
        sez: "2.7.1",
        q: "Perché il fondo comune conviene a entrambi i giocatori avversi al rischio?",
        o: [
          "Perché il valore atteso resta 50 ma la varianza si dimezza, e con u concava meno varianza a parità di media vuol dire più utilità",
          "Perché il valore atteso sale da 50 a 75",
          "Perché elimina del tutto il rischio",
          "Perché i giocatori diventano neutrali al rischio",
        ],
        perche: "Diversificazione: la varianza scende da 2500 a 1250. È il principio dei fondi comuni e delle mutue assicurative.",
      },
      // ---------------------------------------------------------------- 2.7.2
      {
        sez: "2.7.2",
        tipo: "numero",
        q: "Un giocatore con u(x) = √x possiede A = (0,5: 100; 0,5: 0) e nessun'altra ricchezza. Qual è il premio <b>massimo</b> P che pagherebbe per assicurarsi 100 con certezza?",
        ok: 75,
        perche: "Accetta se √(100 − P) ≥ 0,5·√100 = 5, cioè 100 − P ≥ 25, cioè P ≤ 75.",
      },
      {
        sez: "2.7.2",
        tipo: "numero",
        q: "Nella stessa situazione, una compagnia di assicurazione neutrale al rischio quale premio <b>minimo</b> richiede?",
        ok: 50,
        perche: "Le basta coprire il risarcimento atteso: 0,5 · 100 = 50. Il contratto conviene a entrambi per P ∈ [50, 75].",
      },
      {
        sez: "2.7.2",
        q: "Nell'esempio dell'assicurazione, che cosa rappresenta l'ampiezza dell'intervallo [50, 75]?",
        o: [
          "Il premio per il rischio E(A) − CE(A) = 50 − 25: il surplus che le parti si dividono",
          "Il valore atteso dell'attività",
          "La perdita attesa della compagnia",
          "L'equivalente certo dell'attività",
        ],
        perche: "√(100 − P) ≥ 5 equivale a 100 − P ≥ 25 = CE(A). L'assicurazione crea valore spostando il rischio da chi lo teme a chi gli è indifferente.",
      },
      {
        sez: "2.7.2",
        trappola: true,
        q: "Che cosa cambia se il giocatore ha anche un patrimonio iniziale w?",
        o: [
          "Le utilità vanno calcolate sulla ricchezza finale (w + 100 − P, w + 100, w) e il premio massimo cambia",
          "Nulla: il premio massimo resta 75",
          "Il giocatore diventa neutrale al rischio",
          "Il premio minimo della compagnia aumenta",
        ],
        perche: "La funzione di Bernoulli si applica alla ricchezza finale, non al guadagno della singola scommessa. Con u = √x, più si è ricchi meno si è avversi a un rischio della stessa entità.",
      },
      // ---------------------------------------------------------------- 2.8
      {
        sez: "2.8",
        tipo: "vf",
        q: "La teoria VNM descrive come le persone prendono davvero le decisioni rischiose.",
        ok: false,
        perche: "È una teoria <b>normativa</b> (massimizzare l'utilità attesa, molto usata in finanza ed economia), non descrittiva: il paradosso di Allais lo mostra.",
      },
      // ---------------------------------------------------------------- 2.9.1
      {
        sez: "2.9.1",
        tipo: "numero",
        q: "Nella battaglia navale del laboratorio (portaerei 5, corazzata 4, incrociatore 3, sommergibile 3, cacciatorpediniere 2), quante celle occupano in totale le navi?",
        ok: 17,
        tol: 0,
        perche: "5 + 4 + 3 + 3 + 2 = 17: è anche il minimo teorico di colpi per affondare tutto.",
      },
      {
        sez: "2.9.1",
        trappola: true,
        q: "Che difetto ha il generatore <code>create_random_disposition</code> fornito nel notebook?",
        o: [
          "L'ultima riga e l'ultima colonna non vengono mai occupate, perché np.random.randint esclude l'estremo superiore",
          "Le navi possono sovrapporsi",
          "Le navi possono uscire dalla griglia",
          "Genera sempre la stessa disposizione",
        ],
        perche: "Con randint(0, grid_size − 1) e randint(0, grid_size − length) gli estremi giusti non vengono mai estratti: il 19% del campo è acqua garantita. Gli estremi corretti sono randint(0, grid_size) e randint(0, grid_size − length + 1).",
      },
      // ---------------------------------------------------------------- 2.9.2
      {
        sez: "2.9.2",
        q: "Per sparare “a caso” gli appunti mescolano una volta la lista delle 100 celle invece di estrarre una cella e riprovare se è già colpita. Perché?",
        o: [
          "Stessa distribuzione, ma senza riprove: verso fine partita estrarre e riprovare diventa lento",
          "Perché le celle estratte a caso non sarebbero uniformi",
          "Perché così si colpiscono prima le celle centrali",
          "Perché np.random.choice non funziona sulle griglie",
        ],
        perche: "Mescolare e scorrere dà una permutazione casuale uniforme: è esattamente “a caso senza ripetizioni”.",
      },
      // ---------------------------------------------------------------- 2.9.3
      {
        sez: "2.9.3",
        q: "In modalità hunt basta sparare sulle celle a scacchiera (i + j pari). Perché?",
        o: [
          "Perché la nave più piccola occupa 2 celle adiacenti, e ogni coppia di celle adiacenti contiene una cella della scacchiera",
          "Perché le navi non possono stare sulle celle dispari",
          "Perché così si dimezza la probabilità di colpire",
          "Perché le navi sono sempre orizzontali",
        ],
        perche: "Si esplorano 50 celle invece di 100 con la garanzia di intercettare ogni nave.",
      },
      {
        sez: "2.9.3",
        trappola: true,
        q: "Nella strategia hunt and target, perché serve il controllo <code>if shot_grid[i, j]: continue</code> prima di sparare?",
        o: [
          "Perché una cella può finire nella pila dei bersagli due volte, o essere colpita nel frattempo: senza il controllo si conterebbero turni per colpi mai sparati",
          "Perché la pila contiene anche celle fuori dalla griglia",
          "Perché le celle della scacchiera sono già state colpite in modalità hunt",
          "Non serve: è solo un'ottimizzazione",
        ],
        perche: "Due colpi a segno vicini possono aggiungere la stessa cella adiacente: il risultato sarebbe gonfiato.",
      },
      // ---------------------------------------------------------------- 2.9.4
      {
        sez: "2.9.4",
        tipo: "numero",
        q: "Ricerca di un oggetto in n scatole: la scatola k ha probabilità a priori 0,4 e probabilità di rilevazione 0,5. La si ispeziona senza trovare nulla. Qual è la nuova probabilità che l'oggetto sia in k?",
        ok: 0.25,
        perche: "p' = (1 − q)p / (1 − pq) = 0,5·0,4 / (1 − 0,2) = 0,2/0,8 = 0,25. La probabilità scende ma non si azzera: l'oggetto potrebbe esserci e non essere stato visto.",
      },
      {
        sez: "2.9.4",
        q: "Dopo un'ispezione fallita della scatola k, come cambia la probabilità di un'altra scatola j?",
        o: [
          "Diventa p<sub>j</sub> / (1 − p<sub>k</sub>q<sub>k</sub>): aumenta",
          "Resta uguale",
          "Diminuisce come quella di k",
          "Diventa 1/(n − 1)",
        ],
        perche: "Il denominatore comune rinormalizza: la probabilità tolta a k si ridistribuisce in proporzione sulle altre.",
      },
      {
        sez: "2.9.4",
        q: "Con un solo oggetto e scatole indipendenti, quale strategia di ricerca è ottimale?",
        o: [
          "Ispezionare a ogni passo la scatola con l'indice p<sub>i</sub>q<sub>i</sub>/c<sub>i</sub> più alto",
          "Ispezionare la scatola con la probabilità a priori più alta, sempre la stessa",
          "Ispezionare le scatole in ordine casuale",
          "Ispezionare prima le scatole meno costose",
        ],
        perche: "L'indice è la probabilità di trovare l'oggetto per unità di costo, ricalcolata a ogni passo: la strategia golosa è ottima in questo caso. Nella battaglia navale le ipotesi non valgono (più bersagli, celle dipendenti) e diventa un'euristica.",
      },
      {
        sez: "2.9.4",
        q: "Come fu ritrovato il relitto del volo Air France 447, secondo il paper incluso nel materiale?",
        o: [
          "Con un prior costruito come miscela di tre distribuzioni, aggiornato con le ricerche fallite: nel 2011 la ricerca dal centro del posteriore lo trovò in una settimana",
          "Grazie al segnale dei localizzatori acustici delle scatole nere, nel 2009",
          "Esplorando sistematicamente il cerchio di 40 miglia attorno all'ultima posizione nota",
          "Con la ricerca a scacchiera della battaglia navale",
        ],
        perche: "Le ricerche fallite degli anni precedenti diventano ispezioni senza successo, tenendo conto anche della possibilità che i segnalatori non avessero funzionato.",
      },
      // ---------------------------------------------------------------- 2.9.5
      {
        sez: "2.9.5",
        tipo: "numero",
        q: "Prior della battaglia navale: per ogni cella si contano le pose valide di ciascuna delle 5 navi che la coprono, su campo vuoto. Quanto vale nella cella d'angolo (0, 0)?",
        ok: 10,
        tol: 0,
        perche: "Ogni nave ha esattamente 2 pose che coprono l'angolo (una orizzontale e una verticale): 5 × 2 = 10. Al centro si arriva a 2·(5+4+3+3+2) = 34: per questo conviene cominciare dal centro.",
      },
      {
        sez: "2.9.5",
        tipo: "multi",
        q: "Rispetto al modello “un oggetto in n scatole”, quali caratteristiche ha la battaglia navale?",
        o: [
          "Costi uniformi",
          "Rilevazione perfetta: se si spara su una nave la si colpisce",
          "Più bersagli (5 navi)",
          "Caselle non indipendenti: una nave occupa celle contigue",
          "Probabilità di falso negativo",
        ],
        ok: [0, 1, 2, 3],
        perche: "q<sub>i</sub> = 1 e c<sub>i</sub> = 1, ma con 5 bersagli e celle dipendenti l'ottimalità della strategia golosa non vale più. Il gioco è NP-difficile; la ricerca bayesiana resta un'ottima euristica.",
      },
      {
        sez: "2.9.5",
        q: "In modalità target, quali configurazioni si contano?",
        o: [
          "Solo quelle valide che passano per almeno un colpo a segno",
          "Tutte quelle valide, come in modalità hunt",
          "Solo quelle che passano per tutti i colpi a segno",
          "Solo quelle orizzontali",
        ],
        perche: "Si resta in modalità target finché c'è una nave colpita e non affondata. Una posa che passa per h colpi viene contata h volte: dopo due colpi allineati le pose lungo quella linea pesano doppio.",
      },
      {
        sez: "2.9.5",
        trappola: true,
        q: "Il conteggio somma le mappe delle singole navi. Perché le slide lo chiamano un'euristica?",
        o: [
          "Perché tratta ogni nave come se fosse sola: due navi possono “sovrapporsi” nel conteggio, mentre il calcolo esatto richiederebbe le disposizioni congiunte",
          "Perché usa numeri casuali",
          "Perché ignora i colpi a vuoto",
          "Perché non usa il teorema di Bayes",
        ],
        perche: "Le disposizioni congiunte compatibili con i dati sono troppe per essere contate a ogni turno (circa 2<sup>35</sup> all'inizio).",
      },
      {
        sez: "2.9.5",
        trappola: true,
        q: "Una versione che non tiene traccia delle navi affondate può entrare in ciclo infinito. Perché?",
        o: [
          "Una nave piccola affondata e circondata da celle esplorate lascia colpi “aperti” che nessuna posa con celle inesplorate spiega: il posteriore è tutto zero e argmax spara sempre su (0, 0)",
          "Perché le navi affondate tornano a galla",
          "Perché il prior diventa negativo",
          "Perché si esauriscono le celle della scacchiera",
        ],
        perche: "Con la traccia delle navi affondate un colpo aperto appartiene sempre a una nave a galla, la cui posa vera tocca celle inesplorate: il posteriore non può essere nullo.",
      },
      // ---------------------------------------------------------------- 2.9.6
      {
        sez: "2.9.6",
        q: "Quanti colpi in media impiega la ricerca bayesiana che tiene conto delle navi affondate, misurata nel laboratorio?",
        o: ["41–44", "54–56", "60–61", "95"],
        perche: "41,3 con il generatore del notebook, 44,3 con quello corretto: in linea con i 40–44 delle slide. Hunt and target ne impiega circa 61, il tiro casuale circa 95.",
      },
      {
        sez: "2.9.6",
        q: "Quanto vale, in turni risparmiati, l'informazione “nave affondata” nella ricerca bayesiana?",
        o: ["Circa 13 turni", "Circa 1 turno", "Circa 35 turni", "Nulla: il risultato è lo stesso"],
        perche: "Senza affondamenti la ricerca bayesiana fa circa 54–56 colpi, con gli affondamenti 41–44: ogni informazione disponibile va usata.",
      },
      // ---------------------------------------------------------------- 2.9.7
      {
        sez: "2.9.7",
        tipo: "numero",
        q: "Entropia di un colpo che colpisce con probabilità 17/100 e manca con 83/100: H = −Σ p log₂ p. Quanti bit? (Due decimali.)",
        ok: -(0.17 * Math.log2(0.17) + 0.83 * Math.log2(0.83)),
        tol: 0.01,
        perche: "H ≈ 0,66 bit. Con circa 35 bit di informazione in una disposizione servirebbero 35/0,66 ≈ 53 colpi “poco informati”; la ricerca bayesiana ne usa 40–44, cioè circa 0,8 bit per colpo.",
      },
      {
        sez: "2.9.7",
        trappola: true,
        q: "Le slide dicono che la ricerca bayesiana “migliora del 17% il limite” di 53 colpi. Qual è la lettura corretta?",
        o: [
          "53 non è un limite inferiore: è quanto servirebbe con tiri informativi come un tiro a caso. Un colpo porta al più 1 bit, quindi il vero limite è attorno a 35 colpi",
          "53 è il minimo teorico e la ricerca bayesiana lo viola per un errore di misura",
          "Il limite vero è 17 colpi e 53 è una stima superiore",
          "Il limite è 100 colpi",
        ],
        perche: "Un buon giocatore sceglie celle con probabilità di successo vicina a 1/2, dove l'entropia è massima (1 bit). Resta comunque il vincolo banale di almeno 17 colpi.",
      },
    ],

    generatori: [
      {
        nome: "valore-atteso",
        sez: "2.3.2",
        titolo: "Valore atteso di una lotteria",
        crea(r) {
          const n = r.int(3, 4);
          let resto = 10;
          const ps = [];
          for (let i = 0; i < n - 1; i++) {
            const p = r.int(1, resto - (n - 1 - i));
            ps.push(p);
            resto -= p;
          }
          ps.push(resto);
          const probs = ps.map((p) => p / 10);
          const xs = probs.map(() => r.int(-20, 50));
          const ev = probs.reduce((s, p, i) => s + p * xs[i], 0);
          return {
            tipo: "numero",
            q: "Qual è il valore atteso della lotteria L = " + lotteria(probs, xs) + "?",
            ok: ev,
            tol: 0.001,
            perche: "E(L) = " + probs.map((p, i) => fmtBreve(p) + "·" + String(xs[i]).replace("-", "−")).join(" + ") +
              " = <b>" + fmt(ev) + "</b>.",
            dati: { probs, xs },
          };
        },
      },
      {
        nome: "composta",
        sez: "2.3.1",
        titolo: "Riduzione di una lotteria composta",
        crea(r) {
          const p1 = r.int(1, 9) / 10, p2 = r.int(1, 9) / 10, s = r.int(1, 9) / 10;
          const a = r.int(1, 9) * 10, b = r.int(-5, 0), c = r.int(1, 5) * 100;
          const pa = s * p1 + (1 - s) * p2;
          return {
            tipo: "numero",
            q: "L₁ = " + lotteria([p1, 1 - p1], [a, b]) + ", L₂ = " + lotteria([p2, 1 - p2], [a, c]) +
              ". Nella lotteria composta (" + fmtBreve(s) + ": L₁; " + fmtBreve(1 - s) + ": L₂), che probabilità ha il premio <b>" + a + "</b>?",
            ok: pa,
            tol: 0.0005,
            perche: "Si moltiplicano le probabilità lungo i rami e si sommano quelle che portano ad " + a + ": " +
              fmtBreve(s) + "·" + fmtBreve(p1) + " + " + fmtBreve(1 - s) + "·" + fmtBreve(p2) + " = <b>" + QUIZ.decimale(pa, 4) + "</b>.",
            dati: { p1, p2, s },
          };
        },
      },
      {
        nome: "equivalente-certo",
        sez: "2.6",
        titolo: "Utilità attesa ed equivalente certo con u = √x",
        crea(r) {
          const radici = r.shuffle([0, 1, 2, 3, 4, 5, 6, 8, 10, 12]).slice(0, 2);
          const p = r.int(1, 9) / 10;
          const xs = radici.map((z) => z * z);
          const eu = p * radici[0] + (1 - p) * radici[1];
          const ce = eu * eu;
          const chiediCE = r.next() < 0.5;
          return {
            tipo: "numero",
            q: "Un giocatore con u(x) = √x valuta la lotteria L = " + lotteria([p, 1 - p], xs) + ". Quanto vale " +
              (chiediCE ? "il suo <b>equivalente certo</b> CE(L)?" : "la sua <b>utilità attesa</b> E[u(L)]?"),
            ok: chiediCE ? ce : eu,
            tol: chiediCE ? 0.01 : 0.001,
            perche: "E[u(L)] = " + fmtBreve(p) + "·√" + xs[0] + " + " + fmtBreve(1 - p) + "·√" + xs[1] + " = " + QUIZ.decimale(eu, 3) +
              ". L'equivalente certo risolve √CE = E[u(L)], quindi CE = " + QUIZ.decimale(eu, 3) + "² = " + QUIZ.decimale(ce, 2) +
              ", minore del valore atteso " + QUIZ.decimale(p * xs[0] + (1 - p) * xs[1], 2) + ": il giocatore è avverso al rischio.",
            dati: { p, xs, chiediCE },
          };
        },
      },
      {
        nome: "assicurazione",
        sez: "2.7.2",
        titolo: "Premio di assicurazione",
        crea(r) {
          const rad = r.pick([10, 20, 30, 40, 50]);
          const X = rad * rad;
          const q = r.int(2, 8) / 10;
          const massimo = X - Math.pow(q * rad, 2);
          const minimo = (1 - q) * X;
          const chiediMax = r.next() < 0.5;
          return {
            tipo: "numero",
            q: "Un giocatore con u(x) = √x e nessun'altra ricchezza possiede un'attività che vale " + X +
              " con probabilità " + fmtBreve(q) + " e 0 altrimenti. Un'assicurazione gli garantisce " + X +
              " con certezza in cambio di un premio P. " +
              (chiediMax ? "Qual è il premio <b>massimo</b> che il giocatore accetta?" :
                "Una compagnia neutrale al rischio quale premio <b>minimo</b> richiede?"),
            ok: chiediMax ? massimo : minimo,
            tol: 0.01,
            perche: (chiediMax
              ? "Accetta se √(" + X + " − P) ≥ " + fmtBreve(q) + "·√" + X + " = " + QUIZ.decimale(q * rad, 2) +
                ", cioè " + X + " − P ≥ " + QUIZ.decimale(q * rad * q * rad, 2) + ": P ≤ <b>" + QUIZ.decimale(massimo, 2) + "</b>."
              : "Il risarcimento atteso è " + fmtBreve(1 - q) + " · " + X + " = <b>" + QUIZ.decimale(minimo, 2) + "</b>: alla compagnia basta coprirlo.") +
              " Il contratto conviene a entrambi per P tra " + QUIZ.decimale(minimo, 2) + " e " + QUIZ.decimale(massimo, 2) + ".",
            dati: { X, q, chiediMax },
          };
        },
      },
      {
        nome: "continuita",
        sez: "2.4.1",
        titolo: "La probabilità dell'assioma di continuità",
        crea(r) {
          const uN = r.int(0, 5), uM = uN + r.int(1, 10), uL = uM + r.int(1, 10);
          const p = (uM - uN) / (uL - uN);
          return {
            tipo: "numero",
            q: "Con utilità attesa, u(L) = " + uL + ", u(M) = " + uM + ", u(N) = " + uN +
              ". Per quale p vale pL + (1−p)N ∼ M?",
            ok: p,
            perche: "p = (u(M) − u(N)) / (u(L) − u(N)) = " + (uM - uN) + "/" + (uL - uN) + " = <b>" + fmt(p) + "</b>.",
            dati: { uL, uM, uN },
          };
        },
      },
      {
        nome: "bayes-ricerca",
        sez: "2.9.4",
        titolo: "Aggiornamento dopo una ricerca fallita",
        crea(r) {
          const pk = r.int(1, 8) / 10, qk = r.int(1, 10) / 10, pj = r.int(1, Math.round((1 - pk) * 10)) / 10;
          const den = 1 - pk * qk;
          const altra = r.next() < 0.5;
          const ok = altra ? pj / den : ((1 - qk) * pk) / den;
          return {
            tipo: "numero",
            q: "La scatola k ha probabilità " + fmtBreve(pk) + " di contenere l'oggetto e probabilità di rilevazione " +
              fmtBreve(qk) + "; un'altra scatola j ha probabilità " + fmtBreve(pj) +
              ". Si ispeziona k senza trovare nulla. Qual è la nuova probabilità della scatola <b>" + (altra ? "j" : "k") + "</b>?",
            ok,
            tol: 0.001,
            perche: "La probabilità di non trovare nulla è 1 − " + fmtBreve(pk) + "·" + fmtBreve(qk) + " = " + QUIZ.decimale(den, 3) + ". " +
              (altra ? "Per j: " + fmtBreve(pj) + " / " + QUIZ.decimale(den, 3)
                : "Per k: (1 − " + fmtBreve(qk) + ")·" + fmtBreve(pk) + " / " + QUIZ.decimale(den, 3)) +
              " = <b>" + QUIZ.decimale(ok, 4) + "</b>.",
            dati: { pk, qk, pj, altra },
          };
        },
      },
      {
        nome: "trasformazione",
        sez: "2.2",
        titolo: "Trasformazioni di un'utilità ordinale",
        crea(r) {
          const conNegativi = r.next() < 0.5;
          const u = conNegativi ? [r.int(1, 4), -r.int(1, 3), -r.int(4, 8)] : [r.int(7, 9), r.int(4, 6), r.int(1, 3)];
          const fs = [
            { f: "f(t) = t³", ok: true, motivo: "t³ è strettamente crescente su tutto ℝ" },
            { f: "f(t) = 5t − 2", ok: true, motivo: "è strettamente crescente (coefficiente positivo)" },
            { f: "f(t) = e<sup>t</sup>", ok: true, motivo: "l'esponenziale è strettamente crescente" },
            { f: "f(t) = −2t", ok: false, motivo: "è decrescente: inverte l'ordine" },
            { f: "f(t) = t²", ok: !conNegativi, motivo: conNegativi ? "sui negativi t² è decrescente: (−8)² > (−1)² inverte l'ordine" : "sui valori positivi t² è strettamente crescente" },
            { f: "f(t) = |t|", ok: !conNegativi, motivo: conNegativi ? "sui negativi |t| è decrescente" : "sui valori positivi |t| = t" },
          ];
          const s = r.pick(fs);
          return {
            tipo: "vf",
            q: "Le preferenze sono a ≻ b ≻ c e u(a), u(b), u(c) = " + u.map((x) => String(x).replace("-", "−")).join(", ") +
              ". La funzione " + s.f + " applicata a u rappresenta ancora le stesse preferenze.",
            ok: s.ok,
            perche: "f ∘ u rappresenta ≽ se f è strettamente crescente <i>sui valori che u assume</i>: qui " + s.motivo + ".",
            dati: { u, f: s.f },
          };
        },
      },
      {
        nome: "rischio",
        sez: "2.6",
        titolo: "Atteggiamento verso il rischio",
        crea(r) {
          const us = [
            { u: "u(x) = √x", a: 0, perche: "√x è concava" },
            { u: "u(x) = ln(1 + x)", a: 0, perche: "il logaritmo è concavo" },
            { u: "u(x) = 1 − e<sup>−x</sup>", a: 0, perche: "1 − e<sup>−x</sup> è concava" },
            { u: "u(x) = 3x + 2", a: 1, perche: "è lineare" },
            { u: "u(x) = x/10", a: 1, perche: "è lineare" },
            { u: "u(x) = x² (x ≥ 0)", a: 2, perche: "x² è convessa" },
            { u: "u(x) = e<sup>x</sup>", a: 2, perche: "l'esponenziale è convesso" },
          ];
          const s = r.pick(us);
          return {
            tipo: "scelta",
            q: "Un giocatore ha funzione di Bernoulli " + s.u + ". Che atteggiamento ha verso il rischio?",
            o: ["Avverso al rischio", "Neutrale al rischio", "Amante del rischio"],
            ok: s.a,
            ordine: true,
            perche: s.perche + ": concava → avverso (rifiuta le lotterie eque), lineare → neutrale, convessa → amante.",
            dati: { u: s.u },
          };
        },
      },
    ],
  });
})();
