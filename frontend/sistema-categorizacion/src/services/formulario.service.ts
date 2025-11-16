/**
 * Servicio para manejo de formularios
 * Carga y proporciona acceso a los formularios por grado
 */

import type { Formulario, FormulariosData, Grado, PreguntaFormulario } from '@/models';

/**
 * Servicio de Formularios
 */
class FormularioService {
  private formularios: FormulariosData | null = null;
  private cargando: boolean = false;

  /**
   * Carga los formularios desde el archivo JSON
   */
  async cargarFormularios(): Promise<FormulariosData> {
    if (this.formularios) {
      return this.formularios;
    }

    if (this.cargando) {
      // Esperar si ya está cargando
      while (this.cargando) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return this.formularios!;
    }

    try {
      this.cargando = true;

      // Cargar desde archivo estático
      const response = await fetch('/data/formularios.json');

      if (!response.ok) {
        throw new Error(`Error al cargar formularios: ${response.statusText}`);
      }

      const data: FormulariosData = await response.json();

      this.formularios = data;

      console.log('✅ Formularios cargados exitosamente');

      return data;
    } catch (error) {
      console.error('❌ Error al cargar formularios:', error);
      throw error;
    } finally {
      this.cargando = false;
    }
  }

  /**
   * Obtiene el formulario para un grado específico
   *
   * @param grado - Grado del estudiante ('1-2', '3-4', '5-6')
   * @returns Formulario correspondiente al grado
   */
  async obtenerFormularioPorGrado(grado: Grado): Promise<Formulario> {
    const formularios = await this.cargarFormularios();

    const formulario = formularios.formularios[grado];

    if (!formulario) {
      throw new Error(`No se encontró formulario para el grado: ${grado}`);
    }

    return formulario;
  }

  /**
   * Obtiene una pregunta específica de un formulario
   *
   * @param grado - Grado del estudiante
   * @param preguntaId - ID de la pregunta (P1, P2, etc.)
   * @returns Pregunta del formulario
   */
  async obtenerPregunta(grado: Grado, preguntaId: string): Promise<PreguntaFormulario> {
    const formulario = await this.obtenerFormularioPorGrado(grado);

    const pregunta = formulario.preguntas.find((p) => p.id === preguntaId);

    if (!pregunta) {
      throw new Error(`No se encontró la pregunta ${preguntaId} para el grado ${grado}`);
    }

    return pregunta;
  }

  /**
   * Obtiene todas las preguntas de un formulario
   *
   * @param grado - Grado del estudiante
   * @returns Array de preguntas
   */
  async obtenerPreguntas(grado: Grado): Promise<PreguntaFormulario[]> {
    const formulario = await this.obtenerFormularioPorGrado(grado);
    return formulario.preguntas;
  }

  /**
   * Obtiene el número total de preguntas para un grado
   *
   * @param grado - Grado del estudiante
   * @returns Número de preguntas
   */
  async obtenerNumeroPreguntas(grado: Grado): Promise<number> {
    const formulario = await this.obtenerFormularioPorGrado(grado);
    return formulario.preguntas.length;
  }

  /**
   * Valida que todas las preguntas hayan sido respondidas
   *
   * @param grado - Grado del estudiante
   * @param respuestas - Respuestas del formulario
   * @returns true si todas las preguntas fueron respondidas
   */
  async validarFormularioCompleto(
    grado: Grado,
    respuestas: Record<string, string>
  ): Promise<{ completo: boolean; preguntasFaltantes: string[] }> {
    const formulario = await this.obtenerFormularioPorGrado(grado);

    const preguntasFaltantes: string[] = [];

    for (const pregunta of formulario.preguntas) {
      if (!respuestas[pregunta.id]) {
        preguntasFaltantes.push(pregunta.id);
      }
    }

    return {
      completo: preguntasFaltantes.length === 0,
      preguntasFaltantes,
    };
  }

  /**
   * Obtiene las opciones válidas para una pregunta
   *
   * @param grado - Grado del estudiante
   * @param preguntaId - ID de la pregunta
   * @returns Array de IDs de opciones válidas (A, B, C, etc.)
   */
  async obtenerOpcionesValidas(grado: Grado, preguntaId: string): Promise<string[]> {
    const pregunta = await this.obtenerPregunta(grado, preguntaId);
    return pregunta.opciones.map((opcion) => opcion.id);
  }

  /**
   * Limpia el cache de formularios (útil para testing)
   */
  limpiarCache(): void {
    this.formularios = null;
  }
}

// Exportar instancia única (singleton)
export const formularioService = new FormularioService();

// Exportar también la clase para testing
export { FormularioService };
