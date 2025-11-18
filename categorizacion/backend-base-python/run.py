#!/usr/bin/env python
"""
Script de arranque para el Backend de Clasificación de Perfiles
Configura correctamente el PYTHONPATH antes de iniciar el servidor FastAPI
"""
import sys
import os
from pathlib import Path

# Obtener el directorio actual (backend/)
BASE_DIR = Path(__file__).parent.resolve()

# Agregar el directorio al PYTHONPATH
sys.path.insert(0, str(BASE_DIR))

# Verificar que .env existe
env_file = BASE_DIR / ".env"
if not env_file.exists():
    env_example = BASE_DIR / ".env.example"
    if env_example.exists():
        print("⚠️  ADVERTENCIA: No se encuentra el archivo .env")
        print(f"   Copia {env_example} a .env y configura tus variables")
        print(f"   Ejemplo: cp .env.example .env")
    else:
        print("⚠️  ADVERTENCIA: No se encuentra .env ni .env.example")
    print("\n   El servidor puede iniciar pero algunas funcionalidades pueden no estar disponibles.\n")

if __name__ == "__main__":
    import uvicorn

    print("🚀 Iniciando Backend de Clasificación de Perfiles...")
    print(f"📁 Directorio base: {BASE_DIR}")
    print(f"🔧 PYTHONPATH configurado correctamente")
    print(f"🌐 Servidor: http://0.0.0.0:8000")
    print(f"📚 Documentación: http://localhost:8000/docs")
    print()

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,  # Desactivado en Windows para evitar problemas
        log_level="info"
    )
