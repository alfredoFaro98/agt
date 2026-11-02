# Algorithmic Game Theory — appunti e progetto

Appunti in italiano del corso di Algorithmic Game Theory (Università della Calabria, a.a. 2026/2027), in vista dell'appello di gennaio. Sono la traduzione e la rispiegazione delle lezioni del docente, teoria e laboratori insieme.

Tutti i PDF generati stanno in [`documentazione/pdf/`](documentazione/pdf/):

- [`guida-studio.pdf`](documentazione/pdf/guida-studio.pdf): **da leggere per primo**. Come studiare dagli appunti e mappa del corso, in due pagine
- un PDF per ogni lezione, `lezione-NN-nome.pdf`
- [`main.pdf`](documentazione/pdf/main.pdf): tutte le lezioni in un unico documento
- [`project.pdf`](documentazione/pdf/project.pdf): documento di lavoro per il progetto d'esame (metodo, idee, domande aperte, decisioni)

Per esercitarsi: **[`quiz/index.html`](quiz/)**, da aprire con un doppio clic nel browser (non serve installare nulla). Domande divise per lezione con spiegazione e rimando alla sezione degli appunti, più esercizi di calcolo con numeri sempre nuovi; le domande sbagliate si possono ripetere.

| Lezione | Argomento | Laboratorio |
|---|---|---|
| 1 | Introduzione all'AGT, giochi combinatori | Minimax e alpha-beta per il tris |
| 2 | Teoria dell'utilità (VNM, rischio) | Battaglia navale e ricerca bayesiana |
| 3 | Giochi non cooperativi (Nash, minimax) | Best response, minimax con PL, label propagation |
| 4 | Esistenza e complessità degli equilibri, equilibri correlati, apprendimento | Equilibri correlati con PL, fictitious play, regret matching |
| 5 | Giochi coalizionali (core, nucleolo, Shapley) | Core e valore di Shapley |

## Struttura

```
documentazione/              il LaTeX che scriviamo noi
  lezioni/
    01-introduzione/lezione.tex
    02-utilita/lezione.tex        una cartella per lezione
    ...
  pdf/                            tutti i PDF generati
  main.tex                        unisce tutte le lezioni
  project.tex                     documento del progetto
  guida-studio.tex                guida grafica allo studio
  preambolo.tex                   stile comune (font, colori, box, codice)
  lezione-standalone.tex          wrapper per i PDF di singola lezione
  compila.ps1                     script di compilazione

quiz/                        applicativo dei quiz
  index.html, app.js, motore.js   interfaccia e calcoli
  banche/NN-nome.js               una banca di domande per lezione
  test/                           collaudo: node quiz/test/verifica.js,
                                  poi python quiz/test/verifica_generatori.py

lessons/                     slide del docente
labs/
  01-minimax/                     notebook del laboratorio 1
  02-battleship/                  notebook e slide del laboratorio 2
    papers/                       paper di supporto
  03-non-cooperativi/             notebook e slide del laboratorio 3
  04-learning-in-games/           notebook del laboratorio 4
  05-coalizionali/                notebook e slide del laboratorio 5
```

Lezioni e laboratori usano la stessa convenzione per i nomi delle cartelle:
`NN-nome`, con `NN` uguale al numero della lezione.

`lessons/` e `labs/` contengono materiale del docente e non sono nel repository:
vanno messi a mano in locale.

Per aggiungere una lezione: creare `documentazione/lezioni/NN-nome/lezione.tex`
e includerlo in `main.tex`. Il PDF singolo lo genera `compila.ps1` da solo,
leggendo il nome della cartella. Per il quiz: aggiungere `quiz/banche/NN-nome.js`
e una riga `<script>` in `quiz/index.html`, poi lanciare i due test.

## Compilazione

Dipendenze e istruzioni di installazione sono in [`requirements.txt`](requirements.txt).

```powershell
cd documentazione
powershell -File compila.ps1                 # tutto: lezioni, main, project, guida
powershell -File compila.ps1 lezioni         # solo i PDF delle singole lezioni
powershell -File compila.ps1 02              # solo la lezione 02
powershell -File compila.ps1 project         # solo project.pdf
powershell -File compila.ps1 guida-studio    # solo la guida allo studio
```
