# 💳 Credibanco Card System

Sistema completo de gestión de tarjetas de crédito y débito desarrollado con Spring Boot y Angular para Credibanco.

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-green?style=flat-square&logo=spring)
![Angular](https://img.shields.io/badge/Angular-17.0.0-red?style=flat-square&logo=angular)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql)

## 🎯 Descripción del Proyecto

Sistema empresarial que permite la **gestión completa del ciclo de vida de tarjetas** y sus transacciones asociadas. Incluye funcionalidades de creación, activación, consulta y cancelación de tarjetas, así como procesamiento y cancelación de transacciones.

### 🎨 Características Principales

✅ **Gestión de Tarjetas**: Crear, activar, consultar y desactivar tarjetas  
✅ **Procesamiento de Transacciones**: Crear y cancelar transacciones  
✅ **Dashboard Interactivo**: Estadísticas en tiempo real  
✅ **Generación Automática de PAN**: Algoritmo Luhn para validación  
✅ **API REST Completa**: Endpoints documentados con Swagger  
✅ **Frontend Responsivo**: Interfaz moderna con Material Design  

## 🏗️ Arquitectura del Sistema

```
credibanco-card-system/
├── 🔧 backend/                 # API REST con Spring Boot
│   ├── src/main/java/         # Código fuente Java
│   ├── src/test/java/         # Tests unitarios e integración
│   ├── pom.xml                # Dependencias Maven
│   └── 📖 README.md           # Documentación detallada del backend
├── 🎨 frontend/               # SPA con Angular
│   ├── src/app/               # Aplicación Angular
│   ├── package.json           # Dependencias NPM
│   └── 📖 README.md           # Documentación detallada del frontend
└── 🗄️ sql/                    # Scripts y consultas de base de datos
    ├── schema.sql             # Esquema de base de datos
    └── 📊 queries.sql         # Consultas útiles para análisis
```

## 🚀 Stack Tecnológico

### Backend (API REST)
- **Java 17** + **Spring Boot 3.3.5**
- **Spring Data JPA** para persistencia
- **H2** (testing) / **MySQL** (desarrollo/producción)
- **Maven** como gestor de dependencias
- **Swagger** para documentación de API

### Frontend (SPA)
- **Angular 17** + **TypeScript**
- **Angular Material** para componentes UI
- **RxJS** para programación reactiva
- **SCSS** para estilos
- **NPM** como gestor de dependencias

### Base de Datos
- **MySQL 8.0** para producción
- **H2** para desarrollo y testing
- Esquema optimizado para transacciones ACID

## ⚡ Inicio Rápido

### 1. Prerequisitos
```bash
# Verificar versiones
java --version    # Java 17+
mvn --version     # Maven 3.6+
node --version    # Node.js 18+
npm --version     # NPM 9.0+
```

### 2. Backend (Puerto 8080)
```bash
cd backend
./mvnw spring-boot:run -Dspring.profiles.active=test
# API disponible en: http://localhost:8080
```

### 3. Frontend (Puerto 4200)
```bash
cd frontend
npm install
npm start
# Aplicación disponible en: http://localhost:4200
```

## 📊 Funcionalidades del Sistema

### � Módulo de Tarjetas
| Función | Endpoint | Frontend |
|---------|----------|----------|
| Crear tarjeta | `POST /cards` | Formulario con PAN automático |
| Activar tarjeta | `PUT /cards/enroll` | Modal de activación |
| Consultar tarjeta | `GET /cards/{id}` | Vista de detalles |
| Desactivar tarjeta | `DELETE /cards/{id}` | Confirmación de seguridad |
| Listar tarjetas | `GET /cards` | Tabla con filtros y paginación |

### 💰 Módulo de Transacciones
| Función | Endpoint | Frontend |
|---------|----------|----------|
| Crear transacción | `POST /transactions` | Formulario validado |
| Cancelar transacción | `PUT /transactions/cancel` | Botón de cancelación |
| Listar transacciones | `GET /transactions` | Tabla con filtros |

### 📈 Dashboard
- **Estadísticas en tiempo real**: Contadores de tarjetas y transacciones
- **Actividad reciente**: Últimas acciones del sistema
- **Gráficos dinámicos**: Visualización de datos
- **Auto-refresh**: Actualización automática cada 30 segundos

## 🗄️ Modelo de Datos Simplificado

```sql
Cards (Tarjetas)
├── identifier (PK)     # PAN de 16 dígitos
├── holder_name         # Nombre del titular
├── document_number     # Documento de identidad
├── phone_number        # Teléfono de contacto
├── card_type          # CREDIT | DEBIT
├── status             # CREATED | ENROLLED | INACTIVE
└── created_at         # Fecha de creación

Transactions (Transacciones)
├── id (PK)            # ID único
├── card_identifier    # FK a Cards
├── reference_number   # Número de referencia único
├── total_amount       # Monto de la transacción
├── purchase_address   # Dirección de compra
├── status             # APPROVED | CANCELLED | REJECTED
└── created_at         # Fecha de creación
```

## 🧪 Testing y Calidad

### Backend
```bash
cd backend
./mvnw test                    # Tests unitarios
./mvnw verify                  # Tests de integración
./mvnw jacoco:report          # Reporte de cobertura
```

### Frontend
```bash
cd frontend
npm test                       # Tests unitarios
npm run build                  # Verificación de compilación
npm run lint                   # Análisis de código
```

## � Build y Deployment

### Desarrollo
```bash
# Terminal 1: Backend
cd backend && ./mvnw spring-boot:run -Dspring.profiles.active=dev

# Terminal 2: Frontend
cd frontend && npm start
```

### Producción
```bash
# Backend
cd backend && ./mvnw clean package
java -jar target/cards-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod

# Frontend
cd frontend && npm run build
# Servir archivos de dist/ con nginx/apache
```

## � Documentación Detallada

- 🔧 **[Backend README](./backend/README.md)**: API, configuración, testing, deployment
- 🎨 **[Frontend README](./frontend/README.md)**: Componentes, servicios, arquitectura
- 🗄️ **[SQL Queries](./sql/queries.sql)**: Consultas útiles para análisis de datos

## � Monitoreo y Salud

- **Health Check**: `http://localhost:8080/actuator/health`
- **Métricas**: `http://localhost:8080/actuator/metrics`
- **API Docs**: `http://localhost:8080/swagger-ui.html`
- **Frontend**: `http://localhost:4200`

## 🤝 Contribución

1. Revisar documentación específica en cada módulo
2. Seguir estándares de código establecidos
3. Ejecutar tests antes de commit
4. Documentar cambios significativos

---

## 📞 Contacto y Soporte

**Equipo de Desarrollo Credibanco**  
📧 Email: desarrollo@credibanco.com  
📚 Wiki: [Documentación Interna]  
🎫 Issues: [Sistema de Tickets]  

---

<div align="center">

**🏆 Desarrollado con excelencia por Credibanco**

![Credibanco](https://img.shields.io/badge/Credibanco-2024-blue?style=for-the-badge)

</div>