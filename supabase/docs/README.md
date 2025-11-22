# 📚 Documentación Completa - Supabase Backend

Bienvenido a la documentación del backend de Supabase para el Sistema Educativo Adaptativo.

## 📖 Guías Disponibles

### 📊 [analisis/](./analisis/)
**Análisis completo del sistema y arquitectura de base de datos**

Lee esta sección para:
- Entender el modelo de negocio multi-colegio
- Revisar el diagrama de relaciones (ERD)
- Conocer las tablas y relaciones
- Ver ejemplos de datos y casos de uso

**Documentos:**
- 📄 [ANALISIS.md](./analisis/ANALISIS.md) - Análisis completo del negocio
- 🗄️ [DIAGRAMA_BD.md](./analisis/DIAGRAMA_BD.md) - Diagrama de base de datos

---

### 🚀 [setup/](./setup/)
**Guías de instalación y resolución de problemas**

Consulta esta sección cuando:
- Es tu primera vez configurando el proyecto
- Necesitas instalar Supabase CLI
- Encuentres errores al ejecutar Edge Functions
- Los tests HTTP fallen

**Documentos:**
- ⚙️ [instalacion.md](./setup/instalacion.md) - Guía completa de setup
- 🐛 [troubleshooting.md](./setup/troubleshooting.md) - Solución de errores comunes

---

### 🛠️ [implements/](./implements/)
**Scripts de implementación y despliegue**

Lee esta sección para:
- Ejecutar migraciones de base de datos
- Aplicar seeds y datos de ejemplo
- Desplegar en diferentes entornos
- Scripts de backup y mantenimiento

**Documentos:**
- 📝 [README.md](./implements/README.md) - Índice de scripts disponibles

---

### 📝 [changelogs/](./changelogs/)
**Registro histórico de cambios en producción**

Consulta esta sección para:
- Ver historial de versiones
- Conocer cambios implementados
- Revisar notas de migración
- Seguir evolución del sistema

**Documentos:**
- 📋 [README.md](./changelogs/README.md) - Formato y registro de cambios

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
│   │
│   ├── analisis/                      # 📊 Análisis del sistema
│   │   ├── ANALISIS.md                # Análisis completo del negocio
│   │   └── DIAGRAMA_BD.md             # Diagrama de base de datos
│   │
│   ├── setup/                         # 🚀 Instalación y configuración
│   │   ├── instalacion.md             # Guía de instalación completa
│   │   └── troubleshooting.md         # Solución de errores
│   │
│   ├── implements/                    # 🛠️ Scripts de implementación
│   │   └── README.md                  # Índice de scripts
│   │
│   ├── changelogs/                    # 📝 Registro de cambios
│   │   └── README.md                  # Formato y versionado
│   │
│   └── FRONTEND_INTEGRATION.md        # 🔌 Integración con frontends
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

1. **Leer:** [analisis/ANALISIS.md](./analisis/ANALISIS.md) - Entender el negocio
2. **Revisar:** [analisis/DIAGRAMA_BD.md](./analisis/DIAGRAMA_BD.md) - Conocer la estructura
3. **Leer:** [setup/instalacion.md](./setup/instalacion.md) completo
4. **Ejecutar:** Todos los pasos del setup
5. **Probar:** Ejecutar tests HTTP básicos
6. **Leer:** [setup/troubleshooting.md](./setup/troubleshooting.md) por encima
7. **Explorar:** Código de Edge Functions

**Tiempo total:** 2-3 horas

---

### 🔧 Para Mantenimiento y Debugging

1. **Consultar:** [setup/troubleshooting.md](./setup/troubleshooting.md) primero
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

### "¿Cómo funciona el sistema?"
→ Ver [analisis/ANALISIS.md](./analisis/ANALISIS.md)

### "¿Cuál es la estructura de base de datos?"
→ Ver [analisis/DIAGRAMA_BD.md](./analisis/DIAGRAMA_BD.md)

### "No puedo conectarme a Supabase"
→ Ver [setup/troubleshooting.md - Errores de Setup](./setup/troubleshooting.md#errores-de-setup)

### "Edge Function retorna 404"
→ Ver [setup/troubleshooting.md - Function not found](./setup/troubleshooting.md#error-function-not-found)

### "Gemini AI no responde"
→ Ver [setup/troubleshooting.md - Errores de Gemini AI](./setup/troubleshooting.md#errores-de-gemini-ai)

### "Tests HTTP fallan"
→ Ver [setup/troubleshooting.md - Errores en Tests](./setup/troubleshooting.md#errores-en-tests)

### "¿Cómo integro con mi frontend?"
→ Ver [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)

### "Error de base de datos"
→ Ver [setup/troubleshooting.md - Errores de Base de Datos](./setup/troubleshooting.md#errores-de-base-de-datos)

### "¿Cómo llevo registro de cambios?"
→ Ver [changelogs/README.md](./changelogs/README.md)

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
| 2025-11-21 | Reorganización de estructura docs/ en carpetas | Todos |
| 2025-11-21 | Análisis completo del sistema multi-colegio | analisis/ANALISIS.md |
| 2025-11-21 | Diagrama de base de datos detallado | analisis/DIAGRAMA_BD.md |
| 2025-11-21 | Sistema de changelogs para producción | changelogs/ |
| 2025-11-18 | Creación inicial de documentación completa | Todos |
| 2025-11-18 | Agregar guía de troubleshooting | setup/troubleshooting.md |
| 2025-11-18 | Agregar guía de integración frontend | FRONTEND_INTEGRATION.md |

---

## ✅ Checklist de Documentación

- [x] Análisis completo del sistema
- [x] Diagrama de base de datos (ERD)
- [x] Guía de setup completa
- [x] Documentación de troubleshooting
- [x] Guía de integración frontend
- [x] README de tests HTTP
- [x] Estructura de changelogs
- [x] Scripts de implementación
- [x] Ejemplos de código TypeScript
- [x] Comandos comunes documentados
- [x] Mejores prácticas de seguridad
- [x] Enlaces a recursos externos

---

**Última actualización:** 21 de Noviembre, 2025

**Versión de documentación:** 2.0.0

**Mantenido por:** Equipo de Desarrollo

---

¿Necesitas ayuda? 

- **Primera vez:** Lee [analisis/ANALISIS.md](./analisis/ANALISIS.md) y [setup/instalacion.md](./setup/instalacion.md)
- **Problemas:** Consulta [setup/troubleshooting.md](./setup/troubleshooting.md)
- **Integración:** Revisa [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)
