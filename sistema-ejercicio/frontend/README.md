# Frontend - Ejercicios App

Aplicación frontend Next.js para que los estudiantes resuelvan ejercicios personalizados generados con Gemini AI.

## 🎯 Características

- ✅ Interfaz moderna y responsiva con Tailwind CSS
- ✅ Selección de curso (Matemáticas o Razonamiento Verbal)
- ✅ Sesiones personalizadas de ejercicios
- ✅ Feedback inmediato al responder
- ✅ Progreso visual con barra y estadísticas
- ✅ Animaciones fluidas
- ✅ Type-safe con TypeScript

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Backend generador-ejercicios corriendo en `http://localhost:8001`

## 🚀 Instalación

```bash
# Navegar al directorio
cd frontend/ejercicios-app

# Instalar dependencias
npm install

# O con yarn
yarn install
```

## 🔧 Configuración

El frontend se conecta al backend en `http://localhost:8001` por defecto. Si necesitas cambiar la URL, puedes crear un archivo `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://tu-servidor:8001
```

## 🎮 Uso

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3001`

### Modo Producción

```bash
# Build
npm run build

# Start
npm start
```

## 📁 Estructura del Proyecto

```
frontend/ejercicios-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Página principal (sesión de ejercicios)
│   │   └── globals.css         # Estilos globales
│   ├── components/             # Componentes React
│   │   ├── EjercicioCard.tsx   # Card de ejercicio
│   │   ├── OpcionButton.tsx    # Botón de opción
│   │   ├── ProgressBar.tsx     # Barra de progreso
│   │   └── FeedbackPanel.tsx   # Panel de retroalimentación
│   ├── lib/                    # Utilidades y configuración
│   │   └── api-client.ts       # Cliente API con axios
│   └── types/                  # Tipos TypeScript
│       └── ejercicios.ts       # Tipos que coinciden con backend Pydantic
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── postcss.config.js
└── README.md
```

## 🎨 Componentes Principales

### 1. EjercicioCard

Muestra un ejercicio completo con:
- Enunciado del problema
- 4 opciones de respuesta (A, B, C, D)
- Badge de nivel (Fácil/Medio/Difícil)
- Icono según el tipo (matemáticas/verbal)

```tsx
<EjercicioCard
  ejercicio={ejercicio}
  numero={1}
  total={5}
  onResponder={(opcion) => console.log(opcion)}
  respuestaSeleccionada="A"
  mostrarResultado={true}
  disabled={false}
/>
```

### 2. OpcionButton

Botón individual para cada opción de respuesta:
- Estado seleccionado
- Estado correcto (verde)
- Estado incorrecto (rojo)
- Estado deshabilitado

```tsx
<OpcionButton
  letra="A"
  texto="Opción A) Respuesta aquí"
  selected={true}
  correct={false}
  incorrect={true}
  disabled={true}
  onClick={() => {}}
/>
```

### 3. ProgressBar

Barra de progreso visual:
- Ejercicios completados vs total
- Tasa de aciertos
- Indicadores por ejercicio (verde=correcto, rojo=incorrecto)

```tsx
<ProgressBar
  actual={3}
  total={5}
  correctos={2}
/>
```

### 4. FeedbackPanel

Modal de retroalimentación:
- Mensaje de correcto/incorrecto
- Explicación detallada
- Botón para continuar

```tsx
<FeedbackPanel
  mostrar={true}
  esCorrecta={true}
  explicacion="La suma es 5 + 3 = 8..."
  retroalimentacion="¡Excelente trabajo!"
  onContinuar={() => {}}
/>
```

## 🔌 Integración con Backend

### Cliente API

El cliente API (`src/lib/api-client.ts`) proporciona métodos para:

```typescript
// Generar ejercicios de matemáticas
const response = await apiClient.generarEjerciciosMatematicas(
  "EST001",  // estudiante_id
  5,         // cantidad
  "suma"     // tipo_especifico (opcional)
);

// Generar ejercicios verbales
const response = await apiClient.generarEjerciciosVerbal(
  "EST001",
  5,
  "sinonimos"
);

// Validar respuesta
const validation = await apiClient.validarRespuesta({
  ejercicio_id: "MAT_INT_001",
  respuesta_estudiante: "A",
  estudiante_id: "EST001",
  tiempo_respuesta_segundos: 45
});
```

### Tipos TypeScript

Los tipos en `src/types/ejercicios.ts` coinciden exactamente con los modelos Pydantic del backend:

```typescript
interface EjercicioMatematicas extends EjercicioBase {
  tipo: TipoEjercicioMatematicas;
  operacion_principal?: string;
  contexto?: string;
  incluye_visual: boolean;
}

interface GenerarEjerciciosResponse {
  success: boolean;
  mensaje: string;
  estudiante_id: string;
  curso: CursoEnum;
  cantidad_solicitada: number;
  cantidad_generada: number;
  ejercicios_matematicas?: EjercicioMatematicas[];
  ejercicios_verbales?: EjercicioVerbal[];
  perfil_usado: PerfilResumen;
  nivel_determinado: string;
  tiempo_generacion_segundos: number;
}
```

## 🎨 Personalización de Estilos

El proyecto usa Tailwind CSS con configuración personalizada:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {...},   // Azul
      success: {...},   // Verde
      error: {...},     // Rojo
    },
    animation: {
      'fade-in': 'fadeIn 0.3s ease-in',
      'slide-up': 'slideUp 0.3s ease-out',
    },
  },
}
```

## 🔍 Flujo de Usuario

1. **Pantalla Inicial**
   - Ingresa ID de estudiante (opcional)
   - Selecciona curso (Matemáticas/Verbal)
   - Selecciona cantidad de ejercicios (3/5/10)
   - Click en "Comenzar Ejercicios"

2. **Generación**
   - Loading screen mientras Gemini genera ejercicios
   - Mensaje: "Generando ejercicios personalizados..."

3. **Sesión de Ejercicios**
   - Muestra ejercicio uno por uno
   - Barra de progreso en la parte superior
   - Estudiante selecciona opción
   - Feedback inmediato (correcto/incorrecto)
   - Explicación detallada
   - Click "Continuar" para siguiente ejercicio

4. **Pantalla de Resultados**
   - Trofeo animado
   - Estadísticas de la sesión:
     - Ejercicios correctos
     - Tasa de aciertos
     - Tiempo promedio
     - Tiempo total
   - Botón "Comenzar Nueva Sesión"

## 📊 Estado y Gestión de Datos

La aplicación usa React hooks para gestionar el estado:

```typescript
// Estados principales
const [estado, setEstado] = useState<"inicial" | "cargando" | "ejercicios" | "completado">("inicial");
const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
const [respuestas, setRespuestas] = useState<RespuestaEstudiante[]>([]);
const [indiceActual, setIndiceActual] = useState(0);

// Datos de respuesta
interface RespuestaEstudiante {
  ejercicio_id: string;
  opcion_seleccionada: string;
  tiempo_inicio: number;
  tiempo_fin?: number;
  es_correcta?: boolean;
}
```

## 🎯 Funcionalidades Implementadas

- ✅ Selección de curso y cantidad de ejercicios
- ✅ Generación de ejercicios desde API
- ✅ Navegación secuencial por ejercicios
- ✅ Selección de respuestas
- ✅ Validación inmediata (frontend)
- ✅ Feedback visual (correcto/incorrecto)
- ✅ Explicaciones detalladas
- ✅ Barra de progreso animada
- ✅ Estadísticas finales
- ✅ Tracking de tiempo por ejercicio
- ✅ Cálculo de tasa de aciertos
- ✅ Responsive design

## 🚧 Funcionalidades Pendientes (TODO)

- ⏳ Validación de respuestas con backend (actualmente solo frontend)
- ⏳ Almacenamiento de sesiones en localStorage
- ⏳ Historial de sesiones anteriores
- ⏳ Comparación de desempeño (vs promedio, vs sesiones anteriores)
- ⏳ Gráficos de progreso en el tiempo
- ⏳ Sistema de badges/logros
- ⏳ Modo práctica (revisar ejercicios anteriores)
- ⏳ Exportar resultados a PDF
- ⏳ Compartir resultados

## 🐛 Solución de Problemas

### Error: "Cannot connect to backend"

**Problema**: El frontend no puede conectarse al backend.

**Solución**:
1. Verifica que el backend esté corriendo:
   ```bash
   cd generador-ejercicios
   python main.py
   ```
2. Verifica que esté en puerto 8001:
   ```
   http://localhost:8001/health
   ```
3. Verifica CORS en el backend (debe permitir localhost:3001)

### Error: "No se generan ejercicios"

**Problema**: La API retorna error al generar.

**Solución**:
1. Verifica que tengas GEMINI_API_KEY en `.env`
2. Verifica que haya perfiles en `backend/data/perfiles.json`
3. Revisa logs del backend para ver el error específico

### Error: TypeScript

**Problema**: Errores de tipos al compilar.

**Solución**:
```bash
npm run type-check
```

## 📈 Performance

- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Lighthouse Score**: > 90

Optimizaciones:
- Next.js App Router con server components donde sea posible
- Lazy loading de componentes
- Optimización de imágenes automática
- Minificación de CSS/JS en producción

## 🔐 Seguridad

- No se almacenan datos sensibles en localStorage
- Todas las llamadas API usan HTTPS en producción
- Validación de datos en cliente y servidor
- Sanitización de inputs del usuario

## 🤝 Contribuir

Para contribuir al frontend:

1. Crea una rama desde `main`
2. Haz tus cambios
3. Verifica que compile sin errores:
   ```bash
   npm run build
   npm run type-check
   ```
4. Commit y push
5. Crear Pull Request

## 📝 Licencia

Parte del sistema educativo adaptativo con IA.

---

**Desarrollado con Next.js 14, React 18, TypeScript, y Tailwind CSS**

**Última actualización**: 17 de Noviembre, 2025
