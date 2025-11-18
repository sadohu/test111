# Guía de Inicio Rápido - Windows 🪟

Esta es una guía específica para usuarios de Windows para levantar el sistema completo de ejercicios con IA.

## ⚡ Inicio Ultra-Rápido (Recomendado)

**Si ya tienes todo instalado y configurado**:

1. Abre PowerShell en la raíz del proyecto
2. Ejecuta:
   ```powershell
   .\start-all.ps1
   ```
3. Se abrirán 4 ventanas automáticamente
4. Espera 20 segundos a que todo inicie
5. Abre http://localhost:3000 (Clasificación) y http://localhost:3001 (Ejercicios)

## 📋 Setup Primera Vez

### 1. Pre-requisitos

**Verificar que tienes instalado**:
```powershell
python --version  # Debe ser 3.11+
node --version    # Debe ser 18+
npm --version     # Debe ser 9+
```

**Si falta algo**:
- **Python 3.11**: [Descargar](https://www.python.org/downloads/) o usar Microsoft Store
  - ⚠️ Durante instalación, marcar "Add Python to PATH"
- **Node.js 18+**: [Descargar LTS](https://nodejs.org/)
- **Git**: [Descargar](https://git-scm.com/download/win) (opcional)

### 2. Ubicarte en el Proyecto

```powershell
# Navega a tu directorio (ajusta la ruta):
cd "E:\Files\Cheems Heaven\innova-edu-ai_backend\test111"
```

### 3. Configurar Sistema de Clasificación

**Backend (Terminal 1)**:
```powershell
cd categorizacion\backend

# Crear entorno virtual (solo primera vez)
python -m venv venv

# Activar entorno virtual
venv\Scripts\activate

# Crear .env
copy .env.example .env

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
python run.py
```

✅ Verifica en http://localhost:8000/docs

**Frontend (Terminal 2 - NUEVA VENTANA)**:
```powershell
cd categorizacion\frontend

# Instalar dependencias (solo primera vez)
npm install

# Iniciar servidor
npm run dev
```

✅ Verifica en http://localhost:3000

### 4. Configurar Sistema de Ejercicios

**Backend (Terminal 3 - NUEVA VENTANA)**:
```powershell
cd sistema-ejercicio\backend

# Crear entorno virtual (solo primera vez)
python -m venv venv

# Activar entorno virtual
venv\Scripts\activate

# Crear .env
copy .env.example .env

# ⚠️ IMPORTANTE: Editar .env y agregar tu GEMINI_API_KEY
notepad .env
# Obtén tu key en: https://makersuite.google.com/app/apikey
# Agrega: GEMINI_API_KEY=AIzaSy...tu-key-aqui

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
python run.py
```

✅ Verifica en http://localhost:8001/docs

**Frontend (Terminal 4 - NUEVA VENTANA)**:
```powershell
cd sistema-ejercicio\frontend

# Instalar dependencias (solo primera vez)
npm install

# Iniciar servidor
npm run dev
```

✅ Verifica en http://localhost:3001

## 🎯 URLs del Sistema

| Servicio | URL | Descripción |
|----------|-----|-------------|
| 🎨 Clasificación Frontend | http://localhost:3000 | Formulario de clasificación |
| 📊 Clasificación API | http://localhost:8000/docs | Swagger docs |
| 🎮 Ejercicios Frontend | http://localhost:3001 | Generador de ejercicios |
| 🤖 Ejercicios API | http://localhost:8001/docs | Swagger docs + Gemini |

## 💡 Flujo de Uso

1. **Clasificar Estudiante**:
   - Abre http://localhost:3000
   - Completa el cuestionario
   - Anota el ID del estudiante (ej: EST001)

2. **Generar Ejercicios**:
   - Abre http://localhost:3001
   - Ingresa el ID del estudiante (EST001)
   - Genera ejercicios personalizados

## 🔧 Solución de Problemas Comunes

### Error: "python no se reconoce"
```powershell
# Usa 'py' en lugar de 'python':
py -3.11 -m venv venv
```

### Error: "Execution Policy"
```powershell
# Ejecuta PowerShell como Administrador y ejecuta:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "Cannot activate venv"
```powershell
# Verifica que estés en el directorio correcto
# Debe existir la carpeta venv\Scripts\
ls venv\Scripts\

# Si no existe, créala:
python -m venv venv
```

### Puerto Ocupado
```powershell
# Ver qué usa el puerto 8000:
netstat -ano | findstr :8000

# Matar proceso (reemplaza XXXX con el PID):
taskkill /PID XXXX /F
```

### Firewall de Windows
- Cuando Windows pregunte, **permite acceso** a Python y Node.js
- Selecciona "Redes privadas y públicas"

### GEMINI_API_KEY no encontrada
1. Ve a https://makersuite.google.com/app/apikey
2. Crea una API key
3. Cópiala
4. Edita `sistema-ejercicio\backend\.env`
5. Pega: `GEMINI_API_KEY=tu-key-aqui`

## 📝 Comandos Útiles

```powershell
# Navegar directorios
cd ruta\carpeta
cd ..  # Volver atrás

# Ver archivos
ls

# Ver contenido de archivo
type archivo.txt

# Limpiar consola
cls

# Ver procesos Python/Node corriendo
Get-Process python
Get-Process node

# Ver puertos en uso
netstat -ano | findstr :8000
```

## 🛑 Detener Todo

- Cierra las 4 ventanas de PowerShell
- O presiona `Ctrl + C` en cada terminal

## 📚 Documentación Completa

Para más detalles, consulta:
- **[GUIA-TESTING.md](docs/GUIA-TESTING.md)** - Guía completa con troubleshooting
- **[README.md](README.md)** - Documentación general del proyecto

## 🆘 Ayuda

Si encuentras problemas:
1. Revisa la [Sección 11 de GUIA-TESTING.md](docs/GUIA-TESTING.md#guía-rápida-para-windows)
2. Verifica que Python 3.11+ y Node.js 18+ estén instalados
3. Asegúrate de tener la GEMINI_API_KEY configurada
4. Verifica que los 4 servicios estén corriendo en sus puertos

---

**Última actualización**: 18 de Noviembre, 2025
