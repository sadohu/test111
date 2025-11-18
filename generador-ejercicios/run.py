#!/usr/bin/env python
"""
Script de arranque para el servidor FastAPI
Configura correctamente el PYTHONPATH antes de iniciar
"""
import sys
import os
from pathlib import Path

# Obtener el directorio actual (generador-ejercicios)
BASE_DIR = Path(__file__).parent.resolve()

# Agregar el directorio al PYTHONPATH
sys.path.insert(0, str(BASE_DIR))

# Verificar que .env existe
env_file = BASE_DIR / ".env"
if not env_file.exists():
    print("❌ ERROR: No se encuentra el archivo .env")
    print(f"   Esperado en: {env_file}")
    print("\n   Solución:")
    print("   1. Copiar .env.example a .env")
    print("   2. Agregar tu GEMINI_API_KEY")
    sys.exit(1)

# Ahora sí, importar y ejecutar
if __name__ == "__main__":
    import uvicorn
    
    print("🚀 Iniciando servidor FastAPI...")
    print(f"📁 Directorio base: {BASE_DIR}")
    print(f"🔧 PYTHONPATH configurado correctamente")
    print("")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=False,  # Desactivado en Windows para evitar problemas
        log_level="info"
    )