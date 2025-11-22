# 📚 Documentación - Supabase Backend

Documentación del backend de Supabase para el Sistema Educativo Adaptativo.

## 📁 Estructura

```
docs/
├── analisis/           # 📊 Análisis del sistema y lógica de negocio
├── storage/            # 💾 Archivos de referencia y propuestas
├── setup/              # 🚀 Instalación y configuración
├── implements/         # 🛠️ Scripts de implementación
└── changelogs/         # 📝 Registro de cambios
```

---

## 📊 [analisis/](./analisis/)
**Análisis del sistema y lógica de negocio**

**Documentos principales:**
- **ANALISIS.md** - Análisis completo del negocio y especificaciones
- **LOGICA_Y_PROCESOS.md** - Lógica técnica e implementación

**Uso:** Documentos críticos para implementación del sistema.

---

## 💾 [storage/](./storage/)
**Archivos de referencia y propuestas**

**Contenido:**
- Diagramas de base de datos (ERD)
- Código de referencia (clasificador.py)
- Análisis de factibilidad
- Propuestas para versiones futuras

**Uso:** Consultar cuando se necesite contexto adicional o evaluar propuestas.

---

## 🚀 [setup/](./setup/)
**Instalación y configuración**

**Documentos:**
- **instalacion.md** - Guía completa de setup
- **troubleshooting.md** - Solución de errores comunes

**Uso:** Primera vez configurando el proyecto o resolviendo problemas.

---

## 🛠️ [implements/](./implements/)
**Scripts de implementación**

**Contenido:**
- Migraciones de base de datos
- Seeds y datos de ejemplo
- Scripts de despliegue

**Uso:** Ejecutar implementaciones y despliegues.

---

## 📝 [changelogs/](./changelogs/)
**Registro de cambios**

**Contenido:**
- Historial de versiones
- Cambios implementados
- Notas de migración

**Uso:** Seguir evolución del sistema en producción.

---

## 🚀 Inicio Rápido

### Para Desarrolladores Nuevos
1. Leer `analisis/ANALISIS.md` - Entender el negocio
2. Revisar `analisis/LOGICA_Y_PROCESOS.md` - Conocer implementación técnica
3. Seguir `setup/instalacion.md` - Configurar entorno

### Para Debugging
1. Consultar `setup/troubleshooting.md`
2. Ver logs: `supabase functions logs <nombre> --tail`
3. Verificar status: `supabase status`

---

## 📊 Recursos

### Comandos Comunes
```bash
# Ver status
supabase status

# Ver logs
supabase functions logs <nombre> --tail

# Desplegar función
supabase functions deploy <nombre>

# Aplicar migraciones
supabase db push
```

### Enlaces Útiles
- [Supabase Docs](https://supabase.com/docs)
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Gemini AI](https://ai.google.dev/docs)

---

**Última actualización:** 22 de Noviembre, 2025  
**Versión:** 1.0  
**Estado:** Listo para implementación v1.0 (MVP)
