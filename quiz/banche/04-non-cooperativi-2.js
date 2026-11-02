// Lezione 4 — Esistenza e complessità degli equilibri, equilibri correlati, apprendimento.
(function () {
  const { T, M, fmt, fmtBreve } = QUIZ;
  const bm = T.bimatrice;
  const ATTR = bm(["Go", "Stop"], ["Go", "Stop"], [[-10, 5], [0, -1]], [[-10, 0], [5, -1]]);
  const distr = (p, righe, colonne) => bm(righe, colonne, p.map((r) => r.map((x) => fmtBreve(x))));

  QUIZ.aggiungi({
    numero: 4,
    titolo: "Equilibri e apprendimento",
    pdf: "lezione-04-non-cooperativi-2.pdf",
    sezioni: {
      "4.1": "Esistenza dell'equilibrio di Nash misto",
      "4.1.1": "Il teorema del punto fisso di Brouwer",
      "4.1.2": "La costruzione di Nash",
      "4.2.1": "Equilibri misti: PPAD-completezza",
      "4.2.2": "Equilibri puri: NP-difficoltà",
      "4.2.3": "Il quadro complessivo",
      "4.3.1": "L'intuizione: il semaforo",
      "4.3.2": "Equilibri correlati: definizione",
      "4.3.3": "Le disuguaglianze nell'esempio",
      "4.3.4": "Calcolo con la programmazione lineare",
      "4.4": "Altri concetti di soluzione",
      "4.5": "Apprendimento nei giochi",
      "4.5.1": "Fictitious play",
      "4.5.2": "Regret matching",
      "4.6.1": "Lab: equilibri correlati con linprog",
      "4.6.2": "Lab: fictitious play",
      "4.6.3": "Lab: regret matching",
    },
    domande: [
      // ---------------------------------------------------------------- 4.1
      {
        sez: "4.1",
        q: "Qual è l'idea della dimostrazione del teorema di Nash?",
        o: [
          "Ridurre l'esistenza di un equilibrio misto all'esistenza di un punto fisso di una funzione continua",
          "Costruire l'equilibrio con un programma lineare",
          "Eliminare iterativamente le strategie dominate fino a un solo profilo",
          "Mostrare che ogni gioco ha un punto di sella",
        ],
        perche: "Si costruisce f : S → S con f(σ) = σ esattamente quando σ è un equilibrio, e si applica il teorema di Brouwer.",
      },
      // ---------------------------------------------------------------- 4.1.1
      {
        sez: "4.1.1",
        q: "Che cosa afferma il teorema del punto fisso di Brouwer?",
        o: [
          "Ogni funzione continua da un insieme euclideo compatto e convesso in sé stesso ha un punto x₀ con f(x₀) = x₀",
          "Ogni funzione continua su ℝ ha un punto fisso",
          "Ogni funzione da un insieme finito in sé stesso ha un punto fisso",
          "Ogni funzione crescente su [0, 1] ha un unico punto fisso",
        ],
        perche: "Tre ipotesi sull'insieme (compatto, cioè chiuso e limitato, e convesso) e una sulla funzione (continua). Il punto fisso esiste ma non è detto che sia unico.",
      },
      {
        sez: "4.1.1",
        q: "f(x) = x² sull'intervallo aperto (0, 1) non ha punti fissi. Quale ipotesi di Brouwer manca?",
        o: ["L'insieme non è chiuso", "L'insieme non è limitato", "L'insieme non è convesso", "La funzione non è continua"],
        perche: "I punti fissi di x² sono 0 e 1, entrambi esclusi dall'aperto. (0, 1) è limitato e convesso, e x² è continua.",
      },
      {
        sez: "4.1.1",
        q: "Una rotazione di un anello attorno al suo centro non ha punti fissi. Quale ipotesi di Brouwer manca?",
        o: ["L'anello non è convesso", "L'anello non è limitato", "L'anello non è chiuso", "La rotazione non è continua"],
        perche: "Il punto fisso della rotazione sarebbe il centro, che non appartiene all'anello: l'anello ha un “buco”, quindi non è convesso.",
      },
      {
        sez: "4.1.1",
        q: "f(x) = x + 0,1 su tutto ℝ non ha punti fissi. Quale ipotesi di Brouwer manca?",
        o: ["ℝ non è limitato", "ℝ non è chiuso", "ℝ non è convesso", "f non è continua"],
        perche: "Il grafico è una retta parallela alla bisettrice y = x e non la incontra mai. ℝ è chiuso e convesso, ma non limitato, quindi non compatto.",
      },
      // ---------------------------------------------------------------- 4.1.2
      {
        sez: "4.1.2",
        q: "Perché l'insieme S = S₁ × … × S<sub>n</sub> dei profili di strategie miste soddisfa le ipotesi di Brouwer?",
        o: [
          "Ogni S<sub>i</sub> è un simplesso standard (compatto e convesso) e il prodotto di compatti convessi è compatto e convesso",
          "Perché è un insieme finito",
          "Perché contiene sempre un equilibrio puro",
          "Perché è un sottoinsieme di ℝ",
        ],
        perche: "S<sub>i</sub> = {x ∈ ℝ<sup>|A<sub>i</sub>|</sup> : x ≥ 0, 1<sup>T</sup>x = 1}. Le slide dicono anche “chiuso”, ma in ℝ<sup>d</sup> compatto implica già chiuso: ciò che serve è compatto e convesso.",
      },
      {
        sez: "4.1.2",
        q: "Perché nella costruzione di Nash non si usa direttamente la best response come funzione f?",
        o: [
          "Perché la best response può avere più valori (non è una funzione) e può essere discontinua",
          "Perché la best response non esiste sempre",
          "Perché la best response porta sempre a strategie pure",
          "Perché la best response non è definita per strategie miste",
        ],
        perche: "Brouwer richiede una funzione continua. Si usa invece il “guadagno” g, che è continuo.",
      },
      {
        sez: "4.1.2",
        q: "Nella costruzione di Nash, che cosa misura g(a<sub>i</sub><sup>j</sup>, σ) = max{0, u<sub>i</sub>(a<sub>i</sub><sup>j</sup>, σ<sub>−i</sub>) − u<sub>i</sub>(σ)}?",
        o: [
          "Quanto guadagnerebbe i passando dalla sua strategia mista all'azione pura a<sub>i</sub><sup>j</sup> (0 se non guadagna nulla)",
          "La probabilità che i giochi l'azione a<sub>i</sub><sup>j</sup>",
          "Il rimpianto cumulato dell'azione a<sub>i</sub><sup>j</sup>",
          "La perdita di i se gli altri deviano",
        ],
        perche: "f sposta probabilità verso le azioni che fanno guadagnare: σ'<sub>i,aj</sub> = (σ<sub>i,aj</sub> + g(a<sub>i</sub><sup>j</sup>, σ)) / Σ<sub>k</sub>(σ<sub>i,ak</sub> + g(a<sub>i</sub><sup>k</sup>, σ)).",
      },
      {
        sez: "4.1.2",
        q: "Come si dimostra che un punto fisso di f è un equilibrio (il passaggio che le slide non dimostrano)?",
        o: [
          "u<sub>i</sub>(σ) è una media pesata delle utilità delle azioni del supporto, quindi almeno una ha g = 0; dal punto fisso segue che la somma G<sub>i</sub> dei guadagni è 0, e nessuna azione pura migliora",
          "Ogni punto fisso ha tutti i g positivi",
          "Per il teorema minimax",
          "Perché f è iniettiva",
        ],
        perche: "Al punto fisso σ<sub>i,aj</sub>G<sub>i</sub> = g(a<sub>i</sub><sup>j</sup>, σ). Per un'azione del supporto con g = 0 si ha σ<sub>i,aj</sub> > 0, quindi G<sub>i</sub> = 0.",
      },
      {
        sez: "4.1.2",
        tipo: "vf",
        trappola: true,
        q: "Per applicare Brouwer, f deve essere suriettiva (“su” tutto S).",
        ok: false,
        perche: "Basta che f mandi S <i>in</i> sé stesso (into), non <i>su</i> (onto). Le slide scrivono “onto”: è un refuso, come il nome “Brower” al posto di Brouwer.",
      },
      // ---------------------------------------------------------------- 4.2.1
      {
        sez: "4.2.1",
        q: "Qual è la complessità di trovare un equilibrio di Nash misto?",
        o: ["PPAD-completo", "NP-completo", "Polinomiale con la programmazione lineare", "Indecidibile"],
        perche: "La costruzione di Nash mostra che sta in PPAD (non è più difficile di un punto fisso); una riduzione elaborata mostra il contrario. Insieme: PPAD-completo.",
      },
      {
        sez: "4.2.1",
        q: "In che cosa consiste il problema End of Line, rappresentativo di PPAD?",
        o: [
          "Dato un grafo implicito con 2<sup>n</sup> nodi di grado entrante e uscente al più 1 (circuiti S e P) e una sorgente s, trovare un pozzo",
          "Trovare il cammino più lungo in un grafo",
          "Decidere se un grafo ha un ciclo hamiltoniano",
          "Trovare l'ultimo nodo in ordine topologico",
        ],
        perche: "I nodi non sono elencati: si conoscono solo le funzioni successore S e predecessore P.",
      },
      {
        sez: "4.2.1",
        q: "Perché in End of Line una soluzione esiste sempre, eppure il problema è difficile?",
        o: [
          "Seguendo i successori da s si arriva per forza a un pozzo (i nodi sono finiti e non si ripetono), ma la linea può essere lunga in modo esponenziale",
          "Perché il pozzo è sempre il nodo 2<sup>n</sup>",
          "Perché la soluzione esiste solo se n è pari",
          "Perché i circuiti S e P sono casuali",
        ],
        perche: "È lo stesso tipo di difficoltà di Nash: si sa che la soluzione c'è, non si sa trovarla in fretta.",
      },
      {
        sez: "4.2.1",
        q: "Che cosa afferma il lemma di Sperner?",
        o: [
          "In un reticolo triangolato con il bordo colorato secondo la regola, qualunque colorazione interna produce un numero dispari di triangoli tricromatici",
          "Ogni triangolazione si può colorare con 3 colori",
          "Ogni triangolazione ha esattamente un triangolo tricromatico",
          "Trovare un triangolo tricromatico è polinomiale",
        ],
        perche: "È la controparte discreta di Brouwer. Lo si dimostra con un cammino attraverso le “porte” rosso-giallo, che può finire solo in un triangolo tricromatico: un End of Line.",
      },
      {
        sez: "4.2.1",
        q: "Come va letta la catena EoL ≤<sub>p</sub> Sperner ≤<sub>p</sub> Brouwer ≤<sub>p</sub> Nash?",
        o: [
          "X ≤<sub>p</sub> Y vuol dire che X si riduce a Y: Nash è almeno difficile quanto End of Line, cioè PPAD-difficile",
          "Nash è più facile di End of Line",
          "Tutti i problemi della catena sono polinomiali",
          "Nash si riduce a End of Line, quindi sta in P",
        ],
        perche: "Chi sa risolvere Y sa risolvere X. Questa catena dà la difficoltà; la costruzione di Nash con Brouwer dà l'appartenenza a PPAD.",
      },
      // ---------------------------------------------------------------- 4.2.2
      {
        sez: "4.2.2",
        q: "Da quale problema si riduce per dimostrare che trovare un equilibrio di Nash <b>puro</b> è NP-difficile?",
        o: ["3-colorabilità di un grafo", "End of Line", "Programmazione lineare", "Commesso viaggiatore"],
        perche: "Si usano i giochi su grafo: i giocatori sono i nodi e il payoff dipende solo dai vicini.",
      },
      {
        sez: "4.2.2",
        q: "Il primo tentativo (azioni R, G, B; +10 senza conflitti, −10 con conflitti) che cosa dimostra?",
        o: [
          "Solo che trovare l'equilibrio di benessere massimo è NP-difficile: anche se il grafo non è 3-colorabile un equilibrio c'è",
          "Che trovare un equilibrio puro qualsiasi è NP-difficile",
          "Che il gioco non ha mai equilibri",
          "Che il problema è PPAD-completo",
        ],
        perche: "Serve un gioco che abbia un equilibrio puro <i>se e solo se</i> il grafo è 3-colorabile: per questo si aggiunge lo sfidante.",
      },
      {
        sez: "4.2.2",
        q: "Nella costruzione con il nodo sfidante, perché se il grafo non è 3-colorabile non esiste un equilibrio puro?",
        o: [
          "Un nodo in conflitto preferisce copiare lo sfidante (0 > −10), ma se qualcuno lo copia lo sfidante cambia lettera (+10 > −10), e chi giocava la lettera non copia più (−5 < 0): nessun profilo è stabile",
          "Perché lo sfidante ha una strategia dominante",
          "Perché i nodi non hanno best response",
          "Perché il gioco diventa a somma zero",
        ],
        perche: "Se invece il grafo è 3-colorabile, tutti giocano una colorazione corretta (+10) e lo sfidante una lettera che nessuno copia (+10): è un equilibrio.",
      },
      {
        sez: "4.2.2",
        tipo: "vf",
        q: "Per il grafo completo K₄ il gioco con il nodo sfidante ha un equilibrio di Nash puro.",
        ok: false,
        perche: "K₄ non è 3-colorabile. Verificato con una ricerca esaustiva su tutti i profili: il triangolo e il ciclo da 4 nodi hanno un equilibrio puro, K₄ no.",
      },
      {
        sez: "4.2.2",
        trappola: true,
        q: "Se un gioco è dato in forma normale esplicita (la tabella completa), quanto costa trovare un equilibrio puro?",
        o: [
          "È facile: si controlla ogni cella, in tempo polinomiale nella dimensione della tabella. La NP-difficoltà vale per le rappresentazioni compatte come i giochi su grafo",
          "È NP-difficile anche in quel caso",
          "È PPAD-completo",
          "È impossibile in generale",
        ],
        perche: "Con |V| nodi e 5 azioni la tabella avrebbe 5<sup>|V|</sup>·2 celle; il gioco su grafo si descrive con poche regole locali. La difficoltà è relativa alla descrizione compatta.",
      },
      // ---------------------------------------------------------------- 4.2.3
      {
        sez: "4.2.3",
        tipo: "multi",
        q: "Quali affermazioni sulla complessità sono corrette?",
        o: [
          "Trovare un equilibrio di Nash misto è PPAD-completo",
          "Trovare un equilibrio di Nash puro è NP-difficile",
          "Trovare l'equilibrio che massimizza il benessere sociale è NP-difficile",
          "Un equilibrio correlato si trova con un programma lineare",
          "Trovare un equilibrio di Nash misto è NP-completo",
        ],
        ok: [0, 1, 2, 3],
        perche: "Gli equilibri correlati sono più facili: i vincoli sono lineari nelle probabilità. Nash misto è PPAD-completo, non NP-completo (una soluzione esiste sempre, quindi non ha senso come problema di decisione).",
      },
      {
        sez: "4.2.3",
        q: "Che conseguenza trae la lezione dai risultati di complessità?",
        o: [
          "Se calcolare un equilibrio è difficile per un algoritmo centralizzato, non ci si può aspettare che agenti autonomi lo raggiungano da soli nei giochi generici",
          "Che gli equilibri di Nash non esistono nei giochi grandi",
          "Che conviene usare solo strategie pure",
          "Che la teoria dei giochi non si applica ai problemi reali",
        ],
        perche: "È la motivazione per gli equilibri correlati e per l'apprendimento.",
      },
      // ---------------------------------------------------------------- 4.3.1
      {
        sez: "4.3.1",
        tipo: "numero",
        q: "Gioco dell'attraversamento" + ATTR + "All'equilibrio misto ciascuno gioca Go con probabilità 3/8. Con che probabilità le due auto si scontrano (Go, Go)?",
        ok: 9 / 64,
        tol: 0.001,
        perche: "(3/8)·(3/8) = 9/64 ≈ 0,14. A quell'equilibrio ciascuno ottiene −5/8: equo ma pessimo.",
      },
      {
        sez: "4.3.1",
        tipo: "numero",
        q: "Nell'attraversamento, un semaforo raccomanda (Go, Stop) con probabilità 1/2 e (Stop, Go) con probabilità 1/2. Se entrambi seguono la raccomandazione, qual è il payoff atteso di ciascuno?",
        ok: 2.5,
        perche: "½·5 + ½·0 = 2,5 a testa, molto meglio di −5/8 dell'equilibrio misto.",
      },
      {
        sez: "4.3.1",
        q: "Perché a nessuno conviene disobbedire al semaforo, assumendo che l'altro lo segua?",
        o: [
          "Chi riceve Stop sa che l'altro passa: passando prenderebbe −10 invece di 0. Chi riceve Go sa che l'altro si ferma: fermandosi prenderebbe −1 invece di 5",
          "Perché il semaforo punisce chi disobbedisce",
          "Perché Stop è una strategia dominante",
          "Perché il gioco è a somma zero",
        ],
        perche: "La raccomandazione porta informazione su che cosa farà l'altro: è questo che rende stabile un equilibrio correlato.",
      },
      // ---------------------------------------------------------------- 4.3.2
      {
        sez: "4.3.2",
        q: "Qual è la definizione di equilibrio correlato?",
        o: [
          "Una distribuzione p sui profili tale che per ogni i e ogni a<sub>i</sub>, a'<sub>i</sub>: Σ<sub>a−i</sub> p(a<sub>i</sub>, a<sub>−i</sub>)u<sub>i</sub>(a<sub>i</sub>, a<sub>−i</sub>) ≥ Σ<sub>a−i</sub> p(a<sub>i</sub>, a<sub>−i</sub>)u<sub>i</sub>(a'<sub>i</sub>, a<sub>−i</sub>)",
          "Un profilo di strategie miste indipendenti in cui ognuno gioca una best response",
          "Una distribuzione sui profili che massimizza il benessere",
          "Una distribuzione p con Σ p(a'<sub>i</sub>, a<sub>−i</sub>)u<sub>i</sub>(a'<sub>i</sub>, a<sub>−i</sub>) ≤ Σ p(a<sub>i</sub>, a<sub>−i</sub>)u<sub>i</sub>(a<sub>i</sub>, a<sub>−i</sub>)",
        ],
        perche: "Dato che il dispositivo raccomanda a<sub>i</sub>, seguire la raccomandazione è almeno buono quanto passare a qualunque a'<sub>i</sub>. La probabilità è la <b>stessa</b>, p(a<sub>i</sub>, a<sub>−i</sub>), da entrambe le parti.",
      },
      {
        sez: "4.3.2",
        tipo: "vf",
        q: "Ogni equilibrio di Nash misto è anche un equilibrio correlato.",
        ok: true,
        perche: "Basta prendere p(a) = ∏<sub>j</sub> σ<sub>j</sub>(a<sub>j</sub>). Da qui segue anche che ogni gioco finito ha un equilibrio correlato.",
      },
      {
        sez: "4.3.2",
        tipo: "vf",
        q: "Ogni equilibrio correlato è un equilibrio di Nash.",
        ok: false,
        perche: "Il semaforo è un equilibrio correlato ma non il prodotto di due strategie indipendenti: un prodotto con marginali (½, ½) darebbe probabilità ¼ anche a (Go, Go).",
      },
      // ---------------------------------------------------------------- 4.3.3
      {
        sez: "4.3.3",
        q: "Nell'attraversamento, la condizione per il giocatore 1 quando gli si raccomanda Go è p(G,G)·(−10) + p(G,S)·5 ≥ p(G,G)·0 + p(G,S)·(−1). A che cosa equivale?",
        o: ["p(G,S) ≥ (5/3)·p(G,G)", "p(G,S) ≥ (3/5)·p(G,G)", "p(G,G) ≥ (5/3)·p(G,S)", "p(G,S) ≥ p(G,G)"],
        perche: "6·p(G,S) ≥ 10·p(G,G), cioè p(G,S) ≥ 5/3·p(G,G): passare deve essere sicuro abbastanza spesso rispetto allo scontro.",
      },
      // ---------------------------------------------------------------- 4.3.4
      {
        sez: "4.3.4",
        q: "Perché un equilibrio correlato si calcola in tempo polinomiale?",
        o: [
          "Perché le condizioni sono lineari nelle incognite p(a): basta un programma lineare",
          "Perché esiste sempre un equilibrio correlato puro",
          "Perché coincide con il minimax",
          "Perché si può trovare per enumerazione dei profili",
        ],
        perche: "Si può scegliere l'obiettivo che si preferisce, per esempio il benessere totale o la regola maximin.",
      },
      {
        sez: "4.3.4",
        trappola: true,
        q: "Nel vincolo del programma lineare, le slide scrivono a destra p(a'<sub>i</sub>, a<sub>−i</sub>)u<sub>i</sub>(a'<sub>i</sub>, a<sub>−i</sub>). Che cosa c'è di sbagliato?",
        o: [
          "La probabilità corretta è p(a<sub>i</sub>, a<sub>−i</sub>), la stessa del lato sinistro (e manca la sommatoria): si confronta che cosa succede con la stessa raccomandazione",
          "Niente: è la formula corretta",
          "Dovrebbe esserci u<sub>i</sub>(a<sub>i</sub>, a<sub>−i</sub>)",
          "Il verso della disuguaglianza è invertito",
        ],
        perche: "La definizione data qualche slide prima è giusta, e lo è anche il notebook del docente. Nel programma lineare delle slide mancano anche la somma sui profili nell'obiettivo del benessere.",
      },
      {
        sez: "4.3.4",
        q: "Come si scrive come programma lineare la regola maximin, max<sub>p</sub> min<sub>i</sub> E<sub>p</sub>[u<sub>i</sub>]?",
        o: [
          "Con una variabile ausiliaria t: max t  s.t.  t ≤ Σ<sub>a</sub> p(a)u<sub>i</sub>(a) per ogni i, più i vincoli di equilibrio correlato",
          "Così com'è: il minimo è lineare",
          "Non si può: serve la programmazione intera",
          "Minimizzando la somma delle utilità",
        ],
        perche: "Il minimo non è lineare, ma “t sotto ogni utilità” sì. Nel laboratorio questa versione restituisce esattamente il semaforo.",
      },
      // ---------------------------------------------------------------- 4.4
      {
        sez: "4.4",
        q: "Quando ha senso trattare un gioco come se fosse a somma zero e giocare il minimax?",
        o: [
          "Quando si crede che l'avversario voglia danneggiarci, o quando non si conosce la sua utilità",
          "Quando il gioco ha molti equilibri di Nash",
          "Quando si vuole massimizzare il benessere totale",
          "Mai: è sempre sbagliato",
        ],
        perche: "È un approccio conservativo: garantisce il valore del gioco qualunque cosa faccia l'altro.",
      },
      {
        sez: "4.4",
        q: "Come si definisce il rimpianto R(a<sub>i</sub>, a<sub>−i</sub>)?",
        o: [
          "max<sub>a'i</sub> u<sub>i</sub>(a'<sub>i</sub>, a<sub>−i</sub>) − u<sub>i</sub>(a<sub>i</sub>, a<sub>−i</sub>): quanto si perde rispetto alla migliore risposta, col senno di poi",
          "u<sub>i</sub>(a<sub>i</sub>, a<sub>−i</sub>) − min u<sub>i</sub>",
          "La probabilità di non giocare la best response",
          "La differenza tra il payoff di i e quello dell'avversario",
        ],
        perche: "Il criterio del minimo rimpianto sceglie argmin<sub>ai</sub> max<sub>a−i</sub> R(a<sub>i</sub>, a<sub>−i</sub>): meno conservativo del minimax, utile con un avversario imprevedibile.",
      },
      {
        sez: "4.4",
        q: "Nell'attraversamento, quale azione sceglie il giocatore 1 con il criterio del minimo rimpianto massimo?" + ATTR,
        o: ["Stop (rimpianto massimo 6)", "Go (rimpianto massimo 10)", "Go (rimpianto massimo 0)", "È indifferente"],
        perche: "Contro Go la risposta migliore vale 0 (Stop), contro Stop vale 5 (Go). Rimpianti di Go: 10 e 0, massimo 10. Rimpianti di Stop: 0 e 6, massimo 6. Qui anche il maximin sceglie Stop (−1 contro −10).",
      },
      // ---------------------------------------------------------------- 4.5
      {
        sez: "4.5",
        q: "Perché non ci si aspetta che un algoritmo di apprendimento converga a un equilibrio di Nash in <b>ogni</b> gioco?",
        o: [
          "Perché trovare un equilibrio di Nash è PPAD-completo: se un algoritmo semplice ci riuscisse sempre, risolverebbe un problema ritenuto difficile",
          "Perché gli equilibri di Nash non esistono in tutti i giochi",
          "Perché l'apprendimento richiede giochi a somma zero",
          "Perché i giocatori non conoscono i propri payoff",
        ],
        perche: "Per questo i risultati di convergenza valgono per classi di giochi specifiche.",
      },
      // ---------------------------------------------------------------- 4.5.1
      {
        sez: "4.5.1",
        q: "Come funziona il fictitious play?",
        o: [
          "Ogni giocatore stima la strategia degli avversari dalle frequenze osservate e gioca una best response a quella stima",
          "Ogni giocatore gioca in proporzione al rimpianto cumulato",
          "Ogni giocatore gioca la strategia minimax",
          "Ogni giocatore copia l'azione che ha reso di più all'avversario",
        ],
        perche: "σ<sup>t</sup><sub>−i</sub>[a<sub>j</sub>] = count[a<sub>j</sub>]/(t − 1) e a<sub>i</sub><sup>t</sup> ∈ argmax E[u<sub>i</sub>(a<sub>i</sub>, a<sub>−i</sub>) | σ<sup>t</sup><sub>−i</sub>]. Assume che gli altri siano stazionari, cosa non vera perché anche loro imparano.",
      },
      {
        sez: "4.5.1",
        tipo: "multi",
        q: "In quali classi di giochi il fictitious play converge sicuramente a un equilibrio di Nash?",
        o: [
          "Giochi a due giocatori a somma zero",
          "Giochi risolvibili per eliminazione iterata delle strategie strettamente dominate",
          "Giochi a due giocatori 2 × N",
          "Tutti i giochi finiti",
          "Il gioco di Shapley 3 × 3",
        ],
        ok: [0, 1, 2],
        perche: "In generale non converge: nel gioco di Shapley le frequenze oscillano per sempre (verificato: dopo 200 000 turni sono ancora lontane da 1/3). Ma se converge, converge a un equilibrio.",
      },
      {
        sez: "4.5.1",
        q: "In sasso-carta-forbici con fictitious play, che cosa converge a (1/3, 1/3, 1/3)?",
        o: [
          "Le frequenze empiriche delle azioni, cioè le medie nel tempo",
          "Le azioni giocate a ogni turno",
          "Le utilità dei giocatori a ogni turno",
          "Niente: non converge",
        ],
        perche: "Le azioni sono sempre pure e ciclano (sasso per un po', poi carta, poi forbici…); le frequenze oscillano attorno a 1/3 con oscillazioni sempre più strette.",
      },
      // ---------------------------------------------------------------- 4.5.2
      {
        sez: "4.5.2",
        q: "Nel regret matching (versione di Hart e Mas-Colell), come si sceglie la strategia al turno t + 1?",
        o: [
          "In proporzione alla parte positiva del rimpianto cumulato: σ(a) = max(0, R(a)) / Σ<sub>a'</sub> max(0, R(a'))",
          "Giocando l'azione con il rimpianto cumulato più alto",
          "In proporzione alle frequenze osservate dell'avversario",
          "Uniformemente, sempre",
        ],
        perche: "Si gioca più spesso ciò che si rimpiange di non aver giocato. Se tutti i rimpianti sono ≤ 0 si gioca in modo uniforme.",
      },
      {
        sez: "4.5.2",
        trappola: true,
        q: "Le slide scrivono R(a) = Σ<sub>s≤t</sub> max(0, u(a, σ<sup>s</sup><sub>−i</sub>) − u(σ<sup>s</sup>)). Che differenza c'è con la versione corretta?",
        o: [
          "La versione corretta è max(0, Σ<sub>s</sub> …): con quella delle slide i rimpianti non scendono mai, e su un gioco asimmetrico converge a una strategia che non è l'equilibrio",
          "Nessuna: le due formule sono equivalenti",
          "La versione corretta usa il minimo invece del massimo",
          "La versione delle slide converge più in fretta allo stesso punto",
        ],
        perche: "Nel laboratorio, su un gioco con minimax (0,33; 0,56; 0,11), la versione corretta arriva a (0,34; 0,56; 0,10), quella delle slide a (0,41; 0,35; 0,24). In sasso-carta-forbici le due sembrano uguali per simmetria.",
      },
      {
        sez: "4.5.2",
        trappola: true,
        q: "A che cosa converge, con precisione, il regret matching con rimpianti incondizionati (quello visto sopra)?",
        o: [
          "La distribuzione empirica dei profili giocati converge agli equilibri correlati grossolani; agli equilibri correlati veri converge la variante con rimpianti condizionati",
          "Ogni strategia individuale converge a un equilibrio di Nash, in ogni gioco",
          "Le azioni giocate convergono a un equilibrio puro",
          "Non converge a nulla",
        ],
        perche: "Un equilibrio correlato è una distribuzione sui profili congiunti, non una strategia per giocatore. Nei giochi a somma zero la distinzione non conta: le marginali sono strategie minimax.",
      },
      {
        sez: "4.5.2",
        q: "Perché nei giochi a due giocatori a somma zero il regret matching porta all'equilibrio di Nash?",
        o: [
          "Perché le marginali di qualunque equilibrio correlato, anche grossolano, sono strategie minimax",
          "Perché in quei giochi i rimpianti sono sempre zero",
          "Perché il regret matching coincide con il fictitious play",
          "Perché quei giochi hanno sempre un equilibrio puro",
        ],
        perche: "Se nessuno dei due rimpiange un'azione fissa, ciascuno ottiene almeno il valore; essendo a somma zero, ottengono esattamente il valore e le frequenze sono ottime.",
      },
      // ---------------------------------------------------------------- 4.6.1
      {
        sez: "4.6.1",
        tipo: "numero",
        q: "In un gioco a due giocatori con m azioni per la riga e n per la colonna, quanti vincoli di incentivo ha il programma lineare dell'equilibrio correlato (esclusa la normalizzazione)? Rispondi per m = 3, n = 2.",
        ok: 8,
        tol: 0,
        perche: "Uno per ogni coppia (raccomandazione, deviazione) di ciascun giocatore: m(m − 1) + n(n − 1) = 3·2 + 2·1 = 8. Nel 2×2 sono 4, come nella matrice A<sub>ub</sub> del notebook.",
      },
      {
        sez: "4.6.1",
        q: "Massimizzando il benessere nell'attraversamento, linprog restituisce (Go, Stop) con probabilità 1 invece del semaforo, che ha lo stesso benessere 5. Perché?",
        o: [
          "Perché con più soluzioni ottime il risolutore ne restituisce una qualsiasi, di solito un vertice: per avere quella equa bisogna chiederla con l'obiettivo maximin",
          "Perché il semaforo non è un equilibrio correlato",
          "Perché il benessere del semaforo è più basso",
          "Perché linprog non gestisce le probabilità frazionarie",
        ],
        perche: "Con l'obiettivo maximin si ottiene esattamente [[0, ½], [½, 0]] con 2,5 a testa.",
      },
      {
        sez: "4.6.1",
        q: "Perché nei calci di rigore l'equilibrio correlato è la distribuzione uniforme, qualunque sia l'obiettivo?",
        o: [
          "Perché i quattro vincoli formano una catena chiusa p₁₂ ≤ p₁₁ ≤ p₂₁ ≤ p₂₂ ≤ p₁₂ che forza tutte le probabilità a essere uguali: il CE è unico",
          "Perché il suo equilibrio di Nash è (½, ½)",
          "Perché il benessere è massimo con la distribuzione uniforme",
          "Perché linprog sceglie sempre la soluzione uniforme",
        ],
        perche: "La motivazione del notebook (“il suo Nash è 0,5”) è vera ma debole. In un gioco a somma zero il benessere è 0 per qualunque distribuzione, quindi l'obiettivo non conta.",
      },
      // ---------------------------------------------------------------- 4.6.2
      {
        sez: "4.6.2",
        q: "Nel fictitious play del laboratorio su sasso-carta-forbici, i due giocatori hanno frequenze identiche. Perché?",
        o: [
          "Perché la matrice è antisimmetrica (−P<sup>T</sup> = P) e np.argmax rompe i pareggi in modo deterministico: partendo dagli stessi conteggi calcolano la stessa best response",
          "Perché il codice ha un errore",
          "Perché giocano entrambi la strategia uniforme",
          "Perché il fictitious play converge in un solo turno",
        ],
        perche: "Non è un errore, ma è un artefatto da tenere presente se si usa il fictitious play per confronti nel progetto.",
      },
      // ---------------------------------------------------------------- 4.6.3
      {
        sez: "4.6.3",
        q: "Nel laboratorio il rimpianto si calcola sull'azione effettivamente giocata dall'avversario, mentre le slide usano le strategie miste. È un problema?",
        o: [
          "No: il rimpianto campionato è una stima non distorta di quello atteso, quindi le due versioni si comportano allo stesso modo in media",
          "Sì: la versione campionata non converge",
          "Sì: la versione campionata converge a un altro punto",
          "No, perché in RPS i rimpianti sono sempre zero",
        ],
        perche: "In entrambi i casi la frequenza del giocatore 1 in RPS arriva a circa (0,335; 0,332; 0,333) dopo 10 000 turni.",
      },
    ],

    generatori: [
      {
        nome: "verifica-ce",
        sez: "4.3.2",
        titolo: "È un equilibrio correlato?",
        crea(r) {
          const A = [[r.int(-6, 6), r.int(-6, 6)], [r.int(-6, 6), r.int(-6, 6)]];
          const B = [[r.int(-6, 6), r.int(-6, 6)], [r.int(-6, 6), r.int(-6, 6)]];
          let p;
          const eq = M.equilibriPuri(A, B);
          if (eq.length && r.next() < 0.5) {
            p = [[0, 0], [0, 0]];
            const w = eq.length === 1 ? [1] : [r.int(1, 3) / 4];
            if (eq.length > 1) w.push(1 - w[0]);
            eq.slice(0, 2).forEach(([i, j], k) => (p[i][j] += w[k]));
          } else {
            let resto = 4;
            const parti = [];
            for (let k = 0; k < 3; k++) {
              const x = r.int(0, resto);
              parti.push(x);
              resto -= x;
            }
            parti.push(resto);
            const q = r.shuffle(parti);
            p = [[q[0] / 4, q[1] / 4], [q[2] / 4, q[3] / 4]];
          }
          const vinc = M.vincoliCE(A, B, p);
          const ok = vinc.every((v) => v.valore >= -1e-9);
          const nomiR = ["R1", "R2"], nomiC = ["C1", "C2"];
          const righe = vinc.map((v) =>
            (v.chi === "riga" ? "riga, raccomandato " + nomiR[v.racc] + " → " + nomiR[v.dev]
              : "colonna, raccomandato " + nomiC[v.racc] + " → " + nomiC[v.dev]) +
            ": guadagno a obbedire " + QUIZ.decimale(v.valore, 3) + (v.valore < -1e-9 ? " ✗" : " ✓"));
          return {
            tipo: "vf",
            q: "Gioco" + bm(nomiR, nomiC, A, B) + "Distribuzione sui profili" + distr(p, nomiR, nomiC) +
              "Questa distribuzione è un equilibrio correlato.",
            ok,
            perche: "Per ogni raccomandazione e ogni deviazione si calcola Σ p(racc., a<sub>−i</sub>)·(u(racc.) − u(dev.)), che deve essere ≥ 0:<br>" +
              righe.join("<br>") + "<br>" + (ok ? "Tutti i vincoli sono soddisfatti: è un equilibrio correlato." : "Almeno un vincolo è violato: non è un equilibrio correlato.") +
              " (Le raccomandazioni con probabilità 0 danno vincoli banali.)",
            dati: { A, B, p },
          };
        },
      },
      {
        nome: "minimo-rimpianto",
        sez: "4.4",
        titolo: "Minimo rimpianto massimo",
        crea(r) {
          const R3 = ["R1", "R2", "R3"], C3 = ["C1", "C2", "C3"];
          let A, rr;
          do {
            A = R3.map(() => C3.map(() => r.int(0, 9)));
            rr = M.rimpianti(A);
          } while (rr.peggiore.filter((x) => x === Math.min.apply(null, rr.peggiore)).length !== 1);
          return {
            tipo: "scelta",
            q: "Payoff della riga:" + bm(R3, C3, A) + "Quale azione sceglie la riga con il criterio del <b>minimo rimpianto massimo</b>?",
            o: ["R1", "R2", "R3"],
            ok: rr.scelta,
            ordine: true,
            perche: "Rimpianto = migliore payoff della colonna meno il payoff ottenuto. Rimpianti massimi: " +
              rr.peggiore.map((x, i) => "R" + (i + 1) + " → " + x).join(", ") + ". Il più piccolo è quello di <b>R" + (rr.scelta + 1) + "</b>.",
            dati: { A },
          };
        },
      },
      {
        nome: "fictitious-play",
        sez: "4.5.1",
        titolo: "Prossima mossa del fictitious play",
        crea(r) {
          const P = [[0, -1, 1], [1, 0, -1], [-1, 1, 0]];
          let c, u;
          do {
            c = [r.int(1, 12), r.int(1, 12), r.int(1, 12)];
            const tot = c[0] + c[1] + c[2];
            u = M.mulMv(P, c.map((x) => x / tot));
          } while (u.filter((x) => Math.abs(x - Math.max.apply(null, u)) < 1e-9).length !== 1);
          const best = u.indexOf(Math.max.apply(null, u));
          const nomi = ["Sasso", "Carta", "Forbici"];
          const tot = c[0] + c[1] + c[2];
          return {
            tipo: "scelta",
            q: "Sasso-carta-forbici con fictitious play. Finora l'avversario ha giocato Sasso " + c[0] + " volte, Carta " + c[1] +
              " volte e Forbici " + c[2] + " volte. Che cosa gioca il giocatore al prossimo turno?",
            o: nomi,
            ok: best,
            ordine: true,
            perche: "Stima dell'avversario: " + T.vettore(c.map((x) => x / tot)) + ". Utilità attese contro la stima: Sasso " +
              QUIZ.decimale(u[0], 3) + ", Carta " + QUIZ.decimale(u[1], 3) + ", Forbici " + QUIZ.decimale(u[2], 3) +
              ". Ogni azione vale la frequenza dell'azione che batte meno quella dell'azione da cui è battuta. Si gioca la best response: <b>" + nomi[best] + "</b>.",
            dati: { c },
          };
        },
      },
      {
        nome: "regret-matching",
        sez: "4.5.2",
        titolo: "Strategia del regret matching",
        crea(r) {
          let R;
          do {
            R = [r.int(-8, 10), r.int(-8, 10), r.int(-8, 10)];
          } while (R.filter((x) => x > 0).length < 1);
          const k = r.int(0, 2);
          const pos = R.map((x) => Math.max(0, x));
          const tot = pos.reduce((s, x) => s + x, 0);
          const nomi = ["a₁", "a₂", "a₃"];
          return {
            tipo: "numero",
            q: "Regret matching: i rimpianti cumulati delle tre azioni sono R(a₁) = " + String(R[0]).replace("-", "−") +
              ", R(a₂) = " + String(R[1]).replace("-", "−") + ", R(a₃) = " + String(R[2]).replace("-", "−") +
              ". Con che probabilità si gioca <b>" + nomi[k] + "</b> al prossimo turno? (Puoi rispondere con una frazione.)",
            ok: pos[k] / tot,
            perche: "Si prende la parte positiva dei rimpianti: " + pos.join(", ") + ", che somma a " + tot +
              ". La probabilità di " + nomi[k] + " è " + pos[k] + "/" + tot + " = <b>" + fmt(pos[k] / tot) + "</b>." +
              (R[k] <= 0 ? " Un'azione con rimpianto non positivo non viene giocata." : ""),
            dati: { R, k },
          };
        },
      },
    ],
  });
})();
