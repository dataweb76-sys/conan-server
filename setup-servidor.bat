@echo off
echo ============================================
echo  Dragones y Demonios - Setup del servidor
echo ============================================
echo.

echo [1/5] Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Node.js no esta instalado.
    echo Descargalo de: https://nodejs.org  (version LTS)
    echo Instala Node.js y vuelve a ejecutar este script.
    pause
    exit /b 1
)

echo [2/5] Verificando Git...
git --version
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Git no esta instalado.
    echo Descargalo de: https://git-scm.com
    echo Instala Git y vuelve a ejecutar este script.
    pause
    exit /b 1
)

echo [3/5] Descargando codigo...
cd C:\
if exist "servidor-web" (
    echo Actualizando...
    cd servidor-web
    git pull
) else (
    git clone https://github.com/dataweb76-sys/conan-server.git "servidor-web"
    cd servidor-web
)

echo [4/5] Creando configuracion...
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

echo [5/5] Instalando dependencias...
npm install
if %errorlevel% neq 0 (
    echo ERROR en npm install
    pause
    exit /b 1
)

echo.
echo Abriendo puerto 8100 en firewall...
netsh advfirewall firewall delete rule name="Conan API 8100" >nul 2>&1
netsh advfirewall firewall add rule name="Conan API 8100" dir=in action=allow protocol=TCP localport=8100

echo.
echo ============================================
echo  Servidor iniciado. NO cierres esta ventana
echo ============================================
npm start
pause
