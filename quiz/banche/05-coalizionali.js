// Lezione 5 — Giochi coalizionali: struttura di coalizione, core, nucleolo, Shapley.
(function () {
  const { T, M, fmt } = QUIZ;

  const insieme = (S) => "{" + S.split("").join(", ") + "}";
  const giocoHTML = (v) =>
    T.tabella(["Coalizione", "{A}", "{B}", "{C}", "{A, B}", "{A, C}", "{B, C}", "{A, B, C}"],
      [["v", v.A, v.B, v.C, v.AB, v.AC, v.BC, v.ABC]]);
  const GELATO = { A: 0, B: 0, C: 0, AB: 750, AC: 750, BC: 0, ABC: 1000 };
  const SOLO_A = { A: 0, B: 0, C: 0, AB: 750, AC: 750, BC: 0, ABC: 750 };
  const DP = { A: 0, B: 300, C: 0, AB: 750, AC: 750, BC: 400, ABC: 1000 };

  QUIZ.aggiungi({
    numero: 5,
    titolo: "Giochi coalizionali",
    pdf: "lezione-05-coalizionali.pdf",
    sezioni: {
      "5.1": "Dai giochi non cooperativi a quelli coalizionali",
      "5.2": "Giochi in funzione caratteristica",
      "5.3": "Struttura di coalizione",
      "5.3.1": "Il problema è difficile",
      "5.3.2": "Programmazione dinamica",
      "5.4": "Dividere il payoff",
      "5.4.1": "Superadditività",
      "5.5": "Stabilità: il core",
      "5.5.1": "Due cattive notizie",
      "5.6": "Il nucleolo",
      "5.6.1": "L'algoritmo di Kopelowitz",
      "5.6.2": "Il nucleolo può essere iniquo",
      "5.7": "Equità: il valore di Shapley",
      "5.7.1": "Caratterizzazione assiomatica",
      "5.8.1": "Lab: rappresentare la funzione caratteristica",
      "5.8.2": "Lab: superadditività",
      "5.8.3": "Lab: core",
      "5.8.4": "Lab: valore di Shapley",
      "5.8.5": "Lab: struttura di coalizione e nucleolo",
    },
    domande: [
      // ---------------------------------------------------------------- 5.1
      {
        sez: "5.1",
        q: "Che cosa aggiungono i giochi coalizionali rispetto agli equilibri correlati?",
        o: [
          "I giocatori formano coalizioni e prendono accordi vincolanti, senza bisogno di un mediatore esterno",
          "Un dispositivo che raccomanda le azioni",
          "La possibilità di randomizzare le strategie",
          "Il calcolo con la programmazione lineare",
        ],
        perche: "Gli equilibri correlati modellano la cooperazione tramite un mediatore (il semaforo); nei giochi coalizionali la cooperazione nasce da accordi tra i giocatori.",
      },
      {
        sez: "5.1",
        q: "Quale di questi è un esempio di utilità <b>non trasferibile</b> (NTU)?",
        o: [
          "Il prestigio di aver scritto insieme un articolo scientifico",
          "Dividere i profitti di un'impresa comune",
          "Ripartire i costi di un impianto condiviso",
          "Assegnare seggi in parlamento a una coalizione di partiti",
        ],
        perche: "Con TU il valore si può ridistribuire con pagamenti laterali senza cambiare il totale; il prestigio di ciascun autore non si può cedere a un altro.",
      },
      {
        sez: "5.1",
        trappola: true,
        q: "Se i giocatori possono trasferirsi denaro, l'utilità è automaticamente trasferibile?",
        o: [
          "No: un ricco e un povero possono trarre utilità diverse dalla stessa somma. Assumere TU significa assumere utilità lineari nel denaro, uguali per tutti",
          "Sì, sempre",
          "Sì, se il gioco è superadditivo",
          "No, perché il denaro non è mai trasferibile",
        ],
        perche: "È il collegamento con la lezione 2: con una funzione di Bernoulli concava, 100 euro valgono di più per chi ne ha pochi.",
      },
      // ---------------------------------------------------------------- 5.2
      {
        sez: "5.2",
        q: "Che cos'è la funzione caratteristica v di un gioco (N, v)?",
        o: [
          "v : 2<sup>N</sup> → ℝ, che assegna a ogni coalizione C quanto possono guadagnare i suoi membri lavorando insieme",
          "La funzione che assegna a ogni giocatore il suo payoff finale",
          "La probabilità che si formi ciascuna coalizione",
          "La funzione di utilità di Bernoulli di ciascun giocatore",
        ],
        perche: "N è la grande coalizione; v(C) è un valore unico per la coalizione, che poi va diviso.",
      },
      {
        sez: "5.2",
        tipo: "multi",
        q: "Quali proprietà si assumono di solito per la funzione caratteristica, secondo la lezione?",
        o: ["Normalizzata: v(∅) = 0", "Non negativa: v(C) ≥ 0", "Monotona: C ⊆ D ⇒ v(C) ≤ v(D)", "Superadditiva", "Simmetrica tra i giocatori"],
        ok: [0, 1, 2],
        perche: "La superadditività è un'ipotesi in più, introdotta dopo per semplificare (si forma la grande coalizione). Non fa parte delle tre assunzioni di base.",
      },
      {
        sez: "5.2",
        tipo: "numero",
        q: "Gioco del gelato: A ha 6 $, B e C hanno 3 $ ciascuno; vaschette da 500 g a 7 $, 750 g a 9 $, 1000 g a 11 $. Quanto vale v({B, C})?",
        ok: 0,
        tol: 0,
        perche: "B e C insieme hanno 6 $: non bastano neanche per la vaschetta più piccola. Senza A non si compra nulla: v({A,B}) = v({A,C}) = 750, v({A,B,C}) = 1000.",
      },
      {
        sez: "5.2",
        q: "Quale relazione lega giochi NTU, giochi TU e giochi in funzione caratteristica?",
        o: ["NTU ⊃ TU ⊃ giochi in funzione caratteristica", "TU ⊃ NTU ⊃ funzione caratteristica", "Sono tre classi disgiunte", "Funzione caratteristica ⊃ TU ⊃ NTU"],
        perche: "Ogni gioco TU si rappresenta come NTU con un continuo di azioni; i giochi in funzione caratteristica sono i TU in cui il risultato di una coalizione non dipende dalle altre. In pratica si usano questi ultimi, spesso chiamati semplicemente “giochi TU”.",
      },
      {
        sez: "5.2",
        q: "Quando servono i giochi in <b>funzione di partizione</b>?",
        o: [
          "Quando il valore di una coalizione dipende da come si organizzano gli altri giocatori",
          "Quando l'utilità non è trasferibile",
          "Quando il gioco non è superadditivo",
          "Quando i giocatori sono più di tre",
        ],
        perche: "Si scrive v(C, P), con C coalizione della partizione P. Per l'utilità non trasferibile si usano invece i giochi NTU.",
      },
      // ---------------------------------------------------------------- 5.3
      {
        sez: "5.3",
        trappola: true,
        q: "Le slide definiscono la struttura di coalizione come un “ricoprimento” (cover) di N. Che cosa si intende davvero?",
        o: [
          "Una partizione: coalizioni che coprono N e sono a due a due disgiunte",
          "Un ricoprimento qualsiasi, anche con sovrapposizioni",
          "Una sola coalizione che contiene tutti",
          "Un insieme di coppie di giocatori",
        ],
        perche: "Con sovrapposizioni un giocatore verrebbe contato due volte nel benessere. Le slide stesse, più avanti, parlano di partizione.",
      },
      {
        sez: "5.3",
        tipo: "numero",
        q: "Con questa funzione caratteristica" + giocoHTML(DP) + "qual è il benessere massimo ottenibile con una struttura di coalizione?",
        ok: 1050,
        tol: 0,
        perche: "{{A, C}, {B}} dà 750 + 300 = 1050 > 1000: qui la grande coalizione non è la scelta migliore (il gioco non è superadditivo).",
      },
      // ---------------------------------------------------------------- 5.3.1
      {
        sez: "5.3.1",
        tipo: "numero",
        q: "Quante sono le strutture di coalizione (partizioni) di 4 giocatori, cioè i nodi del grafo delle partizioni mostrato a lezione?",
        ok: 15,
        tol: 0,
        perche: "È il numero di Bell B₄ = 15: 1 grande coalizione, 7 con due coalizioni, 6 con tre, 1 con tutti singoli. B<sub>n</sub> cresce tra (n/4)<sup>n/2</sup> e n<sup>n</sup>: enumerare è impraticabile.",
      },
      // ---------------------------------------------------------------- 5.3.2
      {
        sez: "5.3.2",
        q: "Quale equazione usa la programmazione dinamica per la struttura di coalizione?",
        o: [
          "v*(C) = max{ v(C), max<sub>C'∪C''=C, C'∩C''=∅</sub> v*(C') + v*(C'') }",
          "v*(C) = Σ<sub>i∈C</sub> v({i})",
          "v*(C) = max<sub>i∈C</sub> v(C \\ {i})",
          "v*(C) = v(C) + v*(N \\ C)",
        ],
        perche: "O la coalizione resta intera, o la si divide in due parti, ciascuna organizzata nel modo migliore. Si procede per dimensione crescente.",
      },
      {
        sez: "5.3.2",
        trappola: true,
        q: "Con v({B}) = 300, v({C}) = 0 e v({B, C}) = 400, quanto vale v*({B, C})?",
        o: ["400", "750", "300", "700"],
        perche: "max(v*(B) + v*(C), v(BC)) = max(300, 400) = 400. Le slide scrivono 750: è un errore, che non cambia il risultato finale perché 1050 viene da {A,C}|{B}.",
      },
      {
        sez: "5.3.2",
        q: "Perché la programmazione dinamica per la struttura di coalizione costa O(3<sup>n</sup>)?",
        o: [
          "Si considerano le coppie (coalizione C, sua parte C'): ogni giocatore sta in C', in C \\ C' o fuori da C, tre possibilità ciascuno",
          "Perché ci sono 3 giocatori",
          "Perché ogni coalizione si divide in tre parti",
          "Perché si risolvono tre programmi lineari per coalizione",
        ],
        perche: "Esatta ma impraticabile per n ≥ 20 (3<sup>20</sup> ≈ 3,5 miliardi). In pratica si usano euristiche e rappresentazioni compatte.",
      },
      // ---------------------------------------------------------------- 5.4
      {
        sez: "5.4",
        q: "v({1,2,3}) = 9, v({4,5}) = 4. Quale di questi è un esito con struttura ({1,2,3}, {4,5})?",
        o: ["(3, 3, 3, 3, 1)", "(2, 3, 2, 3, 3)", "(3, 3, 3, 2, 3)", "(4, 4, 4, 1, 0)"],
        perche: "Ogni coalizione deve distribuire esattamente il proprio valore (efficienza): 3 + 3 + 3 = 9 e 3 + 1 = 4. (2,3,2,3,3) dà 7 alla prima e 6 alla seconda: non si possono trasferire valori tra coalizioni.",
      },
      {
        sez: "5.4",
        q: "Quando un esito (CS, x) è un'<b>imputazione</b>?",
        o: [
          "Quando soddisfa la razionalità individuale: x<sub>i</sub> ≥ v({i}) per ogni i",
          "Quando è nel core",
          "Quando dà a tutti lo stesso payoff",
          "Quando la struttura è la grande coalizione",
        ],
        perche: "È il requisito minimo: nessuno riceve meno di quanto otterrebbe da solo.",
      },
      // ---------------------------------------------------------------- 5.4.1
      {
        sez: "5.4.1",
        q: "Quando un gioco (N, v) è superadditivo?",
        o: [
          "Quando v(C₁ ∪ C₂) ≥ v(C₁) + v(C₂) per ogni coppia di coalizioni disgiunte",
          "Quando v(C₁ ∪ C₂) ≤ v(C₁) + v(C₂)",
          "Quando v(N) è il valore più alto",
          "Quando v è monotona",
        ],
        perche: "Fondersi non fa mai perdere: si può assumere che si formi la grande coalizione, e un esito è solo un vettore x con Σx<sub>i</sub> = v(N).",
      },
      {
        sez: "5.4.1",
        q: "Molti articoli definiscono gli esiti come vettori con Σx<sub>i</sub> = v(N) anche per giochi non superadditivi. Perché è un'avvertenza da ricordare?",
        o: [
          "Perché in un gioco non superadditivo la struttura migliore può valere più di v(N): nell'esempio della programmazione dinamica dividere 1000 sarebbe sbagliato, perché si possono ottenere 1050",
          "Perché in quei giochi v(N) è sempre zero",
          "Perché la somma dei payoff deve essere zero",
          "Non è un'avvertenza: le due definizioni coincidono sempre",
        ],
        perche: "La semplificazione “si forma la grande coalizione” è giustificata solo dalla superadditività.",
      },
      // ---------------------------------------------------------------- 5.5
      {
        sez: "5.5",
        q: "Qual è la definizione di core?",
        o: [
          "L'insieme degli x con x<sub>i</sub> ≥ 0, Σ<sub>i∈N</sub> x<sub>i</sub> = v(N) e Σ<sub>i∈C</sub> x<sub>i</sub> ≥ v(C) per ogni C ⊆ N",
          "L'insieme delle imputazioni",
          "L'esito che massimizza il benessere",
          "L'insieme degli esiti che danno a tutti almeno la media v(N)/n",
        ],
        perche: "Esiti efficienti in cui ogni coalizione riceve almeno quanto guadagnerebbe da sola: nessuna vuole sganciarsi.",
      },
      {
        sez: "5.5",
        q: "Nel gioco del gelato, perché (200, 200, 600) non è nel core?",
        o: [
          "Perché A e B ricevono 400 ma da soli comprano 750 g: v({A,B}) = 750 > 400",
          "Perché C riceve troppo",
          "Perché la somma non è 1000",
          "Perché qualcuno riceve meno di v({i})",
        ],
        perche: "A e B possono comprare la vaschetta da 750 g e dividersela, 375 a testa: meglio di 200.",
      },
      {
        sez: "5.5",
        q: "v({1,2,3}) = 9, v({4,5}) = 4, v({2,4}) = 7. Perché l'esito (3, 3, 3, 3, 1) non è nel core?",
        o: [
          "Perché i giocatori 2 e 4 ricevono 3 + 3 = 6 < 7 e preferiscono formare {2, 4}",
          "Perché il giocatore 5 riceve solo 1",
          "Perché la somma è 13",
          "Perché la struttura non è la grande coalizione",
        ],
        perche: "Basta una coalizione con eccesso positivo per rendere l'esito instabile.",
      },
      {
        sez: "5.5",
        tipo: "numero",
        q: "Nel gioco del gelato, qual è il payoff <b>massimo</b> che B può ricevere in un esito del core?",
        ok: 250,
        tol: 0,
        perche: "Da x<sub>A</sub> + x<sub>C</sub> ≥ 750 e x<sub>A</sub> + x<sub>B</sub> + x<sub>C</sub> = 1000 segue x<sub>B</sub> ≤ 250. Lo stesso per C, quindi x<sub>A</sub> ≥ 500: B e C sono in concorrenza per fare coppia con A.",
      },
      // ---------------------------------------------------------------- 5.5.1
      {
        sez: "5.5.1",
        tipo: "vf",
        q: "Se un gioco è superadditivo, il suo core non è vuoto.",
        ok: false,
        perche: "Controesempio della lezione: v(i) = 0, v(12) = 7, v(13) = 6, v(23) = 5, v(N) = 8. È superadditivo ma ha core vuoto.",
      },
      {
        sez: "5.5.1",
        q: "v(i) = 0, v({1,2}) = 7, v({1,3}) = 6, v({2,3}) = 5, v(N) = 8. Come si vede che il core è vuoto?",
        o: [
          "Sommando i tre vincoli delle coppie: 2(x₁ + x₂ + x₃) ≥ 18, cioè la somma dovrebbe essere almeno 9, ma deve valere 8",
          "Perché v(N) < v({1,2})",
          "Perché il gioco non è superadditivo",
          "Perché nessun giocatore ha v({i}) > 0",
        ],
        perche: "Ogni giocatore compare in due coppie, quindi la somma delle tre disuguaglianze conta ogni x<sub>i</sub> due volte.",
      },
      {
        sez: "5.5.1",
        tipo: "vf",
        q: "Il core contiene solo esiti equi.",
        ok: false,
        perche: "Nel gelato (1000, 0, 0) è nel core: B e C mettono metà dei soldi e non ricevono nulla, ma nessuna coalizione può fare meglio da sola. Stabilità non vuol dire equità.",
      },
      // ---------------------------------------------------------------- 5.6
      {
        sez: "5.6",
        q: "Che cosa misura l'eccesso e(S, x) = v(S) − Σ<sub>i∈S</sub> x<sub>i</sub>?",
        o: [
          "L'insoddisfazione di S: quanto potrebbe guadagnare da sola in più rispetto a quello che riceve",
          "Il surplus che S porta alla grande coalizione",
          "Quanto S riceve in più del dovuto",
          "La differenza tra il valore di Shapley e il nucleolo",
        ],
        perche: "x è nel core se e solo se tutti gli eccessi sono ≤ 0 (per x efficiente e non negativo).",
      },
      {
        sez: "5.6",
        tipo: "numero",
        q: "v({i}) = 0, v({i,j}) = 1 per ogni coppia, v(N) = 3. Con x = (0, 0, 3), quanto vale l'eccesso della coalizione {1, 2}?",
        ok: 1,
        perche: "e({1,2}, x) = 1 − (0 + 0) = 1: la coppia è insoddisfatta. Con x = (1, 2, 0) sarebbe 1 − 3 = −2.",
      },
      {
        sez: "5.6",
        q: "Come si definisce il nucleolo?",
        o: [
          "L'imputazione che rende lessicograficamente minimo il vettore degli eccessi ordinato dal più grande al più piccolo",
          "L'imputazione che minimizza la somma degli eccessi",
          "L'imputazione che massimizza il minimo payoff",
          "Il centro del core",
        ],
        perche: "Prima si rende la coalizione più insoddisfatta la meno insoddisfatta possibile; a parità, la seconda; e così via.",
      },
      {
        sez: "5.6",
        q: "Gioco simmetrico: v({i}) = 0, v({i,j}) = 1, v(N) = 3. Qual è il nucleolo?",
        o: ["(1, 1, 1)", "(1, 2, 0)", "(0, 0, 3)", "(1,5; 1,5; 0)"],
        perche: "θ(1,1,1) = (−1,−1,−1,−1,−1,−1), mentre θ(1,2,0) = (0,0,−1,−1,−2,−2): il primo elemento −1 < 0 decide. Calcolato anche con l'algoritmo di Kopelowitz nel laboratorio.",
      },
      {
        sez: "5.6",
        tipo: "vf",
        q: "Se il core non è vuoto, il nucleolo sta nel core.",
        ok: true,
        perche: "Un esito del core ha tutti gli eccessi ≤ 0; il nucleolo minimizza il più grande, quindi anche il suo è ≤ 0. Il nucleolo esiste ed è unico: è la versione “più centrale” del core.",
      },
      // ---------------------------------------------------------------- 5.6.1
      {
        sez: "5.6.1",
        q: "Come funziona l'algoritmo di Kopelowitz per il nucleolo?",
        o: [
          "Risolve una sequenza di programmi lineari: minimizza l'eccesso massimo, fissa le coalizioni che lo raggiungono, poi minimizza il massimo tra le rimanenti, e così via",
          "Enumera tutte le imputazioni e sceglie la migliore",
          "Calcola il valore di Shapley e lo corregge",
          "Risolve un solo programma lineare con 2<sup>n</sup> variabili",
        ],
        perche: "Ogni programma ha O(2<sup>n</sup>) vincoli e nel caso peggiore servono fino a 2<sup>n</sup> iterazioni: molto poco pratico.",
      },
      {
        sez: "5.6.1",
        trappola: true,
        q: "Dopo aver risolto LP<sub>k</sub>, quali coalizioni vanno fissate all'eccesso ε*<sub>k</sub>?",
        o: [
          "Quelle il cui eccesso vale ε*<sub>k</sub> in tutte le soluzioni ottime, non solo in quella restituita dal risolutore",
          "Tutte quelle che hanno eccesso ε*<sub>k</sub> nella soluzione restituita",
          "Solo la prima trovata",
          "Tutte le coalizioni con eccesso negativo",
        ],
        perche: "Una soluzione ottima qualsiasi può avere per caso altre coalizioni a ε*<sub>k</sub> che in un'altra soluzione ottima potrebbero scendere: fissarle darebbe un risultato sbagliato. Nel laboratorio lo si controlla con un programma lineare in più per ogni candidata.",
      },
      // ---------------------------------------------------------------- 5.6.2
      {
        sez: "5.6.2",
        q: "Gioco “conta solo A”" + giocoHTML(SOLO_A) + "Qual è il nucleolo?",
        o: ["(750, 0, 0)", "(500, 125, 125)", "(250, 250, 250)", "(375, 375, 0)"],
        perche: "Il core contiene solo (750, 0, 0), e il nucleolo sta nel core. Assegna tutto ad A anche se B o C sono necessari per ottenere qualcosa: stabilità non implica equità. (500, 125, 125) è il valore di Shapley.",
      },
      {
        sez: "5.6.2",
        trappola: true,
        q: "Nello stesso gioco, qual è il vettore degli eccessi del nucleolo (750, 0, 0)?",
        o: ["(0, 0, 0, 0, 0, −750)", "(0, 0, 0, 0, 0, 0)", "(−750, 0, 0, 0, 0, 0)", "(750, 750, 0, 0, 0, 0)"],
        perche: "Le slide scrivono tutti zeri, ma e({A}) = 0 − 750 = −750. Le altre cinque coalizioni hanno eccesso 0.",
      },
      // ---------------------------------------------------------------- 5.7
      {
        sez: "5.7",
        q: "Come si definisce il valore di Shapley?",
        o: [
          "φ(i) = (1/|N|!) Σ<sub>π</sub> [v(B(π, i) ∪ {i}) − v(B(π, i))]: il contributo marginale medio di i su tutti gli ordini di ingresso",
          "φ(i) = v(N)/|N|",
          "φ(i) = v({i}) + (v(N) − Σ<sub>j</sub> v({j}))/|N|",
          "Il payoff di i nel nucleolo",
        ],
        perche: "B(π, i) sono i giocatori che precedono i nella permutazione π. Ogni ordine conta allo stesso modo.",
      },
      {
        sez: "5.7",
        tipo: "numero",
        q: "Valore di Shapley di <b>A</b> nel gioco del gelato" + giocoHTML(GELATO) + "(Due decimali o frazione.)",
        ok: 3500 / 6,
        tol: 0.05,
        perche: "Contributi di A nei 6 ordini: 0, 0, 750, 1000, 750, 1000. Media 3500/6 ≈ 583,33. B e C prendono 208,33 ciascuno.",
      },
      {
        sez: "5.7",
        tipo: "numero",
        q: "Valore di Shapley di <b>B</b> nel gioco “conta solo A”" + giocoHTML(SOLO_A),
        ok: 125,
        tol: 0.01,
        perche: "B contribuisce 750 solo nell'ordine A, B, C (entra subito dopo A); negli altri 5 ordini 0. Media 750/6 = 125. A riceve 500.",
      },
      {
        sez: "5.7",
        tipo: "vf",
        q: "Il valore di Shapley sta sempre nel core.",
        ok: false,
        perche: "Nel gioco “conta solo A” Shapley dà (500, 125, 125), ma x<sub>A</sub> + x<sub>B</sub> = 625 < 750 = v({A,B}). Nel gioco del gelato invece Shapley è nel core.",
      },
      // ---------------------------------------------------------------- 5.7.1
      {
        sez: "5.7.1",
        tipo: "multi",
        q: "Quali sono le quattro proprietà che caratterizzano in modo unico il valore di Shapley?",
        o: ["Efficienza", "Giocatore nullo", "Simmetria", "Additività", "Stabilità (appartenenza al core)", "Razionalità individuale"],
        ok: [0, 1, 2, 3],
        perche: "Efficienza (Σφ = v(N)), giocatore nullo (φ = 0 se non aggiunge mai nulla), simmetria (giocatori intercambiabili ricevono lo stesso), additività (φ(G₁ + G₂) = φ(G₁) + φ(G₂)). La stabilità non vale in generale.",
      },
      {
        sez: "5.7.1",
        q: "Nella formula sui sottoinsiemi φ(i) = Σ<sub>C∋i</sub> (|N| − |C|)!(|C| − 1)!/|N|! · (v(C) − v(C \\ {i})), che cosa rappresenta il coefficiente?",
        o: [
          "La frazione di permutazioni in cui i entra trovando esattamente C \\ {i}: (|C|−1)! ordini per chi viene prima, (|N|−|C|)! per chi viene dopo",
          "La probabilità che si formi la coalizione C",
          "Il peso della coalizione C nel nucleolo",
          "Un fattore di normalizzazione arbitrario",
        ],
        perche: "Si passa da n! permutazioni a 2<sup>n−1</sup> coalizioni che contengono i: è la formula da usare nel codice.",
      },
      {
        sez: "5.7.1",
        trappola: true,
        q: "Le slide chiamano l'assioma 2 “dummy player” e chiedono φ<sub>i</sub> = 0. Qual è la precisazione?",
        o: [
          "In molti testi il dummy aggiunge sempre esattamente v({i}) e riceve v({i}); chi riceve 0 è il null player, che non aggiunge mai nulla. Con v({i}) = 0 coincidono",
          "Non c'è differenza in nessun caso",
          "Il dummy player riceve sempre v(N)/n",
          "Il dummy player non esiste nei giochi superadditivi",
        ],
        perche: "Le slide scrivono anche “Shapely” invece di Shapley.",
      },
      // ---------------------------------------------------------------- 5.8.1
      {
        sez: "5.8.1",
        q: "Perché nel laboratorio la funzione caratteristica si rappresenta con un dizionario indicizzato da <code>frozenset</code>?",
        o: [
          "Perché i frozenset sono immutabili e quindi hashable, si possono usare come chiavi, e offrono le operazioni degli insiemi",
          "Perché sono più veloci delle liste",
          "Perché mantengono l'ordine dei giocatori",
          "Perché i set normali non supportano l'unione",
        ],
        perche: "Un set normale è mutabile e non può fare da chiave. Con i frozenset si scrive direttamente v[C1 | C2], C1 & C2, ecc.",
      },
      {
        sez: "5.8.1",
        trappola: true,
        q: "Il dizionario del notebook non contiene la coalizione vuota. Che cosa bisogna fare?",
        o: [
          "Usare v.get(S, 0) invece di v[S] dove può comparire ∅, per esempio nella formula di Shapley con C = {i}",
          "Niente: Python restituisce 0 per le chiavi mancanti",
          "Aggiungere ∅ con valore v(N)",
          "Escludere i giocatori singoli dal calcolo",
        ],
        perche: "v[frozenset()] darebbe un KeyError. La powerset fornita restituisce le 2<sup>n</sup> − 1 coalizioni non vuote (il commento del notebook dice 2<sup>n−1</sup>, sbagliando).",
      },
      // ---------------------------------------------------------------- 5.8.2
      {
        sez: "5.8.2",
        q: "Il gioco del notebook con v(A) = 6, v(B) = 12, v({A,B}) = 12 è superadditivo?",
        o: ["No: v({A,B}) = 12 < v(A) + v(B) = 18", "Sì", "Sì, perché v è monotona", "Non si può dire senza v(N)"],
        perche: "Basta una coppia di coalizioni disgiunte che viola la disuguaglianza.",
      },
      // ---------------------------------------------------------------- 5.8.3
      {
        sez: "5.8.3",
        trappola: true,
        q: "Il notebook ricava la grande coalizione con <code>max(characteristic_function)</code>. Perché funziona?",
        o: [
          "Perché per i frozenset l'operatore > significa “sovrainsieme proprio”: la grande coalizione contiene tutte le altre, e una volta incontrata max non la lascia più",
          "Perché max confronta la lunghezza degli insiemi",
          "Perché max restituisce l'ultima chiave inserita",
          "Perché max ordina alfabeticamente",
        ],
        perche: "Se la grande coalizione mancasse dal dizionario, max restituirebbe una coalizione qualsiasi senza segnalare nulla.",
      },
      {
        sez: "5.8.3",
        q: "Il notebook verifica se un esito è nel core ma non calcola il core. Come si può sapere se il core è vuoto?",
        o: [
          "Con un solo programma lineare di fattibilità: si cerca un x che soddisfi tutti i vincoli",
          "Enumerando tutti gli esiti interi",
          "Calcolando il valore di Shapley e controllando se è nel core",
          "Non si può fare con un calcolatore",
        ],
        perche: "Calcolarlo tutto richiederebbe di trovare i vertici del poliedro; per sapere solo se è vuoto basta la fattibilità. Applicato al gioco 7, 6, 5, 8 il risolutore conferma che non esiste.",
      },
      // ---------------------------------------------------------------- 5.8.4
      {
        sez: "5.8.4",
        q: "Perché il notebook raccomanda la formula sui sottoinsiemi invece di quella sulle permutazioni?",
        o: [
          "Perché richiede O(2<sup>n</sup>) operazioni per giocatore invece di O(n!): con 9 giocatori 2 ms contro 3,4 s",
          "Perché dà risultati più precisi",
          "Perché funziona anche per giochi non superadditivi",
          "Perché non richiede la funzione caratteristica",
        ],
        perche: "I due metodi danno gli stessi valori. Il codice scorre tutte le coalizioni per ogni giocatore, quindi in totale n·2<sup>n</sup>: comunque esponenziale.",
      },
      {
        sez: "5.8.4",
        trappola: true,
        q: "Il notebook elenca tra le proprietà di Shapley φ(i) ≥ v({i}). Quando vale?",
        o: [
          "Nei giochi superadditivi, dove ogni contributo marginale v(C ∪ {i}) − v(C) è ≥ v({i})",
          "Sempre",
          "Solo se il core non è vuoto",
          "Mai",
        ],
        perche: "Senza superadditività può fallire.",
      },
      // ---------------------------------------------------------------- 5.8.5
      {
        sez: "5.8.5",
        q: "Nel gioco del gelato, come si confrontano nucleolo e valore di Shapley?",
        o: [
          "Nucleolo (750, 125, 125), Shapley (583,33; 208,33; 208,33): entrambi nel core, ma il nucleolo bilancia le insoddisfazioni mentre Shapley premia i contributi marginali",
          "Coincidono",
          "Il nucleolo è fuori dal core, Shapley dentro",
          "Shapley è fuori dal core, il nucleolo dentro",
        ],
        perche: "Al nucleolo le coppie {A,B}, {A,C} e i singoli B e C hanno tutti eccesso −125.",
      },
    ],

    generatori: [
      {
        nome: "shapley",
        sez: "5.7",
        titolo: "Valore di Shapley a 3 giocatori",
        crea(r) {
          const v = { A: r.int(0, 2) * 10, B: r.int(0, 2) * 10, C: r.int(0, 2) * 10 };
          v.AB = v.A + v.B + r.int(0, 6) * 10;
          v.AC = v.A + v.C + r.int(0, 6) * 10;
          v.BC = v.B + v.C + r.int(0, 6) * 10;
          v.ABC = Math.max(v.AB + v.C, v.AC + v.B, v.BC + v.A) + r.int(0, 4) * 10;
          const g = r.pick(["A", "B", "C"]);
          const s = M.shapley3(v);
          const righe = s.contributi.map((c) => [c.ordine, c.mc.A, c.mc.B, c.mc.C]);
          return {
            tipo: "numero",
            q: "Funzione caratteristica" + giocoHTML(v) + "Qual è il valore di Shapley di <b>" + g + "</b>? (Due decimali o frazione.)",
            ok: s.phi[g],
            tol: 0.01,
            perche: "Contributi marginali nei 6 ordini di ingresso:" + T.tabella(["Ordine", "A", "B", "C"], righe) +
              "φ(" + g + ") = media della colonna " + g + " = <b>" + fmt(s.phi[g]) + "</b>. Controllo: φ(A) + φ(B) + φ(C) = " +
              fmt(s.phi.A + s.phi.B + s.phi.C) + " = v(N).",
            dati: { v, g },
          };
        },
      },
      {
        nome: "core",
        sez: "5.5",
        titolo: "Un esito è nel core?",
        crea(r) {
          const N = r.int(6, 12) * 10;
          const v = { A: 0, B: 0, C: 0, AB: r.int(0, N / 10) * 10, AC: r.int(0, N / 10) * 10, BC: r.int(0, N / 10) * 10, ABC: N };
          const candidati = [];
          for (let a = 0; a <= N; a += 10) {
            for (let b = 0; a + b <= N; b += 10) {
              const x = { A: a, B: b, C: N - a - b };
              candidati.push({ x, ok: M.nelCore(v, x) });
            }
          }
          const dentro = candidati.filter((c) => c.ok), fuori = candidati.filter((c) => !c.ok);
          const scelto = dentro.length && (r.next() < 0.5 || !fuori.length) ? r.pick(dentro) : r.pick(fuori);
          const x = scelto.x;
          const viol = M.violazioniCore(v, x);
          return {
            tipo: "vf",
            q: "Funzione caratteristica" + giocoHTML(v) + "L'esito x = (x<sub>A</sub>, x<sub>B</sub>, x<sub>C</sub>) = (" + x.A + ", " + x.B + ", " + x.C + ") è nel core.",
            ok: scelto.ok,
            perche: "La somma è " + N + " = v(N) e i payoff sono non negativi; resta la stabilità. " +
              (viol.length
                ? "La coalizione " + insieme(viol[0]) + " riceve " + viol[0].split("").reduce((s, gg) => s + x[gg], 0) +
                  " ma da sola vale " + v[viol[0]] + ": eccesso positivo, quindi <b>non</b> è nel core."
                : "Ogni coppia riceve almeno il proprio valore (A,B: " + (x.A + x.B) + " ≥ " + v.AB + "; A,C: " + (x.A + x.C) + " ≥ " + v.AC +
                  "; B,C: " + (x.B + x.C) + " ≥ " + v.BC + "): <b>è</b> nel core."),
            dati: { v, x },
          };
        },
      },
      {
        nome: "eccesso",
        sez: "5.6",
        titolo: "Eccesso di una coalizione",
        crea(r) {
          const N = r.int(6, 12) * 10;
          const v = { A: r.int(0, 2) * 5, B: r.int(0, 2) * 5, C: r.int(0, 2) * 5, AB: r.int(2, 8) * 10, AC: r.int(2, 8) * 10, BC: r.int(2, 8) * 10, ABC: N };
          const a = r.int(0, N / 10) * 10, b = r.int(0, N / 10 - a / 10) * 10;
          const x = { A: a, B: b, C: N - a - b };
          const S = r.pick(["A", "B", "C", "AB", "AC", "BC"]);
          const e = M.eccesso(v, S, x);
          return {
            tipo: "numero",
            q: "Funzione caratteristica" + giocoHTML(v) + "Esito x = (" + x.A + ", " + x.B + ", " + x.C + "). Quanto vale l'eccesso e(" + insieme(S) + ", x)?",
            ok: e,
            tol: 0,
            perche: "e(S, x) = v(S) − Σ<sub>i∈S</sub> x<sub>i</sub> = " + v[S] + " − " + S.split("").reduce((s, g) => s + x[g], 0) + " = <b>" + e + "</b>. " +
              (e > 0 ? "Positivo: la coalizione è insoddisfatta e l'esito non è nel core." : "Non positivo: questa coalizione non ha motivo di sganciarsi."),
            dati: { v, x, S },
          };
        },
      },
      {
        nome: "superadditivo",
        sez: "5.4.1",
        titolo: "Il gioco è superadditivo?",
        crea(r) {
          const v = { A: r.int(0, 3) * 10, B: r.int(0, 3) * 10, C: r.int(0, 3) * 10 };
          const vuoleSi = r.next() < 0.5;
          const extra = () => (vuoleSi ? r.int(0, 5) * 10 : r.int(-2, 4) * 10);
          v.AB = Math.max(0, v.A + v.B + extra());
          v.AC = Math.max(0, v.A + v.C + extra());
          v.BC = Math.max(0, v.B + v.C + extra());
          v.ABC = Math.max(v.AB + v.C, v.AC + v.B, v.BC + v.A) + (vuoleSi ? r.int(0, 3) * 10 : r.int(-3, 2) * 10);
          const s = M.superadditivo3(v);
          return {
            tipo: "vf",
            q: "Funzione caratteristica" + giocoHTML(v) + "Il gioco è superadditivo.",
            ok: s.ok,
            perche: s.ok
              ? "Per ogni coppia di coalizioni disgiunte v(C₁ ∪ C₂) ≥ v(C₁) + v(C₂): le tre coppie di singoli e i tre casi “singolo + coppia” sono tutti rispettati."
              : "No: v(" + insieme((s.s + s.t).split("").sort().join("")) + ") = " + M.val(v, (s.s + s.t).split("").sort().join("")) +
                " < v(" + insieme(s.s) + ") + v(" + insieme(s.t) + ") = " + (M.val(v, s.s) + M.val(v, s.t)) + ". Basta una coppia che viola la disuguaglianza.",
            dati: { v },
          };
        },
      },
      {
        nome: "struttura",
        sez: "5.3.2",
        titolo: "Struttura di coalizione ottima",
        crea(r) {
          const v = { A: r.int(0, 4) * 10, B: r.int(0, 4) * 10, C: r.int(0, 4) * 10, AB: r.int(2, 9) * 10, AC: r.int(2, 9) * 10, BC: r.int(2, 9) * 10, ABC: r.int(5, 14) * 10 };
          const s = M.strutturaOttima3(v);
          const nome = (p) => "{" + p.map(insieme).join(", ") + "}";
          return {
            tipo: "numero",
            q: "Funzione caratteristica (il gioco può non essere superadditivo)" + giocoHTML(v) +
              "Qual è il benessere massimo v*(N) ottenibile con una struttura di coalizione?",
            ok: s.best.w,
            tol: 0,
            perche: "Con 3 giocatori le partizioni sono B₃ = 5:<br>" +
              s.valori.map((x) => nome(x.p) + " → " + x.w).join("<br>") + "<br>La migliore è " + nome(s.best.p) + " con <b>" + s.best.w + "</b>.",
            dati: { v },
          };
        },
      },
      {
        nome: "core-vuoto",
        sez: "5.5.1",
        titolo: "Il core è vuoto?",
        crea(r) {
          const N = r.int(6, 12) * 10;
          const v = { A: 0, B: 0, C: 0, AB: r.int(2, N / 10) * 10, AC: r.int(2, N / 10) * 10, BC: r.int(2, N / 10) * 10, ABC: N };
          const pieno = M.coreNonVuoto3(v);
          const somma = v.AB + v.AC + v.BC;
          return {
            tipo: "vf",
            q: "Funzione caratteristica" + giocoHTML(v) + "Il core di questo gioco è <b>vuoto</b>.",
            ok: !pieno,
            perche: "Sommando i vincoli delle tre coppie ogni x<sub>i</sub> compare due volte: 2·v(N) ≥ v(AB) + v(AC) + v(BC). Qui 2·" + N + " = " + 2 * N +
              (somma <= 2 * N ? " ≥ " : " < ") + somma + ". " +
              (pieno ? "La condizione è rispettata (e ogni coppia vale al più v(N)), quindi il core <b>non</b> è vuoto."
                : "La condizione è violata: il core è vuoto, come nel gioco 7, 6, 5, 8 della lezione."),
            dati: { v },
          };
        },
      },
    ],
  });
})();
