# Compila i documenti. I file ausiliari finiscono in build/.
#   powershell -File compila.ps1            -> main.pdf e project.pdf
#   powershell -File compila.ps1 project    -> solo project.pdf
# Due passate: la seconda sistema indice e riferimenti.
param([string[]]$Documenti = @('main', 'project'))
Set-Location $PSScriptRoot
New-Item -ItemType Directory -Force build | Out-Null
foreach ($doc in $Documenti) {
    foreach ($pass in 1..2) {
        pdflatex -interaction=nonstopmode -halt-on-error -aux-directory=build "$doc.tex" | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Errore in $doc.tex (passata $pass). Dettagli in build\$doc.log:" -ForegroundColor Red
            Select-String -Path "build\$doc.log" -Pattern '^!' -Context 0,4 | Select-Object -First 3
            exit 1
        }
    }
    Write-Host "OK -> $doc.pdf" -ForegroundColor Green
}
