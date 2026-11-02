// Lezione 1 — Introduzione all'AGT, giochi combinatori, Minimax.
// Domande: tipo "scelta" (ok = indice giusto, 0 se omesso), "multi" (ok = indici giusti),
// "vf" (ok = true/false), "numero" (ok = valore, tol = tolleranza assoluta).
(function () {
  const { T, M } = QUIZ;

  const albero = (g) => {
    const h = g.map((gr, i) => "<b>M" + (i + 1) + "</b>: " + gr.join(", ")).join(" &nbsp;·&nbsp; ");
    return '<p class="formula">' + h + "</p>";
  };

  QUIZ.aggiungi({
    numero: 1,
    titolo: "Introduzione all'AGT",
    pdf: "lezione-01-introduzione.pdf",
    sezioni: {
      "1.1": "Informazioni sul corso",
      "1.2": "Che cos'è la teoria dei giochi",
      "1.3": "Che cos'è l'Algorithmic Game Theory",
      "1.4.1": "Giochi non cooperativi",
      "1.4.2": "Giochi coalizionali",
      "1.4.3": "Scelta sociale computazionale",
      "1.4.4": "Mechanism design",
      "1.4.5": "Matching markets",
      "1.5": "Giochi combinatori",
      "1.5.1": "Dalla teoria dei giochi al giocare",
      "1.5.2": "L'albero di gioco",
      "1.5.3": "Un'IA per il tris",
      "1.5.4": "L'algoritmo Minimax",
      "1.5.5": "I limiti di Minimax",
      "1.5.6": "Potatura Alpha-Beta",
      "1.5.7": "Oltre alpha-beta",
      "1.6.1": "Lab: rappresentazione e condizioni di vittoria",
      "1.6.2": "Lab: Minimax",
      "1.6.3": "Lab: scegliere la mossa migliore",
      "1.6.4": "Lab: Minimax contro sé stesso",
      "1.6.5": "Lab: Minimax con potatura alpha-beta",
      "1.6.6": "Lab: giocare contro l'IA",
    },
    domande: [
      // ---------------------------------------------------------------- 1.1
      {
        sez: "1.1",
        q: "In che cosa consiste l'esame del corso?",
        o: [
          "Un progetto in cui si formalizza un problema e se ne implementa la soluzione con gli strumenti dell'AGT",
          "Una prova scritta con esercizi di calcolo sugli equilibri",
          "Un orale sulle dimostrazioni dei teoremi visti a lezione",
          "Una prova al calcolatore in cui si completano i notebook dei laboratori",
        ],
        perche: "È l'unica informazione ufficiale sull'esame: un <b>progetto</b> con due metà, <i>formalizzare</i> (giocatori, azioni, utilità, concetto di soluzione) e <i>implementare</i>. Per questo i laboratori contano quanto la teoria.",
      },
      // ---------------------------------------------------------------- 1.2
      {
        sez: "1.2",
        tipo: "multi",
        q: "Quali sono gli ingredienti della definizione di teoria dei giochi data a lezione? Seleziona tutti quelli giusti.",
        o: ["Conflitto", "Cooperazione", "Comportamento razionale", "Predizione", "Informazione perfetta", "Somma zero"],
        ok: [0, 1, 2, 3],
        perche: "I quattro ingredienti sono <b>conflitto</b> (le azioni di uno influenzano gli altri), <b>cooperazione</b> (si possono unire le forze), <b>comportamento razionale</b> (si massimizza l'utilità attesa) e <b>predizione</b> (tramite i concetti di soluzione). Informazione perfetta e somma zero sono proprietà di alcuni giochi, per esempio quelli combinatori, non della teoria in generale.",
      },
      {
        sez: "1.2",
        q: "Nel corso, che cosa significa che un giocatore ha un comportamento <i>razionale</i>?",
        o: [
          "Che massimizza la propria utilità attesa",
          "Che massimizza il benessere complessivo di tutti i giocatori",
          "Che sceglie sempre l'azione che minimizza la perdita massima",
          "Che gioca una strategia dominante",
        ],
        perche: "Razionale = massimizza la <b>propria utilità attesa</b>. Minimizzare la perdita massima è un criterio prudente (minimax), utile in certi casi ma non la definizione di razionalità; una strategia dominante spesso non esiste.",
      },
      {
        sez: "1.2",
        q: "Che cosa sono i <i>concetti di soluzione</i>?",
        o: [
          "Lo strumento con cui la teoria dei giochi predice che cosa succederà, come l'equilibrio di Nash o il valore di Shapley",
          "Gli algoritmi che trovano la mossa migliore in un gioco combinatorio",
          "Le regole che definiscono un gioco: giocatori, azioni e payoff",
          "Le strategie che garantiscono la vittoria a un giocatore",
        ],
        perche: "La teoria dei giochi vuole <b>prevedere</b> come interagiranno agenti razionali, e lo fa con i concetti di soluzione: equilibrio di Nash, valore di Shapley, core, ecc. Minimax è un algoritmo che calcola uno di questi concetti in un caso particolare.",
      },
      // ---------------------------------------------------------------- 1.3
      {
        sez: "1.3",
        q: "Quale definizione di Algorithmic Game Theory è stata data a lezione?",
        o: [
          "L'area all'intersezione tra teoria dei giochi e progettazione di algoritmi, che progetta algoritmi in ambienti strategici",
          "Lo studio dei giochi da tavolo con l'aiuto del calcolatore",
          "La teoria dei giochi applicata all'apprendimento automatico",
          "L'uso della programmazione lineare per risolvere i giochi a somma zero",
        ],
        perche: "La definizione (Nisan et al., 2007) è: intersezione tra <b>teoria dei giochi</b> e <b>progettazione di algoritmi</b>, con l'obiettivo di progettare algoritmi in <b>ambienti strategici</b>, cioè dove ci sono agenti con interessi propri.",
      },
      {
        sez: "1.3",
        tipo: "multi",
        q: "Di che cosa si occupa l'AGT, secondo la lezione? Seleziona tutte le risposte giuste.",
        o: [
          "Calcolare in modo efficiente i concetti di soluzione",
          "Aggregare voti e preferenze",
          "Allocare risorse scarse",
          "Dimostrare l'esistenza degli equilibri nei giochi con infiniti giocatori",
          "Addestrare reti neurali profonde",
        ],
        ok: [0, 1, 2],
        perche: "I tre compiti elencati sono <b>calcolare</b> i concetti di soluzione (per esempio trovare un equilibrio), <b>aggregare</b> voti e preferenze (scelta sociale) e <b>allocare</b> risorse scarse (aste, matching, divisione equa).",
      },
      // ---------------------------------------------------------------- 1.4.1
      {
        sez: "1.4.1",
        q: "Dilemma del prigioniero della lezione 1:" +
          T.bimatrice(["C", "D"], ["C", "D"], [[-1, -5], [0, -3]], [[-1, 0], [-5, -3]], ["P1", "P2"]) +
          "Qual è l'unico equilibrio di Nash?",
        o: ["(D, D)", "(C, C)", "(C, D) e (D, C)", "Non ci sono equilibri"],
        perche: "Per ciascun giocatore tradire conviene <b>qualunque</b> cosa faccia l'altro: se l'altro coopera 0 > −1, se tradisce −3 > −5. Quindi (D, D) è l'unico equilibrio, con utilità (−3, −3). Da (C, C) ciascuno guadagna deviando (da −1 a 0).",
      },
      {
        sez: "1.4.1",
        tipo: "multi",
        trappola: true,
        q: "Nello stesso dilemma del prigioniero, quali esiti sono <b>Pareto-ottimi</b>?" +
          T.bimatrice(["C", "D"], ["C", "D"], [[-1, -5], [0, -3]], [[-1, 0], [-5, -3]], ["P1", "P2"]),
        o: ["(C, C)", "(C, D)", "(D, C)", "(D, D)"],
        ok: [0, 1, 2],
        perche: "Un esito è Pareto-ottimo se nessun altro esito fa stare meglio qualcuno senza far stare peggio nessuno. Da (C, D) = (−5, 0) qualunque altro esito peggiora P2, quindi è Pareto-ottimo, e così (D, C). L'unico <b>non</b> Pareto-ottimo è (D, D): (C, C) fa stare meglio entrambi. Le slide danno una definizione informale (“nessuno può deviare senza peggiorare qualcun altro”) che confonde Pareto con il criterio di Nash.",
      },
      {
        sez: "1.4.1",
        q: "Quale di queste è la definizione corretta di ottimo di Pareto?",
        o: [
          "Un esito per cui non esiste un altro esito in cui qualcuno sta meglio e nessuno sta peggio",
          "Un esito da cui nessun giocatore può migliorare cambiando da solo la propria scelta",
          "L'esito che massimizza la somma delle utilità",
          "L'esito in cui tutti i giocatori ottengono lo stesso payoff",
        ],
        perche: "Pareto confronta <b>esiti</b> tra loro. “Nessuno migliora deviando da solo” è la definizione di equilibrio di Nash. Massimizzare la somma dà un esito Pareto-ottimo, ma non è l'unico: anche esiti sbilanciati possono esserlo.",
      },
      {
        sez: "1.4.1",
        tipo: "vf",
        q: "Nel dilemma del prigioniero l'esito efficiente (Pareto) è anche l'esito stabile (Nash).",
        ok: false,
        perche: "È proprio la tensione che il dilemma mostra: (C, C) è efficiente ma non stabile (ognuno vuole deviare), (D, D) è stabile ma non efficiente.",
      },
      {
        sez: "1.4.1",
        tipo: "multi",
        q: "Quali di queste sono applicazioni dei <b>giochi non cooperativi</b> citate a lezione?",
        o: [
          "Algoritmi per giocare a scacchi e a poker",
          "Generative Adversarial Networks (GAN)",
          "Sicurezza: pattugliamento e sorveglianza",
          "SHAP per spiegare i modelli di machine learning",
          "Ensemble di modelli e random forest",
        ],
        ok: [0, 1, 2],
        perche: "Giochi, GAN (generatore contro discriminatore), sicurezza e decisioni sequenziali robuste sono applicazioni dei giochi non cooperativi. SHAP viene dal valore di Shapley (giochi coalizionali); gli ensemble sono un'applicazione della scelta sociale (ogni modello “vota”).",
      },
      // ---------------------------------------------------------------- 1.4.2
      {
        sez: "1.4.2",
        tipo: "numero",
        q: "Tre imprese A, B, C: una da sola guadagna 0, due insieme guadagnano 100, tutte e tre insieme ancora 100. Se la grande coalizione divide in parti uguali, ognuno prende 33,33. Quanto ottengono a testa B e C se escono e formano una coppia, dividendo in parti uguali?",
        ok: 50,
        perche: "v({B, C}) = 100, diviso in due fa 50 > 33,33. La divisione in parti uguali della grande coalizione non è stabile: una coppia preferisce staccarsi.",
      },
      {
        sez: "1.4.2",
        tipo: "numero",
        q: "Variante: v({A,B}) = v({A,C}) = 100, v({B,C}) = 0, ogni singolo 0, v({A,B,C}) = 100. Qual è il <b>valore di Shapley</b> di A? (Due decimali o frazione.)",
        ok: 200 / 3,
        tol: 0.05,
        perche: "Sui 6 ordini di ingresso A contribuisce 0, 0, 100, 100, 100, 100 (entra per primo in due ordini, altrimenti trova B o C e porta il valore a 100). Media: 400/6 ≈ <b>66,67</b>; B e C prendono 16,67 a testa. È lo stesso gioco del gelato della lezione 5, in scala.",
      },
      {
        sez: "1.4.2",
        q: "Qual è il concetto di soluzione principale dei giochi coalizionali, introdotto nella lezione 1?",
        o: ["Il valore di Shapley", "L'equilibrio di Nash", "Il valore minimax", "L'equilibrio correlato"],
        perche: "I giochi coalizionali chiedono quale coalizione si forma e <b>come dividere</b> il valore; il valore di Shapley dà a ciascuno il contributo marginale medio. Nella lezione 5 si aggiungono core e nucleolo.",
      },
      {
        sez: "1.4.2",
        q: "Che cos'è SHAP, citato tra le applicazioni dei giochi coalizionali?",
        o: [
          "L'applicazione dei valori di Shapley alle feature di un modello, per spiegarne le predizioni",
          "Un algoritmo per trovare equilibri di Nash nei giochi grandi",
          "Una regola di voto per gli ensemble di modelli",
          "Un metodo per calcolare il core di un gioco",
        ],
        perche: "In SHAP i giocatori sono le <b>feature</b> e il valore di una coalizione è quanto il modello predice usando quelle feature: il valore di Shapley misura il contributo di ciascuna feature.",
      },
      // ---------------------------------------------------------------- 1.4.3
      {
        sez: "1.4.3",
        q: "Tre votanti: V1 preferisce A ≻ B ≻ C, V2 preferisce B ≻ C ≻ A, V3 preferisce C ≻ A ≻ B. Nel confronto a maggioranza tra <b>C e A</b>, chi vince?",
        o: ["C, con i voti di V2 e V3", "A, con i voti di V1 e V3", "A, con i voti di V1 e V2", "Pareggio"],
        perche: "V2 mette C prima di A, V3 mette C prima di A, solo V1 preferisce A. Con A che batte B e B che batte C si ottiene il ciclo A ≻ B ≻ C ≻ A: il <b>paradosso di Condorcet</b>.",
      },
      {
        sez: "1.4.3",
        q: "Che cosa mostra il paradosso di Condorcet?",
        o: [
          "Che anche se ogni votante ha preferenze transitive, la maggioranza a coppie può essere ciclica e nessun candidato batte tutti",
          "Che la maggioranza sceglie sempre il candidato peggiore",
          "Che con tre candidati il voto a maggioranza non può essere calcolato",
          "Che i votanti hanno sempre interesse a mentire sulle proprie preferenze",
        ],
        perche: "Le preferenze individuali sono coerenti, quelle collettive no: la preferenza della maggioranza non è transitiva. È il punto di partenza della scelta sociale computazionale.",
      },
      {
        sez: "1.4.3",
        q: "Quale applicazione al machine learning viene citata per la scelta sociale?",
        o: [
          "Random forest ed ensemble di modelli, dove ogni modello “vota” una predizione",
          "Le GAN, dove generatore e discriminatore competono",
          "SHAP, per spiegare le predizioni",
          "Il clustering dei grafi",
        ],
        perche: "In un ensemble le predizioni dei modelli vengono <b>aggregate</b> come voti: è esattamente un problema di scelta sociale.",
      },
      // ---------------------------------------------------------------- 1.4.4
      {
        sez: "1.4.4",
        q: "Perché il mechanism design è descritto come “teoria dei giochi al contrario”?",
        o: [
          "Perché invece di analizzare un gioco dato si progetta il gioco in modo che incentivi i comportamenti desiderati",
          "Perché si parte dagli equilibri e si ricostruiscono i payoff dei giocatori",
          "Perché si studiano i giochi in cui l'obiettivo è perdere",
          "Perché i giocatori muovono in ordine inverso rispetto alla forma estesa",
        ],
        perche: "La teoria dei giochi prende un gioco e ne studia gli esiti; il mechanism design fissa l'esito voluto (per esempio che nelle aste si dichiari il <b>vero</b> prezzo) e progetta le regole che lo producono. Esempi: eBay, Google Ads, appalti pubblici.",
      },
      // ---------------------------------------------------------------- 1.4.5
      {
        sez: "1.4.5",
        q: "Di che cosa si occupano i matching markets?",
        o: [
          "Di abbinare agenti ad agenti, o agenti a oggetti, garantendo proprietà sociali desiderabili",
          "Di stabilire il prezzo di equilibrio in un mercato concorrenziale",
          "Di dividere un bene tra i membri di una coalizione",
          "Di trovare l'equilibrio di Nash nei giochi con molti giocatori",
        ],
        perche: "Esempi: studenti e alloggi, pazienti e donatori di rene, lavoratori e compiti. Il corso vedrà un algoritmo premiato con il Nobel per lo <b>stable matching</b>.",
      },
      // ---------------------------------------------------------------- 1.5
      {
        sez: "1.5",
        tipo: "multi",
        q: "Quali proprietà ha un <b>gioco combinatorio</b>? Seleziona tutte quelle giuste.",
        o: [
          "Due giocatori",
          "Informazione perfetta",
          "Nessun elemento casuale",
          "Finito: termina sempre",
          "Turni alternati",
          "Somma zero",
          "Mosse simultanee",
        ],
        ok: [0, 1, 2, 3, 4, 5],
        perche: "Le sei proprietà sono: due giocatori, informazione perfetta, niente caso, finito, a turni alternati, a somma zero. Le mosse simultanee sono tipiche dei giochi in forma normale (lezione 3).",
      },
      {
        sez: "1.5",
        q: "Quale di questi giochi <b>non</b> è combinatorio?",
        o: ["Poker", "Scacchi", "Dama", "Tris"],
        perche: "Nel poker ci sono carte coperte (informazione non perfetta) e un mazzo mescolato (caso): violano due proprietà. Scacchi, dama, tris e go sono gli esempi tipici di giochi combinatori.",
      },
      {
        sez: "1.5",
        tipo: "vf",
        q: "Il backgammon è un gioco combinatorio.",
        ok: false,
        perche: "Si tirano i dadi: c'è un elemento casuale, quindi non è combinatorio anche se è a informazione perfetta e a turni.",
      },
      // ---------------------------------------------------------------- 1.5.1
      {
        sez: "1.5.1",
        q: "Perché per scegliere la mossa migliore si assume un avversario perfetto?",
        o: [
          "Perché chi vince contro la best response dell'avversario vince anche contro ogni risposta peggiore: si ottiene una garanzia sul risultato",
          "Perché gli avversari reali giocano sempre in modo perfetto",
          "Perché altrimenti il gioco non sarebbe a somma zero",
          "Perché così l'albero di gioco diventa più piccolo",
        ],
        perche: "Ragionare sul caso peggiore dà un risultato che <b>non può essere peggiore</b> di quello calcolato, qualunque cosa faccia l'avversario.",
      },
      // ---------------------------------------------------------------- 1.5.2
      {
        sez: "1.5.2",
        q: "Nell'albero di gioco, che cosa rappresentano gli <b>archi</b>?",
        o: ["Le mosse", "Gli stati del gioco", "I giocatori", "Le probabilità degli esiti"],
        perche: "Nodi = stati (configurazioni della scacchiera), archi = mosse da uno stato al successivo, radice = stato attuale, foglie = stati terminali.",
      },
      // ---------------------------------------------------------------- 1.5.3
      {
        sez: "1.5.3",
        tipo: "multi",
        q: "Quali elementi servono per costruire un'IA per il tris, secondo la lezione?",
        o: [
          "Una rappresentazione della scacchiera e dello stato",
          "Una funzione di valutazione per sapere chi vince",
          "Una strategia di ricerca nell'albero di gioco",
          "Un database di aperture",
          "Una rete neurale addestrata su partite",
        ],
        ok: [0, 1, 2],
        perche: "Rappresentazione, funzione di valutazione e strategia di ricerca. Le basi di conoscenza (aperture, finali) compaiono solo tra le tecniche per giochi grandi come gli scacchi.",
      },
      {
        sez: "1.5.3",
        tipo: "vf",
        q: "Nella funzione di punteggio del tris (+1 vince MAX, 0 pareggio, −1 vince MIN) conta solo l'ordine dei valori, non la loro grandezza.",
        ok: true,
        perche: "Minimax confronta i valori con max e min: qualunque terna con vittoria > pareggio > sconfitta dà le stesse scelte.",
      },
      // ---------------------------------------------------------------- 1.5.4
      {
        sez: "1.5.4",
        q: "In uno stato non terminale in cui muove MAX, quanto vale MM(s)?",
        o: [
          "Il massimo dei valori minimax dei figli",
          "Il minimo dei valori minimax dei figli",
          "La media dei valori minimax dei figli",
          "Il valore della funzione di punteggio nello stato s",
        ],
        perche: "MM(s) = valore(s) se s è terminale, max dei figli se muove MAX, min dei figli se muove MIN. Il valore si calcola risalendo dalle foglie.",
      },
      {
        sez: "1.5.4",
        tipo: "numero",
        q: "Albero a due livelli: radice MAX, tre nodi MIN con foglie" +
          albero([[3, 12, 8], [2, 4, 6], [14, 5, 2]]) + "Qual è il valore minimax della radice?",
        ok: 3,
        perche: "I nodi MIN valgono min(3,12,8) = 3, min(2,4,6) = 2, min(14,5,2) = 2. La radice vale max(3,2,2) = 3: MAX sceglie la prima mossa.",
      },
      // ---------------------------------------------------------------- 1.5.5
      {
        sez: "1.5.5",
        q: "Quanti nodi ha l'albero completo del tris a partire dalla scacchiera vuota (quelli che visita Minimax senza potatura)?",
        o: ["549 946", "362 880 (cioè 9!)", "19 683 (cioè 3⁹)", "5 478"],
        perche: "549 946 è il numero misurato nel laboratorio: tutti i nodi dell'albero, stati intermedi compresi, fermandosi alle vittorie. Gli stati <i>distinti</i> legali sono solo 5 478: molti nodi rappresentano lo stesso stato raggiunto in ordini diversi, ed è quello che sfruttano le transposition table.",
      },
      // ---------------------------------------------------------------- 1.5.6
      {
        sez: "1.5.6",
        q: "Nella potatura alpha-beta, che cosa rappresenta α?",
        o: [
          "Il valore migliore (più alto) che MAX può garantirsi al livello corrente o sopra",
          "Il valore migliore (più basso) che MIN può garantirsi",
          "La profondità massima a cui arriva la ricerca",
          "Il numero di nodi già potati",
        ],
        perche: "α = miglior valore garantito a MAX lungo il percorso, β = miglior valore garantito a MIN. Si parte da α = −∞ e β = +∞.",
      },
      {
        sez: "1.5.6",
        q: "Quando si possono potare i figli rimanenti di un nodo?",
        o: ["Appena α ≥ β", "Appena α ≤ β", "Quando α = 0", "Quando si è visitata metà dei figli"],
        perche: "Con α ≥ β il nodo non potrà mai essere raggiunto con gioco ottimale: uno dei due giocatori ha già un'alternativa migliore più in alto.",
      },
      {
        sez: "1.5.6",
        tipo: "vf",
        q: "Con un ordine sfavorevole delle mosse, alpha-beta può restituire un valore diverso da quello di Minimax.",
        ok: false,
        perche: "Il risultato di alpha-beta è <b>sempre</b> identico a quello di Minimax. L'ordine delle mosse cambia solo quanto si pota, cioè quanto lavoro si risparmia.",
      },
      {
        sez: "1.5.6",
        tipo: "numero",
        q: "Sullo stesso albero" + albero([[3, 12, 8], [2, 4, 6], [14, 5, 2]]) +
          "esplorando i figli da sinistra a destra con alpha-beta, quante foglie <b>non</b> vengono visitate?",
        ok: 2,
        perche: "Dopo M1 la radice ha α = 3. In M2 la prima foglia vale 2, quindi β = 2 ≤ α: si potano le foglie 4 e 6. M3 va visitato tutto (14, 5, 2: β scende a 2 solo all'ultima foglia). Foglie saltate: 2.",
      },
      {
        sez: "1.5.6",
        q: "Nel caso ideale (mosse migliori esplorate per prime), quanti nodi visita alpha-beta, con b mosse per stato e profondità m?",
        o: [
          "Circa b<sup>m/2</sup>: a parità di tempo si cerca circa due volte più in profondità",
          "Circa b<sup>m</sup>/2: si risparmia metà del lavoro",
          "Circa m·b: la ricerca diventa lineare",
          "Esattamente b<sup>m</sup>, come Minimax",
        ],
        perche: "Da b<sup>m</sup> a circa b<sup>m/2</sup>: è la radice quadrata del lavoro. Con lo stesso tempo si raddoppia la profondità raggiungibile.",
      },
      // ---------------------------------------------------------------- 1.5.7
      {
        sez: "1.5.7",
        tipo: "multi",
        q: "Quali tecniche si usano in pratica quando anche alpha-beta non basta (scacchi, go)?",
        o: [
          "Ricerca a profondità fissa e iterative deepening",
          "Valutazione euristica degli stati non terminali",
          "Quiescence search",
          "Transposition table",
          "Move ordering",
          "Eliminazione iterata delle strategie dominate",
        ],
        ok: [0, 1, 2, 3, 4],
        perche: "Più le basi di conoscenza (aperture e finali). L'eliminazione iterata delle strategie dominate è un concetto dei giochi in forma normale (lezione 3).",
      },
      {
        sez: "1.5.7",
        q: "A che cosa serve una transposition table?",
        o: [
          "A memorizzare il valore di stati già visti, raggiungibili con sequenze di mosse diverse",
          "A ordinare le mosse in modo da potare di più",
          "A ricordare le aperture standard",
          "A continuare la ricerca nelle posizioni instabili",
        ],
        perche: "Lo stesso stato si raggiunge con ordini diversi delle mosse: con una tabella (hash) lo si valuta una volta sola.",
      },
      {
        sez: "1.5.7",
        q: "Che cosa fa la quiescence search?",
        o: [
          "Continua la ricerca oltre il limite di profondità solo nelle posizioni instabili, per esempio a metà di uno scambio di pezzi",
          "Ferma la ricerca quando la posizione diventa tranquilla e non succede più niente",
          "Riduce la profondità quando il tempo sta per scadere",
          "Cerca prima le mosse più promettenti",
        ],
        perche: "Fermarsi a metà di uno scambio darebbe una valutazione sbagliata (si vede il pezzo preso ma non la ripresa): la quiescence search prosegue finché la posizione non è stabile.",
      },
      // ---------------------------------------------------------------- 1.6.1
      {
        sez: "1.6.1",
        trappola: true,
        q: "In <code>check_winner</code> si controlla <code>line[0] != 0 and line[0] == line[1] == line[2]</code>. A che cosa serve <code>line[0] != 0</code>?",
        o: [
          "Senza, una riga vuota [0, 0, 0] verrebbe vista come “tre uguali” e darebbe un vincitore inesistente",
          "A escludere le righe in cui ha giocato O",
          "A velocizzare il controllo",
          "A riconoscere il pareggio",
        ],
        perche: "La cella vuota vale 0: tre celle vuote sono “uguali” come tre X. Il controllo esclude questo caso.",
      },
      // ---------------------------------------------------------------- 1.6.2
      {
        sez: "1.6.2",
        q: "Nel Minimax del laboratorio, dopo la chiamata ricorsiva si esegue <code>board[i][j] = 0</code>. Perché?",
        o: [
          "Perché la scacchiera viene modificata sul posto invece di copiata, quindi la mossa va annullata prima di provare la successiva",
          "Perché la cella (i, j) è stata vinta dall'avversario",
          "Per segnare la cella come già esplorata",
          "Per liberare memoria",
        ],
        perche: "È il <i>rollback</i>: si prova la mossa, si valuta, si annulla. Costa meno che copiare la scacchiera a ogni nodo.",
      },
      {
        sez: "1.6.2",
        trappola: true,
        q: "Nel pseudocodice del notebook, nel ramo MAX, il <code>return best</code> è indentato dentro il ciclo <code>for</code>. Che cosa succede?",
        o: [
          "La funzione restituisce il valore dopo aver provato solo la prima mossa",
          "Niente: Python ignora l'indentazione del return",
          "La funzione non termina mai",
          "Il valore viene calcolato correttamente ma più lentamente",
        ],
        perche: "Il return va <b>dopo</b> il ciclo, come nelle slide: altrimenti MAX valuta solo il primo figlio.",
      },
      // ---------------------------------------------------------------- 1.6.3
      {
        sez: "1.6.3",
        trappola: true,
        q: "In <code>find_best_move(board, player)</code>, dopo aver piazzato la mossa di <code>player</code> si chiama <code>minimax(board, ?)</code>. Quale secondo argomento è corretto (X = 1 è MAX, O = 2 è MIN)?",
        o: [
          "<code>player == 2</code>: ora tocca all'avversario",
          "<code>player == 1</code>: tocca ancora a chi ha mosso",
          "<code>True</code> sempre",
          "<code>False</code> sempre",
        ],
        perche: "Se ha mosso X (1) ora muove O, che minimizza: is_maximizing deve essere False, cioè player == 2. Usare player == 1 è l'errore tipico: l'IA valuterebbe le posizioni come se toccasse di nuovo a lei.",
      },
      {
        sez: "1.6.3",
        q: "Perché serve <code>find_best_move</code> oltre a <code>minimax</code>?",
        o: [
          "Perché minimax restituisce un valore, non una mossa: bisogna provare ogni mossa legale e tenere quella con il valore migliore",
          "Perché minimax funziona solo per MAX",
          "Perché minimax non controlla le mosse illegali",
          "Perché minimax non sa riconoscere le partite finite",
        ],
        perche: "Il valore dice quanto vale una posizione; per giocare serve sapere <i>quale</i> mossa lo realizza.",
      },
      // ---------------------------------------------------------------- 1.6.4
      {
        sez: "1.6.4",
        q: "Due IA Minimax giocano a tris l'una contro l'altra. Come finisce?",
        o: ["Sempre in pareggio", "Vince sempre chi inizia", "Vince sempre chi gioca per secondo", "Dipende dalla prima mossa casuale"],
        perche: "Il valore minimax della scacchiera vuota è 0: con gioco ottimale da entrambe le parti il tris è pari.",
      },
      {
        sez: "1.6.4",
        q: "Che cosa afferma il teorema di Zermelo, ricordato nel laboratorio?",
        o: [
          "In un gioco combinatorio finito o un giocatore ha una strategia che garantisce la vittoria, oppure entrambi possono garantirsi almeno il pareggio",
          "Ogni gioco finito ha un equilibrio di Nash in strategie miste",
          "In un gioco a somma zero il max-min coincide con il min-max",
          "Alpha-beta visita al più la radice quadrata dei nodi di Minimax",
        ],
        perche: "Il valore di ogni stato si calcola con l'induzione all'indietro, cioè esattamente con Minimax. Per il tris vale la seconda alternativa.",
      },
      // ---------------------------------------------------------------- 1.6.5
      {
        sez: "1.6.5",
        trappola: true,
        q: "Nel Minimax con alpha-beta del laboratorio le mosse si scorrono con due cicli annidati (i, j). Perché per potare si usa <code>return best</code> invece di <code>break</code>?",
        o: [
          "Perché break uscirebbe solo dal ciclo interno e il ciclo esterno continuerebbe a esplorare le righe successive",
          "Perché break in Python non funziona dentro due cicli",
          "Perché return è più veloce di break",
          "Perché break lascerebbe la mossa non annullata sulla scacchiera",
        ],
        perche: "Con due cicli il break interrompe solo quello su j. Il return va bene perché la mossa è già stata annullata prima del controllo. In alternativa si costruisce prima la lista delle celle vuote e si usa un solo ciclo.",
      },
      {
        sez: "1.6.5",
        q: "Quanti nodi visita alpha-beta a partire dalla scacchiera vuota del tris, contro i 549 946 di Minimax?",
        o: ["18 297 (circa il 3%)", "274 973 (circa la metà)", "54 995 (circa il 10%)", "741 (la radice quadrata)"],
        perche: "18 297 nodi: si pota circa il 97% dell'albero. In una partita intera IA contro IA: 36 684 nodi contro 618 175, circa 0,17 s contro 2,9 s.",
      },
      // ---------------------------------------------------------------- 1.6.6
      {
        sez: "1.6.6",
        tipo: "vf",
        q: "Se l'implementazione di Minimax è corretta, un umano che gioca contro l'IA può al massimo pareggiare.",
        ok: true,
        perche: "L'IA gioca in modo ottimale e il valore del tris è 0: un umano non può fare meglio del pareggio.",
      },
    ],

    // ------------------------------------------------------------------ generatori
    generatori: [
      {
        nome: "minimax",
        sez: "1.5.4",
        titolo: "Valore minimax di un albero",
        crea(r) {
          const g = [0, 1, 2].map(() => [0, 1, 2].map(() => r.int(1, 20)));
          const m = M.minimaxAlbero(g);
          return {
            tipo: "numero",
            q: "Radice MAX, tre nodi MIN con foglie" + albero(g) + "Qual è il valore minimax della radice?",
            ok: m.valore,
            perche: "Ogni nodo MIN prende il minimo delle sue foglie: " +
              m.mins.map((x, i) => "M" + (i + 1) + " = " + x).join(", ") +
              ". La radice MAX prende il massimo: <b>" + m.valore + "</b>.",
            dati: { gruppi: g },
          };
        },
      },
      {
        nome: "alphabeta",
        sez: "1.5.6",
        titolo: "Foglie potate da alpha-beta",
        crea(r) {
          const g = [0, 1, 2].map(() => [0, 1, 2].map(() => r.int(1, 20)));
          const ab = M.alphaBetaAlbero(g);
          const det = ab.dettagli.map((d, i) =>
            "M" + (i + 1) + ": " + d.viste + " foglie viste, vale " + (d.potate ? "≤ " : "") + d.valore +
            (d.potate ? " (" + d.potate + " potate)" : "")).join("; ");
          return {
            tipo: "numero",
            q: "Radice MAX, tre nodi MIN con foglie" + albero(g) +
              "Esplorando da sinistra a destra con alpha-beta, quante foglie <b>non</b> vengono visitate?",
            ok: ab.potate,
            tol: 0,
            perche: "La radice aggiorna α dopo ogni nodo MIN; dentro un nodo MIN si pota appena β ≤ α. " + det +
              ". Totale foglie saltate: <b>" + ab.potate + "</b>. Il valore resta " + ab.valore + ", come con Minimax.",
            dati: { gruppi: g },
          };
        },
      },
      {
        nome: "mossa",
        sez: "1.5.4",
        titolo: "Mossa scelta da MAX",
        crea(r) {
          let g, m;
          do {
            g = [0, 1, 2].map(() => [0, 1, 2].map(() => r.int(1, 20)));
            m = M.minimaxAlbero(g);
          } while (m.mins.filter((x) => x === m.valore).length > 1);
          return {
            tipo: "scelta",
            q: "Radice MAX, tre nodi MIN con foglie" + albero(g) + "Quale mossa sceglie MAX?",
            o: ["M1", "M2", "M3"],
            ok: m.mossa,
            ordine: true,
            perche: "Valori dei nodi MIN: " + m.mins.join(", ") + ". MAX sceglie quello con il valore più alto, <b>M" +
              (m.mossa + 1) + "</b>, anche se altri rami contengono foglie più alte: MIN non gliele lascerebbe mai raggiungere.",
            dati: { gruppi: g },
          };
        },
      },
    ],
  });
})();
