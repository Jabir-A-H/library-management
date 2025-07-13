<#
.SYNOPSIS
    Creates a backup of the library PostgreSQL database
.DESCRIPTION
    This script backs up the library database to F:\WebDev\library-management\database_backups
.NOTES
    File Name      : Backup-LibraryDB.ps1
    Prerequisite   : PostgreSQL installed, pg_dump available in PATH
#>

# Configuration variables
$hostname = "localhost"
$port = "5432"
$username = "postgres"
$database = "library_db"
$backupDir = "F:\WebDev\library-management\database_backups"  # Specific backup location

# Create backup directory if it doesn't exist
if (-not (Test-Path -Path $backupDir)) {
    Write-Host "Creating backup directory at $backupDir" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

# Generate timestamp and backup filename
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = Join-Path -Path $backupDir -ChildPath "${database}_backup_$timestamp.sql"

# Prompt for password securely
$password = Read-Host "Enter PostgreSQL password for user '$username'" -AsSecureString
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

# Build the pg_dump command
$pgDumpCommand = "pg_dump -h $hostname -p $port -U $username -d $database -F p -b -v -f `"$backupFile`""

# Set PGPASSWORD environment variable
$env:PGPASSWORD = $plainPassword

try {
    Write-Host "Starting database backup..." -ForegroundColor Cyan
    
    # Execute the backup command
    Invoke-Expression $pgDumpCommand
    
    # Verify the backup was created
    if (Test-Path -Path $backupFile) {
        $fileSize = [math]::Round((Get-Item $backupFile).Length / 1MB, 2)
        Write-Host "Backup completed successfully!" -ForegroundColor Green
        Write-Host "Backup file: $backupFile" -ForegroundColor Cyan
        Write-Host "File size: $fileSize MB" -ForegroundColor Cyan
        
        # Show recent backups (fixed syntax)
        Write-Host ""
        Write-Host "Recent backups in $backupDir`:" -ForegroundColor Magenta
        Get-ChildItem -Path $backupDir -Filter "*.sql" | 
            Sort-Object LastWriteTime -Descending | 
            Select-Object -First 5 | 
            Format-Table Name, LastWriteTime, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB, 2)}} -AutoSize
    } else {
        Write-Host "Backup failed - file not created" -ForegroundColor Red
    }
} catch {
    Write-Host "An error occurred during backup:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
} finally {
    # Clear the password from memory
    $env:PGPASSWORD = ""
    $plainPassword = ""
    $password = ""
}

# Open the backup directory in Explorer
explorer $backupDir