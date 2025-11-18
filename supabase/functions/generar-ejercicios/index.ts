// =====================================================
// EDGE FUNCTION: generar-ejercicios
// =====================================================
// Genera ejercicios personalizados usando Gemini AI
// basados en el perfil del estudiante
// =====================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Tipos de datos
interface RequestBody {
  estudiante_id: string;
  curso: "matematicas" | "verbal";
  cantidad?: number;
  tipo_especifico?: string;
  forzar_nivel?: string;
}

interface Ejercicio {
  id: string;
  titulo: string;
  enunciado: string;
  opciones: string[];
  respuesta_correcta: string;
  explicacion: string;
  nivel: string;
  tipo: string;
  operacion_principal?: string;
  contexto?: string;
  incluye_visual?: boolean;
}

interface PerfilEstudiante {
  estudiante_id: string;
  grado: string;
  nivel_matematicas: string;
  nivel_lectura: string;
  estilo_aprendizaje: string;
  velocidad: string;
  interes: string;
}

// =====================================================
// PROMPTS PARA GEMINI AI
// =====================================================

const PROMPT_BASE_MATEMATICAS = `
Eres un experto en educación primaria especializado en matemáticas.
Genera {cantidad} ejercicio(s) de matemáticas con las siguientes características:

NIVEL: {nivel}
TIPO: {tipo}
ESTILO DE APRENDIZAJE: {estilo}
CONTEXTO PREFERIDO: {contexto}

FORMATO DE RESPUESTA (JSON):
{
  "ejercicios": [
    {
      "titulo": "Título breve del ejercicio",
      "enunciado": "Descripción completa del problema",
      "opciones": ["A) opción 1", "B) opción 2", "C) opción 3", "D) opción 4"],
      "respuesta_correcta": "A",
      "explicacion": "Explicación paso a paso de la solución",
      "tipo": "{tipo}",
      "nivel": "{nivel}",
      "operacion_principal": "suma|resta|multiplicacion|division",
      "contexto": "{contexto}",
      "incluye_visual": false
    }
  ]
}

INSTRUCCIONES:
- El enunciado debe ser claro y apropiado para el nivel
- Las opciones deben ser razonables y plausibles
- Solo UNA opción debe ser correcta
- La explicación debe ser educativa y comprensible
- Adapta el lenguaje al contexto: {contexto}
- Si el estilo es "visual", incluye descripciones visuales
- Responde ÚNICAMENTE con JSON válido, sin texto adicional
`;

const PROMPT_BASE_VERBAL = `
Eres un experto en educación primaria especializado en razonamiento verbal.
Genera {cantidad} ejercicio(s) de razonamiento verbal con las siguientes características:

NIVEL: {nivel}
TIPO: {tipo}
ESTILO DE APRENDIZAJE: {estilo}
CONTEXTO PREFERIDO: {contexto}

FORMATO DE RESPUESTA (JSON):
{
  "ejercicios": [
    {
      "titulo": "Título del ejercicio",
      "enunciado": "Descripción del ejercicio o texto base",
      "opciones": ["A) opción 1", "B) opción 2", "C) opción 3", "D) opción 4"],
      "respuesta_correcta": "A",
      "explicacion": "Explicación de por qué es la respuesta correcta",
      "tipo": "{tipo}",
      "nivel": "{nivel}",
      "contexto": "{contexto}",
      "incluye_visual": false
    }
  ]
}

INSTRUCCIONES:
- Vocabulario apropiado para el nivel educativo
- Contextos relevantes para niños de primaria
- Opciones bien diferenciadas
- Explicación pedagógica clara
- Adapta el tema al contexto: {contexto}
- Responde ÚNICAMENTE con JSON válido, sin texto adicional
`;

// =====================================================
// MAPEO DE NIVELES Y TIPOS
// =====================================================

const NIVEL_POR_GRADO: Record<string, string> = {
  "1-2": "basico",
  "3-4": "intermedio",
  "5-6": "avanzado",
};

const TIPOS_MATEMATICAS_POR_NIVEL: Record<string, string[]> = {
  basico: ["suma", "resta", "conteo", "comparacion", "figuras", "patrones"],
  intermedio: ["multiplicacion", "division", "fracciones", "geometria", "problemas_mixtos"],
  avanzado: ["operaciones_combinadas", "porcentajes", "geometria_avanzada", "proporciones"],
};

const TIPOS_VERBAL_POR_NIVEL: Record<string, string[]> = {
  basico: ["sinonimos", "antonimos", "categorias", "completar", "analogias"],
  intermedio: ["termino_excluido", "comprension", "oraciones_incompletas"],
  avanzado: ["comprension_inferencial", "analogias_complejas", "plan_de_redaccion", "conectores_logicos"],
};

const CONTEXTOS_POR_INTERES: Record<string, string> = {
  cientifico: "ciencia, experimentos, naturaleza",
  artistico: "arte, música, creatividad",
  deportivo: "deportes, juegos, actividad física",
  social: "amigos, familia, comunidad",
};

// =====================================================
// FUNCIÓN PARA LLAMAR A GEMINI AI
// =====================================================

async function llamarGeminiAI(prompt: string, apiKey: string): Promise<any> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Extraer el texto de la respuesta
    const textoRespuesta = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textoRespuesta) {
      throw new Error("No se recibió respuesta de Gemini AI");
    }

    // Limpiar el texto (eliminar markdown si existe)
    let textoLimpio = textoRespuesta.trim();
    textoLimpio = textoLimpio.replace(/^```json\s*/, "").replace(/\s*```$/, "");

    // Parse JSON
    const resultado = JSON.parse(textoLimpio);
    return resultado;
  } catch (error) {
    console.error("Error llamando a Gemini AI:", error);
    throw error;
  }
}

// =====================================================
// FUNCIÓN PARA CONSTRUIR PROMPT
// =====================================================

function construirPrompt(
  curso: string,
  cantidad: number,
  nivel: string,
  tipo: string,
  perfil: PerfilEstudiante
): string {
  const promptBase = curso === "matematicas" ? PROMPT_BASE_MATEMATICAS : PROMPT_BASE_VERBAL;
  const contexto = CONTEXTOS_POR_INTERES[perfil.interes] || "vida cotidiana";

  return promptBase
    .replace(/{cantidad}/g, cantidad.toString())
    .replace(/{nivel}/g, nivel)
    .replace(/{tipo}/g, tipo)
    .replace(/{estilo}/g, perfil.estilo_aprendizaje)
    .replace(/{contexto}/g, contexto);
}

// =====================================================
// FUNCIÓN PARA DETERMINAR NIVEL
// =====================================================

function determinarNivel(perfil: PerfilEstudiante, curso: string, forzar_nivel?: string): string {
  if (forzar_nivel) {
    return forzar_nivel;
  }

  // Determinar por grado primero
  const nivelBase = NIVEL_POR_GRADO[perfil.grado] || "intermedio";

  // Ajustar según habilidades del estudiante
  if (curso === "matematicas") {
    if (perfil.nivel_matematicas === "avanzado") return "avanzado";
    if (perfil.nivel_matematicas === "necesita_apoyo") return "basico";
    if (perfil.nivel_matematicas === "intermedio") return "intermedio";
  } else if (curso === "verbal") {
    if (perfil.nivel_lectura === "avanzado") return "avanzado";
    if (perfil.nivel_lectura === "inicial") return "basico";
    if (perfil.nivel_lectura === "desarrollado") return "intermedio";
  }

  return nivelBase;
}

// =====================================================
// FUNCIÓN PARA SELECCIONAR TIPO DE EJERCICIO
// =====================================================

function seleccionarTipo(
  curso: string,
  nivel: string,
  tipo_especifico?: string
): string {
  if (tipo_especifico) {
    return tipo_especifico;
  }

  const tiposDisponibles =
    curso === "matematicas"
      ? TIPOS_MATEMATICAS_POR_NIVEL[nivel]
      : TIPOS_VERBAL_POR_NIVEL[nivel];

  if (!tiposDisponibles || tiposDisponibles.length === 0) {
    return curso === "matematicas" ? "suma" : "sinonimos";
  }

  // Seleccionar tipo aleatorio
  const indiceAleatorio = Math.floor(Math.random() * tiposDisponibles.length);
  return tiposDisponibles[indiceAleatorio];
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

  const tiempoInicio = Date.now();

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

    // Obtener API key de Gemini
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY no configurada");
    }

    // Parse request body
    const requestBody: RequestBody = await req.json();

    // Validar datos de entrada
    if (!requestBody.estudiante_id || !requestBody.curso) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Faltan campos requeridos: estudiante_id, curso",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const cantidad = Math.min(requestBody.cantidad || 3, 10); // Máximo 10 ejercicios

    // Obtener perfil del estudiante
    const { data: perfil, error: errorPerfil } = await supabaseClient
      .from("perfiles")
      .select("*")
      .eq("estudiante_id", requestBody.estudiante_id)
      .eq("activo", true)
      .single();

    if (errorPerfil || !perfil) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `No se encontró perfil activo para estudiante: ${requestBody.estudiante_id}`,
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Determinar nivel y tipo
    const nivel = determinarNivel(perfil, requestBody.curso, requestBody.forzar_nivel);
    const tipo = seleccionarTipo(requestBody.curso, nivel, requestBody.tipo_especifico);

    // Construir prompt
    const prompt = construirPrompt(requestBody.curso, cantidad, nivel, tipo, perfil);

    console.log(`Generando ${cantidad} ejercicios de ${requestBody.curso} (${nivel}, ${tipo})`);

    // Llamar a Gemini AI con reintentos
    let ejerciciosData;
    let intentos = 0;
    const maxIntentos = 3;

    while (intentos < maxIntentos) {
      try {
        ejerciciosData = await llamarGeminiAI(prompt, geminiApiKey);
        break;
      } catch (error) {
        intentos++;
        if (intentos >= maxIntentos) {
          throw error;
        }
        console.log(`Reintento ${intentos}/${maxIntentos}...`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * intentos));
      }
    }

    if (!ejerciciosData || !ejerciciosData.ejercicios) {
      throw new Error("Formato de respuesta inválido de Gemini AI");
    }

    // Guardar ejercicios en la base de datos
    const ejerciciosGuardados = [];

    for (const ejercicio of ejerciciosData.ejercicios) {
      const ejercicioId = `${requestBody.curso.toUpperCase()}_${nivel.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const { data: ejercicioGuardado, error: errorEjercicio } = await supabaseClient
        .from("ejercicios_generados")
        .insert({
          ejercicio_id: ejercicioId,
          estudiante_id: requestBody.estudiante_id,
          curso: requestBody.curso,
          tipo: ejercicio.tipo || tipo,
          nivel: ejercicio.nivel || nivel,
          titulo: ejercicio.titulo,
          enunciado: ejercicio.enunciado,
          opciones: ejercicio.opciones,
          respuesta_correcta: ejercicio.respuesta_correcta,
          explicacion: ejercicio.explicacion,
          contexto: ejercicio.contexto,
          operacion_principal: ejercicio.operacion_principal,
          incluye_visual: ejercicio.incluye_visual || false,
          perfil_usado: perfil,
        })
        .select()
        .single();

      if (!errorEjercicio && ejercicioGuardado) {
        ejerciciosGuardados.push(ejercicioGuardado);
      }
    }

    const tiempoTotal = (Date.now() - tiempoInicio) / 1000;

    // Retornar respuesta exitosa
    return new Response(
      JSON.stringify({
        success: true,
        mensaje: `${ejerciciosGuardados.length} ejercicio(s) generado(s) exitosamente`,
        estudiante_id: requestBody.estudiante_id,
        curso: requestBody.curso,
        nivel_determinado: nivel,
        tipo: tipo,
        cantidad_solicitada: cantidad,
        cantidad_generada: ejerciciosGuardados.length,
        ejercicios: ejerciciosGuardados,
        tiempo_generacion_segundos: tiempoTotal,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error en generar-ejercicios:", error);

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
