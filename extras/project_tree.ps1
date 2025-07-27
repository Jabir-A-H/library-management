# Define the root folder as the folder where the script is called
$RootPath = Get-Location

# Output file name (saved in current directory)
$OutputFile = "project_tree.txt"

# List of common folders to exclude (as found in .gitignore)
$ExcludeFolders = @('venv', 'node_modules', '.git', '__pycache__', '.idea', '.vscode', 'build', 'dist', '.mypy_cache', '.pytest_cache', '.cache')

# Recursive function to display folder tree with file sizes, excluding specified folders
function Show-Tree {
    param (
        [string]$Path,
        [string]$Indent = "",
        [string[]]$ExcludeFolders = @()
    )

    $items = Get-ChildItem -LiteralPath $Path | Sort-Object { -not $_.PSIsContainer }, Name
    $items = $items | Where-Object {
        if ($_.PSIsContainer) {
            $ExcludeFolders -notcontains $_.Name
        } else {
            $true
        }
    }
    $count = $items.Count

    for ($i = 0; $i -lt $count; $i++) {
        $item = $items[$i]
        $isLast = ($i -eq $count - 1)
        $prefix = if ($isLast) { "└── " } else { "├── " }
        $nextIndent = if ($isLast) { "$Indent    " } else { "$Indent│   " }

        if ($item.PSIsContainer) {
            Write-Output "$Indent$prefix$item"
            Show-Tree -Path $item.FullName -Indent $nextIndent -ExcludeFolders $ExcludeFolders
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

# Generate the tree and append to the output file, excluding specified folders
Show-Tree -Path $RootPath -ExcludeFolders $ExcludeFolders | Out-File -FilePath $OutputFile -Encoding utf8 -Append

Write-Host "Project tree saved to $OutputFile"