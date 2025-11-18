# Scripts de Base de Datos - Plataforma Educativa con IA

## Descripción

Este directorio contiene los scripts SQL para crear y poblar la base de datos PostgreSQL del proyecto.

## Orden de Ejecución

Los scripts deben ejecutarse en el siguiente orden:

### 1. `01_create_enums.sql`
- Crea todos los tipos ENUM utilizados en el sistema
- Define valores válidos para roles, niveles académicos, estados, etc.

### 2. `02_create_extensions_and_functions.sql`
- Instala extensiones de PostgreSQL necesarias (uuid-ossp, pgcrypto, pg_trgm)
- Define funciones auxiliares para validación, encriptación y cálculos

### 3. `03_create_tables_users.sql`
- Crea tablas del módulo de usuarios y autenticación
- Incluye: users, guardians, students, teachers, directors, administrators

### 4. `04_create_tables_profiles_assessment.sql`
- Crea tablas de perfiles de estudiantes y sistema de evaluación
- Incluye: student_profiles, assessment_items, student_assessments, student_responses

### 5. `05_create_tables_remaining.sql`
- Crea las tablas restantes del sistema
- Incluye módulos de: actividades, retroalimentación, grupos, seguridad, gamificación, reportes, métricas

### 6. `06_seed_data.sql` (OPCIONAL - Solo para desarrollo/testing)
- Inserta datos de prueba
- **NO EJECUTAR EN PRODUCCIÓN**

## Instrucciones de Uso

### Opción 1: Ejecutar scripts individuales

```bash
# Conectarse a PostgreSQL
psql -U postgres -d plataforma_educativa

# Ejecutar scripts en orden
\i 01_create_enums.sql
\i 02_create_extensions_and_functions.sql
\i 03_create_tables_users.sql
\i 04_create_tables_profiles_assessment.sql
\i 05_create_tables_remaining.sql

# Solo en desarrollo/testing:
\i 06_seed_data.sql
```

### Opción 2: Script único consolidado

Puedes combinar todos los scripts en uno solo:

```bash
cat 01_create_enums.sql \
    02_create_extensions_and_functions.sql \
    03_create_tables_users.sql \
    04_create_tables_profiles_assessment.sql \
    05_create_tables_remaining.sql \
    > full_schema.sql

psql -U postgres -d plataforma_educativa -f full_schema.sql
```

### Opción 3: Usando herramientas de migración

Para producción, se recomienda usar herramientas de migración como:

#### **Flyway** (Java)
```bash
flyway migrate
```

#### **Alembic** (Python)
```bash
alembic upgrade head
```

#### **Knex.js** (Node.js)
```bash
npx knex migrate:latest
```

## Creación de Base de Datos

Antes de ejecutar los scripts, crear la base de datos:

```sql
CREATE DATABASE plataforma_educativa
    WITH
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_PE.UTF-8'
    LC_CTYPE = 'es_PE.UTF-8'
    TEMPLATE = template0;
```

## Variables de Entorno Requeridas

Para funciones de encriptación, configurar:

```bash
export DB_ENCRYPTION_SECRET="tu-clave-secreta-aqui-min-32-caracteres"
```

## Verificación Post-Instalación

Verificar que todas las tablas se crearon correctamente:

```sql
-- Contar tablas creadas
SELECT COUNT(*) AS total_tables
FROM information_schema.tables
WHERE table_schema = 'public';

-- Listar todas las tablas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Resultado esperado: **31 tablas**

## Datos de Prueba

El script `06_seed_data.sql` crea los siguientes usuarios de prueba:

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | admin@plataforma.edu.pe | password123 |
| Director | director@colegio.edu.pe | password123 |
| Docente | docente.maria@colegio.edu.pe | password123 |
| Docente | docente.juan@colegio.edu.pe | password123 |
| Tutor | padre1@mail.com | password123 |
| Tutor | madre1@mail.com | password123 |

**Estudiantes:**
- Sofía González (4to A)
- Diego González (5to B)
- Lucía Vargas (3ro A)
- Mateo Silva (4to A)
- Valentina Rojas (5to B)

## Backup y Restauración

### Crear backup

```bash
pg_dump -U postgres -d plataforma_educativa -F c -f backup_plataforma.dump
```

### Restaurar backup

```bash
pg_restore -U postgres -d plataforma_educativa -c backup_plataforma.dump
```

## Seguridad

### Importante

1. **Cambiar contraseñas por defecto** en producción
2. **Usar claves de encriptación robustas** (mínimo 32 caracteres)
3. **Configurar Row-Level Security (RLS)** para control de acceso granular
4. **Habilitar SSL/TLS** para conexiones a la base de datos
5. **Revisar permisos de usuarios** de base de datos

### Ejemplo de configuración de permisos

```sql
-- Crear roles específicos
CREATE ROLE app_user LOGIN PASSWORD 'secure_password';
CREATE ROLE app_readonly LOGIN PASSWORD 'secure_password';

-- Permisos para usuario de aplicación
GRANT CONNECT ON DATABASE plataforma_educativa TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Permisos para usuario de solo lectura
GRANT CONNECT ON DATABASE plataforma_educativa TO app_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;
```

## Mantenimiento

### Actualizar estadísticas

```sql
ANALYZE;
VACUUM ANALYZE;
```

### Reindexar tablas

```sql
REINDEX DATABASE plataforma_educativa;
```

### Limpiar datos de prueba

```sql
-- Solo en desarrollo
TRUNCATE users, students, guardians, teachers, directors, administrators CASCADE;
```

## Soporte

Para problemas o consultas:
- Revisar logs de PostgreSQL: `/var/log/postgresql/`
- Consultar documentación del proyecto en `/docs/proyecto/`

---

**Versión**: 1.0
**Fecha**: 18 de Noviembre de 2025
**Compatibilidad**: PostgreSQL 14+
