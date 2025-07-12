@echo off
echo === PostgreSQL Database Structure Check ===
echo.

echo 1. Checking if PostgreSQL service is running...
net start | findstr -i postgres
echo.

echo 2. Connecting to database and listing tables...
echo \dt | psql -U postgres -d library_db

echo.
echo 3. Showing table structures...
echo \d+ books | psql -U postgres -d library_db

echo.
echo 4. Checking database exists...
echo SELECT datname FROM pg_database WHERE datname = 'library_db'; | psql -U postgres

echo.
echo 5. Checking user exists...
echo SELECT usename FROM pg_user WHERE usename = 'library_user'; | psql -U postgres

echo.
echo === Use the following commands manually if needed ===
echo psql -U postgres -d library_db
echo \dt
echo \d+ tablename
echo SELECT * FROM information_schema.tables WHERE table_schema = 'public';

pause
