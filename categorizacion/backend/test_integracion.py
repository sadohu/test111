"""
Script de Prueba - Integración Frontend-Backend
Simula el flujo completo de clasificación de perfiles
"""

import requests
import json
from typing import Dict, Any


# ============================================================================
# CONFIGURACIÓN
# ============================================================================

BASE_URL = "http://localhost:8000"


# ============================================================================
# FUNCIONES DE UTILIDAD
# ============================================================================

def print_section(title: str):
    """Imprime un título de sección"""
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80 + "\n")


def print_response(response: requests.Response):
    """Imprime la respuesta de forma formateada"""
    print(f"Status Code: {response.status_code}")
    try:
        data = response.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
    except:
        print(response.text)


# ============================================================================
# TESTS
# ============================================================================

def test_health_check():
    """Test 1: Verificar que el servicio esté funcionando"""
    print_section("TEST 1: Health Check")

    response = requests.get(f"{BASE_URL}/api/health")
    print_response(response)

    return response.status_code == 200


def test_clasificar_perfil():
    """Test 2: Clasificar perfil de estudiante (simula frontend)"""
    print_section("TEST 2: Clasificar Perfil - Simula envío desde Frontend")

    # Datos que enviaría el frontend después de que el alumno complete el formulario
    datos_formulario = {
        "estudiante_id": "EST001",
        "grado": "3-4",
        "respuestas": {
            "P1": "A",  # Estilo aprendizaje: Visual
            "P2": "C",  # Velocidad: Moderado
            "P3": "B",  # Atención: Media
            "P4": "C",  # Interés: Científico
            "P5": "B",  # Nivel matemáticas: Intermedio
            "P6": "B",  # Nivel lectura: Desarrollado
            "P7": "A",  # Motivación: Alta
            "P8": "A",  # Frustración: Resiliente
            "P9": "B",  # Trabajo: Colaborativo
            "P10": "A"  # Energía: Matutino
        }
    }

    print("📤 Enviando respuestas del formulario...")
    print(json.dumps(datos_formulario, indent=2, ensure_ascii=False))

    response = requests.post(
        f"{BASE_URL}/api/clasificar-perfil",
        json=datos_formulario
    )

    print("\n📥 Respuesta del Backend:")
    print_response(response)

    if response.status_code == 200:
        perfil = response.json()
        print(f"\n✅ Perfil Clasificado:")
        print(f"   Categoría: {perfil['categoria_principal']}")
        print(f"   Nivel de Riesgo: {perfil['nivel_riesgo']}")
        print(f"   Estilo de Aprendizaje: {perfil['estilo_aprendizaje']}")
        print(f"\n📋 Recomendaciones:")
        for i, rec in enumerate(perfil['recomendaciones'], 1):
            print(f"   {i}. {rec}")

    return response.status_code == 200


def test_obtener_perfil():
    """Test 3: Obtener perfil guardado"""
    print_section("TEST 3: Obtener Perfil Guardado")

    estudiante_id = "EST001"
    response = requests.get(f"{BASE_URL}/api/perfil/{estudiante_id}")

    print_response(response)

    return response.status_code == 200


def test_listar_perfiles():
    """Test 4: Listar todos los perfiles guardados"""
    print_section("TEST 4: Listar Perfiles Guardados")

    response = requests.get(f"{BASE_URL}/api/perfiles")

    print_response(response)

    if response.status_code == 200:
        data = response.json()
        print(f"\n📊 Total de perfiles guardados: {data['total']}")

    return response.status_code == 200


def test_estadisticas():
    """Test 5: Obtener estadísticas"""
    print_section("TEST 5: Estadísticas de Perfiles")

    response = requests.get(f"{BASE_URL}/api/estadisticas")

    print_response(response)

    if response.status_code == 200:
        stats = response.json()['estadisticas']
        print(f"\n📈 Resumen:")
        print(f"   Total de perfiles: {stats['total_perfiles']}")
        print(f"   Categorías: {len(stats['por_categoria'])}")
        print(f"   Niveles de riesgo: {stats['por_nivel_riesgo']}")

    return response.status_code == 200


def test_clasificar_multiples_estudiantes():
    """Test 6: Clasificar múltiples estudiantes (caso real)"""
    print_section("TEST 6: Clasificar Múltiples Estudiantes")

    estudiantes = [
        {
            "estudiante_id": "EST002",
            "grado": "1-2",
            "respuestas": {
                "P1": "B", "P2": "A", "P3": "A", "P4": "A", "P5": "A",
                "P6": "A", "P7": "C", "P8": "C", "P9": "A", "P10": "B"
            }
        },
        {
            "estudiante_id": "EST003",
            "grado": "5-6",
            "respuestas": {
                "P1": "C", "P2": "B", "P3": "C", "P4": "B", "P5": "C",
                "P6": "C", "P7": "B", "P8": "B", "P9": "C", "P10": "A"
            }
        },
    ]

    resultados = []

    for estudiante in estudiantes:
        print(f"\n👤 Clasificando: {estudiante['estudiante_id']} (Grado: {estudiante['grado']})")

        response = requests.post(
            f"{BASE_URL}/api/clasificar-perfil",
            json=estudiante
        )

        if response.status_code == 200:
            perfil = response.json()
            print(f"   ✅ {perfil['categoria_principal']} - Riesgo: {perfil['nivel_riesgo']}")
            resultados.append(perfil)
        else:
            print(f"   ❌ Error: {response.status_code}")

    print(f"\n✅ Se clasificaron {len(resultados)} perfiles correctamente")

    return len(resultados) == len(estudiantes)


def test_validar_respuesta():
    """Test 7: Validar respuesta individual"""
    print_section("TEST 7: Validar Respuesta Individual")

    validacion = {
        "pregunta": "P1",
        "respuesta": "A",
        "grado": "3-4"
    }

    response = requests.post(
        f"{BASE_URL}/api/validar-respuesta",
        json=validacion
    )

    print_response(response)

    return response.status_code == 200


# ============================================================================
# MAIN
# ============================================================================

def main():
    """Ejecuta todas las pruebas"""
    print("=" * 80)
    print("  PRUEBA DE INTEGRACIÓN FRONTEND-BACKEND")
    print("  Sistema de Clasificación de Perfiles Estudiantiles")
    print("=" * 80)

    print(f"\n🔗 Backend URL: {BASE_URL}")
    print("📝 Asegúrate de que el backend esté corriendo en http://localhost:8000\n")

    input("Presiona ENTER para comenzar las pruebas...")

    tests = [
        ("Health Check", test_health_check),
        ("Clasificar Perfil", test_clasificar_perfil),
        ("Obtener Perfil", test_obtener_perfil),
        ("Listar Perfiles", test_listar_perfiles),
        ("Estadísticas", test_estadisticas),
        ("Múltiples Estudiantes", test_clasificar_multiples_estudiantes),
        ("Validar Respuesta", test_validar_respuesta),
    ]

    resultados = []

    for nombre, test_func in tests:
        try:
            resultado = test_func()
            resultados.append((nombre, resultado))
        except requests.exceptions.ConnectionError:
            print(f"\n❌ ERROR: No se pudo conectar al backend en {BASE_URL}")
            print("   Asegúrate de que el servidor esté corriendo con: python -m app.main")
            return
        except Exception as e:
            print(f"\n❌ ERROR en {nombre}: {e}")
            resultados.append((nombre, False))

    # Resumen
    print_section("RESUMEN DE PRUEBAS")

    exitosos = sum(1 for _, resultado in resultados if resultado)
    total = len(resultados)

    for nombre, resultado in resultados:
        icono = "✅" if resultado else "❌"
        print(f"{icono} {nombre}")

    print(f"\n📊 Resultado: {exitosos}/{total} pruebas exitosas")

    if exitosos == total:
        print("\n🎉 ¡Todas las pruebas pasaron! La integración está funcionando correctamente.")
        print("\n📁 Verifica el archivo backend/data/perfiles.json para ver los perfiles guardados.")
    else:
        print("\n⚠️  Algunas pruebas fallaron. Revisa los logs del backend para más detalles.")


if __name__ == "__main__":
    main()
