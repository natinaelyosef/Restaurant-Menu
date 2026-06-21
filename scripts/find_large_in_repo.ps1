# Find largest directories under the project root (fast scan of top-level items)
$path = 'C:\xampp\htdocs\Restaurant-Menu'
Write-Host "Scanning top-level entries in $path (this may take a few moments)..."
$items = Get-ChildItem -LiteralPath $path -Force -ErrorAction SilentlyContinue | ForEach-Object {
    $entry = $_
    $size = 0
    try {
        if ($entry.PSIsContainer) {
            $size = (Get-ChildItem -LiteralPath $entry.FullName -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        } else {
            $size = (Get-Item -LiteralPath $entry.FullName -ErrorAction SilentlyContinue).Length
        }
    } catch { }
    [PSCustomObject]@{Path = $entry.FullName; Size = $size}
}
$items | Sort-Object Size -Descending | Select-Object -First 30 | ForEach-Object {
    $sz = $_.Size
    if ($sz -ge 1GB) { $human = '{0:N2} GB' -f ($sz/1GB) }
    elseif ($sz -ge 1MB) { $human = '{0:N2} MB' -f ($sz/1MB) }
    else { $human = '{0:N2} KB' -f ($sz/1KB) }
    Write-Host "$human`t$($_.Path)"
}

Write-Host "\nAlso check system temporary folders and large user folders (Downloads, Videos)."