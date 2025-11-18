# Sistema de Ejercicios con IA - Arquitectura Modular

Sistema completo de clasificación de estudiantes y generación personalizada de ejercicios usando Gemini AI.

## 📁 Estructura del Proyecto

```
test111/
├── categorizacion/                 # 🎯 Sistema de Clasificación de Perfiles
│   ├── backend/                   # FastAPI - puerto 8000
│   │   ├── app/
│   │   │   ├── models/           # Modelos Pydantic
│   │   │   ├── routes/           # Endpoints API
│   │   │   ├── services/         # Lógica de negocio
│   │   │   └── main.py          # Aplicación FastAPI
│   │   ├── data/                # Almacenamiento JSON
│   │   ├── run.py               # Script de arranque
│   │   └── requirements.txt
│   └── frontend/                  # Next.js 14 - puerto 3000
│       ├── src/
│       │   ├── app/             # App Router
│       │   ├── components/      # Componentes React
│       │   ├── services/        # API clients
│       │   └── models/          # TypeScript types
│       └── package.json
│
├── sistema-ejercicio/             # 🎯 Sistema Generador de Ejercicios
│   ├── backend/                   # FastAPI + Gemini AI - puerto 8001
│   │   ├── models/              # Modelos Pydantic
│   │   ├── services/            # Generadores + Gemini client
│   │   ├── prompts/             # Prompts para Gemini
│   │   ├── data/                # Almacenamiento JSON
│   │   ├── main.py              # Aplicación FastAPI
│   │   ├── run.py               # Script de arranque
│   │   └── requirements.txt
│   └── frontend/                  # Next.js 14 - puerto 3001
│       ├── src/
│       │   ├── app/             # App Router
│       │   ├── components/      # Componentes React
│       │   ├── lib/             # API client
│       │   └── types/           # TypeScript types
│       └── package.json
│
└── docs/                          # Documentación
    ├── GUIA-TESTING.md           # Guía completa de testing
    ├── TODO.md                   # Roadmap y pendientes
    └── sistema-adaptativo-nivel.md
```

## 🚀 Quick Start

### 1️⃣ Sistema de Clasificación de Perfiles

Clasifica estudiantes mediante cuestionarios psicopedagógicos.

**Backend** (Terminal 1):
```bash
cd categorizacion/backend
source venv/bin/activate  # Linux/Mac
# o: venv\Scripts\activate  # Windows
python run.py
```
🌐 http://localhost:8000/docs

**Frontend** (Terminal 2):
```bash
cd categorizacion/frontend
npm install
npm run dev
```
🌐 http://localhost:3000

### 2️⃣ Sistema Generador de Ejercicios

Genera ejercicios personalizados con Gemini AI basándose en perfiles.

**Backend** (Terminal 3):
```bash
cd sistema-ejercicio/backend
source venv/bin/activate  # Linux/Mac
# o: venv\Scripts\activate  # Windows

# Crear .env con tu GEMINI_API_KEY
cp .env.example .env
# Editar .env y agregar: GEMINI_API_KEY=tu-key-aqui

python run.py
```
🌐 http://localhost:8001/docs

**Frontend** (Terminal 4):
```bash
cd sistema-ejercicio/frontend
npm install
npm run dev
```
🌐 http://localhost:3001

## 🔄 Flujo Completo del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│  FASE 1: CLASIFICACIÓN                                          │
│  ─────────────────────────                                      │
│  1. Estudiante completa cuestionario (frontend:3000)            │
│  2. Backend clasifica perfil (backend:8000)                     │
│  3. Se genera: EST001 + perfil completo                         │
│  4. Guarda en: categorizacion/backend/data/perfiles.json        │
└─────────────────────────────────────────────────────────────────┘
                              ⬇️
┌─────────────────────────────────────────────────────────────────┐
│  FASE 2: GENERACIÓN DE EJERCICIOS                               │
│  ──────────────────────────────                                 │
│  1. Estudiante usa ID: EST001 (frontend:3001)                   │
│  2. Backend consulta perfil de EST001 (backend:8000)            │
│  3. Gemini AI genera ejercicios personalizados                  │
│  4. Tracking de respuestas en tiempo real                       │
│  5. Guarda en: sistema-ejercicio/backend/data/sesiones.json     │
└─────────────────────────────────────────────────────────────────┘
                              ⬇️
┌─────────────────────────────────────────────────────────────────┐
│  FASE 3: SISTEMA ADAPTATIVO                                     │
│  ────────────────────────                                       │
│  1. Analiza rendimiento del estudiante                          │
│  2. Calcula métricas (tasa aciertos, tiempo, rachas)            │
│  3. Recomienda nivel para próxima sesión                        │
│  4. Sistema de 7 reglas de decisión (no ML)                     │
└─────────────────────────────────────────────────────────────────┘
```

## 🛠 Stack Tecnológico

### Backend
- **FastAPI** 0.104+ - Framework web moderno
- **Pydantic** 2.5+ - Validación de datos
- **Google Gemini AI** - Generación de ejercicios
- **Python** 3.11+

### Frontend
- **Next.js** 14+ - React framework con App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hooks** - State management

### Storage
- **JSON** (temporal) - Almacenamiento local
- **Supabase** (futuro) - Base de datos PostgreSQL

## 📊 Puertos Utilizados

| Servicio | Puerto | URL |
|----------|--------|-----|
| Backend Clasificación | 8000 | http://localhost:8000 |
| Frontend Clasificación | 3000 | http://localhost:3000 |
| Backend Ejercicios | 8001 | http://localhost:8001 |
| Frontend Ejercicios | 3001 | http://localhost:3001 |

## 📚 Documentación

- **[GUIA-TESTING.md](docs/GUIA-TESTING.md)** - Guía completa de instalación y testing
- **[TODO.md](docs/TODO.md)** - Roadmap y tareas pendientes
- **[sistema-adaptativo-nivel.md](docs/sistema-adaptativo-nivel.md)** - Sistema de adaptación de niveles

## 🔑 Variables de Entorno

### Clasificación Backend
```env
# categorizacion/backend/.env
APP_NAME="API Sistema de Clasificación de Perfiles"
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
SUPABASE_URL=https://tu-proyecto.supabase.co  # Opcional
SUPABASE_KEY=tu-key  # Opcional
```

### Ejercicios Backend
```env
# sistema-ejercicio/backend/.env
GEMINI_API_KEY=AIzaSy...  # REQUERIDO
APP_NAME="Generador de Ejercicios con Gemini"
```

### Frontends
```env
# categorizacion/frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000

# sistema-ejercicio/frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8001
```

## ✅ Checklist de Setup

- [ ] Python 3.11+ instalado
- [ ] Node.js 18+ instalado
- [ ] Crear venvs en ambos backends
- [ ] Instalar dependencias Python (`pip install -r requirements.txt`)
- [ ] Crear archivos `.env` con API keys
- [ ] Instalar dependencias Node (`npm install`)
- [ ] Obtener GEMINI_API_KEY desde [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] Verificar que los 4 servidores levantan correctamente

## 🤝 Contribuir

Este proyecto sigue una arquitectura modular donde cada sistema es independiente:

- **categorizacion/** - Sistema autocontenido de clasificación
- **sistema-ejercicio/** - Sistema autocontenido de ejercicios

Ambos sistemas pueden desplegarse de forma independiente.

## 📝 Licencia

[Definir licencia]

---

**Última actualización**: 18 de Noviembre, 2025
**Versión**: 2.0.0 (Refactor modular)
