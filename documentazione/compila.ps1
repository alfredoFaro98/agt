# Compila i documenti in pdf\. I file ausiliari finiscono in build\.
#   powershell -File compila.ps1            -> tutto (lezioni, main, project)
#   powershell -File compila.ps1 lezioni    -> solo i PDF delle singole lezioni
#   powershell -File compila.ps1 02         -> solo la lezione 02
#   powershell -File compila.ps1 project    -> solo project.pdf
# Due passate: la seconda sistema indice e riferimenti.
param(
    # ValueFromRemainingArguments: cosi' "compila.ps1 02 main" passa entrambi.
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Cosa = @('lezioni', 'main', 'project')
)

Set-Location $PSScriptRoot
New-Item -ItemType Directory -Force build, pdf | Out-Null

function Invoke-Pdflatex {
    param([string]$Nome, [string]$Sorgente)
    foreach ($pass in 1..2) {
        pdflatex -interaction=nonstopmode -halt-on-error `
                 -aux-directory=build -output-directory=pdf `
                 "-jobname=$Nome" $Sorgente | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Errore in $Nome (passata $pass). Dettagli in build\$Nome.log:" -ForegroundColor Red
            Select-String -Path "build\$Nome.log" -Pattern '^!' -Context 0, 4 | Select-Object -First 3
            exit 1
        }
    }
    Write-Host "OK -> pdf\$Nome.pdf" -ForegroundColor Green
}

# Una cartella per lezione in lezioni\, con dentro lezione.tex.
# Il nome della cartella e' NN-slug: NN da' il numero, il nome intero da' il PDF.
$lezioni = Get-ChildItem -Directory lezioni | Sort-Object Name

# 'lezioni' si espande nell'elenco dei numeri: 01, 02, ...
$voci = @()
foreach ($voce in $Cosa) {
    if ($voce -eq 'lezioni') { $voci += $lezioni.Name.Substring(0, 2) } else { $voci += $voce }
}

foreach ($voce in $voci) {
    if ($voce -match '^\d{2}$') {
        $lez = $lezioni | Where-Object { $_.Name.StartsWith($voce) } | Select-Object -First 1
        if (-not $lez) {
            Write-Host "Nessuna lezione $voce in lezioni\" -ForegroundColor Red
            exit 1
        }
        $num = [int]$voce
        $arg = "\def\lezNum{$num}\def\lezPath{lezioni/$($lez.Name)/lezione}\input{lezione-standalone}"
        Invoke-Pdflatex -Nome "lezione-$($lez.Name)" -Sorgente $arg
    }
    else {
        Invoke-Pdflatex -Nome $voce -Sorgente "$voce.tex"
    }
}
