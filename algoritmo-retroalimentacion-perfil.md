# ARCHIVO 2: ALGORITMOS DE RETROALIMENTACIÓN Y REAJUSTE DE PERFIL

## 3. ALGORITMO DE MEJORES EXPLICACIONES Y RETROALIMENTACIÓN CON GEMINI

### 3.1. Características del Algoritmo

**Propósito:**
Proporcionar explicaciones adaptadas y retroalimentación personalizada según el perfil del estudiante y su historial de respuestas, usando Gemini para generar contenido pedagógico de alta calidad.

**Entradas:**
- Perfil completo del estudiante
- Historial de respuestas recientes
- Concepto/tema a explicar
- Contexto del error o dificultad (si aplica)
- Nivel de frustración detectado (opcional)

**Salidas:**
- Explicación personalizada del concepto
- Retroalimentación específica y constructiva
- Recursos adicionales recomendados
- Plan de acción pedagógico

**Técnicas utilizadas:**
- Generación de lenguaje natural con Gemini
- Análisis de patrones de error
- Teoría del andamiaje (Scaffolding)
- Zona de Desarrollo Próximo (ZDP) de Vygotsky
- Diferenciación pedagógica

**Principios pedagógicos:**
- Aprendizaje significativo (conectar con conocimientos previos)
- Retroalimentación inmediata y específica
- Refuerzo positivo constante
- Adaptación al nivel de desarrollo cognitivo

### 3.2. Pseudocódigo del Algoritmo

```pseudocode
ALGORITMO GenerarExplicacionPersonalizada(estudiante_id, concepto, contexto_error)

    // FASE 1: Recopilar contexto completo del estudiante
    perfil = ObtenerPerfilEstudiante(estudiante_id)
    historial_concepto = ObtenerHistorialConcepto(estudiante_id, concepto)
    estado_emocional = DetectarEstadoEmocional(estudiante_id)

    // FASE 2: Analizar patrones de error y dificultades
    FUNCION AnalizarPatronesError(historial_concepto, contexto_error)
        patrones = {
            "errores_recurrentes": [],
            "misconceptions": [],
            "areas_confusion": [],
            "conocimientos_previos_faltantes": []
        }

        // Analizar últimos 10 intentos en este concepto
        intentos_recientes = historial_concepto.ULTIMOS(10)

        // Identificar errores que se repiten
        errores_agrupados = AgruparPorSimilitud(intentos_recientes.errores)

        PARA CADA grupo EN errores_agrupados
            SI grupo.frecuencia >= 3 ENTONCES
                patrones.errores_recurrentes.AGREGAR(grupo.tipo_error)

                // Inferir posible misconception
                misconception = InferirMisconception(grupo.tipo_error, concepto)
                SI misconception != NULL ENTONCES
                    patrones.misconceptions.AGREGAR(misconception)
                FIN SI
            FIN SI
        FIN PARA

        // Identificar áreas de confusión
        SI contexto_error != NULL ENTONCES
            area_confusion = IdentificarAreaConfusion(contexto_error, concepto)
            patrones.areas_confusion.AGREGAR(area_confusion)

            // Verificar conocimientos previos necesarios
            prereq = ObtenerPrerequisitos(concepto)
            PARA CADA conocimiento_previo EN prereq
                dominio = VerificarDominio(estudiante_id, conocimiento_previo)
                SI dominio < 70 ENTONCES
                    patrones.conocimientos_previos_faltantes.AGREGAR(conocimiento_previo)
                FIN SI
            FIN PARA
        FIN SI

        RETORNAR patrones
    FIN FUNCION

    patrones_error = AnalizarPatronesError(historial_concepto, contexto_error)

    // FASE 3: Determinar nivel de explicación necesario
    FUNCION DeterminarNivelExplicacion(perfil, patrones_error, estado_emocional)

        // Nivel base según edad
        SI perfil.edad <= 7 ENTONCES
            nivel_base = "muy_simple"
        SINO SI perfil.edad <= 9 ENTONCES
            nivel_base = "simple"
        SINO SI perfil.edad <= 11 ENTONCES
            nivel_base = "moderado"
        SINO
            nivel_base = "avanzado"
        FIN SI

        // Ajustar según estado emocional
        SI estado_emocional.frustrado == VERDADERO ENTONCES
            nivel_ajustado = ReducirNivel(nivel_base, 1)
            tono_requerido = "muy_empático_y_alentador"
        SINO SI estado_emocional.aburrido == VERDADERO ENTONCES
            nivel_ajustado = AumentarNivel(nivel_base, 1)
            tono_requerido = "desafiante_y_motivador"
        SINO
            nivel_ajustado = nivel_base
            tono_requerido = "amigable_y_cercano"
        FIN SI

        // Ajustar según cantidad de intentos fallidos
        SI historial_concepto.intentos_fallidos_consecutivos >= 3 ENTONCES
            requiere_andamiaje = VERDADERO
            incluir_ejemplos_guiados = VERDADERO
        SINO
            requiere_andamiaje = FALSO
            incluir_ejemplos_guiados = FALSO
        FIN SI

        RETORNAR {
            nivel: nivel_ajustado,
            tono: tono_requerido,
            requiere_andamiaje: requiere_andamiaje,
            incluir_ejemplos_guiados: incluir_ejemplos_guiados,
            necesita_remedial: LONGITUD(patrones_error.conocimientos_previos_faltantes) > 0
        }
    FIN FUNCION

    config_explicacion = DeterminarNivelExplicacion(perfil, patrones_error, estado_emocional)

    // FASE 4: Construir prompt contextualizado para Gemini
    FUNCION ConstruirPromptExplicacion(perfil, concepto, patrones_error, config_explicacion)

        // Determinar metáfora/contexto según inteligencias múltiples
        inteligencia_principal = perfil.inteligencias_multiples.principales[0].nombre
        contexto_explicativo = MapearInteligenciaAMetafora(inteligencia_principal, concepto)

        // Determinar formato según estilo de aprendizaje
        SI perfil.estilo_aprendizaje.predominante == "visual" ENTONCES
            formato = "Usa metáforas visuales, describe imágenes mentales, sugiere diagramas"
        SINO SI perfil.estilo_aprendizaje.predominante == "auditivo" ENTONCES
            formato = "Usa narrativas, diálogos, comparaciones sonoras"
        SINO SI perfil.estilo_aprendizaje.predominante == "kinestesico" ENTONCES
            formato = "Incluye actividades manipulativas, movimientos, acciones concretas"
        SINO  // lectoescritor
            formato = "Organiza en listas, usa estructura clara, incluye definiciones"
        FIN SI

        prompt = """
        Eres un tutor educativo experto y empático especializado en educación primaria.

        PERFIL DEL ESTUDIANTE:
        - Nombre: {perfil.nombre} (usar para personalizar)
        - Edad: {perfil.edad} años, Grado: {perfil.grado}
        - Estilo de aprendizaje: {perfil.estilo_aprendizaje.predominante}
        - Inteligencia predominante: {inteligencia_principal}
        - Ritmo de aprendizaje: {perfil.ritmo_aprendizaje.clasificacion}
        - Estado emocional actual: {estado_emocional.descripcion}

        CONCEPTO A EXPLICAR:
        {concepto}

        CONTEXTO DE LA DIFICULTAD:
        - Error cometido: {contexto_error.descripcion}
        - Patrones de error detectados: {patrones_error.errores_recurrentes}
        - Posibles misconceptions: {patrones_error.misconceptions}
        - Áreas de confusión: {patrones_error.areas_confusion}
        - Conocimientos previos faltantes: {patrones_error.conocimientos_previos_faltantes}
        - Intentos fallidos consecutivos: {historial_concepto.intentos_fallidos_consecutivos}

        CONFIGURACIÓN DE LA EXPLICACIÓN:
        - Nivel de complejidad: {config_explicacion.nivel}
        - Tono requerido: {config_explicacion.tono}
        - Requiere andamiaje: {config_explicacion.requiere_andamiaje}
        - Incluir ejemplos guiados: {config_explicacion.incluir_ejemplos_guiados}
        - Necesita remedial: {config_explicacion.necesita_remedial}

        INSTRUCCIONES:

        1. INICIO EMPÁTICO (obligatorio):
           - Valida el esfuerzo del estudiante
           - Normaliza el error como parte del aprendizaje
           - Genera confianza: "Es completamente normal confundirse con..."

        2. EXPLICACIÓN DEL CONCEPTO:
           - {formato}
           - Usa la metáfora/contexto: {contexto_explicativo}
           - Conecta con conocimientos que YA domina: {perfil.conceptos_dominados_recientes}
           - Si hay misconceptions, corrígelos sutilmente sin ser negativo
           - Nivel de vocabulario apropiado para {perfil.edad} años

        3. ESTRATEGIA DE ANDAMIAJE (si requiere_andamiaje = true):
           - Divide el concepto en pasos más pequeños
           - Proporciona un ejemplo completamente resuelto y explicado paso a paso
           - Luego propone un ejemplo similar para que el estudiante intente

        4. CONOCIMIENTOS PREVIOS (si necesita_remedial = true):
           - Identifica qué conocimiento previo está faltando: {patrones_error.conocimientos_previos_faltantes[0]}
           - Ofrece una mini-explicación de ese concepto
           - Conecta ese concepto previo con el actual

        5. VERIFICACIÓN DE COMPRENSIÓN:
           - Propone 1-2 preguntas sencillas para verificar entendimiento
           - Las preguntas deben ser ligeramente más fáciles que el ejercicio original

        6. MOTIVACIÓN FINAL:
           - Mensaje personalizado de ánimo
           - Recordatorio de progreso reciente en otros temas
           - Frase motivadora adaptada a la edad

        RESTRICCIONES IMPORTANTES:
        - NUNCA uses términos como "está mal", "error", "incorrecto" directamente
        - SIEMPRE empieza con algo positivo
        - Máximo 200 palabras (adaptar a la edad: menos palabras para menores)
        - Usa emojis apropiados para la edad (máximo 3)
        - Lenguaje cálido, cercano y alentador

        FORMATO DE RESPUESTA (JSON):
        {
            "saludo_empatico": "Mensaje inicial validando esfuerzo",

            "explicacion_principal": {
                "introduccion": "Frase que conecta con conocimiento previo",
                "concepto_nucleo": "Explicación del concepto usando la metáfora",
                "ejemplo_concreto": "Ejemplo específico y relevante",
                "aclaracion_misconception": "Corrección sutil del concepto erróneo (si aplica)"
            },

            "andamiaje": {
                "paso_1": "Primer paso simplificado",
                "paso_2": "Segundo paso",
                "paso_3": "Tercer paso",
                "ejemplo_resuelto": "Ejemplo completo paso a paso"
            } (solo si requiere_andamiaje),

            "remedial_conocimientos_previos": {
                "concepto_previo": "Nombre del concepto faltante",
                "explicacion_breve": "Mini explicación del concepto previo",
                "conexion": "Cómo se conecta con el concepto actual"
            } (solo si necesita_remedial),

            "verificacion_comprension": [
                {
                    "pregunta": "Pregunta sencilla 1",
                    "respuesta_esperada": "Respuesta correcta"
                },
                {
                    "pregunta": "Pregunta sencilla 2",
                    "respuesta_esperada": "Respuesta correcta"
                }
            ],

            "recursos_adicionales": [
                {
                    "tipo": "video | juego | actividad | lectura",
                    "descripcion": "Descripción del recurso",
                    "nivel_dificultad": "facil | medio | desafiante"
                }
            ],

            "mensaje_motivacional": "Mensaje final de ánimo personalizado",

            "resumen_para_docente": "Breve resumen técnico para el docente sobre la dificultad detectada y la estrategia aplicada"
        }
        """

        RETORNAR prompt
    FIN FUNCION

    prompt = ConstruirPromptExplicacion(perfil, concepto, patrones_error, config_explicacion)

    // FASE 5: Generar explicación con Gemini
    explicacion_raw = LlamarGeminiAPI(
        prompt=prompt,
        temperature=0.7,  // Balance entre creatividad y coherencia
        max_tokens=2000,
        timeout=5000
    )

    explicacion = ParsearJSON(explicacion_raw)

    // FASE 6: Enriquecer con recursos multimedia
    FUNCION EnriquecerConRecursos(explicacion, concepto, perfil)

        // Buscar recursos en banco de datos
        recursos_disponibles = BuscarRecursos(
            concepto=concepto,
            tipo=perfil.estilo_aprendizaje.predominante,
            edad=perfil.edad
        )

        // Añadir recursos que no sugirió Gemini
        PARA CADA recurso EN recursos_disponibles.PRIMEROS(3)
            SI NO explicacion.recursos_adicionales.CONTIENE(recurso) ENTONCES
                explicacion.recursos_adicionales.AGREGAR(recurso)
            FIN SI
        FIN PARA

        // Generar descripción de imagen/video si aplica
        SI perfil.estilo_aprendizaje.predominante == "visual" ENTONCES
            explicacion.recurso_visual = {
                "tipo": "imagen_conceptual",
                "descripcion": GenerarDescripcionImagenConceptual(concepto, explicacion.explicacion_principal.concepto_nucleo),
                "sugerencia_generacion_ia": VERDADERO
            }
        FIN SI

        RETORNAR explicacion
    FIN FUNCION

    explicacion_enriquecida = EnriquecerConRecursos(explicacion, concepto, perfil)

    // FASE 7: Registrar explicación y preparar seguimiento
    registro = {
        id: GenerarUUID(),
        estudiante_id: estudiante_id,
        concepto: concepto,
        fecha: FECHA_ACTUAL(),

        contexto: {
            patrones_error: patrones_error,
            estado_emocional: estado_emocional,
            configuracion: config_explicacion
        },

        explicacion: explicacion_enriquecida,

        seguimiento: {
            debe_verificar_comprension: VERDADERO,
            proxima_verificacion: FECHA_ACTUAL() + 1_DIA,
            requiere_atencion_docente: config_explicacion.requiere_andamiaje Y historial_concepto.intentos_fallidos_consecutivos >= 5
        },

        metadata: {
            generado_por: "gemini-api",
            version_algoritmo: "2.0",
            tiempo_generacion_ms: TiempoTranscurrido()
        }
    }

    GuardarExplicacion(registro)

    // Notificar a docente si requiere atención especial
    SI registro.seguimiento.requiere_atencion_docente ENTONCES
        NotificarDocente(perfil.docente_id, {
            estudiante: perfil.nombre,
            concepto: concepto,
            dificultad: "alta",
            recomendacion: "Intervención personalizada recomendada",
            resumen: explicacion_enriquecida.resumen_para_docente
        })
    FIN SI

    RETORNAR explicacion_enriquecida

FIN ALGORITMO


// ========================================================================
// FUNCIÓN AUXILIAR: Detectar estado emocional
// ========================================================================

FUNCION DetectarEstadoEmocional(estudiante_id)

    // Recopilar indicadores de las últimas 2 horas
    sesion_actual = ObtenerSesionActual(estudiante_id)

    indicadores = {
        "tiempo_entre_respuestas": [],
        "tasa_errores": 0,
        "intentos_abandonados": 0,
        "tiempo_inactividad": 0,
        "velocidad_respuestas": []
    }

    PARA CADA actividad EN sesion_actual.actividades
        indicadores.tiempo_entre_respuestas.AGREGAR(actividad.tiempo_respuesta)
        indicadores.velocidad_respuestas.AGREGAR(actividad.velocidad)

        SI actividad.resultado == "error" ENTONCES
            indicadores.tasa_errores += 1
        FIN SI

        SI actividad.abandonado == VERDADERO ENTONCES
            indicadores.intentos_abandonados += 1
        FIN SI
    FIN PARA

    indicadores.tasa_errores = indicadores.tasa_errores / LONGITUD(sesion_actual.actividades)
    indicadores.tiempo_inactividad = sesion_actual.tiempo_inactivo_total

    // Clasificar estado emocional
    estado = {
        "frustrado": FALSO,
        "aburrido": FALSO,
        "motivado": FALSO,
        "confundido": FALSO,
        "descripcion": "",
        "nivel_confianza": 0
    }

    // Frustración: muchos errores + tiempos largos + abandonos
    SI indicadores.tasa_errores > 0.6 Y
       indicadores.intentos_abandonados >= 2 Y
       PROMEDIO(indicadores.tiempo_entre_respuestas) > 60 ENTONCES
        estado.frustrado = VERDADERO
        estado.descripcion = "Muestra señales de frustración"
        estado.nivel_confianza = 0.75

    // Aburrimiento: respuestas muy rápidas + tiempo inactividad alto
    SINO SI PROMEDIO(indicadores.velocidad_respuestas) < 10 Y
            indicadores.tiempo_inactividad > 180 ENTONCES
        estado.aburrido = VERDADERO
        estado.descripcion = "Posible aburrimiento o falta de desafío"
        estado.nivel_confianza = 0.65

    // Confusión: tiempos variables + tasa media de errores
    SINO SI DESVIACION_ESTANDAR(indicadores.tiempo_entre_respuestas) > 30 Y
            indicadores.tasa_errores > 0.4 Y indicadores.tasa_errores < 0.7 ENTONCES
        estado.confundido = VERDADERO
        estado.descripcion = "Parece estar confundido pero perseverante"
        estado.nivel_confianza = 0.70

    // Motivado: baja tasa de errores + ritmo constante
    SINO SI indicadores.tasa_errores < 0.3 Y
            DESVIACION_ESTANDAR(indicadores.tiempo_entre_respuestas) < 20 ENTONCES
        estado.motivado = VERDADERO
        estado.descripcion = "Motivado y comprometido"
        estado.nivel_confianza = 0.80

    SINO
        estado.descripcion = "Estado emocional neutral"
        estado.nivel_confianza = 0.50
    FIN SI

    RETORNAR estado

FIN FUNCION
```

---

## 4. ALGORITMO PARA REAJUSTAR PERFIL SEGÚN RESPUESTAS

### 4.1. Características del Algoritmo

**Propósito:**
Actualizar dinámicamente el perfil del estudiante basándose en su comportamiento, respuestas y progreso real, mejorando la precisión de la personalización con el tiempo.

**Entradas:**
- Perfil actual del estudiante
- Historial completo de actividades recientes (últimos 30 días)
- Nuevas evaluaciones completadas
- Feedback explícito del estudiante (opcional)
- Observaciones del docente (opcional)

**Salidas:**
- Perfil actualizado del estudiante
- Log de cambios realizados
- Recomendaciones pedagógicas ajustadas
- Alertas para docentes (si hay cambios significativos)

**Frecuencia de ejecución:**
- Ligera: Después de cada 10 ejercicios completados
- Moderada: Cada 7 días
- Profunda: Cada 30 días o tras evaluación formal

**Principios:**
- Aprendizaje adaptativo continuo
- Evitar sobre-ajuste (dar peso a historial acumulado)
- Detectar cambios significativos vs. variabilidad normal
- Considerar contexto (ej: horario, día de la semana)

### 4.2. Pseudocódigo del Algoritmo

```pseudocode
ALGORITMO ReajustarPerfilEstudiante(estudiante_id, tipo_reajuste)

    // tipo_reajuste: "ligero" | "moderado" | "profundo"

    // FASE 1: Cargar datos necesarios
    perfil_actual = ObtenerPerfilEstudiante(estudiante_id)
    historial_30_dias = ObtenerHistorialActividades(estudiante_id, dias=30)
    historial_7_dias = ObtenerHistorialActividades(estudiante_id, dias=7)
    evaluaciones_recientes = ObtenerEvaluaciones(estudiante_id, dias=30)

    perfil_actualizado = CopiarProfundo(perfil_actual)
    cambios_realizados = []

    // FASE 2: Reajustar nivel académico por área
    SI tipo_reajuste == "moderado" O tipo_reajuste == "profundo" ENTONCES

        FUNCION ReajustarNivelAcademico(perfil, historial_30_dias, evaluaciones)

            PARA CADA area EN ["matematicas", "lectura", "ciencias"]

                // Obtener actividades de esta área
                actividades_area = FILTRAR(historial_30_dias, a => a.area == area)

                SI LONGITUD(actividades_area) < 10 ENTONCES
                    CONTINUAR  // Datos insuficientes
                FIN SI

                // Calcular métricas recientes
                tasa_exito_reciente = CalcularTasaExito(actividades_area)
                nivel_dificultad_promedio = PROMEDIO(a.nivel_dificultad PARA a EN actividades_area)
                progreso = CalcularProgreso(actividades_area)

                // Determinar si debe cambiar de nivel
                nivel_actual = perfil.nivel_academico[area]
                nuevo_nivel = nivel_actual

                // Criterios para ascender de nivel
                SI tasa_exito_reciente >= 0.80 Y
                   nivel_dificultad_promedio >= NivelANumero(nivel_actual) Y
                   progreso == "ascendente" ENTONCES

                    SI nivel_actual == "inicial" ENTONCES
                        nuevo_nivel = "basico"
                    SINO SI nivel_actual == "basico" ENTONCES
                        nuevo_nivel = "intermedio"
                    SINO SI nivel_actual == "intermedio" ENTONCES
                        nuevo_nivel = "avanzado"
                    FIN SI

                    cambios_realizados.AGREGAR({
                        tipo: "nivel_academico_incrementado",
                        area: area,
                        nivel_anterior: nivel_actual,
                        nivel_nuevo: nuevo_nivel,
                        justificacion: "Tasa de éxito " + tasa_exito_reciente + " en nivel " + nivel_dificultad_promedio
                    })

                // Criterios para descender de nivel (con cautela)
                SINO SI tasa_exito_reciente < 0.40 Y
                        nivel_dificultad_promedio <= NivelANumero(nivel_actual) Y
                        progreso == "descendente" ENTONCES

                    SI nivel_actual == "avanzado" ENTONCES
                        nuevo_nivel = "intermedio"
                    SINO SI nivel_actual == "intermedio" ENTONCES
                        nuevo_nivel = "basico"
                    SINO SI nivel_actual == "basico" ENTONCES
                        nuevo_nivel = "inicial"
                    FIN SI

                    cambios_realizados.AGREGAR({
                        tipo: "nivel_academico_decrementado",
                        area: area,
                        nivel_anterior: nivel_actual,
                        nivel_nuevo: nuevo_nivel,
                        justificacion: "Dificultades persistentes detectadas",
                        requiere_atencion_docente: VERDADERO
                    })
                FIN SI

                perfil_actualizado.nivel_academico[area] = nuevo_nivel

                // Actualizar debilidades específicas
                errores_frecuentes = AnalizarErroresFrecuentes(actividades_area)
                perfil_actualizado.nivel_academico.debilidades[area] = errores_frecuentes.PRIMEROS(5)

            FIN PARA

        FIN FUNCION

        ReajustarNivelAcademico(perfil_actualizado, historial_30_dias, evaluaciones_recientes)
    FIN SI

    // FASE 3: Reajustar estilo de aprendizaje (solo reajuste profundo)
    SI tipo_reajuste == "profundo" ENTONCES

        FUNCION ReajustarEstiloAprendizaje(perfil, historial_30_dias)

            // Analizar con qué modalidades tiene mejor desempeño
            desempeno_por_modalidad = {
                "visual": {ejercicios: 0, tasa_exito: 0, tiempo_promedio: 0},
                "auditivo": {ejercicios: 0, tasa_exito: 0, tiempo_promedio: 0},
                "kinestesico": {ejercicios: 0, tasa_exito: 0, tiempo_promedio: 0},
                "lectoescritor": {ejercicios: 0, tasa_exito: 0, tiempo_promedio: 0}
            }

            PARA CADA actividad EN historial_30_dias
                modalidad = actividad.modalidad_presentacion

                SI desempeno_por_modalidad.CONTIENE_LLAVE(modalidad) ENTONCES
                    desempeno_por_modalidad[modalidad].ejercicios += 1
                    desempeno_por_modalidad[modalidad].tasa_exito += actividad.fue_exitoso ? 1 : 0
                    desempeno_por_modalidad[modalidad].tiempo_promedio += actividad.tiempo_respuesta
                FIN SI
            FIN PARA

            // Calcular promedios
            PARA CADA modalidad EN desempeno_por_modalidad.LLAVES()
                SI desempeno_por_modalidad[modalidad].ejercicios > 0 ENTONCES
                    total = desempeno_por_modalidad[modalidad].ejercicios
                    desempeno_por_modalidad[modalidad].tasa_exito /= total
                    desempeno_por_modalidad[modalidad].tiempo_promedio /= total
                FIN SI
            FIN PARA

            // Ordenar por tasa de éxito
            modalidades_ordenadas = OrdenarPorTasaExito(desempeno_por_modalidad)

            estilo_predominante_real = modalidades_ordenadas[0].modalidad
            estilo_predominante_perfil = perfil.estilo_aprendizaje.predominante

            // Actualizar si hay diferencia significativa
            SI estilo_predominante_real != estilo_predominante_perfil Y
               modalidades_ordenadas[0].tasa_exito - modalidades_ordenadas[1].tasa_exito > 0.15 Y
               modalidades_ordenadas[0].ejercicios >= 20 ENTONCES

                perfil_actualizado.estilo_aprendizaje.predominante = estilo_predominante_real
                perfil_actualizado.estilo_aprendizaje.secundario = modalidades_ordenadas[1].modalidad

                perfil_actualizado.estilo_aprendizaje.distribucion = {
                    modalidades_ordenadas[0].modalidad: modalidades_ordenadas[0].tasa_exito * 100,
                    modalidades_ordenadas[1].modalidad: modalidades_ordenadas[1].tasa_exito * 100,
                    modalidades_ordenadas[2].modalidad: modalidades_ordenadas[2].tasa_exito * 100,
                    modalidades_ordenadas[3].modalidad: modalidades_ordenadas[3].tasa_exito * 100
                }

                cambios_realizados.AGREGAR({
                    tipo: "estilo_aprendizaje_actualizado",
                    estilo_anterior: estilo_predominante_perfil,
                    estilo_nuevo: estilo_predominante_real,
                    justificacion: "Desempeño superior en modalidad " + estilo_predominante_real,
                    datos: desempeno_por_modalidad
                })
            FIN SI

        FIN FUNCION

        ReajustarEstiloAprendizaje(perfil_actualizado, historial_30_dias)
    FIN SI

    // FASE 4: Reajustar ritmo de aprendizaje
    SI tipo_reajuste != "ligero" ENTONCES

        FUNCION ReajustarRitmoAprendizaje(perfil, historial_7_dias)

            tiempos_respuesta = []
            niveles_dificultad = []

            PARA CADA actividad EN historial_7_dias
                tiempos_respuesta.AGREGAR(actividad.tiempo_respuesta)
                niveles_dificultad.AGREGAR(actividad.nivel_dificultad)
            FIN PARA

            SI LONGITUD(tiempos_respuesta) < 15 ENTONCES
                RETORNAR  // Datos insuficientes
            FIN SI

            tiempo_medio_actual = MEDIANA(tiempos_respuesta)
            dificultad_promedio = PROMEDIO(niveles_dificultad)

            // Normalizar tiempo por dificultad
            tiempo_normalizado = tiempo_medio_actual / dificultad_promedio

            // Clasificar ritmo actual
            ritmo_observado = ""
            SI tiempo_normalizado < 20 ENTONCES
                ritmo_observado = "rapido"
            SINO SI tiempo_normalizado > 50 ENTONCES
                ritmo_observado = "pausado"
            SINO
                ritmo_observado = "moderado"
            FIN SI

            ritmo_perfil = perfil.ritmo_aprendizaje.clasificacion

            // Actualizar si hay cambio consistente
            SI ritmo_observado != ritmo_perfil ENTONCES

                perfil_actualizado.ritmo_aprendizaje.clasificacion = ritmo_observado
                perfil_actualizado.ritmo_aprendizaje.tiempo_promedio_segundos = tiempo_normalizado

                // Ajustar recomendaciones
                SI ritmo_observado == "rapido" ENTONCES
                    perfil_actualizado.ritmo_aprendizaje.recomendaciones = "Aumentar complejidad y variedad de ejercicios"
                SINO SI ritmo_observado == "pausado" ENTONCES
                    perfil_actualizado.ritmo_aprendizaje.recomendaciones = "Proporcionar más tiempo y andamiaje en conceptos nuevos"
                SINO
                    perfil_actualizado.ritmo_aprendizaje.recomendaciones = "Mantener ritmo actual con desafíos graduales"
                FIN SI

                cambios_realizados.AGREGAR({
                    tipo: "ritmo_aprendizaje_actualizado",
                    ritmo_anterior: ritmo_perfil,
                    ritmo_nuevo: ritmo_observado,
                    tiempo_normalizado: tiempo_normalizado
                })
            FIN SI

        FIN FUNCION

        ReajustarRitmoAprendizaje(perfil_actualizado, historial_7_dias)
    FIN SI

    // FASE 5: Actualizar inteligencias múltiples (solo profundo)
    SI tipo_reajuste == "profundo" ENTONCES

        // Analizar tipos de ejercicios donde destaca
        tipos_ejercicio_exitosos = AnalizarTiposEjercicioExitosos(historial_30_dias)
        nuevas_inteligencias = MapearTiposEjercicioAInteligencias(tipos_ejercicio_exitosos)

        // Combinar con inteligencias previas (70% historial, 30% inicial)
        PARA CADA inteligencia EN perfil_actualizado.inteligencias_multiples.distribucion.LLAVES()
            valor_actual = perfil_actualizado.inteligencias_multiples.distribucion[inteligencia]
            valor_nuevo = nuevas_inteligencias[inteligencia] O 0

            perfil_actualizado.inteligencias_multiples.distribucion[inteligencia] =
                (valor_actual * 0.7) + (valor_nuevo * 0.3)
        FIN PARA

        // Actualizar principales
        top_3 = OrdenarDescendente(perfil_actualizado.inteligencias_multiples.distribucion).PRIMEROS(3)
        perfil_actualizado.inteligencias_multiples.principales = top_3
    FIN SI

    // FASE 6: Actualizar metadata del perfil
    perfil_actualizado.metadata.ultima_actualizacion = FECHA_ACTUAL()
    perfil_actualizado.metadata.tipo_ultima_actualizacion = tipo_reajuste
    perfil_actualizado.metadata.version_algoritmo_reajuste = "2.0"
    perfil_actualizado.metadata.total_actividades_analizadas = LONGITUD(historial_30_dias)
    perfil_actualizado.metadata.confianza_categorizacion = CalcularConfianza(historial_30_dias)

    // Programar próxima evaluación
    SI tipo_reajuste == "ligero" ENTONCES
        perfil_actualizado.metadata.proxima_evaluacion = FECHA_ACTUAL() + 7_DIAS
    SINO SI tipo_reajuste == "moderado" ENTONCES
        perfil_actualizado.metadata.proxima_evaluacion = FECHA_ACTUAL() + 14_DIAS
    SINO  // profundo
        perfil_actualizado.metadata.proxima_evaluacion = FECHA_ACTUAL() + 30_DIAS
    FIN SI

    // FASE 7: Guardar perfil actualizado y registrar cambios
    GuardarPerfilEstudiante(perfil_actualizado)

    log_cambios = {
        id: GenerarUUID(),
        estudiante_id: estudiante_id,
        fecha: FECHA_ACTUAL(),
        tipo_reajuste: tipo_reajuste,
        cambios: cambios_realizados,
        perfil_anterior: perfil_actual,
        perfil_nuevo: perfil_actualizado
    }

    GuardarLogCambiosPerfil(log_cambios)

    // FASE 8: Notificaciones si hay cambios significativos
    SI LONGITUD(cambios_realizados) > 0 ENTONCES

        // Notificar al estudiante
        NotificarEstudiante(estudiante_id, {
            titulo: "Tu perfil de aprendizaje se ha actualizado",
            mensaje: GenerarMensajeAmigable(cambios_realizados),
            tipo: "informativo"
        })

        // Notificar al docente si hay cambios críticos
        requiere_atencion = EXISTE(c EN cambios_realizados DONDE c.requiere_atencion_docente)

        SI requiere_atencion O LONGITUD(cambios_realizados) >= 3 ENTONCES
            NotificarDocente(perfil_actual.docente_id, {
                estudiante: perfil_actual.nombre,
                tipo: "actualizacion_perfil",
                cambios: cambios_realizados,
                requiere_accion: requiere_atencion,
                recomendaciones: GenerarRecomendacionesDocente(cambios_realizados, perfil_actualizado)
            })
        FIN SI
    FIN SI

    RETORNAR {
        perfil_actualizado: perfil_actualizado,
        cambios_realizados: cambios_realizados,
        requiere_atencion_docente: requiere_atencion
    }

FIN ALGORITMO


// ========================================================================
// FUNCIONES AUXILIARES
// ========================================================================

FUNCION CalcularConfianza(historial)
    // La confianza aumenta con más datos
    num_actividades = LONGITUD(historial)

    SI num_actividades < 20 ENTONCES
        RETORNAR 0.50
    SINO SI num_actividades < 50 ENTONCES
        RETORNAR 0.65
    SINO SI num_actividades < 100 ENTONCES
        RETORNAR 0.80
    SINO
        RETORNAR 0.95
    FIN SI
FIN FUNCION


FUNCION GenerarMensajeAmigable(cambios_realizados)
    mensajes = []

    PARA CADA cambio EN cambios_realizados
        SI cambio.tipo == "nivel_academico_incrementado" ENTONCES
            mensajes.AGREGAR("¡Felicidades! Has avanzado al nivel " + cambio.nivel_nuevo + " en " + cambio.area)

        SINO SI cambio.tipo == "estilo_aprendizaje_actualizado" ENTONCES
            mensajes.AGREGAR("Descubrimos que aprendes mejor de forma " + cambio.estilo_nuevo + ". Vamos a usar más actividades así.")

        SINO SI cambio.tipo == "ritmo_aprendizaje_actualizado" ENTONCES
            mensajes.AGREGAR("Ajustamos el ritmo de tus ejercicios para que se adapte mejor a ti.")
        FIN SI
    FIN PARA

    SI LONGITUD(mensajes) == 0 ENTONCES
        RETORNAR "Seguimos aprendiendo sobre cómo te gusta aprender."
    SINO
        RETORNAR UNIR(mensajes, "\n")
    FIN SI
FIN FUNCION


FUNCION GenerarRecomendacionesDocente(cambios, perfil)
    recomendaciones = []

    // Analizar cambios y generar recomendaciones específicas
    PARA CADA cambio EN cambios
        SI cambio.tipo == "nivel_academico_decrementado" ENTONCES
            recomendaciones.AGREGAR(
                "Considerar intervención personalizada en " + cambio.area +
                ". El estudiante muestra dificultades persistentes."
            )

        SINO SI cambio.tipo == "nivel_academico_incrementado" ENTONCES
            recomendaciones.AGREGAR(
                "El estudiante está progresando excelentemente en " + cambio.area +
                ". Considerar desafíos adicionales."
            )
        FIN SI
    FIN PARA

    RETORNAR recomendaciones
FIN FUNCION
```

---

## 5. CONSIDERACIONES DE IMPLEMENTACIÓN

### 5.1. Frecuencia de Reajuste

| Tipo | Cuándo ejecutar | Datos analizados |
|------|----------------|------------------|
| Ligero | Cada 10 ejercicios | Últimos 7 días |
| Moderado | Cada 7 días | Últimos 30 días |
| Profundo | Cada 30 días o tras evaluación formal | Últimos 60-90 días |

### 5.2. Protección contra Sobre-ajuste

- Usar media ponderada (70% historial acumulado, 30% datos recientes)
- Requerir mínimo de actividades antes de cambiar perfil
- Cambios graduales, no abruptos
- Considerar contexto (horario, cansancio, día de semana)

### 5.3. Métricas de Calidad

- Estabilidad del perfil (cambios < 20% mensual ideal)
- Correlación entre perfil y desempeño real
- Satisfacción del estudiante con contenidos recomendados
- Validación periódica por docentes

---

**Fin del Archivo 2**
