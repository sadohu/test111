#!/bin/bash

# =====================================================
# Script de Setup de Datos para Tests
# =====================================================
# Ejecuta los tests necesarios para crear datos base
# que otros tests necesitan
# =====================================================

set -e  # Exit on error

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Setup de Datos para Tests${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Verificar que Supabase está corriendo
echo -e "${YELLOW}1. Verificando Supabase...${NC}"
if ! supabase status > /dev/null 2>&1; then
    echo -e "${RED}❌ Supabase no está corriendo${NC}"
    echo -e "${YELLOW}   Ejecuta: supabase start${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Supabase está corriendo${NC}"
echo ""

# Obtener credenciales
echo -e "${YELLOW}2. Obteniendo credenciales...${NC}"
API_URL=$(supabase status | grep "API URL" | awk '{print $3}')
ANON_KEY=$(supabase status | grep "anon key" | awk '{print $3}')

if [ -z "$API_URL" ] || [ -z "$ANON_KEY" ]; then
    echo -e "${RED}❌ No se pudieron obtener las credenciales${NC}"
    exit 1
fi

BASE_URL="${API_URL}/functions/v1"
echo -e "${GREEN}✅ Base URL: ${BASE_URL}${NC}"
echo ""

# Crear perfiles de estudiantes
echo -e "${YELLOW}3. Creando perfiles de estudiantes...${NC}"

# Estudiante 1: El Científico Resiliente (bajo riesgo)
echo -e "   Creando EST001..."
curl -s -X POST "${BASE_URL}/clasificar-perfil" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "estudiante_id": "EST001",
    "grado": "3-4",
    "nombre": "Juan",
    "apellido": "Pérez",
    "edad": 9,
    "respuestas": {
      "P1": "A", "P2": "B", "P3": "B", "P4": "A", "P5": "B",
      "P6": "B", "P7": "A", "P8": "A", "P9": "B", "P10": "A"
    }
  }' | jq -r '.mensaje // .error' | sed 's/^/      /'

# Estudiante 2: El Explorador Kinestésico (riesgo medio)
echo -e "   Creando EST002..."
curl -s -X POST "${BASE_URL}/clasificar-perfil" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "estudiante_id": "EST002",
    "grado": "1-2",
    "nombre": "María",
    "apellido": "García",
    "edad": 7,
    "respuestas": {
      "P1": "C", "P2": "C", "P3": "C", "P4": "C", "P5": "C",
      "P6": "C", "P7": "B", "P8": "B", "P9": "A", "P10": "B"
    }
  }' | jq -r '.mensaje // .error' | sed 's/^/      /'

# Estudiante 3: El Artista Creativo (bajo riesgo)
echo -e "   Creando EST003..."
curl -s -X POST "${BASE_URL}/clasificar-perfil" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "estudiante_id": "EST003",
    "grado": "5-6",
    "nombre": "Carlos",
    "apellido": "López",
    "edad": 11,
    "respuestas": {
      "P1": "D", "P2": "A", "P3": "A", "P4": "B", "P5": "A",
      "P6": "A", "P7": "A", "P8": "A", "P9": "A", "P10": "C"
    }
  }' | jq -r '.mensaje // .error' | sed 's/^/      /'

echo -e "${GREEN}✅ Perfiles creados${NC}"
echo ""

# Verificar perfiles
echo -e "${YELLOW}4. Verificando perfiles...${NC}"
for estudiante in EST001 EST002 EST003; do
    resultado=$(curl -s "${BASE_URL}/obtener-perfil?estudiante_id=${estudiante}" \
      -H "Authorization: Bearer ${ANON_KEY}" | jq -r '.perfil.categoria_principal // "ERROR"')
    echo -e "   ${estudiante}: ${resultado}"
done
echo -e "${GREEN}✅ Perfiles verificados${NC}"
echo ""

# Generar algunos ejercicios
echo -e "${YELLOW}5. Generando ejercicios de ejemplo...${NC}"

echo -e "   Generando ejercicios de matemáticas para EST001..."
curl -s -X POST "${BASE_URL}/generar-ejercicios" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "estudiante_id": "EST001",
    "curso": "matematicas",
    "cantidad": 3
  }' | jq -r '.mensaje // .error' | sed 's/^/      /'

echo -e "   Generando ejercicios de verbal para EST003..."
curl -s -X POST "${BASE_URL}/generar-ejercicios" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "estudiante_id": "EST003",
    "curso": "verbal",
    "cantidad": 2
  }' | jq -r '.mensaje // .error' | sed 's/^/      /'

echo -e "${GREEN}✅ Ejercicios generados${NC}"
echo ""

# Mostrar estadísticas
echo -e "${YELLOW}6. Estadísticas generales:${NC}"
curl -s "${BASE_URL}/obtener-estadisticas" \
  -H "Authorization: Bearer ${ANON_KEY}" | jq '.estadisticas'

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ Setup completado exitosamente${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Ahora puedes ejecutar los tests HTTP con datos reales.${NC}"
echo ""
echo -e "${YELLOW}Tests disponibles:${NC}"
echo -e "  - clasificar-perfil.http"
echo -e "  - generar-ejercicios.http"
echo -e "  - guardar-respuesta.http"
echo -e "  - validar-respuesta.http"
echo -e "  - obtener-perfil.http"
echo -e "  - obtener-estadisticas.http"
echo ""
