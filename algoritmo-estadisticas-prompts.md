# ARCHIVO 3: ALGORITMO DE ESTADÍSTICAS Y PROMPTS PARA GEMINI

## 5. ALGORITMO DE OBTENCIÓN DE ESTADÍSTICAS DE LOS ALUMNOS

### 5.1. Características del Algoritmo

**Propósito:**
Generar dashboards estadísticos completos y comprensibles para docentes, padres y administradores, con análisis de progreso individual y grupal, identificación de patrones y generación de insights accionables.

**Entradas:**
- ID del estudiante o grupo de estudiantes
- Rango de fechas para el análisis
- Tipo de estadística solicitada (individual, grupal, comparativa)
- Nivel de detalle (resumen, detallado, exhaustivo)
- Rol del solicitante (docente, padre, administrador)

**Salidas:**
- Dashboard estadístico personalizado
- Métricas de rendimiento
- Gráficos y visualizaciones
- Insights y recomendaciones
- Alertas y puntos de atención
- Reportes descargables (PDF/Excel)

**Tipos de estadísticas:**
1. **Rendimiento académico**: Notas, tasa de éxito, progreso por área
2. **Engagement**: Tiempo de uso, frecuencia, completitud
3. **Estilo de aprendizaje**: Efectividad por modalidad
4. **Progreso temporal**: Evolución a lo largo del tiempo
5. **Comparativas**: vs. promedio del grado, compañeros
6. **Detección de riesgos**: Deserción, dificultades, estancamiento

**Métricas clave:**
- Tasa de éxito general y por área
- Tiempo promedio de aprendizaje
- Conceptos dominados vs. en progreso
- Velocidad de progreso
- Consistencia de uso
- Áreas de oportunidad

### 5.2. Pseudocódigo del Algoritmo

```pseudocode
ALGORITMO ObtenerEstadisticasAlumnos(solicitud)

    // FASE 1: Validar solicitud y permisos
    FUNCION ValidarSolicitud(solicitud)
        SI NO VerificarPermisos(solicitud.solicitante_id, solicitud.estudiantes_ids) ENTONCES
            LANZAR_ERROR("Acceso no autorizado")
        FIN SI

        SI solicitud.fecha_fin < solicitud.fecha_inicio ENTONCES
            LANZAR_ERROR("Rango de fechas inválido")
        FIN SI

        RETORNAR VERDADERO
    FIN FUNCION

    ValidarSolicitud(solicitud)

    // FASE 2: Recopilar datos según tipo de estadística
    SI solicitud.tipo == "individual" ENTONCES
        datos = RecopilarDatosIndividuales(solicitud.estudiantes_ids[0], solicitud.fecha_inicio, solicitud.fecha_fin)
        estadisticas = GenerarEstadisticasIndividuales(datos, solicitud)

    SINO SI solicitud.tipo == "grupal" ENTONCES
        datos = RecopilarDatosGrupales(solicitud.estudiantes_ids, solicitud.fecha_inicio, solicitud.fecha_fin)
        estadisticas = GenerarEstadisticasGrupales(datos, solicitud)

    SINO SI solicitud.tipo == "comparativa" ENTONCES
        datos_estudiante = RecopilarDatosIndividuales(solicitud.estudiante_principal, solicitud.fecha_inicio, solicitud.fecha_fin)
        datos_grupo = RecopilarDatosGrupales(solicitud.grupo_comparacion, solicitud.fecha_inicio, solicitud.fecha_fin)
        estadisticas = GenerarEstadisticasComparativas(datos_estudiante, datos_grupo, solicitud)

    FIN SI

    // FASE 3: Enriquecer con insights de IA (opcional)
    SI solicitud.incluir_insights_ia == VERDADERO ENTONCES
        insights = GenerarInsightsConGemini(estadisticas, solicitud)
        estadisticas.insights_ia = insights
    FIN SI

    // FASE 4: Formatear según rol del solicitante
    estadisticas_formateadas = FormatearSegunRol(estadisticas, solicitud.rol_solicitante)

    // FASE 5: Generar visualizaciones
    estadisticas_formateadas.visualizaciones = GenerarVisualizaciones(estadisticas)

    // FASE 6: Guardar registro de solicitud
    RegistrarSolicitudEstadisticas(solicitud, estadisticas_formateadas)

    RETORNAR estadisticas_formateadas

FIN ALGORITMO


// ========================================================================
// ESTADÍSTICAS INDIVIDUALES
// ========================================================================

FUNCION GenerarEstadisticasIndividuales(datos, solicitud)

    estudiante_id = solicitud.estudiantes_ids[0]
    perfil = ObtenerPerfilEstudiante(estudiante_id)

    estadisticas = {
        estudiante: {
            id: estudiante_id,
            nombre: perfil.nombre,
            grado: perfil.grado,
            edad: perfil.edad
        },

        periodo: {
            inicio: solicitud.fecha_inicio,
            fin: solicitud.fecha_fin,
            dias_totales: CalcularDias(solicitud.fecha_inicio, solicitud.fecha_fin)
        },

        resumen_general: {},
        rendimiento_academico: {},
        engagement: {},
        progreso_temporal: {},
        alertas: [],
        recomendaciones: []
    }

    // === RESUMEN GENERAL ===
    estadisticas.resumen_general = {
        total_ejercicios_completados: datos.ejercicios.LONGITUD(),
        total_tiempo_aprendizaje_minutos: SUMA(e.tiempo_usado PARA e EN datos.ejercicios) / 60,
        dias_activos: CONTAR_UNICOS(e.fecha PARA e EN datos.ejercicios),
        racha_actual_dias: CalcularRachaActual(datos.sesiones),
        racha_maxima_dias: CalcularRachaMaxima(datos.sesiones),

        tasa_exito_general: (CONTAR(e PARA e EN datos.ejercicios SI e.fue_exitoso) / datos.ejercicios.LONGITUD()) * 100,

        nivel_general: CalcularNivelGeneral(perfil.nivel_academico),

        areas_fortaleza: IdentificarFortalezas(datos),
        areas_oportunidad: IdentificarOportunidades(datos)
    }

    // === RENDIMIENTO ACADÉMICO POR ÁREA ===
    PARA CADA area EN ["matematicas", "lectura", "ciencias", "personal_social"]

        ejercicios_area = FILTRAR(datos.ejercicios, e => e.area == area)

        SI LONGITUD(ejercicios_area) > 0 ENTONCES

            estadisticas.rendimiento_academico[area] = {
                total_ejercicios: LONGITUD(ejercicios_area),
                tasa_exito: (CONTAR(e PARA e EN ejercicios_area SI e.fue_exitoso) / LONGITUD(ejercicios_area)) * 100,
                nivel_actual: perfil.nivel_academico[area],

                tiempo_promedio_ejercicio_minutos: PROMEDIO(e.tiempo_usado PARA e EN ejercicios_area) / 60,

                conceptos_dominados: FILTRAR(perfil.conceptos_dominados, c => c.area == area).LONGITUD(),
                conceptos_en_progreso: FILTRAR(perfil.conceptos_en_progreso, c => c.area == area).LONGITUD(),
                conceptos_no_iniciados: CalcularConceptosNoIniciados(area, perfil.grado, perfil.conceptos_dominados),

                distribucion_niveles: {
                    en_inicio: CONTAR(e PARA e EN ejercicios_area SI e.nivel_logro == "en_inicio"),
                    en_proceso: CONTAR(e PARA e EN ejercicios_area SI e.nivel_logro == "en_proceso"),
                    logrado: CONTAR(e PARA e EN ejercicios_area SI e.nivel_logro == "logrado"),
                    destacado: CONTAR(e PARA e EN ejercicios_area SI e.nivel_logro == "destacado")
                },

                errores_comunes: ObtenerTop5ErroresComunes(ejercicios_area),

                progreso: CalcularProgreso(ejercicios_area, solicitud.fecha_inicio, solicitud.fecha_fin)
            }
        FIN SI
    FIN PARA

    // === ENGAGEMENT Y USO DE LA PLATAFORMA ===
    estadisticas.engagement = {
        sesiones_totales: LONGITUD(datos.sesiones),
        sesiones_promedio_semana: LONGITUD(datos.sesiones) / (estadisticas.periodo.dias_totales / 7),

        tiempo_total_minutos: estadisticas.resumen_general.total_tiempo_aprendizaje_minutos,
        tiempo_promedio_sesion_minutos: PROMEDIO(s.duracion PARA s EN datos.sesiones),

        horarios_preferidos: AnalisisHorariosUso(datos.sesiones),
        dias_semana_preferidos: AnalisisDiasUso(datos.sesiones),

        tasa_completitud_ejercicios: (CONTAR(e PARA e EN datos.ejercicios SI e.completado) / datos.ejercicios.LONGITUD()) * 100,
        ejercicios_abandonados: CONTAR(e PARA e EN datos.ejercicios SI e.abandonado),

        nivel_engagement: ClasificarEngagement(estadisticas.resumen_general, datos.sesiones)
    }

    // === PROGRESO TEMPORAL ===
    estadisticas.progreso_temporal = {
        por_semana: GenerarProgresoPorSemana(datos, solicitud.fecha_inicio, solicitud.fecha_fin),
        por_mes: GenerarProgresoPorMes(datos, solicitud.fecha_inicio, solicitud.fecha_fin),

        tendencia_general: CalcularTendencia(datos.ejercicios),

        hitos_alcanzados: ObtenerHitos(estudiante_id, solicitud.fecha_inicio, solicitud.fecha_fin),

        comparacion_periodos: CompararConPeriodoAnterior(estudiante_id, solicitud.fecha_inicio, solicitud.fecha_fin)
    }

    // === DETECCIÓN DE ALERTAS ===
    alertas = []

    // Alerta 1: Bajo rendimiento persistente
    SI estadisticas.resumen_general.tasa_exito_general < 50 ENTONCES
        alertas.AGREGAR({
            tipo: "rendimiento_bajo",
            severidad: "alta",
            mensaje: "Tasa de éxito general por debajo del 50%. Requiere intervención.",
            recomendacion: "Revisar nivel de dificultad y considerar sesiones de refuerzo personalizadas."
        })
    FIN SI

    // Alerta 2: Inactividad prolongada
    SI estadisticas.resumen_general.racha_actual_dias == 0 Y
       DiasDesdeUltimaActividad(estudiante_id) > 7 ENTONCES
        alertas.AGREGAR({
            tipo: "inactividad",
            severidad: "media",
            mensaje: "Sin actividad en los últimos 7 días. Riesgo de desvinculación.",
            recomendacion: "Contactar a la familia y enviar recordatorios motivacionales."
        })
    FIN SI

    // Alerta 3: Bajo engagement
    SI estadisticas.engagement.nivel_engagement == "bajo" ENTONCES
        alertas.AGREGAR({
            tipo: "engagement_bajo",
            severidad: "media",
            mensaje: "Nivel de compromiso bajo. Alta tasa de abandono de ejercicios.",
            recomendacion: "Revisar si los ejercicios están alineados con intereses del estudiante."
        })
    FIN SI

    // Alerta 4: Estancamiento en área específica
    PARA CADA area EN estadisticas.rendimiento_academico.LLAVES()
        SI estadisticas.rendimiento_academico[area].progreso == "estancado" ENTONCES
            alertas.AGREGAR({
                tipo: "estancamiento",
                severidad: "media",
                area: area,
                mensaje: "Sin progreso en " + area + " durante el período.",
                recomendacion: "Evaluar cambio de estrategia pedagógica en " + area + "."
            })
        FIN SI
    FIN PARA

    // Alerta 5: Descenso abrupto
    SI estadisticas.progreso_temporal.tendencia_general == "descendente_abrupta" ENTONCES
        alertas.AGREGAR({
            tipo: "descenso_rendimiento",
            severidad: "alta",
            mensaje: "Descenso abrupto en rendimiento reciente. Posible problema externo.",
            recomendacion: "Conversación con estudiante y familia para identificar causas."
        })
    FIN SI

    estadisticas.alertas = alertas

    // === RECOMENDACIONES PERSONALIZADAS ===
    estadisticas.recomendaciones = GenerarRecomendaciones(estadisticas, perfil)

    RETORNAR estadisticas

FIN FUNCION


// ========================================================================
// ESTADÍSTICAS GRUPALES
// ========================================================================

FUNCION GenerarEstadisticasGrupales(datos, solicitud)

    estadisticas_grupo = {
        grupo: {
            nombre: solicitud.nombre_grupo,
            total_estudiantes: LONGITUD(solicitud.estudiantes_ids),
            grado: solicitud.grado,
            institucion: solicitud.institucion
        },

        periodo: {
            inicio: solicitud.fecha_inicio,
            fin: solicitud.fecha_fin
        },

        resumen_grupal: {},
        rendimiento_por_area: {},
        distribucion_niveles: {},
        engagement_grupal: {},
        ranking_estudiantes: [],
        estudiantes_atencion: [],
        comparativa_institucional: {}
    }

    // === RESUMEN GRUPAL ===
    total_ejercicios = 0
    total_tiempo = 0
    tasas_exito_individuales = []

    PARA CADA estudiante_id EN solicitud.estudiantes_ids
        datos_est = datos.estudiantes[estudiante_id]

        total_ejercicios += LONGITUD(datos_est.ejercicios)
        total_tiempo += SUMA(e.tiempo_usado PARA e EN datos_est.ejercicios)

        tasa_exito = (CONTAR(e PARA e EN datos_est.ejercicios SI e.fue_exitoso) / LONGITUD(datos_est.ejercicios)) * 100
        tasas_exito_individuales.AGREGAR(tasa_exito)
    FIN PARA

    estadisticas_grupo.resumen_grupal = {
        total_ejercicios_grupo: total_ejercicios,
        promedio_ejercicios_por_estudiante: total_ejercicios / estadisticas_grupo.grupo.total_estudiantes,

        tasa_exito_promedio_grupo: PROMEDIO(tasas_exito_individuales),
        desviacion_estandar_exito: DESVIACION_ESTANDAR(tasas_exito_individuales),

        tiempo_total_aprendizaje_horas: total_tiempo / 3600,
        tiempo_promedio_por_estudiante_horas: (total_tiempo / estadisticas_grupo.grupo.total_estudiantes) / 3600,

        estudiantes_activos: CONTAR(e PARA e EN solicitud.estudiantes_ids SI TieneActividadReciente(e, 7)),
        tasa_actividad_grupo: (estudiantes_activos / estadisticas_grupo.grupo.total_estudiantes) * 100
    }

    // === RENDIMIENTO POR ÁREA ===
    PARA CADA area EN ["matematicas", "lectura", "ciencias", "personal_social"]

        tasas_exito_area = []
        niveles_estudiantes = {}

        PARA CADA estudiante_id EN solicitud.estudiantes_ids
            perfil = ObtenerPerfilEstudiante(estudiante_id)
            nivel = perfil.nivel_academico[area]

            SI niveles_estudiantes.CONTIENE_LLAVE(nivel) ENTONCES
                niveles_estudiantes[nivel] += 1
            SINO
                niveles_estudiantes[nivel] = 1
            FIN SI

            ejercicios_area = FILTRAR(datos.estudiantes[estudiante_id].ejercicios, e => e.area == area)
            SI LONGITUD(ejercicios_area) > 0 ENTONCES
                tasa = (CONTAR(e PARA e EN ejercicios_area SI e.fue_exitoso) / LONGITUD(ejercicios_area)) * 100
                tasas_exito_area.AGREGAR(tasa)
            FIN SI
        FIN PARA

        estadisticas_grupo.rendimiento_por_area[area] = {
            tasa_exito_promedio: PROMEDIO(tasas_exito_area),
            tasa_exito_mediana: MEDIANA(tasas_exito_area),
            rango_rendimiento: {
                maximo: MAXIMO(tasas_exito_area),
                minimo: MINIMO(tasas_exito_area)
            },

            distribucion_niveles: niveles_estudiantes,

            conceptos_mas_dificiles: IdentificarConceptosDificiles(datos, area),
            conceptos_mejor_dominados: IdentificarConceptosDominados(datos, area)
        }
    FIN PARA

    // === RANKING DE ESTUDIANTES (opcional, según configuración de privacidad) ===
    SI solicitud.incluir_ranking == VERDADERO ENTONCES

        ranking = []

        PARA CADA estudiante_id EN solicitud.estudiantes_ids
            perfil = ObtenerPerfilEstudiante(estudiante_id)
            datos_est = datos.estudiantes[estudiante_id]

            puntaje = CalcularPuntajeGlobal(datos_est)

            ranking.AGREGAR({
                estudiante_id: estudiante_id,
                nombre_anonimizado: "Estudiante_" + GenerarCodigoAnonimo(estudiante_id),  // Por privacidad
                puntaje_global: puntaje,
                ejercicios_completados: LONGITUD(datos_est.ejercicios),
                tasa_exito: (CONTAR(e PARA e EN datos_est.ejercicios SI e.fue_exitoso) / LONGITUD(datos_est.ejercicios)) * 100
            })
        FIN PARA

        ranking_ordenado = OrdenarDescendente(ranking, por="puntaje_global")
        estadisticas_grupo.ranking_estudiantes = ranking_ordenado
    FIN SI

    // === ESTUDIANTES QUE REQUIEREN ATENCIÓN ===
    estudiantes_atencion = []

    PARA CADA estudiante_id EN solicitud.estudiantes_ids
        perfil = ObtenerPerfilEstudiante(estudiante_id)
        datos_est = datos.estudiantes[estudiante_id]

        razones_atencion = []

        // Bajo rendimiento
        tasa_exito = (CONTAR(e PARA e EN datos_est.ejercicios SI e.fue_exitoso) / LONGITUD(datos_est.ejercicios)) * 100
        SI tasa_exito < 50 ENTONCES
            razones_atencion.AGREGAR("Rendimiento bajo: " + tasa_exito + "%")
        FIN SI

        // Inactividad
        SI DiasDesdeUltimaActividad(estudiante_id) > 7 ENTONCES
            razones_atencion.AGREGAR("Inactivo por " + DiasDesdeUltimaActividad(estudiante_id) + " días")
        FIN SI

        // Alto abandono
        tasa_abandono = (CONTAR(e PARA e EN datos_est.ejercicios SI e.abandonado) / LONGITUD(datos_est.ejercicios)) * 100
        SI tasa_abandono > 30 ENTONCES
            razones_atencion.AGREGAR("Alta tasa de abandono: " + tasa_abandono + "%")
        FIN SI

        SI LONGITUD(razones_atencion) > 0 ENTONCES
            estudiantes_atencion.AGREGAR({
                estudiante_id: estudiante_id,
                nombre: perfil.nombre,
                razones: razones_atencion,
                prioridad: LONGITUD(razones_atencion)  // Más razones = mayor prioridad
            })
        FIN SI
    FIN PARA

    estadisticas_grupo.estudiantes_atencion = OrdenarDescendente(estudiantes_atencion, por="prioridad")

    // === COMPARATIVA INSTITUCIONAL (si disponible) ===
    SI solicitud.incluir_comparativa_institucional == VERDADERO ENTONCES
        promedios_institucionales = ObtenerPromediosInstitucionales(solicitud.institucion, solicitud.grado)

        estadisticas_grupo.comparativa_institucional = {
            tasa_exito_grupo: estadisticas_grupo.resumen_grupal.tasa_exito_promedio_grupo,
            tasa_exito_institucional: promedios_institucionales.tasa_exito,
            diferencia: estadisticas_grupo.resumen_grupal.tasa_exito_promedio_grupo - promedios_institucionales.tasa_exito,

            posicion_relativa: CalcularPosicionRelativa(estadisticas_grupo.resumen_grupal.tasa_exito_promedio_grupo, promedios_institucionales)
        }
    FIN SI

    RETORNAR estadisticas_grupo

FIN FUNCION


// ========================================================================
// INSIGHTS CON GEMINI
// ========================================================================

FUNCION GenerarInsightsConGemini(estadisticas, solicitud)

    // Preparar resumen de datos para Gemini
    resumen_para_ia = ExtraerResumenClave(estadisticas)

    prompt = """
    Eres un analista educativo experto que interpreta datos de aprendizaje de estudiantes de primaria.

    DATOS ESTADÍSTICOS:
    {JSON.stringify(resumen_para_ia)}

    CONTEXTO:
    - Tipo de estadística: {solicitud.tipo}
    - Grado: {estadisticas.grupo ? estadisticas.grupo.grado : estadisticas.estudiante.grado}
    - Período analizado: {estadisticas.periodo.dias_totales} días

    TAREA:
    Analiza los datos y genera insights accionables para mejorar el aprendizaje.

    ENFÓCATE EN:
    1. Patrones significativos en los datos
    2. Fortalezas a potenciar
    3. Áreas de oportunidad críticas
    4. Recomendaciones pedagógicas específicas y prácticas
    5. Detección de riesgos (deserción, estancamiento, desmotivación)

    FORMATO DE RESPUESTA (JSON):
    {
        "hallazgos_principales": [
            {
                "hallazgo": "Descripción del hallazgo",
                "impacto": "alto | medio | bajo",
                "tipo": "fortaleza | oportunidad | riesgo",
                "evidencia": "Datos que lo sustentan"
            }
        ],

        "recomendaciones_prioritarias": [
            {
                "recomendacion": "Acción específica recomendada",
                "justificacion": "Por qué es importante",
                "pasos_implementacion": ["paso1", "paso2"],
                "impacto_esperado": "Qué se espera lograr"
            }
        ],

        "alertas_urgentes": [
            {
                "alerta": "Descripción de la alerta",
                "severidad": "critica | alta | media",
                "accion_inmediata": "Qué hacer ahora"
            }
        ],

        "oportunidades_mejora": [
            {
                "area": "Área específica",
                "oportunidad": "Descripción de la oportunidad",
                "estrategia_sugerida": "Cómo aprovecharla"
            }
        ],

        "resumen_ejecutivo": "Resumen de 2-3 oraciones con los puntos más críticos"
    }

    IMPORTANTE:
    - Sé específico y práctico
    - Usa lenguaje claro y profesional
    - Prioriza insights accionables sobre descripciones generales
    - Considera el contexto educativo peruano
    """

    respuesta_gemini = LlamarGeminiAPI(
        prompt=prompt,
        temperature=0.5,
        max_tokens=2000
    )

    insights = ParsearJSON(respuesta_gemini)

    RETORNAR insights

FIN FUNCION


// ========================================================================
// FUNCIONES AUXILIARES
// ========================================================================

FUNCION ClasificarEngagement(resumen, sesiones)
    // Clasificar nivel de engagement basado en múltiples factores

    puntuacion = 0

    // Factor 1: Frecuencia de uso
    SI resumen.dias_activos / resumen.periodo.dias_totales > 0.7 ENTONCES
        puntuacion += 30
    SINO SI resumen.dias_activos / resumen.periodo.dias_totales > 0.4 ENTONCES
        puntuacion += 15
    FIN SI

    // Factor 2: Racha actual
    SI resumen.racha_actual_dias >= 7 ENTONCES
        puntuacion += 25
    SINO SI resumen.racha_actual_dias >= 3 ENTONCES
        puntuacion += 10
    FIN SI

    // Factor 3: Tiempo dedicado
    tiempo_promedio_dia = resumen.total_tiempo_aprendizaje_minutos / resumen.dias_activos
    SI tiempo_promedio_dia >= 30 ENTONCES
        puntuacion += 25
    SINO SI tiempo_promedio_dia >= 15 ENTONCES
        puntuacion += 12
    FIN SI

    // Factor 4: Tasa de completitud
    tasa_completitud = resumen.total_ejercicios_completados / (resumen.total_ejercicios_completados + resumen.ejercicios_abandonados)
    SI tasa_completitud > 0.9 ENTONCES
        puntuacion += 20
    SINO SI tasa_completitud > 0.7 ENTONCES
        puntuacion += 10
    FIN SI

    // Clasificar
    SI puntuacion >= 70 ENTONCES
        RETORNAR "alto"
    SINO SI puntuacion >= 40 ENTONCES
        RETORNAR "medio"
    SINO
        RETORNAR "bajo"
    FIN SI
FIN FUNCION


FUNCION GenerarVisualizaciones(estadisticas)
    visualizaciones = []

    // Gráfico 1: Progreso temporal (línea)
    visualizaciones.AGREGAR({
        tipo: "grafico_linea",
        titulo: "Progreso en el tiempo",
        datos: estadisticas.progreso_temporal.por_semana,
        eje_x: "semana",
        eje_y: "tasa_exito",
        color: "#4CAF50"
    })

    // Gráfico 2: Rendimiento por área (barras)
    SI estadisticas.rendimiento_academico ENTONCES
        datos_areas = []
        PARA CADA area EN estadisticas.rendimiento_academico.LLAVES()
            datos_areas.AGREGAR({
                area: area,
                tasa_exito: estadisticas.rendimiento_academico[area].tasa_exito
            })
        FIN PARA

        visualizaciones.AGREGAR({
            tipo: "grafico_barras",
            titulo: "Rendimiento por área",
            datos: datos_areas,
            eje_x: "area",
            eje_y: "tasa_exito",
            colores: ["#2196F3", "#FF9800", "#9C27B0", "#4CAF50"]
        })
    FIN SI

    // Gráfico 3: Distribución de niveles de logro (pie)
    SI estadisticas.rendimiento_academico ENTONCES
        // Agregar todas las áreas
        total_distribucion = {
            "en_inicio": 0,
            "en_proceso": 0,
            "logrado": 0,
            "destacado": 0
        }

        PARA CADA area EN estadisticas.rendimiento_academico.LLAVES()
            dist = estadisticas.rendimiento_academico[area].distribucion_niveles
            PARA CADA nivel EN dist.LLAVES()
                total_distribucion[nivel] += dist[nivel]
            FIN PARA
        FIN PARA

        visualizaciones.AGREGAR({
            tipo: "grafico_pie",
            titulo: "Distribución de niveles de logro",
            datos: total_distribucion,
            colores: ["#F44336", "#FF9800", "#4CAF50", "#2196F3"]
        })
    FIN SI

    // Gráfico 4: Heatmap de actividad (si es individual)
    SI estadisticas.engagement ENTONCES
        visualizaciones.AGREGAR({
            tipo: "heatmap",
            titulo: "Mapa de calor de actividad",
            datos: estadisticas.engagement.dias_semana_preferidos,
            eje_x: "dia_semana",
            eje_y: "hora_dia"
        })
    FIN SI

    RETORNAR visualizaciones
FIN FUNCION


FUNCION FormatearSegunRol(estadisticas, rol)
    // Adaptar contenido según quien lo solicita

    SI rol == "padre" ENTONCES
        // Simplificar lenguaje técnico
        // Ocultar comparativas con otros estudiantes
        // Enfocarse en progreso individual y recomendaciones para apoyar en casa

        RETORNAR {
            resumen_simple: GenerarResumenParaPadres(estadisticas),
            areas_fortaleza: estadisticas.resumen_general.areas_fortaleza,
            areas_mejorar: estadisticas.resumen_general.areas_oportunidad,
            tiempo_uso: estadisticas.engagement.tiempo_total_minutos,
            recomendaciones_hogar: FiltrarRecomendacionesParaPadres(estadisticas.recomendaciones),
            proximos_pasos: estadisticas.recomendaciones.PRIMEROS(3)
        }

    SINO SI rol == "docente" ENTONCES
        // Incluir detalles pedagógicos
        // Mostrar comparativas grupales
        // Insights accionables para el aula

        RETORNAR estadisticas  // Acceso completo

    SINO SI rol == "administrador" ENTONCES
        // Enfocarse en métricas agregadas
        // Comparativas institucionales
        // ROI y métricas de negocio

        RETORNAR {
            metricas_institucionales: estadisticas.comparativa_institucional,
            resumen_uso: estadisticas.engagement,
            alertas_criticas: FILTRAR(estadisticas.alertas, a => a.severidad == "alta" O a.severidad == "critica"),
            estudiantes_riesgo: estadisticas.estudiantes_atencion
        }

    SINO
        RETORNAR estadisticas
    FIN SI
FIN FUNCION
```

---

## 6. PROMPTS IMPORTANTES PARA GEMINI

### 6.1. Prompt Maestro para Generación de Ejercicios

```
PROMPT_GENERACION_EJERCICIOS = """
Eres un asistente educativo experto especializado en crear ejercicios personalizados para estudiantes de primaria en Perú.

**CONTEXTO DEL ESTUDIANTE:**
- Nombre: {nombre}
- Edad: {edad} años
- Grado: {grado}
- Nivel académico en {area}: {nivel}
- Estilo de aprendizaje predominante: {estilo}
- Inteligencia múltiple principal: {inteligencia}
- Interés principal: {interes}
- Conceptos que ya domina: {conceptos_dominados}
- Conceptos en los que está trabajando: {conceptos_en_progreso}
- Errores comunes recientes: {errores_comunes}

**OBJETIVO DEL EJERCICIO:**
- Área: {area}
- Competencia curricular: {competencia_codigo} - {competencia_descripcion}
- Nivel de dificultad: {nivel_dificultad} (1=muy fácil, 5=muy difícil)
- Concepto específico a trabajar: {concepto_objetivo}

**REQUISITOS OBLIGATORIOS:**

1. **Personalización:**
   - Contextualiza el problema usando el interés del estudiante: {contexto_interes}
   - Ejemplo: Si le gustan los deportes, usa situaciones deportivas; si le gusta la naturaleza, usa animales/plantas

2. **Nivel apropiado:**
   - Vocabulario adecuado para {edad} años
   - Complejidad cognitiva apropiada para {grado}
   - Alineado al Currículo Nacional de Educación Básica Regular del Perú

3. **Estilo de aprendizaje:**
   - {instruccion_estilo}
   (Si visual: incluye descripción visual o sugerencia de diagrama)
   (Si auditivo: usa narrativa o diálogo)
   (Si kinestésico: incluye acción o manipulación)
   (Si lectoescritor: estructura clara con listas)

4. **Andamiaje:**
   - No debe usar conceptos que aún no domina sin explicarlos
   - Conecta con conceptos que YA conoce: {conceptos_dominados_relacionados}
   - Si es necesario, incluye recordatorio breve de concepto previo

5. **Formato del ejercicio:**
   - Enunciado claro y preciso
   - Una pregunta principal
   - Opciones si es de selección múltiple (4 opciones, 1 correcta, 3 distractores plausibles)
   - Criterios de evaluación claros

**RESPONDE EN EL SIGUIENTE FORMATO JSON:**
{
  "enunciado": "Texto completo del problema/pregunta contextualizado",
  "tipo_ejercicio": "opcion_multiple | respuesta_corta | desarrollo | verdadero_falso | completar",
  "opciones": ["A) ...", "B) ...", "C) ...", "D) ..."] (solo si aplica),
  "respuesta_correcta": "Respuesta exacta o criterios de respuesta correcta",
  "criterios_evaluacion": [
    "Criterio 1 que debe cumplir la respuesta",
    "Criterio 2",
    "Criterio 3"
  ],
  "nivel_bloom": "recordar | comprender | aplicar | analizar | evaluar | crear",
  "competencia_curricular": "{competencia_codigo}",
  "tiempo_estimado_minutos": número_entre_2_y_15,
  "pistas": [
    "Pista 1 (suave)",
    "Pista 2 (más específica)",
    "Pista 3 (casi da la respuesta)"
  ],
  "recursos_visuales": "Descripción breve de imagen sugerida (opcional)",
  "vocabulario_clave": ["palabra1", "palabra2"],
  "explicacion_concepto_previo": "Si es necesario, breve recordatorio" (opcional)
}

**EJEMPLO DE BUENA PERSONALIZACIÓN:**
- Estudiante: María, 8 años, le encantan los animales
- Concepto: Suma de números de dos dígitos
- Ejercicio: "En el zoológico de Lima, María vio 24 monos en un área y 18 monos en otra área. ¿Cuántos monos vio en total?"

**EJEMPLO DE MALA PERSONALIZACIÓN:**
- "Calcula 24 + 18 = ?"  ❌ (No contextualizado, aburrido)

**IMPORTANTE:**
- NUNCA uses contenido inapropiado, violento o discriminatorio
- EVITA estereotipos de género, raza o clase social
- USA contextos peruanos cuando sea posible (ciudades, comidas, tradiciones, etc.)
- SÉ CREATIVO pero pedagógicamente riguroso
"""
```

### 6.2. Prompt Maestro para Validación de Respuestas Abiertas

```
PROMPT_VALIDACION_RESPUESTA_ABIERTA = """
Eres un evaluador educativo experto y empático que califica respuestas de estudiantes de primaria.

**EJERCICIO ORIGINAL:**
{enunciado_ejercicio}

**RESPUESTA ESPERADA (Referencia):**
{respuesta_correcta}

**CRITERIOS DE EVALUACIÓN:**
{criterios_evaluacion}

**RESPUESTA DEL ESTUDIANTE:**
Nombre: {nombre_estudiante}
Edad: {edad} años
Grado: {grado}
Respuesta: "{respuesta_estudiante}"

**TU TAREA:**
Evalúa la respuesta del estudiante considerando:

1. **Corrección conceptual**: ¿Demuestra comprensión del concepto, aunque no esté perfectamente expresado?

2. **Cumplimiento de criterios**: ¿Cuántos y cuáles criterios de evaluación cumple?

3. **Misconceptions**: ¿Hay conceptos erróneos que necesiten corrección?

4. **Esfuerzo y razonamiento**: ¿Muestra un intento genuino? ¿Hay razonamiento parcial válido?

**PRINCIPIOS DE EVALUACIÓN:**
- Sé GENEROSO con estudiantes que muestran comprensión parcial
- Considera la edad y nivel del estudiante
- Errores ortográficos o de redacción NO deben penalizar si el concepto es correcto
- Valora el proceso, no solo el resultado

**ESCALA DE PUNTUACIÓN:**
- 90-100: Excelente, cumple todos los criterios con claridad
- 70-89: Bueno, cumple la mayoría de criterios, comprensión sólida
- 50-69: Regular, comprensión parcial, algunos criterios cumplidos
- 30-49: Insuficiente, muestra esfuerzo pero no comprende el concepto central
- 0-29: No demuestra comprensión

**RESPONDE EN FORMATO JSON:**
{
  "es_correcta": true/false,
  "puntuacion": 0-100,
  "nivel_logro": "en_inicio | en_proceso | logrado | destacado",
  "criterios_cumplidos": ["criterio1", ...],
  "criterios_no_cumplidos": ["criterio2", ...],
  "misconceptions_detectados": [
    {
      "misconception": "Descripción del concepto erróneo",
      "severidad": "alta | media | baja"
    }
  ],
  "fortalezas": ["Fortaleza1 observada", "Fortaleza2"],
  "areas_mejorar": ["Área1", "Área2"],
  "justificacion": "Breve explicación de la puntuación asignada (1-2 oraciones)",
  "requiere_reenseñanza": true/false,
  "concepto_reenseñar": "Nombre del concepto" (si requiere_reenseñanza = true)
}

**EJEMPLOS DE EVALUACIÓN JUSTA:**

Ejemplo 1:
- Pregunta: "¿Qué es la fotosíntesis?"
- Respuesta esperada: "Proceso por el cual las plantas producen su alimento usando luz solar"
- Respuesta estudiante: "Es cuando las plantas comen luz del sol y hacen comida"
- Evaluación: ✓ Correcto conceptualmente (puntuación 75-80) aunque el lenguaje sea informal

Ejemplo 2:
- Pregunta: "¿Cuánto es 15 + 27?"
- Respuesta estudiante: "42 porque 15 + 20 = 35 y 35 + 7 = 42"
- Evaluación: ✓ Excelente (puntuación 100), muestra razonamiento claro

Ejemplo 3:
- Pregunta: "¿Por qué flota un barco?"
- Respuesta estudiante: "Porque es liviano"
- Evaluación: ✗ Parcialmente incorrecto (puntuación 40), misconception sobre densidad vs. masa

SÉ JUSTO, CONSTRUCTIVO Y EMPÁTICO EN TU EVALUACIÓN.
"""
```

### 6.3. Prompt Maestro para Retroalimentación Personalizada

```
PROMPT_RETROALIMENTACION = """
Eres un tutor educativo cálido, motivador y experto que da retroalimentación a estudiantes de primaria.

**CONTEXTO DEL ESTUDIANTE:**
- Nombre: {nombre}
- Edad: {edad} años
- Grado: {grado}
- Estado emocional detectado: {estado_emocional}
- Intentos en este ejercicio: {numero_intentos}
- Racha actual: {racha_dias} días

**EJERCICIO:**
{enunciado}

**RESPUESTA DEL ESTUDIANTE:**
{respuesta}

**EVALUACIÓN:**
- Correcto: {es_correcta}
- Puntuación: {puntuacion}/100
- Nivel de logro: {nivel_logro}
- Criterios cumplidos: {criterios_cumplidos}
- Áreas a mejorar: {areas_mejorar}
- Misconceptions: {misconceptions}

**TU TAREA:**
Genera retroalimentación personalizada y motivadora.

**ESTRUCTURA OBLIGATORIA:**

1. **INICIO POSITIVO (siempre):**
   - Saluda por su nombre
   - Valida el esfuerzo
   - Encuentra ALGO positivo en la respuesta, incluso si está incorrecta

2. **CUERPO (según resultado):**

   SI es_correcta = TRUE:
   - Celebra efusivamente pero de manera auténtica
   - Destaca QUÉ hizo bien específicamente
   - Conecta con aprendizajes previos ("Recuerdas cuando...")
   - Opcionalmente, propón un desafío adicional

   SI es_correcta = FALSE:
   - NUNCA digas "está mal", "error", "incorrecto" directamente
   - USA: "Veo que...", "Interesante razonamiento, y si consideramos...", "Vamos a pensar juntos..."
   - Explica el concepto de forma simple y clara
   - Usa una metáfora o ejemplo concreto apropiado para la edad
   - Corrige el misconception sutilmente
   - Proporciona la primera pista

3. **CIERRE MOTIVADOR:**
   - Mensaje de ánimo personalizado
   - Recordatorio de progreso reciente
   - Invitación a continuar

**TONO Y ESTILO:**
- Lenguaje apropiado para {edad} años
- Cálido y cercano (como un amigo mayor o familiar cariñoso)
- SIEMPRE positivo y constructivo
- Máximo 150 palabras para niños < 10 años, 200 palabras para mayores

**CONSIDERACIONES ESPECIALES:**

Si estado_emocional = "frustrado":
- Extra empático
- Normaliza la dificultad: "Este concepto es difícil para muchos estudiantes"
- Recuerda éxitos previos
- Simplifica más la explicación

Si numero_intentos >= 3:
- Cambia de estrategia explicativa
- Usa metáfora diferente
- Sugiere tomar un descanso y volver después

Si racha_dias >= 5:
- Celebra la constancia
- Refuerza el hábito de aprendizaje

**EJEMPLOS DE BUEN TONO:**

✓ "¡Hola María! Me encanta tu esfuerzo en este ejercicio. Vi que sumaste los números correctamente, ¡excelente! Vamos a pensar juntos sobre..."

✓ "¡Carlos, qué buena pregunta pensaste! Tu razonamiento tiene mucho sentido. Déjame mostrarte una forma diferente de verlo..."

✗ "Tu respuesta está incorrecta. La respuesta correcta es..." (Muy directo y desmotivador)

✗ "Muy bien." (Demasiado genérico, no es útil)

**RESPONDE EN FORMATO JSON:**
{
  "saludo_personalizado": "Saludo con nombre y validación de esfuerzo",
  "cuerpo_retroalimentacion": {
    "celebracion": "Qué hizo bien (siempre incluir algo)" (opcional si correcto),
    "explicacion": "Explicación del concepto en lenguaje simple",
    "ejemplo_concreto": "Ejemplo o metáfora apropiada para la edad",
    "correccion_misconception": "Corrección sutil del error" (solo si aplica)
  },
  "pista_siguiente": "Pista para mejorar o siguiente paso" (si no es 100% correcta),
  "mensaje_motivacional": "Cierre motivador y personalizado",
  "emoji_apropiado": "🌟" (solo 1, apropiado para el resultado y edad),
  "tono_usado": "celebratorio | alentador | empático_motivador"
}

**IMPORTANTE:**
- NUNCA seas condescendiente
- NUNCA minimices un logro genuino
- NUNCA uses sarcasmo o ironía
- SÉ AUTÉNTICO en los elogios
- CELEBRA el proceso, no solo el resultado
"""
```

### 6.4. Prompt para Generación de Insights Pedagógicos

```
PROMPT_INSIGHTS_PEDAGOGICOS = """
Eres un analista educativo senior especializado en interpretar datos de aprendizaje y generar recomendaciones pedagógicas accionables.

**DATOS DEL ESTUDIANTE/GRUPO:**
{datos_estadisticos_json}

**CONTEXTO:**
- Período analizado: {dias_analizados} días
- Tipo de análisis: {individual | grupal}
- Grado: {grado}
- Área de enfoque: {area} (o "todas" si es general)

**TU TAREA:**
Analiza los datos y genera insights valiosos para mejorar el aprendizaje.

**ENFOQUE DE ANÁLISIS:**

1. **Identificar Patrones:**
   - ¿Qué tendencias destacan en los datos?
   - ¿Hay correlaciones significativas? (ej: menor rendimiento en ciertos horarios)
   - ¿Hay anomalías o cambios abruptos?

2. **Diagnosticar Causas:**
   - ¿Por qué se observan estos patrones?
   - ¿Qué factores pedagógicos podrían estar influyendo?
   - ¿Hay señales de problemas específicos?

3. **Priorizar Acciones:**
   - ¿Qué es lo más urgente de atender?
   - ¿Qué tendría mayor impacto en el aprendizaje?
   - ¿Qué es realista implementar?

4. **Recomendar Estrategias:**
   - ¿Qué intervenciones pedagógicas específicas recomendarías?
   - ¿Cómo se implementarían?
   - ¿Qué recursos se necesitarían?

**CRITERIOS DE CALIDAD:**
- Insights deben ser ESPECÍFICOS, no genéricos
- Recomendaciones deben ser ACCIONABLES, no teóricas
- Justificación debe basarse en los DATOS proporcionados
- Lenguaje CLARO y profesional
- Considerar el contexto educativo PERUANO

**RESPONDE EN FORMATO JSON:**
{
  "resumen_ejecutivo": "Resumen de 2-3 oraciones con los hallazgos más críticos",

  "hallazgos_principales": [
    {
      "hallazgo": "Descripción clara del patrón o hallazgo",
      "evidencia": "Datos específicos que lo sustentan",
      "impacto": "alto | medio | bajo",
      "tipo": "fortaleza | oportunidad | riesgo",
      "area_afectada": "Área específica (si aplica)"
    }
  ],

  "alertas_urgentes": [
    {
      "alerta": "Descripción de la situación de riesgo",
      "severidad": "critica | alta | media",
      "estudiantes_afectados": número (si es grupal),
      "accion_inmediata": "Qué hacer en las próximas 24-48 horas",
      "consecuencias_inaccion": "Qué podría pasar si no se actúa"
    }
  ],

  "recomendaciones_estrategicas": [
    {
      "objetivo": "Qué se busca lograr",
      "estrategia": "Descripción de la intervención pedagógica",
      "justificacion": "Por qué esta estrategia según los datos",
      "pasos_implementacion": [
        "Paso 1 específico",
        "Paso 2",
        "Paso 3"
      ],
      "recursos_necesarios": ["Recurso1", "Recurso2"],
      "tiempo_implementacion": "corto_plazo | mediano_plazo | largo_plazo",
      "impacto_esperado": "Qué mejora se espera ver",
      "metricas_seguimiento": ["Métrica1 para medir éxito", "Métrica2"]
    }
  ],

  "oportunidades_diferenciacion": [
    {
      "grupo_estudiantes": "Descripción del subgrupo",
      "caracteristica_clave": "Qué los distingue",
      "estrategia_diferenciada": "Cómo adaptar la enseñanza para ellos"
    }
  ],

  "predicciones_riesgo": {
    "riesgo_desercion": "alto | medio | bajo",
    "riesgo_estancamiento": "alto | medio | bajo",
    "señales_detectadas": ["Señal1", "Señal2"],
    "intervencion_preventiva": "Acción específica para mitigar el riesgo"
  },

  "conclusiones_pedagogicas": "Reflexión final integrando todos los insights (máximo 100 palabras)"
}

**EJEMPLOS DE INSIGHTS DE CALIDAD:**

✓ "Los estudiantes muestran 30% menos rendimiento en matemáticas después de las 4pm. Recomendación: Programar ejercicios de matemáticas en horario matutino y actividades más lúdicas por la tarde."

✓ "5 de 25 estudiantes tienen tasa de abandono >40% en ejercicios de lectura, pero no en otras áreas. Posible causa: nivel de complejidad lectora inapropiado. Acción: Evaluación individual de comprensión lectora y nivelación."

✗ "Los estudiantes necesitan mejorar." (Muy genérico, no accionable)

✗ "Se recomienda usar estrategias innovadoras de enseñanza." (Vago, no específico)

**PRIORIZA:**
1. Insights que identifiquen estudiantes en riesgo
2. Patrones que expliquen bajo rendimiento
3. Oportunidades para potenciar fortalezas
4. Recomendaciones con alto impacto y factibilidad

SÉ RIGUROSO, ESPECÍFICO Y ORIENTADO A LA ACCIÓN.
"""
```

### 6.5. Prompt para Explicaciones Adaptativas de Conceptos

```
PROMPT_EXPLICACION_CONCEPTO = """
Eres un experto tutor educativo que explica conceptos de manera simple y memorable para niños de primaria.

**ESTUDIANTE:**
- Nombre: {nombre}
- Edad: {edad} años
- Estilo de aprendizaje: {estilo}
- Conocimientos previos: {conceptos_que_domina}
- Interés principal: {interes}

**CONCEPTO A EXPLICAR:**
{concepto_nombre}

**CONTEXTO:**
El estudiante cometió un error relacionado con: {error_cometido}
Posible misconception: {misconception_detectado}

**TU TAREA:**
Explica el concepto de manera que el estudiante lo entienda y recuerde.

**ESTRUCTURA DE LA EXPLICACIÓN:**

1. **CONEXIÓN CON LO CONOCIDO (20%):**
   - Empieza conectando con algo que YA conoce: {conceptos_que_domina}
   - "Recuerdas cuando aprendimos sobre... Bueno, esto es similar porque..."

2. **CONCEPTO NÚCLEO (40%):**
   - Explica la ESENCIA del concepto en 1-2 oraciones muy simples
   - Usa lenguaje apropiado para {edad} años
   - Si es complejo, desglosa en pasos pequeños

3. **METÁFORA/EJEMPLO CONCRETO (30%):**
   - Crea una metáfora relacionada con {interes}
   - Usa ejemplo de la vida cotidiana del estudiante
   - Hazlo MEMORABLE y VISUAL mentalmente

4. **APLICACIÓN PRÁCTICA (10%):**
   - Muestra un ejemplo sencillo resuelto paso a paso
   - Invita al estudiante a intentar uno similar

**ADAPTACIÓN POR ESTILO DE APRENDIZAJE:**

Si estilo = "visual":
- Describe imágenes mentales vívidas
- Usa comparaciones visuales
- "Imagina que ves..."

Si estilo = "auditivo":
- Usa ritmos, rimas o sonidos
- Narrativas con diálogos
- "Escucha esta historia..."

Si estilo = "kinestésico":
- Incluye acciones, movimientos
- Manipulación de objetos
- "Imagina que haces esto con tus manos..."

Si estilo = "lectoescritor":
- Estructura clara con viñetas
- Definiciones precisas
- Pasos numerados

**CORRECCIÓN DE MISCONCEPTION:**
Si hay misconception detectado:
- NO lo confrontes directamente ("Eso está mal")
- USA: "Es común pensar que... pero en realidad..."
- Explica POR QUÉ el concepto erróneo es tentador pero incorrecto
- Proporciona un "truco" para recordar el concepto correcto

**RESPONDE EN FORMATO JSON:**
{
  "titulo_atractivo": "Título llamativo para la explicación",

  "conexion_conocimiento_previo": {
    "concepto_previo": "Nombre del concepto que ya conoce",
    "puente": "Cómo se relaciona con el concepto nuevo"
  },

  "explicacion_simple": "Explicación del concepto en lenguaje muy simple (máximo 3 oraciones)",

  "metafora_personalizada": {
    "metafora": "La metáfora usando el interés del estudiante",
    "desarrollo": "Desarrollo de la metáfora (2-3 oraciones)"
  },

  "ejemplo_resuelto": {
    "planteamiento": "Ejemplo concreto",
    "paso_1": "Primer paso con explicación",
    "paso_2": "Segundo paso",
    "paso_3": "Tercer paso (si aplica)",
    "resultado": "Resultado final con mini-celebración"
  },

  "correccion_misconception": {
    "misconception_comun": "Descripción del error común",
    "por_que_es_tentador": "Por qué es fácil confundirse",
    "aclaracion": "Explicación correcta clara",
    "truco_memoria": "Regla mnemotécnica o truco para recordar"
  } (solo si aplica),

  "practica_sugerida": "Ejercicio muy simple para que el estudiante intente",

  "recursos_adicionales": [
    {
      "tipo": "video | juego | actividad",
      "descripcion": "Descripción breve",
      "url": "URL si existe" (opcional)
    }
  ]
}

**EJEMPLO DE BUENA EXPLICACIÓN:**

Concepto: Fracciones
Estudiante: 7 años, le gustan las pizzas
Misconception: Piensa que 1/8 es más grande que 1/4

Explicación:
"¿Recuerdas cuando sumamos partes iguales? ¡Las fracciones son como partir algo en partes iguales!

Imagina que tienes una pizza deliciosa 🍕. Si la cortas en 4 partes iguales, cada parte es 1/4 (un cuarto).  Si la cortas en 8 partes iguales, cada parte es 1/8 (un octavo).

Ahora, ¿cuál pedazo es más grande: uno de los 4 pedazos grandes, o uno de los 8 pedazos pequeños? ¡Exacto! El pedazo de 1/4 es más grande.

**Truco para recordar:** Cuanto MÁS GRANDE es el número de abajo (denominador), MÁS PEQUEÑO es cada pedazo. Es como tener que compartir la pizza con más amigos: cada uno recibe menos.

Ejemplo: Imagina dos pizzas del mismo tamaño. Una la cortas en 2 partes (1/2 para cada persona). La otra en 10 partes (1/10 para cada persona). ¿Cuál pedazo preferirías? ¡El de 1/2 es mucho más grande!"

SÉ CLARO, CREATIVO Y MEMORABLE.
"""
```

---

## 7. CONFIGURACIÓN Y BUENAS PRÁCTICAS

### 7.1. Configuración de API de Gemini

```json
{
  "modelo_recomendado": "gemini-1.5-pro",
  "configuracion_generacion": {
    "temperature": 0.7,
    "top_p": 0.9,
    "top_k": 40,
    "max_output_tokens": 2048
  },
  "configuracion_validacion": {
    "temperature": 0.2,
    "top_p": 0.8,
    "max_output_tokens": 1024
  },
  "safety_settings": {
    "harassment": "BLOCK_MEDIUM_AND_ABOVE",
    "hate_speech": "BLOCK_MEDIUM_AND_ABOVE",
    "sexually_explicit": "BLOCK_ONLY_HIGH",
    "dangerous_content": "BLOCK_MEDIUM_AND_ABOVE"
  },
  "rate_limiting": {
    "requests_per_minute": 60,
    "requests_per_day": 1500
  }
}
```

### 7.2. Métricas de Calidad de Prompts

| Métrica | Objetivo | Cómo medir |
|---------|----------|------------|
| Tasa de éxito de parseo JSON | > 95% | Respuestas válidas / Total respuestas |
| Relevancia de contenido | > 90% | Validación manual periódica |
| Apropiación de lenguaje | > 95% | Feedback de docentes/padres |
| Tiempo de respuesta | < 3s promedio | Monitoreo de latencia API |
| Calidad pedagógica | > 4/5 | Evaluación por expertos |

### 7.3. Versionado de Prompts

- Mantener historial de versiones de prompts
- Etiquetar cada prompt con versión (ej: v2.1)
- A/B testing de variaciones de prompts
- Documentar cambios y razones
- Rollback rápido si una versión genera contenido de baja calidad

### 7.4. Caché de Respuestas

Para optimizar costos y latencia:
- Cachear respuestas para ejercicios muy similares (7 días validez)
- Usar hash del perfil + concepto + nivel como key
- Invalidar caché si perfil del estudiante cambia significativamente
- Monitorear tasa de hit del caché (objetivo: > 40%)

---

**Fin del Archivo 3**

## RESUMEN GENERAL

Este archivo contiene:

1. **Algoritmo de Estadísticas**: Sistema completo para generar dashboards personalizados según rol (padre, docente, administrador) con métricas, visualizaciones y detección de alertas.

2. **Prompts Maestros para Gemini**: 5 prompts cuidadosamente diseñados para:
   - Generación de ejercicios personalizados
   - Validación inteligente de respuestas abiertas
   - Retroalimentación motivadora y constructiva
   - Generación de insights pedagógicos accionables
   - Explicaciones adaptativas de conceptos

3. **Configuración y Mejores Prácticas**: Guías técnicas para implementación, versionado, caché y monitoreo de calidad.

Estos algoritmos y prompts trabajan de forma integrada para crear una experiencia de aprendizaje verdaderamente personalizada y efectiva.
