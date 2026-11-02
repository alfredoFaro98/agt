// Lezione 3 — Giochi non cooperativi; Lab 3 — best response, minimax, giochi potenziali.
(function () {
  const { T, M, fmt, fmtBreve } = QUIZ;
  const bm = T.bimatrice;
  const R2 = ["R1", "R2"], C2 = ["C1", "C2"], R3 = ["R1", "R2", "R3"], C3 = ["C1", "C2", "C3"];

  const PD = bm(["C", "D"], ["C", "D"], [[-1, -4], [0, -3]], [[-1, 0], [-4, -3]]);
  const G33 = bm(["L", "M", "R"], ["T", "V", "C"], [[0, 4, 5], [4, 0, 5], [3, 3, 8]], [[4, 0, 3], [0, 4, 3], [5, 5, 8]]);
  const BOS = bm(["A", "C"], ["A", "C"], [[2, 0], [0, 1]], [[1, 0], [0, 2]]);
  const RIGORI = bm(["L", "R"], ["L", "R"], [[1, -1], [-1, 1]], [[-1, 1], [1, -1]]);
  const GCD = bm(["C", "D"], ["A", "B"], [[2, 3], [1, 4]], [[1, 4], [3, 4]]);

  QUIZ.aggiungi({
    numero: 3,
    titolo: "Giochi non cooperativi",
    pdf: "lezione-03-non-cooperativi.pdf",
    sezioni: {
      "3.1": "Giochi strategici e forma normale",
      "3.1.1": "Giochi a due giocatori come matrici",
      "3.2": "Strategie dominanti",
      "3.2.1": "Eliminazione iterata delle strategie strettamente dominate",
      "3.3": "Best response ed equilibrio di Nash in strategie pure",
      "3.3.1": "IESDS ed equilibrio di Nash",
      "3.3.2": "Come leggere l'equilibrio di Nash",
      "3.3.3": "La tragedia dei beni comuni",
      "3.4": "Strategie miste",
      "3.5": "Best response ed equilibrio di Nash misti",
      "3.5.1": "Condizione generale per una best response",
      "3.6": "Equilibri misti nei giochi 2×2",
      "3.7": "Giochi a somma zero e minimax",
      "3.7.1": "Sasso-carta-forbici come programma lineare",
      "3.8.1": "Lab: best response ed equilibrio di Nash",
      "3.8.2": "Lab: minimax nei giochi a somma zero",
      "3.8.3": "Lab: equilibri misti nei giochi 2×2",
      "3.8.4": "Lab: giochi potenziali e rilevamento di comunità",
    },
    domande: [
      // ---------------------------------------------------------------- 3.1
      {
        sez: "3.1",
        q: "Che cosa distingue la forma <b>estesa</b> dalla forma normale?",
        o: [
          "Include l'ordine delle mosse e che cosa sa ogni giocatore quando muove; si rappresenta come un albero",
          "Ammette più di due giocatori",
          "Usa strategie miste invece che pure",
          "Vale solo per i giochi a somma zero",
        ],
        perche: "La forma normale elenca i payoff in funzione delle azioni <i>come se</i> si muovesse simultaneamente; la forma estesa tiene conto del tempo e dell'informazione (scacchi: il nero risponde al bianco; poker: che cosa vede chi punta).",
      },
      {
        sez: "3.1",
        q: "In un gioco in forma normale ⟨N, A, u⟩, da che cosa dipende l'utilità u<sub>i</sub> del giocatore i?",
        o: [
          "Dal profilo completo di azioni (a₁, …, a<sub>n</sub>) di tutti i giocatori",
          "Solo dall'azione a<sub>i</sub> del giocatore i",
          "Solo dalle azioni degli altri giocatori",
          "Dalla probabilità con cui i sceglie ogni azione",
        ],
        perche: "u<sub>i</sub> : A₁ × … × A<sub>n</sub> → ℝ. È proprio l'interdipendenza a rendere strategico il gioco.",
      },
      // ---------------------------------------------------------------- 3.1.1
      {
        sez: "3.1.1",
        tipo: "numero",
        q: "Nel gioco" + GCD + "quanto vale u₂(D, A), il payoff del giocatore colonna quando la riga gioca D e la colonna gioca A?",
        ok: 3,
        tol: 0,
        perche: "Nella cella (D, A) c'è “1, 3”: il primo numero è della riga, il secondo della colonna. Nella matrice B della colonna è l'elemento B[D][A] = 3.",
      },
      {
        sez: "3.1.1",
        q: "Nella rappresentazione con due matrici (A, B) usata nel codice, che cosa contiene B?",
        o: [
          "I payoff del giocatore colonna, nella stessa disposizione righe × colonne",
          "La trasposta dei payoff della riga",
          "Le best response del giocatore colonna",
          "Le probabilità delle strategie miste",
        ],
        perche: "A[i][j] e B[i][j] sono i payoff di riga e colonna quando si gioca la cella (i, j). In un gioco a somma zero B = −A.",
      },
      // ---------------------------------------------------------------- 3.2
      {
        sez: "3.2",
        q: "Quando la strategia s' del giocatore i è <b>strettamente dominata</b> da s''?",
        o: [
          "Quando per ogni combinazione di strategie degli altri giocatori u<sub>i</sub>(s', s<sub>−i</sub>) < u<sub>i</sub>(s'', s<sub>−i</sub>)",
          "Quando per almeno una combinazione degli altri u<sub>i</sub>(s', s<sub>−i</sub>) < u<sub>i</sub>(s'', s<sub>−i</sub>)",
          "Quando in media su tutte le combinazioni s'' dà di più",
          "Quando s'' è la best response all'equilibrio",
        ],
        perche: "Deve valere <b>qualunque</b> cosa facciano gli altri: è per questo che un giocatore razionale non gioca mai una strategia strettamente dominata.",
      },
      {
        sez: "3.2",
        trappola: true,
        q: "Qual è la definizione corretta di strategia <b>debolmente</b> dominata?",
        o: [
          "s' dà ≤ di s'' contro ogni profilo degli altri, e < contro almeno uno",
          "s' dà ≤ di s'' contro ogni profilo degli altri",
          "s' dà < di s'' contro almeno un profilo degli altri",
          "s' dà ≤ di s'' contro il profilo di equilibrio",
        ],
        perche: "Le slide usano solo ≤ ovunque: così ogni strategia dominerebbe debolmente sé stessa, e due strategie con payoff identici si dominerebbero a vicenda. Serve anche la disuguaglianza stretta in almeno un caso.",
      },
      // ---------------------------------------------------------------- 3.2.1
      {
        sez: "3.2.1",
        q: "Applicando IESDS al dilemma del prigioniero" + PD + "che cosa resta?",
        o: ["Solo (D, D)", "Solo (C, C)", "(C, C) e (D, D)", "Tutti i profili: nessuna strategia è dominata"],
        perche: "Per entrambi C è strettamente dominata da D (−1 < 0 e −4 < −3): si eliminano e resta (D, D). D è una strategia strettamente dominante; il gioco è risolvibile per dominanza.",
      },
      {
        sez: "3.2.1",
        tipo: "vf",
        q: "Ogni gioco finito si può risolvere con l'eliminazione iterata delle strategie strettamente dominate.",
        ok: false,
        perche: "Nel gioco 3×3 della lezione (L, M, R contro T, V, C) ogni strategia è la migliore in almeno un caso, quindi nessuna è dominata e IESDS non elimina nulla.",
      },
      {
        sez: "3.2.1",
        q: "Nel dilemma del prigioniero generico i payoff sono a (tradire da soli), b (cooperare entrambi), c (tradire entrambi), d (cooperare da soli). Quale ordine lo caratterizza?",
        o: ["a > b > c > d", "b > a > c > d", "a > c > b > d", "b > c > a > d"],
        perche: "Tradire conviene sempre (a > b e c > d), ma tradire entrambi è peggio che cooperare entrambi (b > c). Nella lezione 1 i numeri erano 0, −1, −3, −5, nella 3 sono 0, −1, −3, −4: l'ordine è lo stesso, ed è l'unica cosa che conta.",
      },
      // ---------------------------------------------------------------- 3.3
      {
        sez: "3.3",
        q: "Perché BR(a<sub>−i</sub>) si definisce come un <b>insieme</b>?",
        o: [
          "Perché più azioni possono dare lo stesso payoff massimo contro a<sub>−i</sub>",
          "Perché contiene le best response di tutti i giocatori",
          "Perché contiene le azioni non dominate",
          "Perché le best response cambiano nel tempo",
        ],
        perche: "a*<sub>i</sub> ∈ BR(a<sub>−i</sub>) ⇔ u<sub>i</sub>(a*<sub>i</sub>, a<sub>−i</sub>) ≥ u<sub>i</sub>(a<sub>i</sub>, a<sub>−i</sub>) per ogni a<sub>i</sub>: con i pareggi le best response sono più di una.",
      },
      {
        sez: "3.3",
        q: "Qual è l'unico equilibrio di Nash puro del gioco" + G33,
        o: ["(R, C)", "(L, V)", "(M, T)", "Non ci sono equilibri puri"],
        perche: "Segnando le best response: la riga risponde a T con M, a V con L, a C con R; la colonna risponde a L con T, a M con V, a R con C. L'unica cella con entrambi i segni è (R, C), con payoff (8, 8).",
      },
      // ---------------------------------------------------------------- 3.3.1
      {
        sez: "3.3.1",
        tipo: "vf",
        q: "Se IESDS elimina tutti i profili tranne uno, quel profilo è l'unico equilibrio di Nash puro.",
        ok: true,
        perche: "Una strategia strettamente dominata non è mai best response, quindi nessun equilibrio viene eliminato: se resta un solo profilo, è l'equilibrio.",
      },
      {
        sez: "3.3.1",
        tipo: "vf",
        q: "Ogni profilo che sopravvive all'eliminazione iterata è un equilibrio di Nash.",
        ok: false,
        perche: "Nel gioco 3×3 sopravvivono tutti e 9 i profili, ma l'equilibrio è uno solo, (R, C).",
      },
      {
        sez: "3.3.1",
        q: "Perché una strategia strettamente dominata non può far parte di un equilibrio di Nash?",
        o: [
          "Perché contro qualunque profilo degli altri la strategia che la domina dà di più: non è mai una best response",
          "Perché gli altri giocatori la punirebbero",
          "Perché il teorema di Nash lo esclude",
          "Perché dà sempre payoff negativi",
        ],
        perche: "In un equilibrio ognuno gioca una best response; una strategia strettamente dominata non lo è contro nessun profilo.",
      },
      // ---------------------------------------------------------------- 3.3.2
      {
        sez: "3.3.2",
        q: "Il ragionamento dell'equilibrio di Nash considera quali deviazioni?",
        o: [
          "Solo quelle di un giocatore alla volta",
          "Anche quelle congiunte di più giocatori",
          "Solo quelle che migliorano il benessere totale",
          "Solo quelle verso strategie miste",
        ],
        perche: "Nessuno ha interesse a cambiare <b>da solo</b>: per questo un equilibrio può essere stabile e insieme inefficiente, come nel dilemma del prigioniero.",
      },
      {
        sez: "3.3.2",
        tipo: "numero",
        q: "Quanti equilibri di Nash <b>puri</b> ha la battaglia dei sessi?" + BOS,
        ok: 2,
        tol: 0,
        perche: "(A, A) e (C, C): ciascuno è sbilanciato a favore di uno dei due. C'è poi un terzo equilibrio, misto.",
      },
      {
        sez: "3.3.2",
        trappola: true,
        q: "Nella battaglia dei sessi giocare (A, A) metà delle volte e (C, C) l'altra metà dà 1,5 a testa. Che cos'è questo accordo?",
        o: [
          "Un equilibrio correlato: richiede un segnale comune (per esempio una moneta lanciata insieme)",
          "L'equilibrio misto in cui ciascuno randomizza al 50%",
          "Un equilibrio di Nash puro",
          "Una strategia dominante",
        ],
        perche: "Se ciascuno randomizzasse per conto suo al 50%, metà delle volte finirebbero in (A, C) o (C, A) con payoff 0. Coordinarsi richiede un dispositivo comune: è un equilibrio correlato (lezione 4).",
      },
      {
        sez: "3.3.2",
        tipo: "vf",
        q: "Il gioco dei calci di rigore ha un equilibrio di Nash in strategie pure." + RIGORI,
        ok: false,
        perche: "Da qualunque cella uno dei due vuole cambiare: il portiere vuole indovinare il lato, il tiratore no. L'unico equilibrio è misto, 50/50 per entrambi.",
      },
      {
        sez: "3.3.2",
        trappola: true,
        q: "Le slide dicono che nei rigori randomizzare al 50% dà “il miglior esito per entrambi”. Qual è la lettura corretta?",
        o: [
          "In un gioco a somma zero non esiste un esito migliore per entrambi: 50/50 è l'unico profilo stabile, e ciascuno si garantisce 0",
          "È corretto: 50/50 massimizza il payoff di entrambi",
          "50/50 è un equilibrio puro",
          "50/50 è la strategia dominante",
        ],
        perche: "Quello che uno guadagna l'altro lo perde. 50/50 è la strategia minimax: nessuno può fare meglio deviando da solo.",
      },
      // ---------------------------------------------------------------- 3.3.3
      {
        sez: "3.3.3",
        q: "Tragedia dei beni comuni: u(x<sub>i</sub>, x<sub>j</sub>) = x<sub>i</sub>(A − B(x<sub>i</sub> + x<sub>j</sub>)). Qual è la best response dell'agricoltore i?",
        o: ["x<sub>i</sub> = (A − Bx<sub>j</sub>)/(2B)", "x<sub>i</sub> = A/(3B)", "x<sub>i</sub> = (A − Bx<sub>j</sub>)/B", "x<sub>i</sub> = A/(2B) − x<sub>j</sub>"],
        perche: "∂u/∂x<sub>i</sub> = A − 2Bx<sub>i</sub> − Bx<sub>j</sub> = 0. È un massimo perché la derivata seconda è −2B < 0. A/(3B) è il valore all'equilibrio, non la best response.",
      },
      {
        sez: "3.3.3",
        q: "Quanta acqua estrae in totale la coppia di agricoltori all'equilibrio di Nash, e quanta ne estrarrebbe un pianificatore?",
        o: ["2A/(3B) all'equilibrio, A/(2B) con il pianificatore", "A/(2B) all'equilibrio, 2A/(3B) con il pianificatore", "A/(3B) in entrambi i casi", "A/B all'equilibrio, A/(2B) con il pianificatore"],
        perche: "Equilibrio simmetrico x* = A/(3B), quindi 2A/(3B). Il pianificatore massimizza X(A − BX): X = A/(2B). In competizione si estrae di più e ognuno ottiene meno (A²/9B contro A²/8B).",
      },
      {
        sez: "3.3.3",
        q: "Perché il piano “ognuno estrae A/(4B)” non è un equilibrio?",
        o: [
          "Perché se l'altro estrae A/(4B), la best response è 3A/(8B) > A/(4B): ognuno ha interesse a estrarre di più",
          "Perché non massimizza il benessere totale",
          "Perché non è simmetrico",
          "Perché richiede che A = B",
        ],
        perche: "BR(A/4B) = (A − A/4)/(2B) = 3A/(8B). È la stessa logica del dilemma del prigioniero con un continuo di azioni.",
      },
      {
        sez: "3.3.3",
        trappola: true,
        q: "Le slide confrontano l'equilibrio con l'“ottimo di Pareto”. Che cosa calcolano davvero?",
        o: [
          "L'ottimo utilitaristico, cioè il massimo della somma delle utilità, che è uno dei tanti esiti Pareto-ottimi",
          "L'unico esito Pareto-ottimo del gioco",
          "Un esito che non è Pareto-ottimo",
          "L'equilibrio di Nash in strategie miste",
        ],
        perche: "Anche “un agricoltore estrae A/(2B) e l'altro 0” è Pareto-ottimo. Massimizzare la somma individua un esito particolare tra quelli efficienti.",
      },
      // ---------------------------------------------------------------- 3.4
      {
        sez: "3.4",
        q: "Che cos'è il <b>supporto</b> di una strategia mista?",
        o: [
          "L'insieme delle azioni giocate con probabilità positiva",
          "L'azione giocata con probabilità più alta",
          "L'insieme delle best response alla strategia",
          "L'insieme delle strategie che la dominano",
        ],
        perche: "Una strategia pura ha supporto di un solo elemento; una mista ne ha almeno due.",
      },
      {
        sez: "3.4",
        tipo: "numero",
        q: "Matching pennies: la riga vince 1 se le monete coincidono, perde 1 altrimenti. Entrambi giocano Testa con probabilità 4/5. Qual è l'utilità attesa della riga?",
        ok: 0.36,
        tol: 0.001,
        perche: "0,8·0,8 − 0,8·0,2 − 0,2·0,8 + 0,2·0,2 = 0,64 − 0,16 − 0,16 + 0,04 = 0,36. Con (1/2, 1/2) per entrambi sarebbe 0.",
      },
      {
        sez: "3.4",
        q: "Nella formula Pr(a | σ) = ∏<sub>j</sub> σ<sub>j</sub>(a<sub>j</sub>), quale ipotesi si sta facendo?",
        o: [
          "Che i giocatori randomizzino in modo indipendente l'uno dall'altro",
          "Che tutti i giocatori usino la stessa strategia",
          "Che le azioni siano equiprobabili",
          "Che il gioco sia a somma zero",
        ],
        perche: "Il prodotto delle probabilità vale per eventi indipendenti. Togliere questa ipotesi (un segnale comune) porta agli equilibri correlati.",
      },
      {
        sez: "3.4",
        trappola: true,
        q: "Perché gli equilibri misti richiedono che i payoff siano utilità di VNM?",
        o: [
          "Perché si calcolano valori attesi, che hanno senso solo per utilità cardinali: con utilità ordinali una trasformazione crescente cambierebbe l'equilibrio misto",
          "Perché altrimenti non esisterebbero equilibri puri",
          "Perché VNM garantisce che il gioco sia a somma zero",
          "Non li richiedono: bastano utilità ordinali",
        ],
        perche: "Gli equilibri puri dipendono solo dall'ordine dei payoff e sopravvivono a qualunque trasformazione crescente; quelli misti no.",
      },
      // ---------------------------------------------------------------- 3.5
      {
        sez: "3.5",
        q: "Che cosa afferma il teorema di Nash (1950)?",
        o: [
          "Ogni gioco finito ha almeno un equilibrio di Nash in strategie miste",
          "Ogni gioco finito ha esattamente un equilibrio di Nash",
          "Ogni gioco finito ha un equilibrio di Nash in strategie pure",
          "In ogni gioco finito il max-min coincide con il min-max",
        ],
        perche: "Esistenza, non unicità (la battaglia dei sessi ne ha tre), e in strategie miste (i rigori non ne hanno di puri). L'ultima opzione è il teorema minimax, che vale per i giochi a somma zero.",
      },
      {
        sez: "3.5",
        trappola: true,
        q: "Nella definizione di best response mista le slide scrivono “∀σ<sub>i</sub> ∈ A<sub>i</sub>”. Dove sta davvero σ<sub>i</sub>?",
        o: [
          "In S<sub>i</sub>, l'insieme delle distribuzioni di probabilità su A<sub>i</sub>",
          "In A<sub>i</sub>, l'insieme delle azioni",
          "In A<sub>−i</sub>",
          "In ℝ",
        ],
        perche: "È un refuso: le strategie miste sono distribuzioni sulle azioni.",
      },
      // ---------------------------------------------------------------- 3.5.1
      {
        sez: "3.5.1",
        q: "Condizione del supporto: quando σ<sub>r</sub> è una best response a σ<sub>c</sub>?",
        o: [
          "Se e solo se ogni azione con σ<sub>r</sub>(i) > 0 ha (Aσ<sub>c</sub><sup>T</sup>)<sub>i</sub> uguale al massimo di Aσ<sub>c</sub><sup>T</sup>",
          "Se e solo se σ<sub>r</sub> mette tutta la probabilità sull'azione migliore",
          "Se e solo se σ<sub>r</sub> è uniforme",
          "Se e solo se σ<sub>r</sub>Aσ<sub>c</sub><sup>T</sup> ≥ 0",
        ],
        perche: "Una strategia mista è best response se e solo se mette probabilità <b>solo</b> su azioni pure che sono best response. Non serve che sia pura: con più azioni ottime qualunque miscela tra esse va bene.",
      },
      {
        sez: "3.5.1",
        q: "Sasso-carta-forbici, payoff della riga" + bm(["Sasso", "Carta", "Forbici"], ["Sasso", "Carta", "Forbici"], [[0, -1, 1], [1, 0, -1], [-1, 1, 0]]) + "La colonna gioca (1/2, 1/2, 0). Qual è la best response della riga?",
        o: ["Carta, sempre", "Sasso, sempre", "Forbici, sempre", "(1/3, 1/3, 1/3)"],
        perche: "Aσ<sub>c</sub><sup>T</sup> = (−0,5; 0,5; 0): la carta ha l'utilità più alta ed è l'unica best response, quindi σ<sub>r</sub>* = (0, 1, 0).",
      },
      {
        sez: "3.5.1",
        q: "Battaglia dei sessi con A = [[2,0],[0,1]] e la colonna che gioca σ<sub>c</sub> = (1/3, 2/3). Quali strategie della riga sono best response?",
        o: [
          "Tutte: Aσ<sub>c</sub><sup>T</sup> = (2/3, 2/3), le due azioni rendono uguale",
          "Solo A pura",
          "Solo C pura",
          "Solo (2/3, 1/3)",
        ],
        perche: "Con entrambe le azioni ottime, qualunque miscela è best response: (2/3, 1/3), (1/2, 1/2), (1, 0)…",
      },
      {
        sez: "3.5.1",
        tipo: "vf",
        q: "Nella battaglia dei sessi" + BOS + "il profilo σ<sub>r</sub> = (1/2, 1/2), σ<sub>c</sub> = (1/3, 2/3) è un equilibrio di Nash.",
        ok: false,
        perche: "σ<sub>r</sub> è best response a σ<sub>c</sub>, ma σ<sub>r</sub>B = (1/2, 1): la colonna dovrebbe giocare solo C, mentre σ<sub>c</sub> dà 1/3 ad A. L'equilibrio misto è σ<sub>r</sub> = (2/3, 1/3).",
      },
      {
        sez: "3.5.1",
        q: "Qual è il passaggio chiave della dimostrazione della condizione del supporto?",
        o: [
          "Scrivere σ<sub>r</sub>Aσ<sub>c</sub><sup>T</sup> = u − Σ<sub>i</sub> σ<sub>r</sub>(i)(u − (Aσ<sub>c</sub><sup>T</sup>)<sub>i</sub>), con u il massimo: la somma è ≥ 0 ed è nulla solo se il supporto contiene azioni ottime",
          "Applicare il teorema del punto fisso di Brouwer",
          "Risolvere un programma lineare",
          "Usare l'induzione sul numero di azioni",
        ],
        perche: "Ogni termine u − (Aσ<sub>c</sub><sup>T</sup>)<sub>i</sub> è non negativo: l'utilità massima è u e si raggiunge solo azzerando tutti i termini pesati.",
      },
      // ---------------------------------------------------------------- 3.6
      {
        sez: "3.6",
        tipo: "numero",
        q: "Battaglia dei sessi" + BOS + "All'equilibrio misto, con che probabilità la <b>colonna</b> gioca A?",
        ok: 1 / 3,
        perche: "La colonna rende indifferente la riga: 2p = 1·(1 − p), quindi p = 1/3. Simmetricamente la riga gioca A con probabilità 2/3.",
      },
      {
        sez: "3.6",
        q: "In un equilibrio misto di un gioco 2×2, da che cosa dipende la probabilità con cui gioca la riga?",
        o: [
          "Dai payoff della colonna: la riga sceglie la probabilità che rende la colonna indifferente",
          "Dai propri payoff: la riga massimizza la sua utilità attesa",
          "Dal valore del gioco",
          "Da nulla: è sempre 1/2",
        ],
        perche: "È il “trucco controintuitivo”: all'equilibrio le azioni della riga le rendono uguale, e la probabilità serve a tenere indifferente l'avversario, altrimenti smetterebbe di randomizzare.",
      },
      {
        sez: "3.6",
        tipo: "numero",
        q: "Battaglia dei sessi" + BOS + "Qual è il payoff atteso di ciascun giocatore all'equilibrio misto?",
        ok: 2 / 3,
        perche: "Riga: con la colonna a (1/3, 2/3), giocare A rende 2·1/3 = 2/3. Meno di 1, il peggior payoff degli equilibri puri: si “mancano” con probabilità 5/9.",
      },
      // ---------------------------------------------------------------- 3.7
      {
        sez: "3.7",
        q: "Quando un gioco a due giocatori (A, B) è a somma zero?",
        o: ["Quando A = −B", "Quando A = B", "Quando A + B = 1", "Quando tutti i payoff sono zero"],
        perche: "Ciò che uno guadagna l'altro lo perde: basta una matrice A, che la riga massimizza e la colonna minimizza.",
      },
      {
        sez: "3.7",
        q: "Fissata σ<sub>c</sub>, perché max<sub>σr</sub> σ<sub>r</sub>Aσ<sub>c</sub><sup>T</sup> = min{v : Aσ<sub>c</sub><sup>T</sup> ≤ 1v}?",
        o: [
          "Il massimo si raggiunge su un'azione pura (condizione del supporto), e il massimo di un vettore è il più piccolo v che lo maggiora componente per componente",
          "Perché il gioco è simmetrico",
          "Perché σ<sub>r</sub> è uniforme",
          "Per il teorema di Nash",
        ],
        perche: "Con la sua scelta di σ<sub>c</sub> la colonna fissa il “tetto” v al guadagno della riga, e vuole renderlo il più basso possibile.",
      },
      {
        sez: "3.7",
        q: "Quale programma lineare risolve la colonna in un gioco a somma zero?",
        o: [
          "min v  s.t.  Aσ<sub>c</sub><sup>T</sup> ≤ 1v, σ<sub>c</sub> ∈ S<sub>c</sub>",
          "max u  s.t.  σ<sub>r</sub>A ≥ u1<sup>T</sup>, σ<sub>r</sub> ∈ S<sub>r</sub>",
          "min v  s.t.  σ<sub>c</sub>A ≥ 1v",
          "max v  s.t.  Aσ<sub>c</sub><sup>T</sup> ≥ 1v",
        ],
        perche: "La colonna minimizza il massimo concesso alla riga (minimax); la seconda opzione è il programma della riga (maximin).",
      },
      {
        sez: "3.7",
        q: "Che cosa afferma il teorema minimax di von Neumann (1928)?",
        o: [
          "In un gioco a somma zero esistono σ<sub>r</sub>, σ<sub>c</sub> e v con Aσ<sub>c</sub><sup>T</sup> ≤ 1v e σ<sub>r</sub>A ≥ v1<sup>T</sup>: max-min = min-max = v, il valore del gioco",
          "In un gioco a somma zero esiste sempre un equilibrio puro",
          "In ogni gioco finito esiste un equilibrio misto",
          "Il valore di un gioco a somma zero è sempre 0",
        ],
        perche: "Il payoff che la riga si può garantire coincide con quello che la colonna può impedirle di superare. Il valore non è 0 in generale (nel RPS modificato è 0,125).",
      },
      {
        sez: "3.7",
        q: "Nella dimostrazione del minimax, come si ottiene u ≤ v (la parte “debole”)?",
        o: [
          "u = u1<sup>T</sup>σ<sub>c</sub><sup>T</sup> ≤ σ<sub>r</sub>Aσ<sub>c</sub><sup>T</sup> ≤ σ<sub>r</sub>1v = v per soluzioni ammissibili qualsiasi",
          "Per induzione sul numero di righe",
          "Applicando Brouwer",
          "Calcolando esplicitamente le soluzioni",
        ],
        perche: "Basta combinare i due vincoli con le strategie dell'altro. L'uguaglianza u = v si dimostra poi per induzione su m + n, cancellando una riga con disuguaglianza stretta.",
      },
      {
        sez: "3.7",
        q: "Come prosegue la dimostrazione dell'uguaglianza u = v nel minimax?",
        o: [
          "Per induzione su m + n: se una disuguaglianza di Aσ<sub>c</sub><sup>T</sup> ≤ 1v è stretta nella riga k, si cancella la riga k e si usa l'ipotesi induttiva sul gioco ridotto",
          "Con il lemma di Sperner",
          "Mostrando che ogni gioco a somma zero ha un punto di sella",
          "Per assurdo, supponendo che il gioco non abbia valore",
        ],
        perche: "Poi si mostra che v̄ = v (altrimenti mescolando σ<sub>c</sub> con la soluzione del gioco ridotto si abbasserebbe v), e si chiude con ū ≤ u ≤ v = v̄ = ū.",
      },
      {
        sez: "3.7",
        q: "Sasso-carta-forbici in strategie <b>pure</b>: quanto valgono il max-min della riga e il min-max della colonna?",
        o: [
          "−1 e +1: non coincidono, servono le strategie miste",
          "0 e 0: coincidono già in strategie pure",
          "+1 e −1",
          "1/3 e 1/3",
        ],
        perche: "Qualunque azione pura della riga può essere battuta (−1), e qualunque azione pura della colonna lascia alla riga una vittoria (+1). In strategie miste entrambi valgono 0, il valore del gioco.",
      },
      // ---------------------------------------------------------------- 3.7.1
      {
        sez: "3.7.1",
        q: "Nella forma standard per <code>linprog</code> del programma della riga, con x = (σ<sub>r</sub>, u), quale matrice M<sub>ub</sub> si usa per una A qualsiasi m × n?",
        o: ["[−A<sup>T</sup> | 1]  (n righe, m + 1 colonne)", "[A | −1]  (m righe, n + 1 colonne)", "[A<sup>T</sup> | 1]", "[−A | 1]"],
        perche: "I vincoli σ<sub>r</sub>A ≥ u1<sup>T</sup>, uno per colonna j, diventano u − (σ<sub>r</sub>A)<sub>j</sub> ≤ 0: coefficienti −A<sup>T</sup> per σ<sub>r</sub> e 1 per u.",
      },
      {
        sez: "3.7.1",
        q: "Perché il vettore dei costi è c = (0, …, 0, −1)?",
        o: [
          "Perché linprog minimizza: massimizzare u equivale a minimizzare −u",
          "Perché il valore del gioco è −1",
          "Perché le probabilità non contano nell'obiettivo e u va resa negativa",
          "Perché così si impone σ<sub>r</sub> ≥ 0",
        ],
        perche: "Le componenti relative a σ<sub>r</sub> sono 0 perché nell'obiettivo compare solo u.",
      },
      {
        sez: "3.7.1",
        trappola: true,
        q: "Perché nella chiamata a linprog bisogna dichiarare <code>bounds = [(0, None)]*m + [(None, None)]</code>?",
        o: [
          "Perché linprog impone di default x ≥ 0 a tutte le variabili, ma u è il valore del gioco e può essere negativo: se non è libera, i giochi di valore negativo diventano impossibili",
          "Perché le probabilità possono essere negative",
          "Per velocizzare il risolutore",
          "Perché altrimenti linprog massimizza invece di minimizzare",
        ],
        perche: "Le slide scrivono x ≥ 0 su tutte le variabili; il notebook lo dice correttamente solo per le prime m. I test del notebook hanno tutti valore ≥ 0 e non se ne accorgono.",
      },
      // ---------------------------------------------------------------- 3.8.1
      {
        sez: "3.8.1",
        q: "Nel codice di <code>is_best_response(P1, P2, s1, s2)</code>, che cosa calcolano <code>P1 @ s2</code> e <code>s1 @ P2</code>?",
        o: [
          "Le utilità di ogni azione pura della riga contro s2 e di ogni azione pura della colonna contro s1",
          "Le utilità attese complessive di riga e colonna",
          "Le best response di riga e colonna",
          "Le probabilità congiunte delle celle",
        ],
        perche: "Poi basta controllare che il supporto di ciascuna strategia contenga solo azioni di utilità massima: la stessa funzione vale per strategie pure e miste.",
      },
      {
        sez: "3.8.1",
        trappola: true,
        q: "Perché nel codice si confronta <code>u_row[s1 > 0] >= u_row.max() - 1e-9</code> invece di usare <code>==</code>?",
        o: [
          "Perché probabilità come 2/3 non sono rappresentabili esattamente in floating point, e utilità che dovrebbero essere uguali possono differire di 10<sup>−16</sup>",
          "Perché le utilità possono essere negative",
          "Perché numpy non supporta l'uguaglianza tra array",
          "Per accettare anche strategie approssimativamente ottime",
        ],
        perche: "Con == un equilibrio misto corretto potrebbe essere rifiutato a caso. Lo stesso vale per qualunque verifica di equilibrio nel progetto.",
      },
      // ---------------------------------------------------------------- 3.8.2
      {
        sez: "3.8.2",
        q: "Il gioco A = [[−2, −1], [−1, −3]] ha valore −5/3. Che cosa succede risolvendolo con linprog lasciando i limiti di default (tutte le variabili ≥ 0)?",
        o: [
          "Il programma risulta impossibile (status 2), res.x è None e il codice successivo si rompe con un errore che non spiega la causa",
          "linprog restituisce comunque −5/3",
          "linprog restituisce valore 0 e strategia uniforme",
          "linprog restituisce la strategia giusta ma valore 0",
        ],
        perche: "Con u ≥ 0 nessuna strategia garantisce un valore non negativo: non ci sono soluzioni ammissibili. Con u libera si ottiene x = (2/3, 1/3) e valore −5/3.",
      },
      {
        sez: "3.8.2",
        trappola: true,
        q: "Nel notebook, sopra la cella dell'RPS modificato (matrice 4×3) c'è il commento “It should print [1/3, 1/3, 1/3]”. È corretto?",
        o: [
          "No: è un residuo della cella precedente. La strategia minimax è (0; 0,125; 0,5; 0,375), con valore 0,125",
          "Sì: ogni variante di RPS ha strategia uniforme",
          "No: la soluzione è (1/4, 1/4, 1/4, 1/4)",
          "Sì, ma solo per la matrice trasposta",
        ],
        perche: "Lo conferma l'output del docente nel notebook della lezione 4. Una matrice 4×3 ha quattro probabilità, non tre.",
      },
      // ---------------------------------------------------------------- 3.8.3
      {
        sez: "3.8.3",
        q: "Dall'indifferenza della riga, qA₁₁ + (1−q)A₁₂ = qA₂₁ + (1−q)A₂₂, quale formula si ricava per q (probabilità della prima colonna)?",
        o: [
          "q = (A₂₂ − A₁₂) / (A₁₁ − A₁₂ − A₂₁ + A₂₂)",
          "q = (A₁₁ − A₂₁) / (A₁₁ − A₁₂ − A₂₁ + A₂₂)",
          "q = (B₂₂ − B₂₁) / (B₁₁ − B₁₂ − B₂₁ + B₂₂)",
          "q = A₂₂ / (A₁₁ + A₂₂)",
        ],
        perche: "La probabilità della colonna si ricava dai payoff della <b>riga</b>, e viceversa: p = (B₂₂ − B₂₁)/(B₁₁ − B₁₂ − B₂₁ + B₂₂).",
      },
      {
        sez: "3.8.3",
        trappola: true,
        q: "Che cosa succede applicando la formula dell'equilibrio misto 2×2 al dilemma del prigioniero" + PD,
        o: [
          "Il denominatore vale 0: non esiste un equilibrio completamente misto, c'è solo quello puro (D, D)",
          "Si ottiene p = q = 1/2",
          "Si ottiene l'equilibrio (D, D) come caso particolare",
          "Si ottiene una probabilità negativa",
        ],
        perche: "A₁₁ − A₁₂ − A₂₁ + A₂₂ = −1 + 4 − 0 − 3 = 0. Nel gioco C/D × A/B, invece, esce p = −0,5. Una versione da usare nel progetto deve controllare denominatore e che p, q ∈ [0, 1].",
      },
      // ---------------------------------------------------------------- 3.8.4
      {
        sez: "3.8.4",
        q: "Quando un gioco ⟨N, S, u⟩ è un <b>gioco potenziale esatto</b>?",
        o: [
          "Quando esiste Φ tale che, per ogni deviazione unilaterale di i, la variazione di u<sub>i</sub> è uguale alla variazione di Φ",
          "Quando la somma delle utilità è costante",
          "Quando tutti i giocatori hanno la stessa utilità",
          "Quando esiste una strategia dominante per ogni giocatore",
        ],
        perche: "u<sub>i</sub>(s'<sub>i</sub>, s<sub>−i</sub>) − u<sub>i</sub>(s<sub>i</sub>, s<sub>−i</sub>) = Φ(s'<sub>i</sub>, s<sub>−i</sub>) − Φ(s<sub>i</sub>, s<sub>−i</sub>): i giocatori “spingono” tutti lo stesso potenziale.",
      },
      {
        sez: "3.8.4",
        tipo: "multi",
        q: "Quali proprietà hanno i giochi potenziali finiti?",
        o: [
          "Hanno sempre un equilibrio di Nash puro",
          "Ogni sequenza di miglioramenti unilaterali stretti è finita (FIP)",
          "La dinamica di best response con miglioramenti stretti converge a un equilibrio",
          "Ogni equilibrio massimizza Φ",
          "L'equilibrio è unico",
        ],
        ok: [0, 1, 2],
        perche: "Ogni miglioramento alza Φ, che ha un numero finito di valori: le sequenze terminano, e dove terminano c'è un equilibrio. Ma gli equilibri possono essere molti e solo massimi <i>locali</i> di Φ.",
      },
      {
        sez: "3.8.4",
        q: "Nel gioco delle comunità del laboratorio, qual è l'utilità di un nodo e qual è il potenziale?",
        o: [
          "Utilità: numero di vicini nello stesso cluster. Potenziale: numero di archi con estremi nello stesso cluster",
          "Utilità: dimensione del proprio cluster. Potenziale: numero di cluster",
          "Utilità: numero di vicini in cluster diversi. Potenziale: numero di archi tagliati",
          "Utilità: grado del nodo. Potenziale: somma dei gradi",
        ],
        perche: "Φ(s) = ½ Σ<sub>i</sub> Σ<sub>j∈Γ(i)</sub> 𝕀(s<sub>i</sub> = s<sub>j</sub>): ogni arco compare due volte, da cui il ½. Quando un nodo cambia cluster cambiano solo i suoi archi, e Δu<sub>i</sub> = ΔΦ.",
      },
      {
        sez: "3.8.4",
        trappola: true,
        q: "Nella dinamica di best response per le comunità, perché un nodo deve restare nel suo cluster se questo è già tra i migliori?",
        o: [
          "Perché cambiare a pari merito non alza Φ e la garanzia di terminazione salta: con un nodo conteso tra due cluster la dinamica può non finire mai",
          "Per velocizzare l'algoritmo",
          "Perché altrimenti il nodo resterebbe isolato",
          "Non serve: la dinamica termina comunque",
        ],
        perche: "Verificato su due cricche da 5 nodi più un nodo collegato a entrambe: con “resta se sei già ottimo” termina al primo turno, con “passa all'altro cluster ottimo” non termina mai.",
      },
      {
        sez: "3.8.4",
        q: "Qual è il profilo che <b>massimizza</b> il potenziale nel gioco delle comunità?",
        o: [
          "Tutti i nodi nello stesso cluster: Φ = |E|, è un equilibrio ma non dice nulla sulle comunità",
          "Ogni nodo in un cluster diverso",
          "Le comunità vere del grafo",
          "Due cluster di uguale dimensione",
        ],
        perche: "La label propagation funziona perché si ferma in un massimo <i>locale</i> partendo da etichette tutte diverse, non perché massimizza Φ. Trovare un equilibrio non è trovare quello giusto.",
      },
      {
        sez: "3.8.4",
        q: "Sul modello a blocchi stocastico del laboratorio (4 comunità da 100 nodi, p = 0,2 dentro, q = 0,01 tra), come si è comportata la dinamica su 20 grafi?",
        o: [
          "Ha ritrovato esattamente le 4 comunità in 19 casi su 20, in circa 4 turni",
          "Ha sempre fuso tutto in un unico cluster",
          "Non è mai terminata entro 100 turni",
          "Ha trovato sempre 400 cluster da un nodo",
        ],
        perche: "In media 3,8 turni, con il potenziale che cresce a ogni spostamento; nel caso rimanente due comunità sono state fuse.",
      },
    ],

    generatori: [
      {
        nome: "equilibri-puri",
        sez: "3.3",
        titolo: "Equilibri di Nash puri",
        crea(r) {
          const n = r.next() < 0.5 ? 2 : 3;
          const rows = n === 2 ? R2 : R3, cols = n === 2 ? C2 : C3;
          const A = rows.map(() => cols.map(() => r.int(0, 9)));
          const B = rows.map(() => cols.map(() => r.int(0, 9)));
          const eq = M.equilibriPuri(A, B);
          const nomi = eq.map(([i, j]) => "(" + rows[i] + ", " + cols[j] + ")");
          return {
            tipo: "numero",
            q: "Quanti equilibri di Nash in strategie <b>pure</b> ha questo gioco?" + bm(rows, cols, A, B),
            ok: eq.length,
            tol: 0,
            perche: "Per ogni colonna si segna il massimo della riga (primo numero), per ogni riga il massimo della colonna (secondo numero); gli equilibri sono le celle con entrambi i segni" +
              (eq.length ? ": <b>" + nomi.join(", ") + "</b>." : ". Qui non ce n'è nessuna: <b>0</b> equilibri puri (ce n'è comunque almeno uno misto, per il teorema di Nash)."),
            dati: { A, B },
          };
        },
      },
      {
        nome: "misto-2x2",
        sez: "3.6",
        titolo: "Equilibrio misto di un 2×2",
        crea(r) {
          let A, B, e;
          do {
            A = [[r.int(0, 6), r.int(0, 6)], [r.int(0, 6), r.int(0, 6)]];
            B = [[r.int(0, 6), r.int(0, 6)], [r.int(0, 6), r.int(0, 6)]];
            e = M.misto2x2(A, B);
          } while (!e || !QUIZ.frazione(e.p, 12) || !QUIZ.frazione(e.q, 12));
          const chiediRiga = r.next() < 0.5;
          return {
            tipo: "numero",
            q: "Il gioco" + bm(R2, C2, A, B) + "ha un equilibrio completamente misto. Con che probabilità " +
              (chiediRiga ? "la <b>riga</b> gioca R1?" : "la <b>colonna</b> gioca C1?") + " (Puoi rispondere con una frazione.)",
            ok: chiediRiga ? e.p : e.q,
            perche: (chiediRiga
              ? "La riga gioca R1 con probabilità p che rende indifferente la <b>colonna</b>: p·" + B[0][0] + " + (1−p)·" + B[1][0] +
                " = p·" + B[0][1] + " + (1−p)·" + B[1][1] + ", da cui p = <b>" + fmt(e.p) + "</b>."
              : "La colonna gioca C1 con probabilità q che rende indifferente la <b>riga</b>: q·" + A[0][0] + " + (1−q)·" + A[0][1] +
                " = q·" + A[1][0] + " + (1−q)·" + A[1][1] + ", da cui q = <b>" + fmt(e.q) + "</b>.") +
              " Ricorda: la probabilità di un giocatore dipende dai payoff dell'altro.",
            dati: { A, B, chiediRiga },
          };
        },
      },
      {
        nome: "best-response",
        sez: "3.5.1",
        titolo: "Best response a una strategia mista",
        crea(r) {
          const miste = [[1 / 2, 1 / 2, 0], [1 / 3, 1 / 3, 1 / 3], [0, 1 / 2, 1 / 2], [1 / 4, 1 / 2, 1 / 4], [1 / 2, 0, 1 / 2], [2 / 3, 1 / 3, 0]];
          let A, s, u;
          do {
            A = R3.map(() => C3.map(() => r.int(-3, 5)));
            s = r.pick(miste);
            u = M.mulMv(A, s);
          } while (u.filter((x) => Math.abs(x - Math.max.apply(null, u)) < 1e-9).length !== 1);
          const best = u.indexOf(Math.max.apply(null, u));
          return {
            tipo: "scelta",
            q: "Payoff della riga:" + bm(R3, C3, A) + "La colonna gioca σ<sub>c</sub> = " + T.vettore(s) +
              ". Quale strategia è la best response della riga?",
            o: ["R1 pura", "R2 pura", "R3 pura", "La strategia uniforme (1/3, 1/3, 1/3)"],
            ok: best,
            ordine: true,
            perche: "Aσ<sub>c</sub><sup>T</sup> = " + T.vettore(u) + ": l'azione con utilità massima è R" + (best + 1) +
              ", ed è l'unica, quindi l'unica best response è giocarla sempre. Una miscela sarebbe best response solo se tutte le azioni del suo supporto fossero ottime.",
            dati: { A, s },
          };
        },
      },
      {
        nome: "utilita-mista",
        sez: "3.4",
        titolo: "Utilità attesa con strategie miste",
        crea(r) {
          const A = [[r.int(-4, 6), r.int(-4, 6)], [r.int(-4, 6), r.int(-4, 6)]];
          const p = r.int(1, 9) / 10, q = r.int(1, 9) / 10;
          const sr = [p, 1 - p], sc = [q, 1 - q];
          const u = M.dot(sr, M.mulMv(A, sc));
          return {
            tipo: "numero",
            q: "Payoff della riga:" + bm(R2, C2, A) + "La riga gioca " + T.vettore(sr) + ", la colonna " + T.vettore(sc) +
              ". Qual è l'utilità attesa della riga σ<sub>r</sub>Aσ<sub>c</sub><sup>T</sup>?",
            ok: u,
            tol: 0.001,
            perche: "Ogni cella ha probabilità σ<sub>r</sub>(i)·σ<sub>c</sub>(j): " +
              [0, 1].map((i) => [0, 1].map((j) => fmtBreve(sr[i]) + "·" + fmtBreve(sc[j]) + "·" + String(A[i][j]).replace("-", "−")).join(" + ")).join(" + ") +
              " = <b>" + QUIZ.decimale(u, 3) + "</b>.",
            dati: { A, sr, sc },
          };
        },
      },
      {
        nome: "dominata",
        sez: "3.2",
        titolo: "Strategia strettamente dominata",
        crea(r) {
          const domina = (x, y) => x.every((v, j) => v > y[j]);
          let A, dominate;
          const vuoleUna = r.next() < 0.75;
          do {
            A = R3.map(() => [r.int(0, 9), r.int(0, 9)]);
            dominate = [0, 1, 2].filter((i) => [0, 1, 2].some((k) => k !== i && domina(A[k], A[i])));
          } while (vuoleUna ? dominate.length !== 1 : dominate.length !== 0);
          const ok = vuoleUna ? dominate[0] : 3;
          let motivo;
          if (vuoleUna) {
            const k = [0, 1, 2].find((kk) => kk !== ok && domina(A[kk], A[ok]));
            motivo = "R" + (k + 1) + " dà di più di R" + (ok + 1) + " contro entrambe le colonne (" + A[k][0] + " > " + A[ok][0] +
              " e " + A[k][1] + " > " + A[ok][1] + "): R" + (ok + 1) + " è strettamente dominata e un giocatore razionale non la gioca mai.";
          } else {
            motivo = "Nessuna riga dà strettamente di più di un'altra contro <i>entrambe</i> le colonne: nessuna è strettamente dominata da un'altra riga pura, e l'eliminazione iterata qui non parte.";
          }
          return {
            tipo: "scelta",
            q: "Payoff della riga (la colonna ha due azioni):" + bm(R3, C2, A) + "Quale riga è strettamente dominata da un'altra riga pura?",
            o: ["R1", "R2", "R3", "Nessuna"],
            ok,
            ordine: true,
            perche: motivo,
            dati: { A },
          };
        },
      },
      {
        nome: "somma-zero-2x2",
        sez: "3.7",
        titolo: "Valore di un gioco a somma zero 2×2",
        crea(r) {
          let A, v;
          do {
            A = [[r.int(-5, 6), r.int(-5, 6)], [r.int(-5, 6), r.int(-5, 6)]];
            v = M.valoreSommaZero2x2(A);
          } while (v.sella || !QUIZ.frazione(v.valore, 12) || !QUIZ.frazione(v.p, 12));
          return {
            tipo: "numero",
            q: "Gioco a somma zero; payoff della riga (la colonna riceve l'opposto):" + bm(R2, C2, A) +
              "Il gioco non ha punti di sella. Qual è il suo <b>valore</b>? (Puoi rispondere con una frazione.)",
            ok: v.valore,
            perche: "Senza punto di sella entrambi randomizzano. La riga gioca R1 con p che rende uguali le due colonne: p·" +
              A[0][0] + " + (1−p)·" + A[1][0] + " = p·" + A[0][1] + " + (1−p)·" + A[1][1] + ", quindi p = " + fmt(v.p) +
              ". Sostituendo si ottiene il valore <b>" + fmt(v.valore) + "</b> (in formula: (a·d − b·c)/(a − b − c + d)).",
            dati: { A },
          };
        },
      },
      {
        nome: "beni-comuni",
        sez: "3.3.3",
        titolo: "Tragedia dei beni comuni",
        crea(r) {
          const A = r.int(6, 30) * 10, B = r.int(1, 5);
          const casi = [
            { c: "l'estrazione di <b>ciascun</b> agricoltore all'equilibrio di Nash", v: A / (3 * B), f: "x* = A/(3B)" },
            { c: "l'estrazione <b>totale</b> all'equilibrio di Nash", v: (2 * A) / (3 * B), f: "X = 2A/(3B)" },
            { c: "l'estrazione totale che sceglierebbe un <b>pianificatore</b>", v: A / (2 * B), f: "X = A/(2B)" },
            { c: "l'utilità di ciascun agricoltore all'equilibrio di Nash", v: (A * A) / (9 * B), f: "A²/(9B)" },
          ];
          const s = r.pick(casi);
          return {
            tipo: "numero",
            q: "Due agricoltori estraggono x₁, x₂ da una falda comune; ricavo unitario A − B(x₁ + x₂) con A = " + A + ", B = " + B +
              ". Quanto vale " + s.c + "? (Due decimali.)",
            ok: s.v,
            tol: 0.01,
            perche: "Dalla best response x<sub>i</sub> = (A − Bx<sub>j</sub>)/(2B) e dalla simmetria si ottiene x* = A/(3B); il pianificatore massimizza X(A − BX). Qui " +
              s.f + " = <b>" + QUIZ.decimale(s.v, 2) + "</b>.",
            dati: { A, B, caso: casi.indexOf(s) },
          };
        },
      },
    ],
  });
})();
