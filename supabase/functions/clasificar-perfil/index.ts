// =====================================================
// EDGE FUNCTION: clasificar-perfil
// =====================================================
// Clasifica el perfil de un estudiante basado en
// respuestas a un formulario psicopedagógico
// =====================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Tipos de datos
interface RespuestasFormulario {
  [key: string]: string;
}

interface RequestBody {
  estudiante_id: string;
  grado: string;
  respuestas: RespuestasFormulario;
  nombre?: string;
  apellido?: string;
  edad?: number;
}

interface PerfilClasificado {
  estudiante_id: string;
  grado: string;
  estilo_aprendizaje: string;
  velocidad: string;
  atencion: string;
  interes: string;
  nivel_matematicas: string;
  nivel_lectura: string;
  motivacion: string;
  frustracion: string;
  trabajo: string;
  energia: string;
  nivel_riesgo: string;
  categoria_principal: string;
  recomendaciones: string[];
  confianza_perfil: number;
  respuestas_originales: RespuestasFormulario;
}

// Constantes de clasificación
const CATEGORIAS = {
  cientifico_resiliente: "El Científico Resiliente",
  artista_creativo: "El Artista Creativo",
  explorador_kinestesico: "El Explorador Kinestésico",
  estratega_analitico: "El Estratega Analítico",
  lider_social: "El Líder Social",
  pensador_silencioso: "El Pensador Silencioso",
  aprendiz_constante: "El Aprendiz Constante",
  desafiante_audaz: "El Desafiante Audaz",
  soñador_creativo: "El Soñador Creativo",
  observador_reflexivo: "El Observador Reflexivo",
};

const RECOMENDACIONES_POR_ESTILO = {
  visual: [
    "📊 Usar organizadores visuales y mapas mentales",
    "🎨 Incorporar diagramas, gráficos e ilustraciones",
    "📹 Utilizar videos educativos y presentaciones visuales",
  ],
  auditivo: [
    "🎵 Incorporar explicaciones verbales y discusiones",
    "🎧 Utilizar podcasts educativos y audiolibros",
    "💬 Promover trabajo en grupo con diálogo",
  ],
  kinestesico: [
    "🏃 Incorporar actividades prácticas y experimentos",
    "✋ Permitir movimiento durante el aprendizaje",
    "🧩 Usar manipulativos y materiales concretos",
  ],
  lectoescritura: [
    "📚 Proporcionar lecturas complementarias",
    "✍️ Promover toma de notas y resúmenes escritos",
    "📝 Incluir actividades de redacción y reflexión",
  ],
};

// =====================================================
// FUNCIÓN DE CLASIFICACIÓN
// =====================================================

function clasificarPerfil(
  estudiante_id: string,
  grado: string,
  respuestas: RespuestasFormulario
): PerfilClasificado {
  // Mapeo de respuestas a características
  const estilo_aprendizaje = mapearEstiloAprendizaje(respuestas.P1);
  const velocidad = mapearVelocidad(respuestas.P2);
  const atencion = mapearAtencion(respuestas.P3);
  const interes = mapearInteres(respuestas.P4);
  const nivel_matematicas = mapearNivelMatematicas(respuestas.P5);
  const nivel_lectura = mapearNivelLectura(respuestas.P6);
  const motivacion = mapearMotivacion(respuestas.P7);
  const frustracion = mapearFrustracion(respuestas.P8);
  const trabajo = mapearTrabajo(respuestas.P9);
  const energia = mapearEnergia(respuestas.P10);

  // Determinar nivel de riesgo
  const nivel_riesgo = determinarNivelRiesgo({
    atencion,
    motivacion,
    frustracion,
    nivel_matematicas,
    nivel_lectura,
  });

  // Determinar categoría principal
  const categoria_principal = determinarCategoria({
    estilo_aprendizaje,
    interes,
    velocidad,
    trabajo,
    frustracion,
    motivacion,
  });

  // Generar recomendaciones personalizadas
  const recomendaciones = generarRecomendaciones({
    estilo_aprendizaje,
    velocidad,
    nivel_riesgo,
    interes,
  });

  // Calcular confianza del perfil
  const confianza_perfil = calcularConfianza(respuestas);

  return {
    estudiante_id,
    grado,
    estilo_aprendizaje,
    velocidad,
    atencion,
    interes,
    nivel_matematicas,
    nivel_lectura,
    motivacion,
    frustracion,
    trabajo,
    energia,
    nivel_riesgo,
    categoria_principal,
    recomendaciones,
    confianza_perfil,
    respuestas_originales: respuestas,
  };
}

// =====================================================
// FUNCIONES DE MAPEO
// =====================================================

function mapearEstiloAprendizaje(respuesta: string): string {
  const mapeo: Record<string, string> = {
    A: "visual",
    B: "auditivo",
    C: "kinestesico",
    D: "lectoescritura",
  };
  return mapeo[respuesta] || "visual";
}

function mapearVelocidad(respuesta: string): string {
  const mapeo: Record<string, string> = {
    A: "rapido",
    B: "moderado",
    C: "lento",
    D: "muy_lento",
  };
  return mapeo[respuesta] || "moderado";
}

function mapearAtencion(respuesta: string): string {
  const mapeo: Record<string, string> = {
    A: "alta",
    B: "media",
    C: "baja",
    D: "muy_baja",
  };
  return mapeo[respuesta] || "media";
}

function mapearInteres(respuesta: string): string {
  const mapeo: Record<string, string> = {
    A: "cientifico",
    B: "artistico",
    C: "deportivo",
    D: "social",
  };
  return mapeo[respuesta] || "cientifico";
}

function mapearNivelMatematicas(respuesta: string): string {
  const mapeo: Record<string, string> = {
    A: "avanzado",
    B: "intermedio",
    C: "basico",
    D: "necesita_apoyo",
  };
  return mapeo[respuesta] || "basico";
}

function mapearNivelLectura(respuesta: string): string {
  const mapeo: Record<string, string> = {
    A: "avanzado",
    B: "desarrollado",
    C: "en_desarrollo",
    D: "inicial",
  };
  return mapeo[respuesta] || "en_desarrollo";
}

function mapearMotivacion(respuesta: string): string {
  const mapeo: Record<string, string> = {
    A: "alta",
    B: "media",
    C: "baja",
    D: "muy_baja",
  };
  return mapeo[respuesta] || "media";
}

function mapearFrustracion(respuesta: string): string {
  const mapeo: Record<string, string> = {
    A: "resiliente",
    B: "moderado",
    C: "baja_tolerancia",
    D: "muy_baja_tolerancia",
  };
  return mapeo[respuesta] || "moderado";
}

function mapearTrabajo(respuesta: string): string {
  const mapeo: Record<string, string> = {
    A: "individual",
    B: "colaborativo",
    C: "mixto",
    D: "depende_tarea",
  };
  return mapeo[respuesta] || "mixto";
}

function mapearEnergia(respuesta: string): string {
  const mapeo: Record<string, string> = {
    A: "matutino",
    B: "vespertino",
    C: "nocturno",
    D: "constante",
  };
  return mapeo[respuesta] || "matutino";
}

// =====================================================
// DETERMINACIÓN DE RIESGO Y CATEGORÍA
// =====================================================

function determinarNivelRiesgo(caracteristicas: {
  atencion: string;
  motivacion: string;
  frustracion: string;
  nivel_matematicas: string;
  nivel_lectura: string;
}): string {
  let puntos_riesgo = 0;

  // Factores de atención
  if (caracteristicas.atencion === "baja") puntos_riesgo += 2;
  if (caracteristicas.atencion === "muy_baja") puntos_riesgo += 3;

  // Factores de motivación
  if (caracteristicas.motivacion === "baja") puntos_riesgo += 2;
  if (caracteristicas.motivacion === "muy_baja") puntos_riesgo += 3;

  // Factores de frustración
  if (caracteristicas.frustracion === "baja_tolerancia") puntos_riesgo += 2;
  if (caracteristicas.frustracion === "muy_baja_tolerancia") puntos_riesgo += 3;

  // Factores académicos
  if (caracteristicas.nivel_matematicas === "necesita_apoyo") puntos_riesgo += 2;
  if (caracteristicas.nivel_lectura === "inicial") puntos_riesgo += 2;

  // Clasificación de riesgo
  if (puntos_riesgo >= 7) return "alto";
  if (puntos_riesgo >= 4) return "medio";
  return "bajo";
}

function determinarCategoria(caracteristicas: {
  estilo_aprendizaje: string;
  interes: string;
  velocidad: string;
  trabajo: string;
  frustracion: string;
  motivacion: string;
}): string {
  // Lógica simplificada de categorización
  if (caracteristicas.interes === "cientifico" && caracteristicas.frustracion === "resiliente") {
    return CATEGORIAS.cientifico_resiliente;
  }
  if (caracteristicas.interes === "artistico" && caracteristicas.estilo_aprendizaje === "visual") {
    return CATEGORIAS.artista_creativo;
  }
  if (caracteristicas.estilo_aprendizaje === "kinestesico") {
    return CATEGORIAS.explorador_kinestesico;
  }
  if (caracteristicas.velocidad === "rapido" && caracteristicas.trabajo === "individual") {
    return CATEGORIAS.estratega_analitico;
  }
  if (caracteristicas.trabajo === "colaborativo" && caracteristicas.interes === "social") {
    return CATEGORIAS.lider_social;
  }
  if (caracteristicas.trabajo === "individual" && caracteristicas.motivacion === "alta") {
    return CATEGORIAS.pensador_silencioso;
  }
  if (caracteristicas.motivacion === "alta" && caracteristicas.frustracion === "resiliente") {
    return CATEGORIAS.aprendiz_constante;
  }
  if (caracteristicas.frustracion === "baja_tolerancia" && caracteristicas.motivacion === "alta") {
    return CATEGORIAS.desafiante_audaz;
  }
  if (caracteristicas.interes === "artistico") {
    return CATEGORIAS.soñador_creativo;
  }

  return CATEGORIAS.observador_reflexivo;
}

function generarRecomendaciones(caracteristicas: {
  estilo_aprendizaje: string;
  velocidad: string;
  nivel_riesgo: string;
  interes: string;
}): string[] {
  const recomendaciones: string[] = [];

  // Recomendaciones por estilo de aprendizaje
  const recEstilo = RECOMENDACIONES_POR_ESTILO[caracteristicas.estilo_aprendizaje as keyof typeof RECOMENDACIONES_POR_ESTILO];
  if (recEstilo) {
    recomendaciones.push(...recEstilo);
  }

  // Recomendaciones por velocidad
  if (caracteristicas.velocidad === "rapido") {
    recomendaciones.push("🚀 Proporcionar ejercicios de extensión y desafíos");
  } else if (caracteristicas.velocidad === "lento" || caracteristicas.velocidad === "muy_lento") {
    recomendaciones.push("⏰ Dar tiempo adicional y fragmentar tareas");
  }

  // Recomendaciones por nivel de riesgo
  if (caracteristicas.nivel_riesgo === "alto") {
    recomendaciones.push("🆘 Requiere intervención y apoyo especializado");
    recomendaciones.push("👥 Considerar tutoría personalizada");
  } else if (caracteristicas.nivel_riesgo === "medio") {
    recomendaciones.push("⚠️ Monitorear progreso de cerca");
  }

  return recomendaciones.slice(0, 5); // Máximo 5 recomendaciones
}

function calcularConfianza(respuestas: RespuestasFormulario): number {
  const total_preguntas = Object.keys(respuestas).length;
  const confianza_base = (total_preguntas / 10) * 100;

  // Ajustar confianza si hay respuestas inconsistentes
  return Math.min(Math.round(confianza_base), 100);
}

// =====================================================
// HANDLER PRINCIPAL
// =====================================================

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Crear cliente de Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Parse request body
    const requestBody: RequestBody = await req.json();

    // Validar datos de entrada
    if (!requestBody.estudiante_id || !requestBody.grado || !requestBody.respuestas) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Faltan campos requeridos: estudiante_id, grado, respuestas",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verificar o crear estudiante
    const { data: estudianteExistente } = await supabaseClient
      .from("estudiantes")
      .select("*")
      .eq("estudiante_id", requestBody.estudiante_id)
      .single();

    if (!estudianteExistente) {
      // Crear nuevo estudiante
      const { error: errorEstudiante } = await supabaseClient
        .from("estudiantes")
        .insert({
          estudiante_id: requestBody.estudiante_id,
          nombre: requestBody.nombre || null,
          apellido: requestBody.apellido || null,
          grado: requestBody.grado,
          edad: requestBody.edad || null,
        });

      if (errorEstudiante) {
        throw errorEstudiante;
      }
    }

    // Clasificar perfil
    const perfil = clasificarPerfil(
      requestBody.estudiante_id,
      requestBody.grado,
      requestBody.respuestas
    );

    // Desactivar perfiles anteriores
    await supabaseClient
      .from("perfiles")
      .update({ activo: false })
      .eq("estudiante_id", requestBody.estudiante_id);

    // Guardar perfil en base de datos
    const { data: perfilGuardado, error: errorPerfil } = await supabaseClient
      .from("perfiles")
      .insert({
        estudiante_id: perfil.estudiante_id,
        grado: perfil.grado,
        estilo_aprendizaje: perfil.estilo_aprendizaje,
        velocidad: perfil.velocidad,
        atencion: perfil.atencion,
        interes: perfil.interes,
        nivel_matematicas: perfil.nivel_matematicas,
        nivel_lectura: perfil.nivel_lectura,
        motivacion: perfil.motivacion,
        frustracion: perfil.frustracion,
        trabajo: perfil.trabajo,
        energia: perfil.energia,
        categoria_principal: perfil.categoria_principal,
        nivel_riesgo: perfil.nivel_riesgo,
        recomendaciones: perfil.recomendaciones,
        confianza_perfil: perfil.confianza_perfil,
        respuestas_originales: perfil.respuestas_originales,
      })
      .select()
      .single();

    if (errorPerfil) {
      throw errorPerfil;
    }

    // Retornar respuesta exitosa
    return new Response(
      JSON.stringify({
        success: true,
        mensaje: "Perfil clasificado y guardado exitosamente",
        perfil: perfilGuardado,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error en clasificar-perfil:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Error interno del servidor",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
