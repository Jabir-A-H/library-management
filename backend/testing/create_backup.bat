@echo off
echo === Creating Database Backup Before Migration ===
echo.

set BACKUP_FILE=library_db_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.sql
set BACKUP_FILE=%BACKUP_FILE: =0%

echo Creating backup: %BACKUP_FILE%
pg_dump -U postgres -h localhost -d library_db > %BACKUP_FILE%

if %errorlevel% equ 0 (
    echo ✅ Backup created successfully: %BACKUP_FILE%
    echo.
    echo You can now safely run the migration:
    echo python run_migration.py
) else (
    echo ❌ Backup failed! Please check your PostgreSQL connection.
    echo Make sure PostgreSQL is running and credentials are correct.
)

echo.
pause
