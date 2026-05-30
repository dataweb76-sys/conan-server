@echo off
echo ============================================
echo  Dragones y Demonios - Setup del servidor
echo ============================================
echo.

:: Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Instalando Node.js...
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.19.1/node-v20.19.1-x64.msi' -OutFile '%TEMP%\node.msi'"
    msiexec /i "%TEMP%\node.msi" /quiet /norestart
    echo Node.js instalado. Reiniciando script...
    pause
    start "" "%~f0"
    exit
)
echo Node.js OK: & node --version

:: Verificar Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Instalando Git...
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/git-for-windows/git/releases/download/v2.49.0.windows.1/Git-2.49.0-64-bit.exe' -OutFile '%TEMP%\git.exe'"
    "%TEMP%\git.exe" /VERYSILENT /NORESTART
    echo Git instalado. Reiniciando script...
    pause
    start "" "%~f0"
    exit
)
echo Git OK: & git --version

echo.
echo Descargando codigo...
cd C:\
if exist "servidor-web" (
    cd servidor-web
    git pull
) else (
    git clone https://github.com/dataweb76-sys/conan-server.git "servidor-web"
    cd servidor-web
)

echo Creando configuracion...
(
echo SUPABASE_URL=https://fpjfygsngkqwybxxhflr.supabase.co
echo SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwamZ5Z3NuZ2txd3lieHhoZmxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMzUxMzYsImV4cCI6MjA5NTcxMTEzNn0.C6GMDFs2i6NWO1AcyuTdPrR6n7i6Ph9Qt2KtLoMgEl0
echo SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwamZ5Z3NuZ2txd3lieHhoZmxyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDEzNTEzNiwiZXhwIjoyMDk1NzExMTM2fQ.V0PBy3X8FQNFuNb6cJyUVKGhPYYMjAsYLxK_qQzDG54
echo PORT=8100
echo RCON_HOST=127.0.0.1
echo RCON_PORT=25575
echo RCON_PASS=dani123
echo ADMIN_KEY=dani_admin_2024
) > .env

echo Instalando dependencias npm...
call npm install

echo Abriendo puerto 8100 en firewall...
netsh advfirewall firewall delete rule name="Conan API 8100" >nul 2>&1
netsh advfirewall firewall add rule name="Conan API 8100" dir=in action=allow protocol=TCP localport=8100

echo.
echo ============================================
echo  Servidor listo. NO cierres esta ventana.
echo ============================================
npm start
pause
