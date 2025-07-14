<#
.SYNOPSIS
    Creates a backup of the library PostgreSQL database
.DESCRIPTION
    This script backs up the library database to F:\WebDev\library-management\extras\database_backups in  both plain SQL and directory format backups with automatic parallel job optimization for the host system.
.NOTES
    File Name      : Backup-LibraryDB.ps1
    Prerequisite   : PostgreSQL installed, pg_dump available in PATH
#>

# Configuration variables
$hostname = "localhost"
$port = "5432"
$username = "postgres"
$database = "library_db"
$backupDir = "F:\WebDev\library-management\extras\database_backups"
$logFile = "$backupDir\last_backup.log"

# Initialize logging
"===== BACKUP STARTED $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') =====" > $logFile

# Create backup directory if it doesn't exist
if (-not (Test-Path -Path $backupDir)) {
    Write-Host "Creating backup directory at $backupDir" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    "Created backup directory" >> $logFile
}

# Generate timestamp and backup filename
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = Join-Path -Path $backupDir -ChildPath "${database}_backup_$timestamp.sql"

# Calculate optimal parallel jobs (PostgreSQL 12+)
$physicalCores = (Get-CimInstance Win32_Processor).NumberOfCores
$parallelJobs = if ($physicalCores -le 2) {
    # Conservative setting for weak CPUs (like your i3-4005U)
    [Math]::Min($physicalCores, 2)
} else {
    # More aggressive scaling for powerful systems
    [Math]::Min([int]($physicalCores * 1.5), 8)  # Cap at 8 jobs
}
"Detected $physicalCores physical cores -> Using $parallelJobs parallel jobs" >> $logFile

# Prompt for password securely
$password = Read-Host "Enter PostgreSQL password for user '$username'" -AsSecureString
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

# Build the pg_dump command with parallel jobs
$pgDumpCommand = "pg_dump -h $hostname -p $port -U $username -d $database -F p -b -j $parallelJobs -f `"$backupFile`" 2>&1"

# Set PGPASSWORD environment variable
$env:PGPASSWORD = $plainPassword

try {
    Write-Host "Starting database backup..." -ForegroundColor Cyan
    
    # Execute silently (all output to log)
    $dumpOutput = Invoke-Expression $pgDumpCommand
    $dumpOutput >> $logFile
    
    # Verify the backup was created
    if (Test-Path -Path $backupFile) {
        $fileSizeKB = [math]::Round((Get-Item $backupFile).Length / 1KB, 2)
        Write-Host "Backup completed successfully!" -ForegroundColor Green
        Write-Host "$backupFile ($fileSizeKB KB)" -ForegroundColor Cyan
        
        # Log details
        "Backup created: $backupFile" >> $logFile
        "Parallel jobs used: $parallelJobs" >> $logFile
        "File size: $fileSizeKB KB" >> $logFile
        "===== BACKUP COMPLETED $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') =====" >> $logFile
        
        # Show recent backups
        Write-Host ""
        Write-Host "Recent backups in $backupDir`:" -ForegroundColor Magenta
        Get-ChildItem -Path $backupDir -Filter "*.sql" | 
            Sort-Object LastWriteTime -Descending | 
            Select-Object -First 5 | 
            Format-Table Name, LastWriteTime, @{Name="Size(KB)";Expression={[math]::Round($_.Length/1KB, 2)}} -AutoSize
    } else {
        throw "Backup file not created"
    }
} catch {
    Write-Host "Backup failed: $($_.Exception.Message)" -ForegroundColor Red
    "ERROR: $($_.Exception.Message)" >> $logFile
    "===== BACKUP FAILED $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') =====" >> $logFile
} finally {
    # Clear the password from memory
    $env:PGPASSWORD = ""
    $plainPassword = ""
    $password = ""
}