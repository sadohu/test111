# 📚 Documentación Completa - Supabase Backend

Bienvenido a la documentación del backend de Supabase para el Sistema Educativo Adaptativo.

## 📖 Guías Disponibles

### 🚀 [SETUP.md](./SETUP.md)
**Guía de instalación completa desde cero**

Lee este documento primero si:
- Es tu primera vez configurando el proyecto
- Necesitas instalar Supabase CLI
- Quieres desplegar las Edge Functions
- Necesitas aplicar las migraciones

**Tiempo estimado:** 30-45 minutos

**Incluye:**
- ✅ Instalación de Supabase CLI
- ✅ Obtención de credenciales
- ✅ Configuración de proyecto local
- ✅ Despliegue de Edge Functions
- ✅ Configuración de tests
- ✅ Checklist de verificación completo

---

### 🐛 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
**Solución de errores comunes**

Consulta este documento cuando:
- Encuentres errores al ejecutar Edge Functions
- Los tests HTTP fallen
- Gemini AI retorne errores
- Necesites depurar problemas

**Incluye:**
- ❌ Errores de setup y soluciones
- ❌ Errores de Edge Functions
- ❌ Errores de base de datos
- ❌ Errores en tests HTTP
- ❌ Errores de Gemini AI
- 🔄 Flujo de troubleshooting

---

### 🔌 [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)
**Guía de integración con frontends Next.js**

Lee este documento para:
- Migrar frontends de Python/FastAPI a Supabase
- Instalar y configurar `@supabase/supabase-js`
- Actualizar servicios y componentes
- Integrar Edge Functions en React

**Incluye:**
- 📦 Instalación de dependencias
- ⚙️ Configuración de variables de entorno
- 🔌 Creación de cliente Supabase
- 🎯 Migración de servicios
- 🔄 Actualización de componentes
- 🔒 Mejores prácticas de seguridad

---

## 🗂️ Estructura de Documentación

```
supabase/
├── README.md                          # Documentación principal del proyecto
├── docs/                              # 📚 Documentación detallada
│   ├── README.md                      # Este archivo (índice)
│   ├── SETUP.md                       # Guía de instalación completa
│   ├── TROUBLESHOOTING.md             # Solución de errores
│   └── FRONTEND_INTEGRATION.md        # Integración con frontends
│
├── test/                              # 🧪 Tests HTTP
│   ├── README.md                      # Guía de tests
│   ├── clasificar-perfil.http         # Tests de clasificación
│   ├── generar-ejercicios.http        # Tests de generación
│   ├── guardar-respuesta.http         # Tests de respuestas
│   ├── validar-respuesta.http         # Tests de validación
│   ├── obtener-perfil.http            # Tests de obtención
│   └── obtener-estadisticas.http      # Tests de estadísticas
│
├── functions/                         # 🔥 Edge Functions (TypeScript/Deno)
│   ├── clasificar-perfil/
│   ├── generar-ejercicios/
│   ├── guardar-respuesta/
│   ├── validar-respuesta/
│   ├── obtener-perfil/
│   └── obtener-estadisticas/
│
├── migrations/                        # 🗄️ Migraciones SQL
│   └── 20250101000000_initial_schema.sql
│
└── seed/                              # 🌱 Datos de ejemplo
    └── seed.sql
```

---

## 🎯 Rutas de Aprendizaje

### 👨‍💻 Para Desarrolladores Nuevos

1. **Leer:** [SETUP.md](./SETUP.md) completo
2. **Ejecutar:** Todos los pasos del setup
3. **Probar:** Ejecutar tests HTTP básicos
4. **Leer:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) por encima
5. **Explorar:** Código de Edge Functions

**Tiempo total:** 1-2 horas

---

### 🔧 Para Mantenimiento y Debugging

1. **Consultar:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) primero
2. **Ver logs:**
   ```bash
   supabase functions logs <nombre-funcion> --tail
   ```
3. **Probar:** Tests HTTP relevantes
4. **Verificar:** Estado del sistema
   ```bash
   supabase status
   supabase secrets list
   supabase functions list
   ```

**Tiempo:** Variable según el problema

---

### 🎨 Para Integración Frontend

1. **Leer:** [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)
2. **Instalar:** `@supabase/supabase-js`
3. **Configurar:** Variables de entorno
4. **Migrar:** Servicios uno por uno
5. **Probar:** Flujo completo

**Tiempo total:** 2-4 horas por frontend

---

## 📊 Recursos Rápidos

### URLs Importantes

- **Supabase Dashboard:** https://app.supabase.com
- **Gemini API Keys:** https://makersuite.google.com/app/apikey
- **Supabase Docs:** https://supabase.com/docs
- **Edge Functions Guide:** https://supabase.com/docs/guides/functions

### Comandos Comunes

```bash
# Ver status del proyecto
supabase status

# Ver logs
supabase functions logs <nombre> --tail

# Desplegar función
supabase functions deploy <nombre>

# Aplicar migraciones
supabase db push

# Ver secrets
supabase secrets list

# Configurar secret
supabase secrets set KEY=value

# Conectar a BD
supabase db remote connect

# Resetear BD local (CUIDADO)
supabase db reset
```

### Endpoints de Edge Functions

**Base URL Local:** `http://localhost:54321/functions/v1`
**Base URL Producción:** `https://your-project.supabase.co/functions/v1`

| Función | Endpoint | Método |
|---------|----------|--------|
| Clasificar Perfil | `/clasificar-perfil` | POST |
| Generar Ejercicios | `/generar-ejercicios` | POST |
| Guardar Respuesta | `/guardar-respuesta` | POST |
| Validar Respuesta | `/validar-respuesta` | POST |
| Obtener Perfil | `/obtener-perfil` | GET |
| Obtener Estadísticas | `/obtener-estadisticas` | GET |

---

## 🔍 Búsqueda Rápida de Problemas

### "No puedo conectarme a Supabase"
→ Ver [TROUBLESHOOTING.md - Errores de Setup](./TROUBLESHOOTING.md#errores-de-setup)

### "Edge Function retorna 404"
→ Ver [TROUBLESHOOTING.md - Function not found](./TROUBLESHOOTING.md#error-function-not-found)

### "Gemini AI no responde"
→ Ver [TROUBLESHOOTING.md - Errores de Gemini AI](./TROUBLESHOOTING.md#errores-de-gemini-ai)

### "Tests HTTP fallan"
→ Ver [TROUBLESHOOTING.md - Errores en Tests](./TROUBLESHOOTING.md#errores-en-tests)

### "¿Cómo integro con mi frontend?"
→ Ver [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)

### "Error de base de datos"
→ Ver [TROUBLESHOOTING.md - Errores de Base de Datos](./TROUBLESHOOTING.md#errores-de-base-de-datos)

---

## 💡 Tips y Mejores Prácticas

### Desarrollo Local

```bash
# Siempre iniciar Supabase local para desarrollo
supabase start

# Ver logs en tiempo real mientras desarrollas
supabase functions logs --tail

# Usar datos seed para tests
supabase db seed
```

### Testing

```bash
# Orden recomendado de tests:
# 1. clasificar-perfil.http (crear perfiles)
# 2. obtener-perfil.http (verificar)
# 3. generar-ejercicios.http (crear ejercicios)
# 4. guardar-respuesta.http (guardar respuestas)
# 5. obtener-estadisticas.http (ver stats)
```

### Deployment

```bash
# Antes de desplegar a producción:
# 1. Probar localmente
# 2. Verificar secrets están configurados
# 3. Aplicar migraciones
supabase db push

# 4. Desplegar funciones
supabase functions deploy <nombre>

# 5. Verificar logs
supabase functions logs <nombre>
```

### Seguridad

```bash
# ✅ HACER:
# - Usar anon_key en frontend
# - Configurar RLS en tablas
# - Mantener service_role_key secreto
# - Rotar API keys regularmente

# ❌ NO HACER:
# - Exponer service_role_key en frontend
# - Commitear .env con valores reales
# - Deshabilitar RLS en producción
# - Compartir API keys públicamente
```

---

## 📞 Soporte

### Documentación Oficial

- [Supabase Documentation](https://supabase.com/docs)
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Gemini AI](https://ai.google.dev/docs)

### Comunidad

- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)

### Issues

Si encuentras un bug o tienes una sugerencia:
1. Revisar [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Buscar en issues existentes
3. Crear nuevo issue con detalles completos

---

## 📝 Changelog de Documentación

| Fecha | Cambio | Archivo |
|-------|--------|---------|
| 2025-11-18 | Creación inicial de documentación completa | Todos |
| 2025-11-18 | Agregar guía de troubleshooting | TROUBLESHOOTING.md |
| 2025-11-18 | Agregar guía de integración frontend | FRONTEND_INTEGRATION.md |

---

## ✅ Checklist de Documentación

- [x] Guía de setup completa
- [x] Documentación de troubleshooting
- [x] Guía de integración frontend
- [x] README de tests HTTP
- [x] Ejemplos de código TypeScript
- [x] Comandos comunes documentados
- [x] Mejores prácticas de seguridad
- [x] Enlaces a recursos externos

---

**Última actualización:** 18 de Noviembre, 2025

**Versión de documentación:** 1.0.0

**Mantenido por:** Equipo de Desarrollo

---

¿Necesitas ayuda? Empieza por [SETUP.md](./SETUP.md) si es tu primera vez, o [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) si tienes problemas.
