# Chatbot de Preguntas y Respuestas con Google Gemini

Un proyecto simple e interactivo que utiliza la API de Google Gemini para crear un chatbot inteligente con memoria de conversación. Perfecto para aprender a integrar IA en tus proyectos.

## Características

- Chat interactivo con historial de conversación
- Modo de pregunta única desde línea de comandos
- Manejo robusto de errores
- Validación de entrada de usuario
- Configuración segura mediante variables de entorno
- Código bien comentado y fácil de entender

## Requisitos Previos

- Python 3.8 o superior
- Una cuenta de Google para obtener la API key de Gemini
- Conexión a Internet

## Instalación

### 1. Clonar o descargar el proyecto

```bash
git clone <url-del-repositorio>
cd test111
```

### 2. Instalar las dependencias

```bash
pip install -r requirements.txt
```

O instalarlas manualmente:

```bash
pip install google-generativeai python-dotenv
```

### 3. Configurar las variables de entorno

Copia el archivo de ejemplo y configura tu API key:

```bash
cp .env.example .env
```

Edita el archivo `.env` y agrega tu API key de Gemini:

```
GEMINI_API_KEY=tu_api_key_real_aqui
GEMINI_MODEL=gemini-pro
```

## Cómo obtener una API Key de Google Gemini

### Paso a paso:

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)

2. Inicia sesión con tu cuenta de Google

3. Haz clic en "Get API Key" o "Crear clave de API"

4. Si es tu primera vez:
   - Acepta los términos de servicio
   - Selecciona o crea un proyecto de Google Cloud

5. Haz clic en "Create API Key in new project" o selecciona un proyecto existente

6. Copia la API key generada

7. Pégala en tu archivo `.env`:
   ```
   GEMINI_API_KEY=AIzaSy...tu_clave_aqui
   ```

### Notas importantes sobre la API key:

- **NUNCA** compartas tu API key públicamente
- **NUNCA** la subas a repositorios públicos (el archivo `.env` está en `.gitignore`)
- Google Gemini ofrece un plan gratuito con límites de uso
- Monitorea tu uso en [Google Cloud Console](https://console.cloud.google.com/)

## Uso

### Modo Interactivo (Conversación)

Ejecuta el script sin argumentos para iniciar una conversación:

```bash
python main.py
```

Luego puedes hacer preguntas de forma interactiva:

```
👤 Tú: ¿Qué es la inteligencia artificial?
🤖 Gemini: [Respuesta del modelo]

👤 Tú: ¿Puedes darme ejemplos?
🤖 Gemini: [Respuesta considerando el contexto anterior]
```

Para salir del chat, escribe: `salir`, `exit`, `quit`, o presiona `Ctrl+C`

### Modo de Pregunta Única

Ejecuta el script con una pregunta como argumento:

```bash
python main.py "¿Cuál es la capital de Francia?"
```

Esto hará una sola pregunta y mostrará la respuesta.

## Ejemplos de Preguntas

### Preguntas Generales

```bash
python main.py "Explícame qué es Python en términos simples"
python main.py "¿Cuáles son las diferencias entre listas y tuplas en Python?"
python main.py "Dame un resumen de la Segunda Guerra Mundial"
```

### Preguntas de Programación

```bash
python main.py "¿Cómo creo un bucle for en Python?"
python main.py "Explícame qué son las funciones lambda"
```

### Conversaciones Contextuales (Modo Interactivo)

```
👤 Tú: ¿Qué es el aprendizaje automático?
🤖 Gemini: [Explicación del ML]

👤 Tú: ¿Cuáles son sus aplicaciones prácticas?
🤖 Gemini: [Responde basándose en la conversación previa]

👤 Tú: Dame un ejemplo simple de código
🤖 Gemini: [Proporciona código relacionado con ML]
```

### Preguntas Creativas

```bash
python main.py "Escribe un poema corto sobre la tecnología"
python main.py "Cuéntame un chiste sobre programadores"
python main.py "Dame consejos para aprender a programar"
```

## Estructura del Proyecto

```
test111/
│
├── main.py              # Archivo principal del chatbot
├── requirements.txt     # Dependencias del proyecto
├── .env.example        # Plantilla de variables de entorno
├── .env                # Tu configuración (NO subir a git)
├── .gitignore          # Archivos ignorados por git
└── README_GEMINI_CHATBOT.md  # Este archivo
```

## Características Técnicas

### Gestión de Historial

El chatbot utiliza la funcionalidad `start_chat()` de Gemini que mantiene automáticamente el historial de la conversación, permitiendo:

- Preguntas de seguimiento contextuales
- Referencias a respuestas anteriores
- Conversaciones más naturales y coherentes

### Validación de Entrada

El código incluye validaciones para:

- Entradas vacías
- Preguntas demasiado largas (> 5000 caracteres)
- Manejo de caracteres especiales

### Manejo de Errores

El chatbot maneja diferentes tipos de errores:

- API key faltante o inválida
- Errores de conexión a la API
- Interrupciones del usuario (Ctrl+C)
- Errores de procesamiento de respuestas

## Limitaciones y Consideraciones

### Límites de la API Gratuita

- Número limitado de peticiones por minuto
- Cuota diaria de uso
- Monitorea tu uso en Google Cloud Console

### Contenido

- Gemini puede no tener información sobre eventos muy recientes
- Las respuestas pueden variar entre ejecuciones
- Siempre verifica información crítica

### Seguridad

- No ingreses información personal sensible
- No compartas tu API key
- El historial de conversación se pierde al cerrar el programa (no se guarda en disco)

## Solución de Problemas

### Error: "No se encontró GEMINI_API_KEY"

**Solución:**
1. Verifica que creaste el archivo `.env` (no solo `.env.example`)
2. Asegúrate de que la clave esté correctamente formateada:
   ```
   GEMINI_API_KEY=tu_clave_aqui
   ```
3. No uses comillas alrededor de la clave

### Error: "API key inválida"

**Solución:**
1. Verifica que copiaste la clave completa
2. Regenera la clave en Google AI Studio
3. Asegúrate de que la API de Gemini esté habilitada en tu proyecto

### Error de conexión

**Solución:**
1. Verifica tu conexión a Internet
2. Comprueba que no haya problemas con el firewall
3. Espera unos minutos si es un problema temporal de Google

### Respuestas lentas

**Causas posibles:**
- Conexión a Internet lenta
- Alta demanda en los servidores de Google
- Preguntas muy complejas que requieren más procesamiento

## Próximos Pasos y Mejoras

Ideas para extender este proyecto:

1. **Guardar historial:** Almacenar conversaciones en archivos JSON
2. **Interfaz gráfica:** Crear una UI con Tkinter o una web app con Flask
3. **Múltiples modelos:** Permitir cambiar entre gemini-pro y gemini-pro-vision
4. **Análisis de imágenes:** Integrar capacidades de visión para analizar imágenes
5. **Streaming de respuestas:** Mostrar la respuesta mientras se genera
6. **Comandos especiales:** Agregar comandos como `/clear`, `/history`, `/export`
7. **Personalización:** Permitir ajustar el tono y estilo de las respuestas

## Recursos Adicionales

### Documentación Oficial

- [Google AI Studio](https://makersuite.google.com/)
- [Documentación de Gemini API](https://ai.google.dev/docs)
- [Python SDK de Google Generative AI](https://github.com/google/generative-ai-python)

### Tutoriales

- [Quickstart de Gemini API](https://ai.google.dev/tutorials/python_quickstart)
- [Ejemplos de código](https://github.com/google/generative-ai-python/tree/main/samples)

### Comunidad

- [Stack Overflow - Tag: google-gemini](https://stackoverflow.com/questions/tagged/google-gemini)
- [Google AI Community](https://developers.googleblog.com/)

## Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

## Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Abre un issue para discutir los cambios
2. Fork el repositorio
3. Crea una rama para tu feature
4. Haz commit de tus cambios
5. Abre un Pull Request

## Autor

Proyecto creado con fines educativos para demostrar la integración de Google Gemini API.

## Agradecimientos

- Google por proporcionar la API de Gemini
- La comunidad de Python por las excelentes bibliotecas
- Todos los que contribuyen a hacer la IA más accesible

---

**¿Tienes preguntas?** Abre un issue en el repositorio o consulta la documentación oficial de Google Gemini.

**Feliz chateo!** 🤖✨
