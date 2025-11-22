# Setup y Configuración

Esta carpeta contiene toda la documentación relacionada con la instalación, configuración y resolución de problemas del sistema.

## 📚 Documentos Disponibles

### ⚙️ [instalacion.md](./instalacion.md)
**Guía completa de instalación y configuración**

Lee este documento para:
- Instalar Supabase CLI
- Configurar el proyecto por primera vez
- Obtener credenciales necesarias
- Desplegar Edge Functions
- Aplicar migraciones
- Configurar tests HTTP

**Tiempo estimado:** 30-45 minutos

---

### 🐛 [troubleshooting.md](./troubleshooting.md)
**Solución de errores comunes**

Consulta este documento cuando:
- Encuentres errores de conexión
- Las Edge Functions fallen
- Los tests HTTP no funcionen
- Gemini AI retorne errores
- Necesites depurar problemas de base de datos

---

## 🚀 Inicio Rápido

### Primera vez en el proyecto

1. Lee [instalacion.md](./instalacion.md) completo
2. Ejecuta todos los pasos en orden
3. Verifica con el checklist al final
4. Guarda [troubleshooting.md](./troubleshooting.md) como referencia

### Ya tengo el proyecto configurado

```bash
# Iniciar Supabase local
supabase start

# Ver estado
supabase status

# Verificar funciones
supabase functions list

# Ver logs
supabase functions logs --tail
```

### Problemas comunes

- **No puedo conectarme**: Ver [troubleshooting.md - Errores de Setup](./troubleshooting.md#errores-de-setup)
- **Function not found**: Ver [troubleshooting.md - Function not found](./troubleshooting.md#error-function-not-found)
- **Tests fallan**: Ver [troubleshooting.md - Errores en Tests](./troubleshooting.md#errores-en-tests)

---

## 📋 Comandos Útiles

### Gestión del proyecto

```bash
# Ver estado completo
supabase status

# Iniciar servicios
supabase start

# Detener servicios
supabase stop

# Resetear BD (CUIDADO - elimina datos)
supabase db reset
```

### Edge Functions

```bash
# Listar funciones
supabase functions list

# Desplegar función
supabase functions deploy <nombre>

# Ver logs
supabase functions logs <nombre> --tail

# Eliminar función
supabase functions delete <nombre>
```

### Base de Datos

```bash
# Aplicar migraciones
supabase db push

# Crear nueva migración
supabase migration new <nombre>

# Ver diferencias
supabase db diff

# Conectar a BD local
supabase db remote connect

# Ejecutar seed
supabase db seed
```

### Secrets

```bash
# Listar secrets
supabase secrets list

# Configurar secret
supabase secrets set KEY=value

# Eliminar secret
supabase secrets unset KEY
```

---

## 🔧 Configuración Recomendada

### VS Code Extensions

```json
{
  "recommendations": [
    "humao.rest-client",
    "supabase.vscode-supabase",
    "denoland.vscode-deno"
  ]
}
```

### .env Template

```bash
# Supabase
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-anon-key

# Gemini AI
GEMINI_API_KEY=your-api-key

# Opcionales
DATABASE_URL=postgresql://...
```

---

## 📞 Ayuda Adicional

- **Dudas de instalación**: [instalacion.md](./instalacion.md)
- **Errores específicos**: [troubleshooting.md](./troubleshooting.md)
- **Documentación oficial**: [Supabase Docs](https://supabase.com/docs)
- **Comunidad**: [Supabase Discord](https://discord.supabase.com)

---

**Última actualización:** 2025-11-21
