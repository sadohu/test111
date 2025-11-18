# start-all.ps1 - Inicia todos los servidores del sistema
# Sistema de Ejercicios con IA - Categorización y Generación

# ⚠️ IMPORTANTE: Edita esta ruta con tu ubicación real del proyecto
$base = "E:\Files\Cheems Heaven\innova-edu-ai_backend\test111"

# Colores para output
$Green = "Green"
$Cyan = "Cyan"
$White = "White"
$Yellow = "Yellow"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor $Cyan
Write-Host "║     Sistema de Ejercicios con IA - Inicio Completo      ║" -ForegroundColor $Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor $Cyan
Write-Host ""

# Función para abrir nueva ventana de PowerShell
function Start-Service {
    param(
        [string]$Path,
        [string]$Command,
        [string]$Title
    )

    Write-Host "🚀 Iniciando: $Title..." -ForegroundColor $Green

    $fullCommand = "cd '$Path'; $Command; Write-Host ''; Write-Host 'Presiona cualquier tecla para cerrar...' -ForegroundColor Yellow; `$null = `$Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')"

    Start-Process powershell -ArgumentList "-NoExit", "-Command", $fullCommand
    Start-Sleep 2
}

# Verificar que el directorio base existe
if (-not (Test-Path $base)) {
    Write-Host "❌ ERROR: No se encuentra el directorio: $base" -ForegroundColor Red
    Write-Host "   Por favor, edita la variable `$base en este script con la ruta correcta." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit
}

Write-Host "📁 Directorio base: $base" -ForegroundColor $White
Write-Host ""

# 1. Backend Clasificación
$path1 = Join-Path $base "categorizacion\backend"
if (Test-Path $path1) {
    Start-Service $path1 "venv\Scripts\activate; python run.py" "Backend Clasificación (puerto 8000)"
} else {
    Write-Host "⚠️  No se encuentra: $path1" -ForegroundColor Yellow
}

Start-Sleep 3

# 2. Frontend Clasificación
$path2 = Join-Path $base "categorizacion\frontend"
if (Test-Path $path2) {
    Start-Service $path2 "npm run dev" "Frontend Clasificación (puerto 3000)"
} else {
    Write-Host "⚠️  No se encuentra: $path2" -ForegroundColor Yellow
}

Start-Sleep 3

# 3. Backend Ejercicios
$path3 = Join-Path $base "sistema-ejercicio\backend"
if (Test-Path $path3) {
    Start-Service $path3 "venv\Scripts\activate; python run.py" "Backend Ejercicios (puerto 8001)"
} else {
    Write-Host "⚠️  No se encuentra: $path3" -ForegroundColor Yellow
}

Start-Sleep 3

# 4. Frontend Ejercicios
$path4 = Join-Path $base "sistema-ejercicio\frontend"
if (Test-Path $path4) {
    Start-Service $path4 "npm run dev" "Frontend Ejercicios (puerto 3001)"
} else {
    Write-Host "⚠️  No se encuentra: $path4" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor $Green
Write-Host "║            ✅ Todos los servicios iniciados!             ║" -ForegroundColor $Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor $Green
Write-Host ""
Write-Host "📚 URLs del Sistema:" -ForegroundColor $Cyan
Write-Host ""
Write-Host "  🎯 Sistema de Clasificación:" -ForegroundColor $Yellow
Write-Host "     - Frontend:  http://localhost:3000" -ForegroundColor $White
Write-Host "     - API Docs:  http://localhost:8000/docs" -ForegroundColor $White
Write-Host ""
Write-Host "  🎯 Sistema de Ejercicios:" -ForegroundColor $Yellow
Write-Host "     - Frontend:  http://localhost:3001" -ForegroundColor $White
Write-Host "     - API Docs:  http://localhost:8001/docs" -ForegroundColor $White
Write-Host ""
Write-Host "💡 Flujo de uso:" -ForegroundColor $Cyan
Write-Host "   1. Abre http://localhost:3000 → Clasifica estudiante → Obtén ID (EST001)" -ForegroundColor $White
Write-Host "   2. Abre http://localhost:3001 → Usa EST001 → Genera ejercicios" -ForegroundColor $White
Write-Host ""
Write-Host "⚠️  Para detener todos los servicios, cierra las 4 ventanas de PowerShell" -ForegroundColor $Yellow
Write-Host ""
Write-Host "Presiona Enter para salir de este script..." -ForegroundColor $Cyan
Read-Host
