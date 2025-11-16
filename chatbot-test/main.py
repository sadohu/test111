"""
Chatbot de Preguntas y Respuestas con Google Gemini API
Este script permite interactuar con el modelo Gemini de Google para
hacer preguntas y recibir respuestas manteniendo el contexto de la conversación.
"""

import os
import sys
from dotenv import load_dotenv
import google.generativeai as genai

# Cargar variables de entorno desde el archivo .env
load_dotenv()

def configurar_gemini():
    """
    Configura la API de Google Gemini con la clave API
    Returns:
        model: Instancia del modelo Gemini configurado
    """
    # Obtener la API key desde las variables de entorno
    api_key = os.getenv('GEMINI_API_KEY')

    # Validar que la API key existe
    if not api_key:
        print("❌ Error: No se encontró GEMINI_API_KEY en el archivo .env")
        print("Por favor, crea un archivo .env basado en .env.example")
        sys.exit(1)

    # Configurar la API de Gemini
    genai.configure(api_key=api_key)

    # Obtener el nombre del modelo desde variables de entorno o usar valor por defecto
    model_name = os.getenv('GEMINI_MODEL', 'gemini-pro')

    # Crear y retornar el modelo
    model = genai.GenerativeModel(model_name)

    return model

def validar_entrada(pregunta):
    """
    Valida que la entrada del usuario sea válida
    Args:
        pregunta: Texto ingresado por el usuario
    Returns:
        bool: True si es válida, False si no
    """
    # Verificar que no esté vacía
    if not pregunta or pregunta.strip() == "":
        return False

    # Verificar que no sea demasiado larga (límite de seguridad)
    if len(pregunta) > 5000:
        print("⚠️  La pregunta es demasiado larga. Máximo 5000 caracteres.")
        return False

    return True

def chat_interactivo():
    """
    Función principal que maneja el chat interactivo con Gemini
    """
    print("=" * 60)
    print("🤖 Chatbot con Google Gemini")
    print("=" * 60)
    print("\nInstrucciones:")
    print("- Escribe tus preguntas y presiona Enter")
    print("- Escribe 'salir', 'exit' o 'quit' para terminar")
    print("- El chatbot recuerda el contexto de la conversación")
    print("=" * 60)
    print()

    try:
        # Configurar el modelo de Gemini
        model = configurar_gemini()

        # Iniciar una sesión de chat (mantiene el historial)
        chat = model.start_chat(history=[])

        print("✅ Conexión exitosa con Gemini. ¡Puedes empezar a preguntar!\n")

        # Bucle principal del chat
        while True:
            # Obtener entrada del usuario
            pregunta = input("👤 Tú: ").strip()

            # Verificar si el usuario quiere salir
            if pregunta.lower() in ['salir', 'exit', 'quit', 'bye']:
                print("\n👋 ¡Hasta luego! Gracias por usar el chatbot.")
                break

            # Validar la entrada
            if not validar_entrada(pregunta):
                print("⚠️  Por favor, escribe una pregunta válida.\n")
                continue

            try:
                # Enviar mensaje al modelo y obtener respuesta
                print("\n🤖 Gemini: ", end="", flush=True)
                response = chat.send_message(pregunta)

                # Mostrar la respuesta
                print(response.text)
                print()  # Línea en blanco para mejor legibilidad

            except Exception as e:
                print(f"\n❌ Error al procesar la pregunta: {str(e)}")
                print("Intenta reformular tu pregunta o verifica tu conexión.\n")

    except KeyboardInterrupt:
        print("\n\n👋 Chat interrumpido. ¡Hasta luego!")
    except Exception as e:
        print(f"\n❌ Error fatal: {str(e)}")
        sys.exit(1)

def modo_pregunta_unica(pregunta):
    """
    Modo para hacer una sola pregunta sin chat interactivo
    Args:
        pregunta: La pregunta a realizar
    """
    try:
        model = configurar_gemini()

        if not validar_entrada(pregunta):
            print("❌ Pregunta inválida")
            sys.exit(1)

        print(f"\n👤 Pregunta: {pregunta}\n")
        print("🤖 Gemini: ", end="", flush=True)

        response = model.generate_content(pregunta)
        print(response.text)
        print()

    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        sys.exit(1)

def main():
    """
    Función principal del programa
    """
    # Si se pasa un argumento, usar modo de pregunta única
    if len(sys.argv) > 1:
        pregunta = " ".join(sys.argv[1:])
        modo_pregunta_unica(pregunta)
    else:
        # Modo interactivo
        chat_interactivo()

if __name__ == "__main__":
    main()
