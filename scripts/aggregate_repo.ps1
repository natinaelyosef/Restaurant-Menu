$RepoRoot = Get-Location
$OutFile = Join-Path $RepoRoot.Path 'all_files_and_dirs.txt'
if (Test-Path $OutFile) { Remove-Item -LiteralPath $OutFile -Force }
"Repository root: $($RepoRoot.Path)" | Out-File -FilePath $OutFile -Encoding utf8
"" | Out-File -FilePath $OutFile -Append -Encoding utf8
"=== Directory tree ===" | Out-File -FilePath $OutFile -Append -Encoding utf8
Get-ChildItem -Recurse -Force -Directory | Where-Object { $_.FullName -notmatch '\\(vendor|node_modules|storage)($|\\)' } | ForEach-Object {
    $rel = $_.FullName.Substring($RepoRoot.Path.Length + 1)
    $rel | Out-File -FilePath $OutFile -Append -Encoding utf8
}
"" | Out-File -FilePath $OutFile -Append -Encoding utf8
"=== Files and contents ===" | Out-File -FilePath $OutFile -Append -Encoding utf8
Get-ChildItem -Recurse -Force -File | Where-Object { $_.FullName -notmatch '\\(vendor|node_modules|storage)($|\\)' } | Sort-Object FullName | ForEach-Object {
    $relPath = $_.FullName.Substring($RepoRoot.Path.Length + 1)
    "---- FILE: $relPath ----" | Out-File -FilePath $OutFile -Append -Encoding utf8
    try {
        $content = Get-Content -Raw -Encoding UTF8 -ErrorAction Stop -Path $_.FullName
        $content | Out-File -FilePath $OutFile -Append -Encoding utf8
    } catch {
        try {
            $content = Get-Content -Raw -ErrorAction Stop -Path $_.FullName
            $content | Out-File -FilePath $OutFile -Append -Encoding utf8
        } catch {
            "[BINARY OR UNREADABLE: $relPath]" | Out-File -FilePath $OutFile -Append -Encoding utf8
        }
    }
}
