// =====================================================
// EDGE FUNCTION: guardar-respuesta
// =====================================================
// Guarda la respuesta de un estudiante a un ejercicio
// y actualiza estadísticas de sesión
// =====================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface RequestBody {
  estudiante_id: string;
  ejercicio_id: string;
  sesion_id?: string;
  curso: "matematicas" | "verbal";
  respuesta_seleccionada: string;
  tiempo_respuesta_ms?: number;
  dispositivo?: string;
}

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const requestBody: RequestBody = await req.json();

    // Validar campos requeridos
    if (!requestBody.estudiante_id || !requestBody.ejercicio_id || !requestBody.respuesta_seleccionada) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Faltan campos requeridos",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Obtener ejercicio para verificar respuesta correcta
    const { data: ejercicio, error: errorEjercicio } = await supabaseClient
      .from("ejercicios_generados")
      .select("*")
      .eq("ejercicio_id", requestBody.ejercicio_id)
      .single();

    if (errorEjercicio || !ejercicio) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Ejercicio no encontrado",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verificar si la respuesta es correcta
    const esCorrecta = requestBody.respuesta_seleccionada === ejercicio.respuesta_correcta;

    // Generar ID de respuesta
    const respuestaId = `RESP_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Guardar respuesta
    const { data: respuestaGuardada, error: errorRespuesta } = await supabaseClient
      .from("respuestas")
      .insert({
        respuesta_id: respuestaId,
        estudiante_id: requestBody.estudiante_id,
        ejercicio_id: requestBody.ejercicio_id,
        sesion_id: requestBody.sesion_id,
        curso: requestBody.curso,
        respuesta_seleccionada: requestBody.respuesta_seleccionada,
        es_correcta: esCorrecta,
        tiempo_respuesta_ms: requestBody.tiempo_respuesta_ms,
        ejercicio_snapshot: ejercicio,
        dispositivo: requestBody.dispositivo,
        ip_address: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
        user_agent: req.headers.get("user-agent"),
      })
      .select()
      .single();

    if (errorRespuesta) {
      throw errorRespuesta;
    }

    // Actualizar sesión si existe
    if (requestBody.sesion_id) {
      const { data: sesion } = await supabaseClient
        .from("sesiones")
        .select("*")
        .eq("sesion_id", requestBody.sesion_id)
        .single();

      if (sesion) {
        const ejerciciosCompletados = sesion.ejercicios_completados + 1;
        const correctas = sesion.correctas + (esCorrecta ? 1 : 0);
        const incorrectas = sesion.incorrectas + (esCorrecta ? 0 : 1);
        const tiempoTotal = sesion.tiempo_total_ms + (requestBody.tiempo_respuesta_ms || 0);
        const porcentajeAcierto = (correctas / ejerciciosCompletados) * 100;

        await supabaseClient
          .from("sesiones")
          .update({
            ejercicios_completados,
            correctas,
            incorrectas,
            tiempo_total_ms: tiempoTotal,
            porcentaje_acierto: porcentajeAcierto,
            estado: ejerciciosCompletados >= sesion.cantidad_ejercicios ? "completada" : "en_progreso",
            fecha_fin: ejerciciosCompletados >= sesion.cantidad_ejercicios ? new Date().toISOString() : null,
          })
          .eq("sesion_id", requestBody.sesion_id);
      }
    }

    // Marcar ejercicio como usado
    await supabaseClient
      .from("ejercicios_generados")
      .update({
        usado: true,
        fecha_uso: new Date().toISOString(),
      })
      .eq("ejercicio_id", requestBody.ejercicio_id);

    return new Response(
      JSON.stringify({
        success: true,
        mensaje: "Respuesta guardada exitosamente",
        respuesta: respuestaGuardada,
        es_correcta: esCorrecta,
        respuesta_correcta: ejercicio.respuesta_correcta,
        explicacion: ejercicio.explicacion,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error en guardar-respuesta:", error);

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
