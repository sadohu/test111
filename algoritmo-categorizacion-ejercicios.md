# ARCHIVO 1: ALGORITMOS DE CATEGORIZACIÓN Y GENERACIÓN DE EJERCICIOS

## 1. ALGORITMO DE CATEGORIZACIÓN DE ESTUDIANTES

### 1.1. Características del Algoritmo

**Propósito:**
Clasificar a los estudiantes según su perfil de aprendizaje, intereses y nivel académico para personalizar la experiencia educativa.

**Entradas:**
- Datos demográficos básicos (edad, grado)
- Respuestas al cuestionario inicial de diagnóstico
- Resultados de evaluación inicial de conocimientos
- Preferencias de intereses (artístico, deportivo, científico, literario)
- Historial de interacciones (si existe)

**Salidas:**
- Perfil del estudiante categorizado
- Nivel académico por área (matemáticas, lectura, ciencias)
- Estilo de aprendizaje predominante (visual, auditivo, kinestésico, lectoescritor)
- Áreas de interés prioritarias
- Ritmo de aprendizaje estimado

**Técnicas utilizadas:**
- Análisis de respuestas mediante NLP (procesamiento de lenguaje natural)
- Clasificación multi-etiqueta
- Sistema de puntuación ponderada
- Modelo VARK para estilos de aprendizaje
- Teoría de Inteligencias Múltiples de Gardner

**Métricas de evaluación:**
- Precisión de categorización (validada con docentes)
- Tasa de recategorización temprana (< 10% ideal)
- Satisfacción del estudiante con contenidos recomendados

### 1.2. Pseudocódigo del Algoritmo de Categorización

```pseudocode
ALGORITMO CategorizarEstudiante(estudiante_id)

    // FASE 1: Recopilación de datos iniciales
    FUNCION RecopilarDatosIniciales(estudiante_id)
        datos_basicos = ObtenerDatosDemograficos(estudiante_id)
        respuestas_diagnostico = AplicarCuestionarioDiagnostico(estudiante_id)
        evaluacion_inicial = AplicarEvaluacionConocimientos(estudiante_id)
        preferencias_intereses = AplicarCuestionarioIntereses(estudiante_id)

        RETORNAR {
            edad: datos_basicos.edad,
            grado: datos_basicos.grado,
            respuestas: respuestas_diagnostico,
            evaluacion: evaluacion_inicial,
            intereses: preferencias_intereses
        }
    FIN FUNCION

    datos = RecopilarDatosIniciales(estudiante_id)

    // FASE 2: Determinar nivel académico por área
    FUNCION DeterminarNivelAcademico(evaluacion)
        niveles = {}

        PARA CADA area EN ["matematicas", "lectura", "ciencias"]
            puntaje = evaluacion[area].puntaje_total
            preguntas_correctas = evaluacion[area].correctas
            total_preguntas = evaluacion[area].total

            porcentaje = (preguntas_correctas / total_preguntas) * 100

            SI porcentaje >= 80 ENTONCES
                niveles[area] = "avanzado"
            SINO SI porcentaje >= 60 ENTONCES
                niveles[area] = "intermedio"
            SINO SI porcentaje >= 40 ENTONCES
                niveles[area] = "basico"
            SINO
                niveles[area] = "inicial"
            FIN SI

            // Análisis de patrones de error
            errores_comunes = AnalizarPatronesError(evaluacion[area].respuestas)
            niveles[area + "_debilidades"] = errores_comunes
        FIN PARA

        RETORNAR niveles
    FIN FUNCION

    nivel_academico = DeterminarNivelAcademico(datos.evaluacion)

    // FASE 3: Identificar estilo de aprendizaje (Modelo VARK)
    FUNCION IdentificarEstiloAprendizaje(respuestas_diagnostico)
        puntuaciones = {
            "visual": 0,
            "auditivo": 0,
            "kinestesico": 0,
            "lectoescritor": 0
        }

        // Pesos para cada pregunta según tipo
        pesos_preguntas = ObtenerPesosPreguntasVARK()

        PARA CADA respuesta EN respuestas_diagnostico
            pregunta_id = respuesta.pregunta_id
            valor_respuesta = respuesta.valor

            // Sumar puntuación a cada estilo según la respuesta
            PARA CADA estilo EN puntuaciones.keys()
                puntuaciones[estilo] += pesos_preguntas[pregunta_id][estilo] * valor_respuesta
            FIN PARA
        FIN PARA

        // Normalizar puntuaciones
        total = SUMA(puntuaciones.values())
        PARA CADA estilo EN puntuaciones.keys()
            puntuaciones[estilo] = (puntuaciones[estilo] / total) * 100
        FIN PARA

        // Determinar estilo predominante y secundario
        estilos_ordenados = OrdenarDescendente(puntuaciones)
        estilo_predominante = estilos_ordenados[0].key
        estilo_secundario = estilos_ordenados[1].key SI estilos_ordenados[1].value > 20

        RETORNAR {
            predominante: estilo_predominante,
            secundario: estilo_secundario,
            distribucion: puntuaciones,
            es_multimodal: (estilos_ordenados[0].value - estilos_ordenados[1].value) < 15
        }
    FIN FUNCION

    estilo_aprendizaje = IdentificarEstiloAprendizaje(datos.respuestas)

    // FASE 4: Identificar inteligencias múltiples predominantes
    FUNCION IdentificarInteligenciasMultiples(preferencias_intereses)
        inteligencias = {
            "linguistica": 0,
            "logico_matematica": 0,
            "espacial": 0,
            "musical": 0,
            "corporal_kinestesica": 0,
            "interpersonal": 0,
            "intrapersonal": 0,
            "naturalista": 0
        }

        // Mapeo de intereses a inteligencias
        mapeo = {
            "lectura": ["linguistica"],
            "escritura_creativa": ["linguistica", "intrapersonal"],
            "matematicas": ["logico_matematica"],
            "ciencias": ["logico_matematica", "naturalista"],
            "arte": ["espacial"],
            "musica": ["musical"],
            "deportes": ["corporal_kinestesica"],
            "trabajo_en_equipo": ["interpersonal"],
            "reflexion_personal": ["intrapersonal"],
            "naturaleza": ["naturalista"]
        }

        PARA CADA interes EN preferencias_intereses
            nombre_interes = interes.nombre
            nivel_interes = interes.nivel // 1-5

            SI mapeo.CONTIENE(nombre_interes) ENTONCES
                PARA CADA inteligencia EN mapeo[nombre_interes]
                    inteligencias[inteligencia] += nivel_interes
                FIN PARA
            FIN SI
        FIN PARA

        // Identificar top 3 inteligencias
        top_inteligencias = OrdenarDescendente(inteligencias).PRIMEROS(3)

        RETORNAR {
            principales: top_inteligencias,
            distribucion: inteligencias
        }
    FIN FUNCION

    inteligencias = IdentificarInteligenciasMultiples(datos.intereses)

    // FASE 5: Estimar ritmo de aprendizaje
    FUNCION EstimarRitmoAprendizaje(evaluacion, respuestas_diagnostico)
        // Analizar tiempo de respuesta en evaluación inicial
        tiempos_promedio = []

        PARA CADA respuesta EN evaluacion.todas_respuestas
            tiempo = respuesta.tiempo_respuesta_segundos
            dificultad = respuesta.pregunta_dificultad

            tiempo_normalizado = tiempo / dificultad
            tiempos_promedio.AGREGAR(tiempo_normalizado)
        FIN PARA

        tiempo_medio = MEDIANA(tiempos_promedio)

        // Analizar patrones de respuesta
        respuestas_impulsivas = CONTAR(r PARA r EN evaluacion.todas_respuestas SI r.tiempo < 5)
        respuestas_reflexivas = CONTAR(r PARA r EN evaluacion.todas_respuestas SI r.tiempo > 30)

        // Clasificar ritmo
        SI tiempo_medio < 15 Y respuestas_impulsivas > 5 ENTONCES
            ritmo = "rapido"
            recomendacion = "Necesita desafíos constantes para mantener interés"
        SINO SI tiempo_medio > 45 O respuestas_reflexivas > 8 ENTONCES
            ritmo = "pausado"
            recomendacion = "Beneficiará de tiempo extendido y explicaciones detalladas"
        SINO
            ritmo = "moderado"
            recomendacion = "Ritmo estándar con flexibilidad adaptativa"
        FIN SI

        RETORNAR {
            ritmo: ritmo,
            tiempo_promedio_segundos: tiempo_medio,
            recomendacion: recomendacion
        }
    FIN FUNCION

    ritmo = EstimarRitmoAprendizaje(datos.evaluacion, datos.respuestas)

    // FASE 6: Construir perfil completo del estudiante
    perfil = {
        estudiante_id: estudiante_id,
        fecha_creacion: FECHA_ACTUAL(),

        nivel_academico: {
            matematicas: nivel_academico.matematicas,
            lectura: nivel_academico.lectura,
            ciencias: nivel_academico.ciencias,
            debilidades: {
                matematicas: nivel_academico.matematicas_debilidades,
                lectura: nivel_academico.lectura_debilidades,
                ciencias: nivel_academico.ciencias_debilidades
            }
        },

        estilo_aprendizaje: {
            predominante: estilo_aprendizaje.predominante,
            secundario: estilo_aprendizaje.secundario,
            es_multimodal: estilo_aprendizaje.es_multimodal,
            distribucion: estilo_aprendizaje.distribucion
        },

        inteligencias_multiples: {
            principales: inteligencias.principales,
            distribucion: inteligencias.distribucion
        },

        ritmo_aprendizaje: {
            clasificacion: ritmo.ritmo,
            tiempo_promedio: ritmo.tiempo_promedio_segundos,
            recomendaciones: ritmo.recomendacion
        },

        metadata: {
            version_algoritmo: "1.0",
            confianza_categorizacion: CalcularConfianza(datos),
            requiere_recategorizacion: FALSO,
            proxima_evaluacion: FECHA_ACTUAL() + 30_DIAS
        }
    }

    // FASE 7: Guardar perfil y activar seguimiento
    GuardarPerfilEstudiante(perfil)
    IniciarSeguimientoAdaptativo(estudiante_id)
    GenerarRecomendacionesIniciales(perfil)

    RETORNAR perfil

FIN ALGORITMO
```

---

## 2. ALGORITMO DE GENERACIÓN DE EJERCICIOS CON GEMINI Y VALIDACIÓN DE RESPUESTAS

### 2.1. Características del Algoritmo

**Propósito:**
Generar ejercicios personalizados usando la API de Gemini y validar las respuestas de los estudiantes de manera inteligente.

**Entradas:**
- Perfil del estudiante
- Tema/competencia a trabajar
- Nivel de dificultad deseado
- Contexto de aprendizaje previo
- Respuesta del estudiante al ejercicio

**Salidas:**
- Ejercicio personalizado generado
- Validación de respuesta (correcta/incorrecta/parcial)
- Retroalimentación específica
- Siguientes pasos recomendados

**Técnicas utilizadas:**
- Prompting estructurado a Gemini API
- Validación multi-criterio de respuestas
- NLP para análisis semántico de respuestas abiertas
- Sistema de puntuación gradual
- Detección de misconceptions (conceptos erróneos)

**Restricciones:**
- Tiempo de generación < 3 segundos
- Ejercicios alineados al Currículo Nacional Peruano
- Lenguaje apropiado para edad (6-12 años)
- Validación con timeout de 2 segundos

### 2.2. Pseudocódigo del Algoritmo de Generación de Ejercicios

```pseudocode
ALGORITMO GenerarEjercicioPersonalizado(estudiante_id, tema, nivel_dificultad)

    // FASE 1: Preparar contexto del estudiante
    perfil = ObtenerPerfilEstudiante(estudiante_id)
    historial_tema = ObtenerHistorialTema(estudiante_id, tema)

    // FASE 2: Construir prompt para Gemini
    FUNCION ConstruirPromptGeneracion(perfil, tema, nivel_dificultad, historial)

        // Determinar modalidad según estilo de aprendizaje
        SI perfil.estilo_aprendizaje.predominante == "visual" ENTONCES
            modalidad_preferida = "incluir descripción para imagen o diagrama"
        SINO SI perfil.estilo_aprendizaje.predominante == "auditivo" ENTONCES
            modalidad_preferida = "incluir narrativa o diálogo"
        SINO SI perfil.estilo_aprendizaje.predominante == "kinestesico" ENTONCES
            modalidad_preferida = "incluir actividad práctica o manipulativa"
        SINO
            modalidad_preferida = "incluir texto con estructura clara"
        FIN SI

        // Conectar con inteligencias múltiples
        inteligencia_principal = perfil.inteligencias_multiples.principales[0]
        contexto_interes = MapearInteligenciaAContexto(inteligencia_principal)

        prompt = """
        Eres un asistente educativo especializado en educación primaria peruana.

        CONTEXTO DEL ESTUDIANTE:
        - Edad: {perfil.edad} años
        - Grado: {perfil.grado}
        - Nivel en {tema}: {perfil.nivel_academico[tema]}
        - Estilo de aprendizaje: {perfil.estilo_aprendizaje.predominante}
        - Interés principal: {contexto_interes}
        - Ritmo de aprendizaje: {perfil.ritmo_aprendizaje.clasificacion}

        HISTORIAL RECIENTE:
        - Ejercicios completados en este tema: {historial.total_completados}
        - Tasa de éxito: {historial.tasa_exito}%
        - Conceptos dominados: {historial.conceptos_dominados}
        - Conceptos en progreso: {historial.conceptos_en_progreso}
        - Errores comunes: {historial.errores_comunes}

        TAREA:
        Genera UN ejercicio de {tema} con nivel de dificultad {nivel_dificultad}.

        REQUISITOS:
        1. {modalidad_preferida}
        2. Contextualizar el problema usando {contexto_interes}
        3. Usar lenguaje apropiado para {perfil.edad} años
        4. Alineado al Currículo Nacional Peruano para {perfil.grado}
        5. Evitar conceptos que ya domina completamente
        6. Enfocarse en {historial.conceptos_en_progreso[0]} si existe

        FORMATO DE RESPUESTA (JSON):
        {
            "enunciado": "Texto del problema",
            "tipo_ejercicio": "opcion_multiple | respuesta_corta | desarrollo | verdadero_falso",
            "opciones": ["A", "B", "C", "D"] (solo si es opción múltiple),
            "respuesta_correcta": "Respuesta o respuestas correctas",
            "criterios_evaluacion": ["criterio1", "criterio2"],
            "nivel_bloom": "recordar | comprender | aplicar | analizar",
            "competencia_curricular": "Código de competencia del Currículo Nacional",
            "recursos_visuales": "Descripción de imagen recomendada (opcional)",
            "tiempo_estimado_minutos": número,
            "pistas": ["pista1", "pista2", "pista3"]
        }
        """

        RETORNAR prompt
    FIN FUNCION

    prompt = ConstruirPromptGeneracion(perfil, tema, nivel_dificultad, historial_tema)

    // FASE 3: Llamar a Gemini API con retry logic
    FUNCION LlamarGeminiConReintentos(prompt, max_reintentos=3)
        intentos = 0

        MIENTRAS intentos < max_reintentos HACER
            INTENTAR
                respuesta = LlamarGeminiAPI(
                    prompt=prompt,
                    temperature=0.7,  // Balance creatividad/consistencia
                    max_tokens=1500,
                    timeout=3000  // 3 segundos
                )

                // Validar que la respuesta sea JSON válido
                ejercicio = ParsearJSON(respuesta)

                // Validar campos requeridos
                SI ValidarEstructuraEjercicio(ejercicio) ENTONCES
                    RETORNAR ejercicio
                SINO
                    intentos += 1
                    CONTINUAR
                FIN SI

            CAPTURAR Error e
                REGISTRAR_LOG("Error llamando Gemini: " + e.mensaje)
                intentos += 1

                SI intentos < max_reintentos ENTONCES
                    ESPERAR(2^intentos * 1000)  // Backoff exponencial
                FIN SI
            FIN INTENTAR
        FIN MIENTRAS

        // Si todos los intentos fallan, usar ejercicio de respaldo
        RETORNAR GenerarEjercicioRespaldo(tema, nivel_dificultad)
    FIN FUNCION

    ejercicio_generado = LlamarGeminiConReintentos(prompt)

    // FASE 4: Enriquecer ejercicio con metadatos
    ejercicio_completo = {
        id: GenerarUUID(),
        estudiante_id: estudiante_id,
        fecha_generacion: FECHA_ACTUAL(),
        tema: tema,
        nivel_dificultad: nivel_dificultad,

        contenido: ejercicio_generado,

        metadata: {
            generado_por: "gemini-api",
            version_prompt: "1.0",
            personalizado: VERDADERO,
            contexto_interes: contexto_interes,
            estilo_aprendizaje_usado: perfil.estilo_aprendizaje.predominante
        },

        estado: {
            completado: FALSO,
            intentos: 0,
            tiempo_inicio: NULL,
            tiempo_fin: NULL
        }
    }

    // FASE 5: Guardar ejercicio y retornar
    GuardarEjercicio(ejercicio_completo)

    RETORNAR ejercicio_completo

FIN ALGORITMO


// ========================================================================
// ALGORITMO DE VALIDACIÓN DE RESPUESTAS
// ========================================================================

ALGORITMO ValidarRespuestaEjercicio(ejercicio_id, respuesta_estudiante)

    // FASE 1: Obtener contexto del ejercicio
    ejercicio = ObtenerEjercicio(ejercicio_id)
    estudiante_id = ejercicio.estudiante_id
    perfil = ObtenerPerfilEstudiante(estudiante_id)

    // Actualizar tiempo de finalización
    ejercicio.estado.tiempo_fin = FECHA_ACTUAL()
    tiempo_usado = ejercicio.estado.tiempo_fin - ejercicio.estado.tiempo_inicio
    ejercicio.estado.intentos += 1

    // FASE 2: Determinar tipo de validación según tipo de ejercicio
    tipo = ejercicio.contenido.tipo_ejercicio

    SI tipo == "opcion_multiple" O tipo == "verdadero_falso" ENTONCES
        resultado = ValidarRespuestaExacta(ejercicio, respuesta_estudiante)

    SINO SI tipo == "respuesta_corta" ENTONCES
        resultado = ValidarRespuestaCorta(ejercicio, respuesta_estudiante, perfil)

    SINO SI tipo == "desarrollo" ENTONCES
        resultado = ValidarRespuestaDesarrollo(ejercicio, respuesta_estudiante, perfil)

    FIN SI

    // FASE 3: Generar retroalimentación personalizada
    retroalimentacion = GenerarRetroalimentacion(
        ejercicio,
        respuesta_estudiante,
        resultado,
        perfil
    )

    // FASE 4: Actualizar perfil y estadísticas
    ActualizarEstadisticas(estudiante_id, ejercicio, resultado)

    // FASE 5: Determinar siguiente acción
    siguiente_accion = DeterminarSiguienteAccion(resultado, ejercicio, perfil)

    validacion_completa = {
        ejercicio_id: ejercicio_id,
        estudiante_id: estudiante_id,
        respuesta_estudiante: respuesta_estudiante,

        evaluacion: {
            es_correcta: resultado.es_correcta,
            puntuacion: resultado.puntuacion,  // 0-100
            nivel_logro: resultado.nivel_logro,  // en_inicio | en_proceso | logrado | destacado
            criterios_cumplidos: resultado.criterios_cumplidos,
            criterios_no_cumplidos: resultado.criterios_no_cumplidos
        },

        retroalimentacion: retroalimentacion,

        siguiente_accion: siguiente_accion,

        metadata: {
            tiempo_usado_segundos: tiempo_usado,
            intentos_totales: ejercicio.estado.intentos,
            fecha_validacion: FECHA_ACTUAL()
        }
    }

    // Guardar validación
    GuardarValidacion(validacion_completa)

    RETORNAR validacion_completa

FIN ALGORITMO


// Función auxiliar: Validar respuesta exacta
FUNCION ValidarRespuestaExacta(ejercicio, respuesta_estudiante)
    respuesta_correcta = ejercicio.contenido.respuesta_correcta

    SI respuesta_estudiante == respuesta_correcta ENTONCES
        RETORNAR {
            es_correcta: VERDADERO,
            puntuacion: 100,
            nivel_logro: "logrado",
            criterios_cumplidos: ejercicio.contenido.criterios_evaluacion,
            criterios_no_cumplidos: []
        }
    SINO
        RETORNAR {
            es_correcta: FALSO,
            puntuacion: 0,
            nivel_logro: "en_inicio",
            criterios_cumplidos: [],
            criterios_no_cumplidos: ejercicio.contenido.criterios_evaluacion
        }
    FIN SI
FIN FUNCION


// Función auxiliar: Validar respuesta corta con Gemini
FUNCION ValidarRespuestaCorta(ejercicio, respuesta_estudiante, perfil)

    prompt_validacion = """
    Eres un evaluador educativo experto en educación primaria.

    EJERCICIO:
    {ejercicio.contenido.enunciado}

    RESPUESTA ESPERADA:
    {ejercicio.contenido.respuesta_correcta}

    CRITERIOS DE EVALUACIÓN:
    {ejercicio.contenido.criterios_evaluacion}

    RESPUESTA DEL ESTUDIANTE (edad {perfil.edad}):
    {respuesta_estudiante}

    TAREA:
    Evalúa la respuesta del estudiante considerando:
    1. ¿Es correcta conceptualmente aunque tenga errores de forma?
    2. ¿Demuestra comprensión parcial?
    3. ¿Qué criterios cumple y cuáles no?
    4. ¿Hay misconceptions (conceptos erróneos)?

    FORMATO DE RESPUESTA (JSON):
    {
        "es_correcta": true/false,
        "puntuacion": 0-100,
        "nivel_logro": "en_inicio | en_proceso | logrado | destacado",
        "criterios_cumplidos": ["criterio1", ...],
        "criterios_no_cumplidos": ["criterio2", ...],
        "misconceptions_detectados": ["misconception1", ...],
        "comprension_demostrada": "descripción breve",
        "areas_mejorar": ["area1", "area2"]
    }
    """

    respuesta_gemini = LlamarGeminiAPI(prompt_validacion, temperature=0.2)
    resultado = ParsearJSON(respuesta_gemini)

    RETORNAR resultado
FIN FUNCION


// Función auxiliar: Validar respuesta de desarrollo con Gemini
FUNCION ValidarRespuestaDesarrollo(ejercicio, respuesta_estudiante, perfil)

    prompt_validacion = """
    Eres un evaluador educativo experto que califica respuestas de desarrollo.

    EJERCICIO:
    {ejercicio.contenido.enunciado}

    RESPUESTA ESPERADA (referencia):
    {ejercicio.contenido.respuesta_correcta}

    CRITERIOS DE EVALUACIÓN:
    {ejercicio.contenido.criterios_evaluacion}

    RESPUESTA DEL ESTUDIANTE (grado {perfil.grado}):
    {respuesta_estudiante}

    RÚBRICA:
    - Correcta y completa (90-100 puntos): Cumple todos los criterios, demuestra comprensión profunda
    - Correcta con omisiones menores (70-89 puntos): Cumple mayoría de criterios, comprensión sólida
    - Parcialmente correcta (50-69 puntos): Cumple algunos criterios, comprensión parcial
    - Incorrecta pero con esfuerzo (20-49 puntos): No cumple criterios pero muestra intento
    - Sin comprensión (0-19 puntos): No demuestra comprensión del concepto

    TAREA:
    Evalúa la respuesta de manera constructiva, considerando la edad del estudiante.

    FORMATO DE RESPUESTA (JSON):
    {
        "es_correcta": true/false,
        "puntuacion": 0-100,
        "nivel_logro": "en_inicio | en_proceso | logrado | destacado",
        "criterios_cumplidos": ["criterio1", ...],
        "criterios_no_cumplidos": ["criterio2", ...],
        "fortalezas": ["fortaleza1", "fortaleza2"],
        "areas_mejorar": ["area1", "area2"],
        "misconceptions_detectados": ["misconception1", ...],
        "nivel_detalle": "insuficiente | basico | adecuado | excelente",
        "coherencia": "insuficiente | basica | adecuada | excelente",
        "uso_vocabulario": "insuficiente | basico | adecuado | avanzado"
    }
    """

    respuesta_gemini = LlamarGeminiAPI(prompt_validacion, temperature=0.2)
    resultado = ParsearJSON(respuesta_gemini)

    RETORNAR resultado
FIN FUNCION


// Función auxiliar: Generar retroalimentación personalizada
FUNCION GenerarRetroalimentacion(ejercicio, respuesta_estudiante, resultado, perfil)

    prompt_retroalimentacion = """
    Eres un tutor educativo empático y motivador para estudiantes de primaria.

    CONTEXTO:
    - Estudiante de {perfil.edad} años, grado {perfil.grado}
    - Estilo de aprendizaje: {perfil.estilo_aprendizaje.predominante}
    - Ritmo: {perfil.ritmo_aprendizaje.clasificacion}

    EJERCICIO:
    {ejercicio.contenido.enunciado}

    RESPUESTA DEL ESTUDIANTE:
    {respuesta_estudiante}

    EVALUACIÓN:
    {resultado}

    TAREA:
    Genera retroalimentación personalizada que:
    1. Sea SIEMPRE positiva y motivadora (incluso si está incorrecta)
    2. Celebre lo que hizo bien
    3. Explique el error sin usar términos negativos
    4. Proporcione una pista para mejorar
    5. Use lenguaje apropiado para {perfil.edad} años
    6. Sea breve (máximo 100 palabras)

    SI el estudiante está en "en_inicio":
        - Enfócate en el esfuerzo, no en el error
        - Proporciona la primera pista
        - Anima a intentarlo de nuevo

    SI el estudiante está en "en_proceso":
        - Celebra el progreso
        - Señala qué falta pulir
        - Proporciona una pista específica

    SI el estudiante está en "logrado" o "destacado":
        - Celebra el logro efusivamente
        - Destaca qué hizo especialmente bien
        - Propón un desafío adicional (opcional)

    FORMATO DE RESPUESTA (JSON):
    {
        "mensaje_principal": "Texto principal de retroalimentación",
        "celebracion": "Frase motivadora específica",
        "explicacion_concepto": "Explicación breve del concepto (si aplica)",
        "pista_siguiente_paso": "Sugerencia para mejorar o continuar",
        "recursos_adicionales": ["recurso1", "recurso2"] (opcional),
        "tono": "celebratorio | motivador | alentador"
    }
    """

    respuesta_gemini = LlamarGeminiAPI(prompt_retroalimentacion, temperature=0.8)
    retroalimentacion = ParsearJSON(respuesta_gemini)

    RETORNAR retroalimentacion
FIN FUNCION


// Función auxiliar: Determinar siguiente acción
FUNCION DeterminarSiguienteAccion(resultado, ejercicio, perfil)

    SI resultado.es_correcta Y resultado.puntuacion >= 80 ENTONCES
        // Avanzar al siguiente nivel
        RETORNAR {
            accion: "avanzar",
            nivel_dificultad_siguiente: ejercicio.nivel_dificultad + 1,
            tema_siguiente: ejercicio.tema,
            justificacion: "Dominio demostrado del concepto actual"
        }

    SINO SI resultado.puntuacion >= 50 Y resultado.puntuacion < 80 ENTONCES
        // Reforzar con ejercicio similar
        RETORNAR {
            accion: "reforzar",
            nivel_dificultad_siguiente: ejercicio.nivel_dificultad,
            tema_siguiente: ejercicio.tema,
            enfoque: resultado.criterios_no_cumplidos,
            justificacion: "Requiere práctica adicional en criterios específicos"
        }

    SINO
        // Retroceder o proporcionar andamiaje
        SI ejercicio.estado.intentos >= 3 ENTONCES
            RETORNAR {
                accion: "andamiaje",
                tipo_andamiaje: "video_explicativo | actividad_guiada | ejercicio_mas_simple",
                nivel_dificultad_siguiente: MAX(1, ejercicio.nivel_dificultad - 1),
                tema_siguiente: ejercicio.tema,
                justificacion: "Requiere apoyo adicional antes de continuar"
            }
        SINO
            RETORNAR {
                accion: "reintentar",
                con_pistas: VERDADERO,
                pista_mostrar: ejercicio.contenido.pistas[ejercicio.estado.intentos - 1],
                justificacion: "Ofrecer otra oportunidad con apoyo"
            }
        FIN SI
    FIN SI

FIN FUNCION
```

---

## 3. CONSIDERACIONES TÉCNICAS DE IMPLEMENTACIÓN

### 3.1. Integración con API de Gemini

**Configuración recomendada:**
```
- Modelo: gemini-1.5-pro (mayor capacidad de razonamiento)
- Temperature: 0.7 para generación, 0.2 para validación
- Max tokens: 1500 para ejercicios, 800 para validaciones
- Safety settings: BLOCK_MEDIUM_AND_ABOVE para contenido no apropiado
```

### 3.2. Caché y Optimización

**Estrategias:**
- Cachear respuestas de Gemini para ejercicios similares (validez 7 días)
- Precarga de ejercicios para temas comunes
- Rate limiting: máximo 60 llamadas/minuto por estudiante
- Fallback a banco de ejercicios predefinidos si API falla

### 3.3. Seguridad y Validación

**Medidas:**
- Sanitización de respuestas de estudiantes antes de enviar a Gemini
- Validación de JSON devuelto por Gemini
- Timeout en todas las llamadas API
- Logs de todas las interacciones para auditoría
- Filtro de contenido inapropiado en respuestas generadas

### 3.4. Métricas de Calidad

**Monitoreo continuo:**
- Tasa de éxito de generación de ejercicios (objetivo: > 95%)
- Tiempo promedio de generación (objetivo: < 3s)
- Tasa de coherencia de validaciones (comparar con validación manual)
- Satisfacción del estudiante con ejercicios (encuesta periódica)
- Tasa de falsos positivos/negativos en validación (objetivo: < 5%)

---

## 4. EJEMPLO DE FLUJO COMPLETO

```
1. Estudiante inicia sesión
2. Sistema ejecuta CategorizarEstudiante() (solo primera vez)
3. Sistema determina: tema = "matemáticas", nivel = 2
4. Sistema ejecuta GenerarEjercicioPersonalizado(estudiante_id, "fracciones", 2)
5. Gemini genera ejercicio contextualizado (ej: reparto de pizzas)
6. Estudiante resuelve ejercicio
7. Sistema ejecuta ValidarRespuestaEjercicio(ejercicio_id, "3/4")
8. Gemini valida respuesta y genera retroalimentación
9. Sistema muestra: "¡Excelente! Entiendes que 3/4 representa..."
10. Sistema determina siguiente acción: avanzar a nivel 3
11. Ciclo se repite
```

---

**Notas finales:**
- Estos algoritmos deben ser refinados mediante pruebas A/B con estudiantes reales
- La calibración de niveles de dificultad requiere validación con docentes
- Los prompts a Gemini deben iterarse basándose en la calidad de respuestas obtenidas
- Considerar implementar un "modo de emergencia" sin IA que use ejercicios predefinidos
