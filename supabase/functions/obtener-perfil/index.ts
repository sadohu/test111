// =====================================================
// EDGE FUNCTION: obtener-perfil
// =====================================================
// Obtiene el perfil activo de un estudiante
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

    // Obtener estudiante_id de la URL
    const url = new URL(req.url);
    const estudianteId = url.searchParams.get("estudiante_id");

    if (!estudianteId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Falta parámetro: estudiante_id",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Obtener perfil activo
    const { data: perfil, error: errorPerfil } = await supabaseClient
      .from("perfiles")
      .select("*")
      .eq("estudiante_id", estudianteId)
      .eq("activo", true)
      .single();

    if (errorPerfil || !perfil) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `No se encontró perfil activo para estudiante: ${estudianteId}`,
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        perfil: perfil,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error en obtener-perfil:", error);

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
