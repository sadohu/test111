// =====================================================
// EDGE FUNCTION: validar-respuesta
// =====================================================
// Valida una respuesta sin guardarla en la base de datos
// Útil para validación en tiempo real
// =====================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface RequestBody {
  ejercicio_id: string;
  respuesta: string;
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

    if (!requestBody.ejercicio_id || !requestBody.respuesta) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Faltan campos requeridos: ejercicio_id, respuesta",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Obtener ejercicio
    const { data: ejercicio, error: errorEjercicio } = await supabaseClient
      .from("ejercicios_generados")
      .select("respuesta_correcta, explicacion")
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

    const esCorrecta = requestBody.respuesta === ejercicio.respuesta_correcta;

    return new Response(
      JSON.stringify({
        success: true,
        valida: true,
        es_correcta: esCorrecta,
        respuesta_correcta: ejercicio.respuesta_correcta,
        explicacion: ejercicio.explicacion,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error en validar-respuesta:", error);

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
