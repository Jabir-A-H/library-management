# Define the root folder as the parent folder of the current "extras" directory
$RootPath = Resolve-Path ".."

# Output file name (saved in current directory)
$OutputFile = "project_tree.txt"

# Recursive function to display folder tree with file sizes
function Show-Tree {
    param (
        [string]$Path,
        [string]$Indent = ""
    )

    $items = Get-ChildItem -LiteralPath $Path | Sort-Object { -not $_.PSIsContainer }, Name
    $count = $items.Count

    for ($i = 0; $i -lt $count; $i++) {
        $item = $items[$i]
        $isLast = ($i -eq $count - 1)
        $prefix = if ($isLast) { "└── " } else { "├── " }
        $nextIndent = if ($isLast) { "$Indent    " } else { "$Indent│   " }

        if ($item.PSIsContainer) {
            Write-Output "$Indent$prefix$item"
            Show-Tree -Path $item.FullName -Indent $nextIndent
        }
        else {
            $sizeKB = "{0:N2} KB" -f ($item.Length / 1KB)
            Write-Output "$Indent$prefix$item ($sizeKB)"
        }
    }
}

# Write the root folder name as the top-level header
$rootFolderName = Split-Path $RootPath -Leaf
Write-Output $rootFolderName | Out-File -FilePath $OutputFile -Encoding utf8

# Generate the tree and append to the output file
Show-Tree -Path $RootPath | Out-File -FilePath $OutputFile -Encoding utf8 -Append

Write-Host "Project tree saved to $OutputFile"
