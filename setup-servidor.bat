@echo off
echo ============================================
echo  Instalando servidor web Dragones y Demonios
echo ============================================

cd C:\
if exist "servidor-web" (
    echo Actualizando codigo...
    cd servidor-web
    git pull
) else (
    echo Clonando repositorio...
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

echo Instalando dependencias...
npm install

echo.
echo ============================================
echo  Abriendo firewall puerto 8100...
echo ============================================
netsh advfirewall firewall add rule name="Conan API 8100" dir=in action=allow protocol=TCP localport=8100

echo.
echo ============================================
echo  Iniciando servidor...
echo ============================================
npm start
