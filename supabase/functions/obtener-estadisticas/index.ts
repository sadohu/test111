// =====================================================
// EDGE FUNCTION: obtener-estadisticas
// =====================================================
// Obtiene estadísticas generales del sistema o de un
// estudiante específico
// =====================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    const url = new URL(req.url);
    const estudianteId = url.searchParams.get("estudiante_id");

    if (estudianteId) {
      // Estadísticas de un estudiante específico
      const { data: estadisticas, error } = await supabaseClient
        .from("estadisticas_estudiante")
        .select("*")
        .eq("estudiante_id", estudianteId)
        .single();

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({
          success: true,
          tipo: "estudiante",
          estudiante_id: estudianteId,
          estadisticas: estadisticas,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      // Estadísticas generales del sistema
      const [
        { count: totalEstudiantes },
        { count: totalPerfiles },
        { count: totalEjercicios },
        { count: totalRespuestas },
        { data: perfilesPorCategoria },
        { data: perfilesPorRiesgo },
      ] = await Promise.all([
        supabaseClient.from("estudiantes").select("*", { count: "exact", head: true }),
        supabaseClient.from("perfiles").select("*", { count: "exact", head: true }).eq("activo", true),
        supabaseClient.from("ejercicios_generados").select("*", { count: "exact", head: true }),
        supabaseClient.from("respuestas").select("*", { count: "exact", head: true }),
        supabaseClient
          .from("perfiles")
          .select("categoria_principal")
          .eq("activo", true),
        supabaseClient
          .from("perfiles")
          .select("nivel_riesgo")
          .eq("activo", true),
      ]);

      // Agrupar por categoría
      const categorias: Record<string, number> = {};
      perfilesPorCategoria?.forEach((p: any) => {
        categorias[p.categoria_principal] = (categorias[p.categoria_principal] || 0) + 1;
      });

      // Agrupar por nivel de riesgo
      const riesgos: Record<string, number> = {};
      perfilesPorRiesgo?.forEach((p: any) => {
        riesgos[p.nivel_riesgo] = (riesgos[p.nivel_riesgo] || 0) + 1;
      });

      return new Response(
        JSON.stringify({
          success: true,
          tipo: "general",
          estadisticas: {
            total_estudiantes: totalEstudiantes || 0,
            total_perfiles_activos: totalPerfiles || 0,
            total_ejercicios_generados: totalEjercicios || 0,
            total_respuestas: totalRespuestas || 0,
            por_categoria: categorias,
            por_nivel_riesgo: riesgos,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error en obtener-estadisticas:", error);

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
