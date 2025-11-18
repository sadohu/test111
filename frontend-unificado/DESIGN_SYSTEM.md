# Sistema de Diseño - Frontend Unificado

Este documento describe el sistema de diseño unificado que se aplica a toda la aplicación, incluyendo categorización de perfiles, ejercicios, login, registro y reportes.

## Tabla de Contenidos

- [Filosofía de Diseño](#filosofía-de-diseño)
- [Paleta de Colores](#paleta-de-colores)
- [Tipografía](#tipografía)
- [Espaciado](#espaciado)
- [Componentes](#componentes)
- [Animaciones](#animaciones)
- [Responsive Design](#responsive-design)
- [Modo Oscuro](#modo-oscuro)

## Filosofía de Diseño

El sistema de diseño está orientado a crear una experiencia educativa amigable, accesible y profesional:

- **Colores vibrantes**: Uso de azul educativo, verde para éxito y púrpura para creatividad
- **Bordes redondeados**: Mayor suavidad visual (12px por defecto)
- **Transiciones suaves**: Feedback visual agradable en interacciones
- **Accesibilidad**: Contraste adecuado y estados de foco claros
- **Consistencia**: Mismo look & feel en todas las secciones

## Paleta de Colores

### Colores de Marca

```css
/* Azul Educativo - Color Principal */
--primary: 217 91% 60%
--primary-foreground: 0 0% 100%
--primary-hover: 217 91% 50%

/* Verde Éxito/Crecimiento - Color Secundario */
--secondary: 142 76% 36%
--secondary-foreground: 0 0% 100%
--secondary-hover: 142 76% 30%

/* Púrpura Creatividad - Color de Acento */
--accent: 262 83% 58%
--accent-foreground: 0 0% 100%
--accent-hover: 262 83% 48%
```

### Colores de Estado

```css
/* Éxito */
--success: 142 76% 36%
--success-foreground: 0 0% 100%
--success-light: 142 76% 95%

/* Error */
--error: 0 84% 60%
--error-foreground: 0 0% 100%
--error-light: 0 84% 95%

/* Advertencia */
--warning: 38 92% 50%
--warning-foreground: 0 0% 100%
--warning-light: 38 92% 95%

/* Información */
--info: 199 89% 48%
--info-foreground: 0 0% 100%
--info-light: 199 89% 95%
```

### Colores Neutrales

```css
--background: 0 0% 100%
--foreground: 222.2 47.4% 11.2%
--muted: 210 40% 96.1%
--muted-foreground: 215.4 16.3% 46.9%
--border: 214.3 31.8% 91.4%
```

### Uso de Colores en Tailwind

```tsx
// Usando colores de marca
<div className="bg-primary text-primary-foreground">Primary</div>
<div className="bg-secondary text-secondary-foreground">Secondary</div>
<div className="bg-accent text-accent-foreground">Accent</div>

// Usando colores de estado
<div className="bg-success text-success-foreground">Éxito</div>
<div className="bg-error text-error-foreground">Error</div>
<div className="bg-warning text-warning-foreground">Advertencia</div>
```

## Tipografía

### Fuente

```css
font-family: 'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif;
```

### Headings

```tsx
<h1>  // text-4xl md:text-5xl lg:text-6xl font-bold
<h2>  // text-3xl md:text-4xl lg:text-5xl font-bold
<h3>  // text-2xl md:text-3xl lg:text-4xl font-bold
<h4>  // text-xl md:text-2xl lg:text-3xl font-bold
```

### Pesos de Fuente

- **Normal**: 400 (text body)
- **Medium**: 500 (labels)
- **Semibold**: 600 (buttons, badges)
- **Bold**: 700 (headings)

## Espaciado

### Border Radius

```css
--radius-sm: 0.5rem;   /* 8px */
--radius: 0.75rem;     /* 12px - Default */
--radius-lg: 1rem;     /* 16px */
--radius-xl: 1.5rem;   /* 24px */
```

### Sombras

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-md: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1)
--shadow-xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
```

## Componentes

### Button

Botón reutilizable con múltiples variantes y tamaños.

```tsx
import { Button } from '@/components/ui';

// Variantes
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="success">Success</Button>
<Button variant="error">Error</Button>

// Tamaños
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// Estados
<Button isLoading>Loading...</Button>
<Button disabled>Disabled</Button>
```

### Card

Contenedor versátil para agrupar contenido relacionado.

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui';

<Card variant="interactive">
  <CardHeader>
    <CardTitle>Título de la tarjeta</CardTitle>
    <CardDescription>Descripción opcional</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Contenido principal de la tarjeta</p>
  </CardContent>
  <CardFooter>
    <Button>Acción</Button>
  </CardFooter>
</Card>
```

**Variantes de Card:**
- `default`: Sin efectos hover
- `hover`: Sombra al hacer hover
- `interactive`: Sombra + cambio de borde al hover + cursor pointer

### Input

Campo de entrada con soporte para labels, errores y texto de ayuda.

```tsx
import { Input } from '@/components/ui';

// Input básico
<Input placeholder="Ingresa tu nombre" />

// Con label
<Input label="Nombre completo" required />

// Con error
<Input
  label="Email"
  error="Este email ya está registrado"
/>

// Con helper text
<Input
  label="Contraseña"
  type="password"
  helperText="Mínimo 8 caracteres"
/>
```

### Badge

Pequeños indicadores de estado o categoría.

```tsx
import { Badge } from '@/components/ui';

<Badge variant="primary">Primario</Badge>
<Badge variant="secondary">Secundario</Badge>
<Badge variant="success">Completado</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="warning">Pendiente</Badge>
<Badge variant="info">Información</Badge>
```

### Alert

Mensajes de retroalimentación para el usuario.

```tsx
import { Alert } from '@/components/ui';

<Alert variant="success" title="Éxito">
  Tu perfil ha sido guardado correctamente.
</Alert>

<Alert variant="error" title="Error" onClose={handleClose}>
  Ocurrió un error al procesar tu solicitud.
</Alert>

<Alert variant="warning" title="Advertencia">
  Debes completar todos los campos obligatorios.
</Alert>

<Alert variant="info" title="Información">
  Esta acción no se puede deshacer.
</Alert>
```

## Animaciones

### Utilidades de Animación

```tsx
// Fade in
<div className="animate-fade-in">Aparece gradualmente</div>

// Slide up
<div className="animate-slide-up">Desliza desde abajo</div>

// Slide down
<div className="animate-slide-down">Desliza desde arriba</div>

// Scale in
<div className="animate-scale-in">Escala desde el centro</div>

// Hover effects
<div className="hover-lift">Se eleva al hacer hover</div>
<div className="hover-grow">Crece al hacer hover</div>
```

### Transiciones

```css
--transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)
--transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

## Responsive Design

### Breakpoints (Tailwind defaults)

```css
sm: 640px   /* Tablet pequeño */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop pequeño */
xl: 1280px  /* Desktop */
2xl: 1536px /* Desktop grande */
```

### Container Responsive

```tsx
<div className="container-app">
  {/* Contenido con padding automático responsive */}
</div>
```

Equivale a:
```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
```

### Tipografía Responsive

Los headings escalan automáticamente:

```tsx
<h1>  // 2.25rem → 3rem → 3.75rem (sm → md → lg)
<h2>  // 1.875rem → 2.25rem → 3rem
<h3>  // 1.5rem → 1.875rem → 2.25rem
<h4>  // 1.25rem → 1.5rem → 1.875rem
```

## Modo Oscuro

El sistema incluye soporte para modo oscuro usando la clase `.dark`:

```tsx
// En tu layout o página raíz
<html className="dark">
  {/* Modo oscuro activado */}
</html>
```

### Colores en Modo Oscuro

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
}
```

## Clases Utilitarias Personalizadas

### Gradientes

```tsx
<div className="gradient-primary">
  {/* Gradiente de primary a accent */}
</div>

<div className="gradient-success">
  {/* Gradiente de success a secondary */}
</div>

<div className="gradient-background">
  {/* Gradiente de fondo azul-índigo-púrpura */}
</div>
```

### Scrollbar Personalizada

```tsx
<div className="scrollbar-thin overflow-auto">
  {/* Scrollbar delgada estilizada */}
</div>

<div className="no-scrollbar overflow-auto">
  {/* Sin scrollbar visible */}
</div>
```

### Focus Ring

```tsx
<button className="focus-ring">
  {/* Anillo de enfoque personalizado */}
</button>
```

### Skeleton Loading

```tsx
<div className="skeleton h-8 w-full">
  {/* Placeholder animado */}
</div>
```

### Progress Bar

```tsx
<div className="progress-bar">
  <div className="progress-bar-fill" style={{ width: '60%' }} />
</div>
```

## Ejemplos de Uso

### Formulario Completo

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

function LoginForm() {
  return (
    <Card variant="default" className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          required
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          required
        />
        <Alert variant="error">
          Las credenciales son incorrectas.
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="link">¿Olvidaste tu contraseña?</Button>
        <Button variant="primary">Ingresar</Button>
      </CardFooter>
    </Card>
  );
}
```

### Dashboard con Cards

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card variant="hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Progreso</CardTitle>
            <Badge variant="success">75%</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: '75%' }} />
          </div>
        </CardContent>
      </Card>

      {/* Más cards... */}
    </div>
  );
}
```

## Buenas Prácticas

1. **Usa los componentes del sistema**: Evita crear nuevos estilos cuando puedes usar componentes existentes.

2. **Mantén la consistencia**: Usa las variantes de color apropiadas (success para éxito, error para errores, etc.).

3. **Responsive first**: Siempre piensa en móvil primero, luego escala a desktop.

4. **Accesibilidad**:
   - Usa labels en todos los inputs
   - Incluye estados de foco visibles
   - Mantén contraste adecuado

5. **Animaciones sutiles**: Usa las animaciones predefinidas para feedback, pero sin excesos.

6. **Espaciado consistente**: Usa la escala de Tailwind (4px increments: p-2, p-4, p-6, etc.)

## Mantenimiento

Para agregar nuevos colores o componentes:

1. Define variables CSS en `src/app/globals.css`
2. Extiende Tailwind en `tailwind.config.ts`
3. Crea componente reutilizable en `src/components/ui/`
4. Exporta en `src/components/ui/index.ts`
5. Documenta aquí con ejemplos

---

**Última actualización**: 2025-01-18
