"""
Ejemplos de uso del Sistema de Clasificación de Perfiles
Muestra diferentes casos de uso y perfiles de estudiantes
"""

import sys
import os

# Añadir el directorio lib al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lib'))

from clasificador_perfiles import SistemaClasificacionPerfiles, PerfilEstudiante
import json


def ejemplo_1_estudiante_alto_riesgo():
    """
    EJEMPLO 1: Estudiante de Alto Riesgo
    Carlos - 1ro grado (7 años)
    """
    print("\n" + "="*80)
    print("📝 EJEMPLO 1: ESTUDIANTE DE ALTO RIESGO")
    print("="*80)
    print("\nNombre: Carlos")
    print("Grado: 1ro de Primaria (7 años)")
    print("Contexto: Estudiante con dificultades académicas y baja motivación")
    print("-"*80)

    sistema = SistemaClasificacionPerfiles()

    # Respuestas del formulario de Carlos
    respuestas_carlos = {
        'P1': 'C',  # Kinestésico (le gusta hacer cosas con las manos)
        'P2': 'B',  # Pausado (como una tortuga)
        'P3': 'C',  # Atención baja (se distraigo fácil)
        'P4': 'B',  # Le gusta jugar y correr (deportivo)
        'P5': 'C',  # Matemáticas difíciles (básico)
        'P6': 'C',  # Le cuesta leer, necesita ayuda (inicial)
        'P7': 'C',  # Se aburre, quiere jugar (motivación baja)
        'P8': 'B',  # Se pone triste y no quiere seguir (sensible)
        'P9': 'C',  # Prefiere ayuda de profesora (guiado)
        'P10': 'A'  # Más energía en la mañana (matutino)
    }

    perfil = sistema.clasificar_respuestas(respuestas_carlos, grado='1-2', estudiante_id='EST_CARLOS_001')

    print(f"\n🎯 PERFIL IDENTIFICADO: {perfil.categoria_principal}")
    print(f"⚠️  NIVEL DE RIESGO: {perfil.nivel_riesgo.upper()}")
    print(f"\n📊 CARACTERÍSTICAS DEL PERFIL:")
    print(f"   • Estilo de aprendizaje: {perfil.estilo_aprendizaje.upper()}")
    print(f"   • Velocidad de procesamiento: {perfil.velocidad}")
    print(f"   • Nivel de atención: {perfil.atencion}")
    print(f"   • Área de interés: {perfil.interes}")
    print(f"   • Nivel en matemáticas: {perfil.nivel_matematicas}")
    print(f"   • Nivel de lectura: {perfil.nivel_lectura}")
    print(f"   • Motivación: {perfil.motivacion}")
    print(f"   • Manejo de frustración: {perfil.frustracion}")
    print(f"   • Preferencia de trabajo: {perfil.trabajo}")
    print(f"   • Mejor horario: {perfil.energia}")

    print(f"\n💡 RECOMENDACIONES PEDAGÓGICAS ({len(perfil.recomendaciones)} recomendaciones):")
    for i, rec in enumerate(perfil.recomendaciones, 1):
        print(f"   {i}. {rec}")

    print("\n✅ PLAN DE ACCIÓN INMEDIATO:")
    print("   1. Asignar tutor individual o apoyo psicopedagógico")
    print("   2. Sesiones de 10-15 minutos con actividades kinestésicas")
    print("   3. Integrar el deporte en el aprendizaje (matemáticas jugando)")
    print("   4. Refuerzo positivo constante para aumentar autoestima")
    print("   5. Seguimiento semanal con padres y docentes")

    return perfil


def ejemplo_2_estudiante_bajo_riesgo():
    """
    EJEMPLO 2: Estudiante de Bajo Riesgo
    Sofía - 5to grado (10 años)
    """
    print("\n" + "="*80)
    print("📝 EJEMPLO 2: ESTUDIANTE DE BAJO RIESGO (ALTO RENDIMIENTO)")
    print("="*80)
    print("\nNombre: Sofía")
    print("Grado: 5to de Primaria (10 años)")
    print("Contexto: Estudiante con alto rendimiento y motivación")
    print("-"*80)

    sistema = SistemaClasificacionPerfiles()

    # Respuestas del formulario de Sofía
    respuestas_sofia = {
        'P1': 'B',  # Auditivo
        'P2': 'A',  # Rápido
        'P3': 'A',  # Alta atención (30-45 min)
        'P4': 'D',  # Comunicación (literario)
        'P5': 'A',  # Matemáticas avanzado
        'P6': 'A',  # Lectura experto
        'P7': 'A',  # Alta motivación (curioso, investiga)
        'P8': 'A',  # Resiliente
        'P9': 'A',  # Independiente
        'P10': 'A'  # Matutino
    }

    perfil = sistema.clasificar_respuestas(respuestas_sofia, grado='5-6', estudiante_id='EST_SOFIA_002')

    print(f"\n🎯 PERFIL IDENTIFICADO: {perfil.categoria_principal}")
    print(f"✅ NIVEL DE RIESGO: {perfil.nivel_riesgo.upper()}")
    print(f"\n📊 CARACTERÍSTICAS DEL PERFIL:")
    print(f"   • Estilo de aprendizaje: {perfil.estilo_aprendizaje.upper()}")
    print(f"   • Velocidad de procesamiento: {perfil.velocidad}")
    print(f"   • Nivel de atención: {perfil.atencion}")
    print(f"   • Área de interés: {perfil.interes}")
    print(f"   • Nivel en matemáticas: {perfil.nivel_matematicas}")
    print(f"   • Nivel de lectura: {perfil.nivel_lectura}")
    print(f"   • Motivación: {perfil.motivacion}")
    print(f"   • Manejo de frustración: {perfil.frustracion}")
    print(f"   • Preferencia de trabajo: {perfil.trabajo}")
    print(f"   • Mejor horario: {perfil.energia}")

    print(f"\n💡 RECOMENDACIONES PEDAGÓGICAS ({len(perfil.recomendaciones)} recomendaciones):")
    for i, rec in enumerate(perfil.recomendaciones, 1):
        print(f"   {i}. {rec}")

    print("\n🌟 OPORTUNIDADES DE ENRIQUECIMIENTO:")
    print("   1. Participar en olimpiadas de matemáticas y lectura")
    print("   2. Proyectos de investigación independiente")
    print("   3. Escritura creativa y análisis literario avanzado")
    print("   4. Mentor para estudiantes con dificultades")
    print("   5. Debates, clubes de lectura y podcasts educativos")

    return perfil


def ejemplo_3_estudiante_riesgo_medio():
    """
    EJEMPLO 3: Estudiante de Riesgo Medio
    Diego - 3ro grado (8 años)
    """
    print("\n" + "="*80)
    print("📝 EJEMPLO 3: ESTUDIANTE DE RIESGO MEDIO")
    print("="*80)
    print("\nNombre: Diego")
    print("Grado: 3ro de Primaria (8 años)")
    print("Contexto: Estudiante promedio con algunas dificultades")
    print("-"*80)

    sistema = SistemaClasificacionPerfiles()

    # Respuestas del formulario de Diego
    respuestas_diego = {
        'P1': 'A',  # Visual
        'P2': 'C',  # Moderado
        'P3': 'B',  # Atención media (15-20 min)
        'P4': 'C',  # Ciencia y Tecnología (científico)
        'P5': 'B',  # Matemáticas intermedio
        'P6': 'B',  # Lectura desarrollado
        'P7': 'B',  # Motivación media
        'P8': 'C',  # Frustración intermedio
        'P9': 'B',  # Colaborativo
        'P10': 'B'  # Vespertino
    }

    perfil = sistema.clasificar_respuestas(respuestas_diego, grado='3-4', estudiante_id='EST_DIEGO_003')

    print(f"\n🎯 PERFIL IDENTIFICADO: {perfil.categoria_principal}")
    print(f"⚠️  NIVEL DE RIESGO: {perfil.nivel_riesgo.upper()}")
    print(f"\n📊 CARACTERÍSTICAS DEL PERFIL:")
    print(f"   • Estilo de aprendizaje: {perfil.estilo_aprendizaje.upper()}")
    print(f"   • Velocidad de procesamiento: {perfil.velocidad}")
    print(f"   • Nivel de atención: {perfil.atencion}")
    print(f"   • Área de interés: {perfil.interes}")
    print(f"   • Nivel en matemáticas: {perfil.nivel_matematicas}")
    print(f"   • Nivel de lectura: {perfil.nivel_lectura}")
    print(f"   • Motivación: {perfil.motivacion}")
    print(f"   • Manejo de frustración: {perfil.frustracion}")
    print(f"   • Preferencia de trabajo: {perfil.trabajo}")
    print(f"   • Mejor horario: {perfil.energia}")

    print(f"\n💡 RECOMENDACIONES PEDAGÓGICAS ({len(perfil.recomendaciones)} recomendaciones):")
    for i, rec in enumerate(perfil.recomendaciones, 1):
        print(f"   {i}. {rec}")

    print("\n📋 PLAN DE APOYO:")
    print("   1. Usar experimentos y visualizaciones para enseñar conceptos")
    print("   2. Trabajo en equipo para mantener motivación")
    print("   3. Bloques de estudio de 20-25 minutos con descansos")
    print("   4. Conectar aprendizaje con tecnología y ciencia")
    print("   5. Monitoreo quincenal del progreso")

    return perfil


def ejemplo_4_estudiante_multimodal():
    """
    EJEMPLO 4: Estudiante Multimodal Equilibrado
    María - 4to grado (9 años)
    """
    print("\n" + "="*80)
    print("📝 EJEMPLO 4: ESTUDIANTE MULTIMODAL EQUILIBRADO")
    print("="*80)
    print("\nNombre: María")
    print("Grado: 4to de Primaria (9 años)")
    print("Contexto: Estudiante versátil con perfil equilibrado")
    print("-"*80)

    sistema = SistemaClasificacionPerfiles()

    # Respuestas del formulario de María
    respuestas_maria = {
        'P1': 'D',  # Multimodal (le gusta de todas las formas)
        'P2': 'C',  # Moderado
        'P3': 'B',  # Atención media
        'P4': 'A',  # Arte y Cultura (artístico)
        'P5': 'B',  # Matemáticas intermedio
        'P6': 'B',  # Lectura desarrollado
        'P7': 'B',  # Motivación media
        'P8': 'C',  # Frustración intermedio
        'P9': 'B',  # Colaborativo
        'P10': 'C'  # Flexible (rinde igual todo el día)
    }

    perfil = sistema.clasificar_respuestas(respuestas_maria, grado='3-4', estudiante_id='EST_MARIA_004')

    print(f"\n🎯 PERFIL IDENTIFICADO: {perfil.categoria_principal}")
    print(f"✅ NIVEL DE RIESGO: {perfil.nivel_riesgo.upper()}")
    print(f"\n📊 CARACTERÍSTICAS DEL PERFIL:")
    print(f"   • Estilo de aprendizaje: {perfil.estilo_aprendizaje.upper()}")
    print(f"   • Velocidad de procesamiento: {perfil.velocidad}")
    print(f"   • Nivel de atención: {perfil.atencion}")
    print(f"   • Área de interés: {perfil.interes}")
    print(f"   • Nivel en matemáticas: {perfil.nivel_matematicas}")
    print(f"   • Nivel de lectura: {perfil.nivel_lectura}")
    print(f"   • Motivación: {perfil.motivacion}")
    print(f"   • Manejo de frustración: {perfil.frustracion}")
    print(f"   • Preferencia de trabajo: {perfil.trabajo}")
    print(f"   • Mejor horario: {perfil.energia}")

    print(f"\n💡 RECOMENDACIONES PEDAGÓGICAS ({len(perfil.recomendaciones)} recomendaciones):")
    for i, rec in enumerate(perfil.recomendaciones, 1):
        print(f"   {i}. {rec}")

    print("\n🎨 ENFOQUE ARTÍSTICO:")
    print("   1. Integrar arte en todas las materias (dibujos de conceptos matemáticos)")
    print("   2. Proyectos creativos grupales")
    print("   3. Combinar modalidades: visual + auditivo + kinestésico")
    print("   4. Flexibilidad en horarios de estudio")
    print("   5. Fomentar expresión creativa como herramienta de aprendizaje")

    return perfil


def comparar_perfiles():
    """
    Compara todos los perfiles generados
    """
    print("\n" + "="*80)
    print("📊 COMPARACIÓN DE PERFILES")
    print("="*80)

    sistema = SistemaClasificacionPerfiles()

    perfiles = []

    # Generar todos los perfiles
    perfiles.append(sistema.clasificar_respuestas({
        'P1': 'C', 'P2': 'B', 'P3': 'C', 'P4': 'B', 'P5': 'C',
        'P6': 'C', 'P7': 'C', 'P8': 'B', 'P9': 'C', 'P10': 'A'
    }, '1-2', 'EST_CARLOS_001'))

    perfiles.append(sistema.clasificar_respuestas({
        'P1': 'B', 'P2': 'A', 'P3': 'A', 'P4': 'D', 'P5': 'A',
        'P6': 'A', 'P7': 'A', 'P8': 'A', 'P9': 'A', 'P10': 'A'
    }, '5-6', 'EST_SOFIA_002'))

    perfiles.append(sistema.clasificar_respuestas({
        'P1': 'A', 'P2': 'C', 'P3': 'B', 'P4': 'C', 'P5': 'B',
        'P6': 'B', 'P7': 'B', 'P8': 'C', 'P9': 'B', 'P10': 'B'
    }, '3-4', 'EST_DIEGO_003'))

    perfiles.append(sistema.clasificar_respuestas({
        'P1': 'D', 'P2': 'C', 'P3': 'B', 'P4': 'A', 'P5': 'B',
        'P6': 'B', 'P7': 'B', 'P8': 'C', 'P9': 'B', 'P10': 'C'
    }, '3-4', 'EST_MARIA_004'))

    # Tabla comparativa
    print("\n┌─────────────┬──────────────────────────────┬────────────┬──────────┬──────────┐")
    print("│ Estudiante  │ Categoría                    │ Riesgo     │ Mat.     │ Lectura  │")
    print("├─────────────┼──────────────────────────────┼────────────┼──────────┼──────────┤")

    for p in perfiles:
        est_id = p.estudiante_id.split('_')[1][:6]
        cat = p.categoria_principal[:28].ljust(28)
        riesgo = p.nivel_riesgo.upper().ljust(10)
        mat = p.nivel_matematicas[:8].ljust(8)
        lec = p.nivel_lectura[:8].ljust(8)

        print(f"│ {est_id.ljust(11)} │ {cat} │ {riesgo} │ {mat} │ {lec} │")

    print("└─────────────┴──────────────────────────────┴────────────┴──────────┴──────────┘")

    # Estadísticas
    print(f"\n📈 ESTADÍSTICAS:")
    print(f"   • Total de perfiles analizados: {len(perfiles)}")
    print(f"   • Estudiantes de alto riesgo: {sum(1 for p in perfiles if p.nivel_riesgo == 'alto')}")
    print(f"   • Estudiantes de riesgo medio: {sum(1 for p in perfiles if p.nivel_riesgo == 'medio')}")
    print(f"   • Estudiantes de bajo riesgo: {sum(1 for p in perfiles if p.nivel_riesgo == 'bajo')}")

    # Distribución por estilo de aprendizaje
    estilos = {}
    for p in perfiles:
        estilos[p.estilo_aprendizaje] = estilos.get(p.estilo_aprendizaje, 0) + 1

    print(f"\n🎨 DISTRIBUCIÓN POR ESTILO DE APRENDIZAJE:")
    for estilo, cantidad in estilos.items():
        print(f"   • {estilo.capitalize()}: {cantidad} estudiante(s)")


def exportar_a_json():
    """
    Exporta todos los perfiles a JSON
    """
    print("\n" + "="*80)
    print("💾 EXPORTACIÓN A JSON")
    print("="*80)

    sistema = SistemaClasificacionPerfiles()

    perfil_ejemplo = sistema.clasificar_respuestas({
        'P1': 'A', 'P2': 'C', 'P3': 'B', 'P4': 'C', 'P5': 'B',
        'P6': 'B', 'P7': 'B', 'P8': 'C', 'P9': 'B', 'P10': 'B'
    }, '3-4', 'EST_EXPORT_001')

    perfil_dict = perfil_ejemplo.to_dict()
    perfil_json = json.dumps(perfil_dict, indent=2, ensure_ascii=False)

    print("\nPerfil exportado a JSON:")
    print(perfil_json)

    # Guardar en archivo
    output_file = os.path.join(os.path.dirname(__file__), 'data', 'perfil_ejemplo.json')
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(perfil_json)

    print(f"\n✅ Perfil guardado en: {output_file}")


def main():
    """
    Función principal que ejecuta todos los ejemplos
    """
    print("\n")
    print("╔" + "="*78 + "╗")
    print("║" + " "*20 + "SISTEMA DE CLASIFICACIÓN DE PERFILES" + " "*22 + "║")
    print("║" + " "*20 + "Ejemplos de Uso y Demostración" + " "*28 + "║")
    print("╚" + "="*78 + "╝")

    # Ejecutar ejemplos
    ejemplo_1_estudiante_alto_riesgo()
    ejemplo_2_estudiante_bajo_riesgo()
    ejemplo_3_estudiante_riesgo_medio()
    ejemplo_4_estudiante_multimodal()

    # Comparación
    comparar_perfiles()

    # Exportar
    exportar_a_json()

    print("\n" + "="*80)
    print("✅ DEMOSTRACIÓN COMPLETADA")
    print("="*80)
    print("\nPara usar este sistema en tu aplicación:")
    print("  1. Importa: from clasificador_perfiles import SistemaClasificacionPerfiles")
    print("  2. Crea instancia: sistema = SistemaClasificacionPerfiles()")
    print("  3. Clasifica: perfil = sistema.clasificar_respuestas(respuestas, grado, id)")
    print("  4. Usa las recomendaciones para personalizar el aprendizaje")
    print("\n")


if __name__ == "__main__":
    main()
