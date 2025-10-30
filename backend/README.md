# 🏦 Credibanco Card System

> **Sistema backend profesional para gestión de tarjetas de crédito/débito y transacciones de compra**

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-green.svg)](https://spring.io/projects/spring-boot)
[![Maven](https://img.shields.io/badge/Maven-3.8+-blue.svg)](https://maven.apache.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://www.mysql.com/)
[![H2](https://img.shields.io/badge/H2-Testing-lightgrey.svg)](https://www.h2database.com/)

Sistema backend robusto desarrollado con **Spring Boot 3** siguiendo las mejores prácticas empresariales, implementando arquitectura limpia y patrones de diseño profesionales.

---

## 🚀 Inicio Rápido

### ⚡ Ejecución Inmediata (Con datos de prueba)

```bash
# Clonar el repositorio
git clone <repository-url>
cd credibanco-card-system/backend

# Ejecutar con base de datos en memoria y datos precargados
./mvnw spring-boot:run -Dspring.profiles.active=test

# ✅ Aplicación lista en: http://localhost:8080
# 🎯 20 tarjetas y 25+ transacciones precargadas automáticamente
```

### 🔗 URLs de Acceso
- **API Base:** http://localhost:8080
- **Health Check:** http://localhost:8080/actuator/health
- **Consola H2:** http://localhost:8080/h2-console

---

## ✨ Características Principales

| 🎯 Funcionalidad | 📋 Descripción |
|------------------|-----------------|
| **🏦 Gestión de Tarjetas** | Crear, activar, consultar, desactivar y listar con validaciones robustas |
| **💳 Gestión de Transacciones** | Crear, cancelar y listar con reglas de negocio estrictas |
| **📊 Paginación Inteligente** | Endpoints con paginación, ordenamiento y filtrado avanzado |
| **🔍 Auditoría Completa** | Registro automático de todas las operaciones |
| **⚡ Validaciones Avanzadas** | Bean Validation + validaciones personalizadas |
| **🛡️ Manejo de Errores** | Global exception handler con códigos HTTP apropiados |
| **🏗️ Arquitectura Limpia** | Separación clara: Controller → Service → Repository |
| **📝 Logging Estructurado** | Sistema detallado para monitoreo y debugging |
| **🧪 Testing Profesional** | Cobertura >80% con JUnit 5 y Mockito |
| **🚀 Datos de Prueba** | 20 tarjetas + 25 transacciones precargadas |

---

## 🛠️ Stack Tecnológico

### 🔧 Core Framework
```
Java 17                    # LTS con características modernas
Spring Boot 3.3.5          # Framework principal 
Spring Data JPA            # Persistencia con Hibernate
Spring Web                 # APIs REST
Spring Validation          # Bean Validation
```

### 🗄️ Base de Datos
```
MySQL 8.0+                 # Producción
H2 Database                # Desarrollo/Testing
```

### 🧰 Herramientas
```
Maven 3.8+                 # Gestión de dependencias
Lombok                     # Reducción de boilerplate
SLF4J + Logback           # Logging estructurado
JUnit 5 + Mockito         # Testing profesional
```

---

## 📁 Arquitectura del Proyecto

```
src/main/java/com/credibanco/cardsystem/
├── 🎮 controller/          # REST Controllers con validaciones
│   ├── CardController.java
│   └── TransactionController.java
├── 🧠 service/             # Lógica de negocio
│   ├── CardService.java
│   └── TransactionService.java
├── 💾 repository/          # Acceso a datos (Spring Data JPA)
│   ├── CardRepository.java
│   └── TransactionRepository.java
├── 🏗️ model/               # Entidades JPA con auditoría
│   ├── Card.java
│   ├── Transaction.java
│   └── AuditLog.java
├── 📦 dto/                 # Data Transfer Objects
│   ├── request/            # DTOs de entrada
│   └── response/           # DTOs de respuesta
├── ⚠️ exception/           # Manejo global de errores
├── 🔧 util/                # Utilidades (IDs, máscaras, etc.)
├── ⚙️ config/              # Configuraciones
└── 🚀 CardsApplication.java # Clase principal
```

---

## 📚 API Documentation

### 📋 Endpoints Disponibles

| Método | Endpoint | Descripción | Paginación |
|--------|----------|-------------|------------|
| `POST` | `/cards` | ✨ Crear nueva tarjeta | ❌ |
| `PUT` | `/cards/enroll` | 🔓 Activar tarjeta | ❌ |
| `GET` | `/cards/{identifier}` | 🔍 Consultar tarjeta específica | ❌ |
| `GET` | `/cards` | 📋 Listar todas las tarjetas | ✅ |
| `DELETE` | `/cards/{identifier}` | 🔒 Desactivar tarjeta | ❌ |
| `POST` | `/transactions` | 💰 Crear nueva transacción | ❌ |
| `PUT` | `/transactions/cancel` | ❌ Cancelar transacción | ❌ |
| `GET` | `/transactions` | 📋 Listar todas las transacciones | ✅ |

### 🔍 Parámetros de Paginación

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `page` | `int` | `0` | Número de página (inicia en 0) |
| `size` | `int` | `10` | Elementos por página (máximo 100) |
| `sortBy` | `string` | `createdAt` | Campo para ordenamiento |
| `sortDir` | `string` | `desc` | Dirección: `asc` o `desc` |

---

## 🏦 Gestión de Tarjetas

<details>
<summary><strong>✨ Crear Tarjeta</strong></summary>

```http
POST /cards
Content-Type: application/json

{
    "pan": "1234567890123456",
    "holderName": "Juan Pérez",
    "documentNumber": "12345678",
    "cardType": "CREDIT",
    "phoneNumber": "+573001234567"
}
```

**✅ Respuesta (201 Created):**
```json
{
    "identifier": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "maskedPan": "1234********3456",
    "validationNumber": "123456"
}
```
</details>

<details>
<summary><strong>🔓 Activar Tarjeta</strong></summary>

```http
PUT /cards/enroll
Content-Type: application/json

{
    "identifier": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "validationNumber": "123456"
}
```

**✅ Respuesta (200 OK):** _(Sin contenido)_
</details>

<details>
<summary><strong>🔍 Consultar Tarjeta</strong></summary>

```http
GET /cards/{identifier}
```

**✅ Respuesta (200 OK):**
```json
{
    "identifier": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "maskedPan": "1234********3456",
    "holderName": "Juan Pérez",
    "documentNumber": "12345678",
    "cardType": "CREDIT",
    "phoneNumber": "+573001234567",
    "status": "ENROLLED",
    "createdAt": "2025-10-30T08:00:00"
}
```
</details>

<details>
<summary><strong>📋 Listar Tarjetas (Con Paginación)</strong></summary>

```http
GET /cards?page=0&size=10&sortBy=createdAt&sortDir=desc
```

**✅ Respuesta (200 OK):**
```json
{
    "content": [
        {
            "identifier": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "maskedPan": "1234********3456",
            "holderName": "Juan Pérez",
            "status": "ENROLLED",
            "createdAt": "2025-10-30T08:00:00"
        }
    ],
    "totalElements": 25,
    "totalPages": 3,
    "size": 10,
    "number": 0
}
```
</details>

---

## 💳 Gestión de Transacciones

<details>
<summary><strong>💰 Crear Transacción</strong></summary>

```http
POST /transactions
Content-Type: application/json

{
    "cardIdentifier": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "totalAmount": 100.50,
    "purchaseAddress": "Centro Comercial Andino, Bogotá"
}
```

**✅ Respuesta (201 Created):**
```json
{
    "referenceNumber": "TXN1730275200000",
    "cardIdentifier": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "totalAmount": 100.50,
    "purchaseAddress": "Centro Comercial Andino, Bogotá",
    "status": "APPROVED",
    "createdAt": "2025-10-30T08:00:00"
}
```
</details>

<details>
<summary><strong>❌ Cancelar Transacción</strong></summary>

```http
PUT /transactions/cancel
Content-Type: application/json

{
    "referenceNumber": "TXN1730275200000"
}
```

**✅ Respuesta (200 OK):** _(Sin contenido)_

> ⚠️ **Nota:** Solo se pueden cancelar transacciones dentro de los primeros 5 minutos
</details>

<details>
<summary><strong>📋 Listar Transacciones (Con Paginación)</strong></summary>

```http
GET /transactions?page=0&size=10&sortBy=createdAt&sortDir=desc
```

**✅ Respuesta (200 OK):**
```json
{
    "content": [
        {
            "referenceNumber": "TXN1730275200000",
            "cardIdentifier": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "totalAmount": 100.50,
            "purchaseAddress": "Centro Comercial Andino, Bogotá",
            "status": "APPROVED",
            "createdAt": "2025-10-30T08:00:00"
        }
    ],
    "totalElements": 150,
    "totalPages": 15,
    "size": 10,
    "number": 0
}
```
</details>

---

## 🔧 Configuración e Instalación

### 📋 Prerrequisitos

```bash
Java 17+           # https://adoptium.net/
Maven 3.8+         # https://maven.apache.org/download.cgi
MySQL 8.0+         # https://dev.mysql.com/downloads/ (opcional)
```

### ⚙️ Configuración de MySQL (Producción)

<details>
<summary><strong>🐬 Configurar MySQL</strong></summary>

1. **Crear base de datos:**
```sql
CREATE DATABASE credibanco_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'credibanco_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON credibanco_db.* TO 'credibanco_user'@'localhost';
FLUSH PRIVILEGES;
```

2. **Configurar application.yml:**
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/credibanco_db
    username: credibanco_user
    password: your_secure_password
  jpa:
    hibernate:
      ddl-auto: update
```

3. **Ejecutar aplicación:**
```bash
./mvnw spring-boot:run
```
</details>

### 🧪 Modo Desarrollo (H2 + Datos de Prueba)

```bash
# Ejecutar con base de datos en memoria y datos precargados
./mvnw spring-boot:run -Dspring.profiles.active=test

# Acceder a consola H2
# URL: http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:testdb
# User: sa
# Password: (vacío)
```

---

## 🎲 Datos de Prueba Precargados

> 🎯 **Con el perfil `test`, la aplicación carga automáticamente datos realistas para pruebas**

### 🏦 Tarjetas Generadas (20 registros)
```json
{
  "ejemplo": {
    "holderName": "Juan Pérez",
    "maskedPan": "1234********0001",
    "documentNumber": "12345678",
    "cardType": "CREDIT",
    "phoneNumber": "+573001234567",
    "status": "ENROLLED"
  }
}
```

### 💳 Transacciones Generadas (25+ registros)
```json
{
  "ejemplo": {
    "referenceNumber": "TXN1730275200001",
    "totalAmount": 150.75,
    "purchaseAddress": "Centro Comercial Andino, Bogotá",
    "status": "APPROVED"
  }
}
```

### 🔍 Consultas SQL de Ejemplo
```sql
-- Ver todas las tarjetas
SELECT * FROM cards;

-- Ver transacciones con detalles de tarjeta
SELECT t.*, c.holder_name, c.masked_pan 
FROM transactions t 
JOIN cards c ON t.card_id = c.id;

-- Estadísticas por estado
SELECT status, COUNT(*) as total FROM cards GROUP BY status;
```

---

## 💻 Ejemplos de Uso con cURL

### 🔄 Flujo Completo

<details>
<summary><strong>🏦 Flujo de Tarjeta</strong></summary>

```bash
# 1. Crear tarjeta
curl -X POST http://localhost:8080/cards \
  -H "Content-Type: application/json" \
  -d '{
    "pan": "1234567890123456",
    "holderName": "Ana García",
    "documentNumber": "87654321",
    "cardType": "DEBIT",
    "phoneNumber": "+573201234567"
  }'

# 2. Activar tarjeta (usar identifier del paso anterior)
curl -X PUT http://localhost:8080/cards/enroll \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "validationNumber": "123456"
  }'

# 3. Consultar detalles
curl http://localhost:8080/cards/a1b2c3d4-e5f6-7890-abcd-ef1234567890

# 4. Listar todas las tarjetas
curl "http://localhost:8080/cards?page=0&size=5"
```
</details>

<details>
<summary><strong>💳 Flujo de Transacciones</strong></summary>

```bash
# 1. Crear transacción
curl -X POST http://localhost:8080/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "cardIdentifier": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "totalAmount": 250.00,
    "purchaseAddress": "Plaza de Bolívar, Medellín"
  }'

# 2. Cancelar transacción (dentro de 5 minutos)
curl -X PUT http://localhost:8080/transactions/cancel \
  -H "Content-Type: application/json" \
  -d '{
    "referenceNumber": "TXN1730275200000"
  }'

# 3. Listar transacciones
curl "http://localhost:8080/transactions?page=0&size=10&sortBy=totalAmount&sortDir=desc"
```
</details>

---

## 📊 Reglas de Negocio

### 🏦 Tarjetas
| 📋 Regla | 📝 Descripción |
|-----------|----------------|
| **Unicidad** | El PAN debe ser único en el sistema |
| **Estados** | `CREATED` → `ENROLLED` → `INACTIVE` |
| **Activación** | Solo tarjetas `CREATED` pueden activarse |
| **Desactivación** | Solo tarjetas `ENROLLED` pueden desactivarse |
| **Validación** | PAN de 16 dígitos, teléfono internacional |

### 💳 Transacciones
| 📋 Regla | 📝 Descripción |
|-----------|----------------|
| **Tarjetas válidas** | Solo para tarjetas `ENROLLED` |
| **Cancelación** | Dentro de 5 minutos desde creación |
| **Estados** | Solo `APPROVED` pueden cancelarse |
| **Montos** | Valores positivos, máximo 2 decimales |
| **Referencia** | Número único basado en timestamp |

---

## 🧪 Testing y Calidad

### 🚀 Ejecutar Tests
```bash
# Todos los tests
./mvnw test

# Tests específicos
./mvnw test -Dtest=CardControllerTest

# Con reporte de cobertura
./mvnw test jacoco:report
```

### 📊 Métricas de Calidad
- **Cobertura objetivo:** >80%
- **Tests unitarios:** Servicios y utilidades
- **Tests de integración:** Controladores
- **Mocking:** Mockito para dependencias

---

## 🚨 Resolución de Problemas

<details>
<summary><strong>🔧 Problemas Comunes</strong></summary>

### Error: Puerto 8080 ocupado
```bash
# Cambiar puerto
export SERVER_PORT=8081
./mvnw spring-boot:run
```

### Error: MySQL no conecta
```bash
# Usar H2 para desarrollo
./mvnw spring-boot:run -Dspring.profiles.active=test
```

### Tests fallan
```bash
# Limpiar y recompilar
./mvnw clean compile test
```
</details>

---

## 🔍 Códigos de Estado HTTP

| 📊 Código | 📝 Descripción | 🎯 Casos de Uso |
|-----------|----------------|------------------|
| `200 OK` | ✅ Operación exitosa | Consultas, actualizaciones |
| `201 Created` | ✨ Recurso creado | Tarjetas, transacciones |
| `400 Bad Request` | ⚠️ Error de validación | Datos inválidos, estado incorrecto |
| `404 Not Found` | 🔍 Recurso no encontrado | Tarjeta/transacción inexistente |
| `500 Internal Error` | 🔥 Error del servidor | Fallos internos |

---

## 📞 Soporte y Contribución

### 🤝 Contribuir
1. Fork del repositorio
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m "feat: nueva funcionalidad"`
4. Tests: `./mvnw test`
5. Pull Request

### 📜 Licencia
Este proyecto es propiedad de **Credibanco** - Uso interno y evaluación técnica.

---

<div align="center">

**🏦 Credibanco Card System**  
*Sistema backend profesional para gestión de tarjetas*

[![Java](https://img.shields.io/badge/Powered%20by-Java%2017-orange)](https://www.oracle.com/java/)
[![Spring](https://img.shields.io/badge/Built%20with-Spring%20Boot-green)](https://spring.io/)

**Versión 1.0.0** | **Octubre 2025**

</div>