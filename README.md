# Algorithmic Game Theory — appunti e progetto

Appunti in italiano del corso di Algorithmic Game Theory (Università della Calabria, a.a. 2026/2027), in vista dell'appello di gennaio.

- [`main.pdf`](main.pdf): appunti di tutte le lezioni, teoria e laboratori
- [`project.pdf`](project.pdf): documento di lavoro per il progetto d'esame (metodo, idee, domande aperte, decisioni)

## Struttura

```
main.tex        documento unico con tutte le lezioni
project.tex     documento del progetto
preambolo.tex   stile comune (font, colori, box, codice)
compila.ps1     script di compilazione
N/lezione.tex   teoria e laboratorio della lezione N
```

Le slide e i notebook originali del docente non sono nel repository: vanno messi a mano nelle cartelle delle lezioni.

## Compilazione

Dipendenze e istruzioni di installazione sono in [`requirements.txt`](requirements.txt).

```powershell
powershell -File compila.ps1            # main.pdf e project.pdf
powershell -File compila.ps1 project    # solo project.pdf
```
