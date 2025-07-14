<#
.SYNOPSIS
    Creates a backup of the library PostgreSQL database
.DESCRIPTION
    This script backs up the library database to F:\WebDev\library-management\extras\database_backups in both plain SQL and directory format backups with automatic parallel job optimization for the host system.
.NOTES
    File Name      : Backup-LibraryDB.ps1
    Prerequisite   : PostgreSQL installed, pg_dump available in PATH
#>

if (-not (Get-Command pg_dump -ErrorAction SilentlyContinue)) {
    throw "pg_dump is not available in the system PATH. Please install PostgreSQL CLI tools."
}

# Configuration variables
$hostname = "localhost"
$port = "5432"
$username = "postgres"
$database = "library_db"
$backupRoot = "F:\WebDev\library-management\extras\database_backups"
$logFile = "$backupRoot\backup.log"

# Initialize logging
function Log-Message {
    param (
        [string]$message,
        [switch]$ToConsole = $false,
        [ConsoleColor]$Color = "Gray"
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] $message"
    Add-Content -Path $logFile -Value $logEntry
    if ($ToConsole) {
        Write-Host $logEntry -ForegroundColor $Color
    }
}

# Rotate log if too big
if ((Test-Path $logFile) -and ((Get-Item $logFile).Length -gt 5MB)) {
    Rename-Item $logFile "$logFile.old" -Force
    Log-Message "Rotated log file"
}

Log-Message "===== DUAL FORMAT BACKUP STARTED $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') ====="
Log-Message "Initializing..."

# Create backup directory if it doesn't exist
if (-not (Test-Path -Path $backupRoot)) {
    Log-Message "Backup directory not found. Creating..." -ToConsole -Color Yellow
    New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null
    Log-Message "Created backup directory"
}

# Calculate optimal parallel jobs
$physicalCores = (Get-CimInstance Win32_Processor).NumberOfCores
$parallelJobs = if ($physicalCores -le 2) {
    [Math]::Min($physicalCores, 2)
} else {
    [Math]::Min([int]($physicalCores * 1.5), 8)
}
Log-Message "Detected $physicalCores physical cores -> Using $parallelJobs parallel jobs"

try {
    # Prompt for password securely
    $password = Read-Host "Enter PostgreSQL password for user '$username'" -AsSecureString
    $plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
    )

    $env:PGPASSWORD = $plainPassword

    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

    Log-Message "Starting database backup..." -ToConsole -Color Cyan

    # Plain SQL backup
    $sqlFile = "$backupRoot\${database}_plain_$timestamp.sql"
    $sqlCommand = "pg_dump -h $hostname -p $port -U $username -d $database -F p -b -f `"$sqlFile`""
    Log-Message "Executing plain SQL backup..."
    $sqlResult = Invoke-Expression $sqlCommand 2>&1
    if ($LASTEXITCODE -ne 0) { throw "Plain backup failed: $sqlResult" }

    # Directory format backup
    $dirBackup = "$backupRoot\${database}_dir_$timestamp"
    $dirCommand = "pg_dump -h $hostname -p $port -U $username -d $database -F d -j $parallelJobs -b -f `"$dirBackup`""
    Log-Message "Executing directory format backup with $parallelJobs jobs..."
    $dirResult = Invoke-Expression $dirCommand 2>&1
    if ($LASTEXITCODE -ne 0) { throw "Directory backup failed: $dirResult" }

    # Verify backups
    $success = $true
    if (-not (Test-Path $sqlFile)) {
        Log-Message "WARNING: Plain SQL file not created"
        $success = $false
    }
    if (-not (Test-Path "$dirBackup\toc.dat")) {
        Log-Message "WARNING: Directory backup incomplete (missing toc.dat)"
        $success = $false
    }

	if ($success) {
		# Existing log + display code...

		# Compare with previous backup
		$previousSqlFile = Get-ChildItem -Path $backupRoot -Filter "*.sql" |
			Where-Object { $_.FullName -ne $sqlFile } |
			Sort-Object LastWriteTime -Descending |
			Select-Object -First 1

		if ($previousSqlFile) {
			$prevHash = Get-FileHash -Path $previousSqlFile.FullName -Algorithm SHA256
			$currHash = Get-FileHash -Path $sqlFile -Algorithm SHA256

			if ($prevHash.Hash -eq $currHash.Hash) {
				Log-Message "NO CHANGES DETECTED: Backup identical to previous ($($previousSqlFile.Name))"
				Write-Host "`nIdentical backup detected!" -ForegroundColor Yellow
				Write-Host "[K]eep both  [D]elete new backup  [R]ename new backup as duplicate" -ForegroundColor Cyan

				do {
					$choice = Read-Host "Choose an option (K/D/R)"
				} while ($choice -notin @("K", "D", "R", "k", "d", "r"))

				switch ($choice.ToUpper()) {
					"K" {
						Log-Message "User chose to KEEP both backups."
					}
					"D" {
						Remove-Item $sqlFile -Force
						Remove-Item -Recurse -Force $dirBackup
						Log-Message "User chose to DELETE duplicate backup."
						Write-Host "Duplicate backup deleted." -ForegroundColor Green
						$success = $false  # don't print file info later
					}
					"R" {
						$dupSqlFile = $sqlFile -replace "\.sql$", "_dup.sql"
						$dupDir = $dirBackup + "_dup"

						Rename-Item -Path $sqlFile -NewName (Split-Path $dupSqlFile -Leaf)
						Rename-Item -Path $dirBackup -NewName (Split-Path $dupDir -Leaf)

						Log-Message "User chose to RENAME duplicate backup to:"
						Log-Message "  $dupSqlFile"
						Log-Message "  $dupDir"
						Write-Host "Backup renamed as duplicate." -ForegroundColor Green

						$sqlFile = $dupSqlFile
						$dirBackup = $dupDir
					}
				}
			} else {
				Log-Message "CHANGES DETECTED: Backup differs from previous ($($previousSqlFile.Name))"
			}
		} else {
			Log-Message "No previous backup found for hash comparison"
		}
	}

    if ($success) {
        $sqlSize = [math]::Round((Get-Item $sqlFile).Length / 1KB, 2)
        $dirSize = [math]::Round((Get-ChildItem $dirBackup | Measure-Object -Property Length -Sum).Sum / 1KB, 2)

        Log-Message "Backup completed successfully!" -ToConsole -Color Green
        Log-Message "Plain file: $sqlFile ($sqlSize KB)" -ToConsole -Color Cyan
        Log-Message "Directory: $dirBackup ($dirSize KB)" -ToConsole -Color Cyan

        Log-Message "SUCCESS: Plain backup ($sqlSize KB) + Directory backup ($dirSize KB)"
        Log-Message "Plain file: $sqlFile"
        Log-Message "Directory: $dirBackup"

        Write-Host ""
        Write-Host "Recent backups in $backupRoot`:" -ForegroundColor Magenta
        Get-ChildItem -Path $backupRoot -Filter "*.sql" |
            Sort-Object LastWriteTime -Descending |
            Select-Object -First 5 |
            Format-Table Name, LastWriteTime, @{Name = "Size(KB)"; Expression = {[math]::Round($_.Length / 1KB, 2)}} -AutoSize
    }

}
catch {
    $errorMsg = $_.Exception.Message
    Log-Message "CRITICAL ERROR: $errorMsg" -ToConsole -Color Red
    Log-Message "STACK TRACE: $($_.ScriptStackTrace)"
    Log-Message "===== BACKUP FAILED ====="
    exit 1
}
finally {
    # Clear sensitive data
    if ($plainPassword) { $plainPassword = "" }
    if ($env:PGPASSWORD) { $env:PGPASSWORD = "" }
    if ($Password) { $Password = "" }
    Log-Message "===== BACKUP PROCESS COMPLETED ====="
}
