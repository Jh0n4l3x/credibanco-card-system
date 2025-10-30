# 🎨 Frontend - Credibanco Card System# 💳 Credibanco Card System - Frontend



> **Aplicación Angular moderna para gestión de tarjetas y transacciones**![Angular](https://img.shields.io/badge/Angular-17.0.0-red?style=flat-square&logo=angular)

![TypeScript](https://img.shields.io/badge/TypeScript-5.2.0-blue?style=flat-square&logo=typescript)

![Angular](https://img.shields.io/badge/Angular-17.0.0-red?style=flat-square&logo=angular)![Material Design](https://img.shields.io/badge/Material_Design-17.0.0-blue?style=flat-square&logo=material-design)

![TypeScript](https://img.shields.io/badge/TypeScript-5.2.0-blue?style=flat-square&logo=typescript)![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)

![Material](https://img.shields.io/badge/Material-17.0.0-indigo?style=flat-square&logo=material-design)

![RxJS](https://img.shields.io/badge/RxJS-7.8.0-purple?style=flat-square&logo=reactivex)Frontend moderno y profesional para el sistema de gestión de tarjetas de crédito/débito de Credibanco. Desarrollado con Angular 17 y Material Design para una experiencia de usuario excepcional.



Interfaz web moderna y responsiva desarrollada con **Angular 17** y **Material Design** para la gestión completa del sistema de tarjetas Credibanco.## � Tabla de Contenidos



---- [🚀 Características](#-características)

- [🏗️ Arquitectura](#️-arquitectura)

## 🚀 Inicio Rápido- [🛠️ Tecnologías](#️-tecnologías)

- [📦 Instalación](#-instalación)

```bash- [🚀 Desarrollo](#-desarrollo)

# Instalar dependencias- [🎨 Funcionalidades](#-funcionalidades)

npm install- [🌐 API Integration](#-api-integration)

- [📱 Responsive Design](#-responsive-design)

# Ejecutar en desarrollo- [🧪 Testing](#-testing)

npm start- [📦 Build & Deploy](#-build--deploy)

# Aplicación disponible en: http://localhost:4200- [📖 Documentación](#-documentación)



# Compilar para producción## 🚀 Características

npm run build

```✅ **Dashboard interactivo** con estadísticas en tiempo real  

✅ **Gestión completa de tarjetas** (crear, activar, desactivar)  

> ⚠️ **Prerequisito:** Backend corriendo en `http://localhost:8080`✅ **Sistema de transacciones** con cancelación automática  

✅ **Generación automática de PAN** con algoritmo Luhn  

---✅ **Validaciones robustas** en todos los formularios  

✅ **Paginación del servidor** para mejor rendimiento  

## ✨ Características Principales✅ **Sin caché** para datos siempre actualizados  

✅ **Diseño responsive** para todos los dispositivos  

### 🎯 Funcionalidades✅ **Manejo de errores** centralizado y amigable  

✅ **Dashboard Dinámico** - Estadísticas en tiempo real con auto-refresh  

✅ **Gestión de Tarjetas** - CRUD completo con validaciones avanzadas  ## 🏗️ Arquitectura

✅ **Gestión de Transacciones** - Crear y cancelar con confirmaciones  

✅ **Navegación Intuitiva** - Rutas protegidas y breadcrumbs  ```

✅ **Tablas Inteligentes** - Paginación server-side y filtros  src/

✅ **Formularios Reactivos** - Validaciones en tiempo real  ├── 📁 app/

✅ **Diseño Responsivo** - Adaptable a todos los dispositivos  │   ├── 🔧 core/                    # Servicios principales y configuración

│   │   ├── services/               # CardService, TransactionService

### 🛠️ Stack Técnico│   │   └── interceptors/           # HTTP interceptors (no-cache, errors)

```typescript│   ├── 🔄 shared/                  # Componentes y modelos compartidos

Angular 17.0.0        // Framework SPA moderno│   │   ├── components/             # Componentes reutilizables

TypeScript 5.2.0      // Tipado estático avanzado│   │   └── models/                 # Interfaces TypeScript

Angular Material 17   // Componentes Material Design│   ├── 🎯 features/                # Módulos de funcionalidades

RxJS 7.8.0           // Programación reactiva│   │   ├── 📊 dashboard/           # Panel principal con estadísticas

SCSS                 // Estilos avanzados│   │   ├── 💳 cards/               # Gestión de tarjetas

Bootstrap Grid       // Sistema de grillas responsivo│   │   │   ├── card-list/          # Lista con filtros y paginación

```│   │   │   ├── card-create/        # Crear tarjeta + PAN automático

│   │   │   ├── card-detail/        # Detalles y gestión

---│   │   │   └── card-enroll-dialog/ # Modal de activación

│   │   └── 💰 transactions/        # Gestión de transacciones

## 📁 Estructura del Proyecto│   │       ├── transaction-list/   # Lista con cancelación

│   │       ├── transaction-create/ # Crear transacción

```│   │       └── transaction-detail/ # Detalles de transacción

src/app/│   ├── 🎨 assets/                  # Recursos estáticos

├── 🎮 core/                    # Servicios core y globales│   ├── 🌍 environments/            # Configuración de entornos

│   ├── interceptors/           # HTTP interceptors│   └── 🎨 styles.scss              # Estilos globales Material Design

│   │   └── error.interceptor.ts```

│   └── services/               # Servicios principales

│       ├── card.service.ts     # Gestión de tarjetas## 🛠️ Tecnologías

│       └── transaction.service.ts # Gestión de transacciones

├── 🎨 features/                # Módulos funcionales### Core Framework

│   ├── dashboard/              # Dashboard principal- **Angular 17.0.0** - Framework SPA con las últimas características

│   │   ├── dashboard.component.ts- **TypeScript 5.2.0** - Tipado estático y features modernas

│   │   ├── dashboard.component.html- **RxJS 7.8.0** - Programación reactiva y manejo de estados

│   │   └── dashboard.component.scss

│   ├── cards/                  # Módulo de tarjetas### UI/UX

│   │   ├── cards.module.ts- **Angular Material 17.0.0** - Componentes Material Design

│   │   ├── card-create/        # Crear tarjeta- **Angular CDK 17.0.0** - Kit de desarrollo de componentes

│   │   ├── card-detail/        # Detalles de tarjeta- **SCSS** - Preprocesador CSS con variables y mixins

│   │   └── card-list/          # Lista de tarjetas

│   └── transactions/           # Módulo de transacciones### Development Tools

│       ├── transaction-create/- **Angular CLI 17.0.0** - Herramientas de desarrollo

│       └── transaction-list/- **ESLint 9.38.0** - Linting y calidad de código

├── 📦 shared/                  # Componentes compartidos- **Karma + Jasmine** - Testing framework

│   ├── components/             # Componentes reutilizables

│   │   ├── loading/            # Spinner de carga## 📦 Instalación

│   │   └── confirmation-dialog/ # Diálogos de confirmación

│   └── models/                 # Interfaces TypeScript### Prerrequisitos

│       ├── card.interface.ts

│       └── transaction.interface.ts```bash

├── 🎨 styles/                  # Estilos globales# Node.js 18+ requerido

└── 🌍 environments/            # Configuraciones por ambientenode --version  # v18.0.0+

    ├── environment.ts          # Desarrollonpm --version   # 9.0.0+

    └── environment.prod.ts     # Producción```

```

### Configuración inicial

---

```bash

## 🎯 Componentes Principales# 1. Navegar al directorio del frontend

cd frontend

### 📊 Dashboard Component

```typescript# 2. Instalar dependencias

// Estadísticas en tiempo real con RxJSnpm install

@Component({

  selector: 'app-dashboard',# 3. Instalar Angular CLI globalmente (opcional)

  templateUrl: './dashboard.component.html'npm install -g @angular/cli@17

})```

export class DashboardComponent implements OnInit, OnDestroy {

  // Streams reactivos para datos en tiempo real### Configuración de entornos

  cards$ = this.cardService.getAllCards();

  transactions$ = this.transactionService.getAllTransactions();**Desarrollo** (`src/environments/environment.ts`):

  ```typescript

  // Auto-refresh cada 30 segundosexport const environment = {

  private refreshTimer$ = timer(0, 30000);  production: false,

}  apiBaseUrl: 'http://localhost:8080',

```  appName: 'Credibanco Card System',

  version: '1.0.0'

**Características:**};

- 📈 Métricas en tiempo real (tarjetas activas, transacciones del día)```

- 🔄 Auto-refresh automático cada 30 segundos

- 📋 Lista de actividad reciente**Producción** (`src/environments/environment.prod.ts`):

- 📊 Gráficos dinámicos con Chart.js```typescript

export const environment = {

### 💳 Card Management  production: true,

```typescript  apiBaseUrl: 'https://api.credibanco.com',

// Gestión completa de tarjetas  appName: 'Credibanco Card System',

export class CardListComponent {  version: '1.0.0'

  displayedColumns = ['maskedPan', 'holderName', 'status', 'createdAt', 'actions'];};

  dataSource = new MatTableDataSource<Card>();```

  

  // Paginación server-side## 🚀 Desarrollo

  paginator = { page: 0, size: 10, totalElements: 0 };

}### Comandos principales

```

```bash

**Características:**# 🚀 Servidor de desarrollo (puerto 4200)

- 🔍 Búsqueda y filtrado en tiempo realnpm start

- 📄 Paginación server-side optimizada# o

- ✏️ Formularios reactivos con validacionesng serve --open

- 🎭 Enmascaramiento de PAN para seguridad

- 🎯 Acciones contextuales (ver, editar, eliminar)# 🏗️ Build para producción

npm run build

### 💰 Transaction Management# o

```typescriptng build --configuration production

// Gestión de transacciones

export class TransactionListComponent {# 🧪 Ejecutar tests unitarios

  cancelTransaction(referenceNumber: string) {npm test

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {# o

      data: { message: '¿Está seguro de cancelar esta transacción?' }ng test

    });

    # 🔍 Linting del código

    dialogRef.afterClosed().subscribe(confirmed => {npm run lint

      if (confirmed) {# o

        this.transactionService.cancelTransaction(referenceNumber).subscribe();ng lint

      }

    });# 👀 Build en modo watch

  }npm run watch

}# o

```ng build --watch --configuration development

```

**Características:**

- 💰 Crear transacciones con validación de montos### Configuración de desarrollo

- ❌ Cancelar transacciones con confirmación

- 📊 Estados visuales (Aprobada, Cancelada, Rechazada)El servidor de desarrollo estará disponible en `http://localhost:4200`

- ⏱️ Control de tiempo para cancelaciones

**Características del entorno de desarrollo:**

---- 🔄 Hot reload automático

- 🐛 Source maps habilitados

## 🌐 API Integration- 📊 Análisis de bundles

- 🚨 Linting en tiempo real

### 💳 Card Service

```typescript## 🎨 Funcionalidades

@Injectable({ providedIn: 'root' })

export class CardService {### 📊 Dashboard Dinámico

  private readonly baseUrl = `${environment.apiUrl}/cards`;- **Estadísticas en tiempo real**: Total de tarjetas, transacciones y montos

  - **Actividad reciente**: Últimas acciones del sistema

  // Crear tarjeta- **Auto-refresh**: Actualización automática cada 30 segundos

  createCard(card: CreateCardRequest): Observable<CreateCardResponse> {- **Tarjetas recientes**: Últimas 5 tarjetas creadas

    return this.http.post<CreateCardResponse>(this.baseUrl, card);- **Transacciones recientes**: Últimas 5 transacciones procesadas

  }

  ### 💳 Gestión de Tarjetas

  // Obtener tarjetas con paginación

  getCards(params: PaginationParams): Observable<PaginatedResponse<Card>> {#### Crear Tarjeta

    return this.http.get<PaginatedResponse<Card>>(this.baseUrl, { params });- **PAN automático**: Generación con algoritmo Luhn

  }- **Validaciones robustas**: Documento, teléfono, nombres

  - **Preview visual**: Vista previa de la tarjeta

  // Enrolar tarjeta- **Tipos soportados**: CREDIT (Visa) / DEBIT (MasterCard)

  enrollCard(request: EnrollCardRequest): Observable<void> {

    return this.http.put<void>(`${this.baseUrl}/enroll`, request);#### Gestión Completa

  }- **Lista con filtros**: Por estado y tipo de tarjeta

}- **Paginación del servidor**: Mejor rendimiento

```- **Activación de tarjetas**: Modal con validación

- **Desactivación**: Confirmación de seguridad

### 💰 Transaction Service- **Ver detalles**: Información completa + transacciones

```typescript

@Injectable({ providedIn: 'root' })### 💰 Gestión de Transacciones

export class TransactionService {

  private readonly baseUrl = `${environment.apiUrl}/transactions`;#### Crear Transacción

  - **Validación de tarjeta**: Solo tarjetas activas

  // Crear transacción- **Cálculo automático**: Monto + dirección de compra

  createTransaction(transaction: CreateTransactionRequest): Observable<Transaction> {- **Estados automáticos**: APPROVED/REJECTED según reglas

    return this.http.post<Transaction>(this.baseUrl, transaction);

  }#### Operaciones

  - **Cancelar transacciones**: Solo las aprobadas

  // Cancelar transacción- **Filtros avanzados**: Por estado y fecha

  cancelTransaction(referenceNumber: string): Observable<void> {- **Detalles completos**: Información de la transacción

    const request = { referenceNumber };

    return this.http.put<void>(`${this.baseUrl}/cancel`, request);### 🔒 Validaciones y Seguridad

  }

}```typescript

```// Validaciones implementadas

✅ PAN: 16-19 dígitos numéricos

---✅ Documento: 10-15 caracteres alfanuméricos

✅ Teléfono: Exactamente 10 dígitos

## 🧪 Testing✅ Nombres: Mínimo 2 caracteres, solo letras y espacios

✅ Monto: Número positivo con decimales

### 🚀 Tests Unitarios✅ Estados: Enum validation para consistencia

```bash```

# Ejecutar todos los tests

npm test## 🌐 API Integration



# Tests en modo watch### Endpoints de Tarjetas

npm run test:watch

```typescript

# Coverage report// Crear tarjeta

npm run test:coveragePOST /cards

```{

  "documentNumber": "1234567890",

### 📊 Estructura de Tests  "holderName": "Juan Pérez",

```typescript  "phoneNumber": "3001234567",

describe('CardService', () => {  "cardType": "CREDIT"

  let service: CardService;}

  let httpMock: HttpTestingController;

  // Activar tarjeta

  beforeEach(() => {PUT /cards/enroll

    TestBed.configureTestingModule({{

      imports: [HttpClientTestingModule],  "identifier": "1234567890123456",

      providers: [CardService]  "validationNumber": "123456"

    });}

    service = TestBed.inject(CardService);

    httpMock = TestBed.inject(HttpTestingController);// Obtener tarjeta

  });GET /cards/{identifier}

  

  it('should create card successfully', () => {// Desactivar tarjeta

    // Test implementationDELETE /cards/{identifier}

  });

});// Listar tarjetas (paginado)

```GET /cards?page=0&size=10&sortBy=createdAt&sortDir=desc

```

---

### Endpoints de Transacciones

## 🚀 Build y Deployment

```typescript

### 📦 Build para Producción// Crear transacción

```bashPOST /transactions

# Build optimizado{

npm run build  "cardIdentifier": "1234567890123456",

  "totalAmount": 50000,

# Archivos generados en dist/  "purchaseAddress": "Tienda ABC - Bogotá"

dist/}

├── index.html

├── main.[hash].js      # Código principal// Cancelar transacción

├── polyfills.[hash].js # PolyfillsPUT /transactions/cancel

├── runtime.[hash].js   # Runtime Angular{

└── styles.[hash].css   # Estilos compilados  "referenceNumber": "TXN-20241030-001"

```}



### 🌐 Nginx Configuration// Listar transacciones (paginado)

```nginxGET /transactions?page=0&size=10&sortBy=createdAt&sortDir=desc

server {```

  listen 80;

  server_name _;### Manejo de Respuestas

  root /usr/share/nginx/html;

  index index.html;```typescript

  // Estructura de respuesta paginada

  # Angular routinginterface PageResponse<T> {

  location / {  content: T[];

    try_files $uri $uri/ /index.html;  totalElements: number;

  }  totalPages: number;

    size: number;

  # API proxy  number: number;

  location /api/ {  first: boolean;

    proxy_pass http://backend:8080/;  last: boolean;

  }}

}

```// Manejo automático de errores HTTP

- 400: Datos inválidos

---- 404: Recurso no encontrado

- 409: Conflicto (duplicados)

## 🔍 Comandos Útiles- 500: Error del servidor

```

### 🛠️ Desarrollo

```bash## 📱 Responsive Design

# Limpiar cache

npm cache clean --force### Breakpoints



# Reinstalar dependencias```scss

rm -rf node_modules package-lock.json && npm install// Breakpoints principales

$mobile: 768px;    // Móviles

# Analizar bundle$tablet: 1024px;   // Tablets

npm run build -- --stats-json$desktop: 1200px;  // Desktop

npx webpack-bundle-analyzer dist/stats.json

// Adaptaciones automáticas

# Generar componente- Tablas → Cards en móvil

ng generate component features/cards/card-example- Sidebar → Bottom navigation

- Grid responsive automático

# Generar servicio- Touch-friendly buttons

ng generate service core/services/example```

```

### Optimizaciones Mobile

### ⚠️ Troubleshooting- **Navegación optimizada**: Bottom navigation en móviles

| 🔧 Problema | 💡 Solución |- **Gestos touch**: Swipe y tap optimizados

|-------------|-------------|- **Carga progresiva**: Lazy loading de componentes

| CORS Error | Verificar configuración del backend |- **Imágenes responsive**: Adaptación automática

| 404 Error | Confirmar que backend esté en puerto 8080 |

| Build Error | Limpiar cache: `npm run clean && npm install` |## 🧪 Testing

| Test Failure | Verificar imports de HttpClientTestingModule |

### Tests Unitarios

---

```bash

## 📞 Información Adicional# Ejecutar todos los tests

ng test

### 🎯 Roadmap

- [ ] Implementar PWA (Progressive Web App)# Tests con coverage

- [ ] Agregar tests E2E con Cypressng test --code-coverage

- [ ] Implementar i18n para múltiples idiomas

- [ ] Agregar notificaciones push# Tests en modo watch

- [ ] Dashboard con charts avanzadosng test --watch



### 🤝 Contribución# Tests para CI/CD

1. Seguir [Angular Style Guide](https://angular.io/guide/styleguide)ng test --browsers=ChromeHeadless --watch=false

2. Usar [Conventional Commits](https://www.conventionalcommits.org/)```

3. Escribir tests para nuevas funcionalidades

4. Documentar cambios significativos### Estructura de Tests



---```typescript

// Ejemplo de test de componente

<div align="center">describe('CardListComponent', () => {

  let component: CardListComponent;

**🎨 Frontend Credibanco Card System**    let fixture: ComponentFixture<CardListComponent>;

*Interfaz moderna para gestión de tarjetas*  let cardService: jasmine.SpyObj<CardService>;



[![Angular](https://img.shields.io/badge/Powered%20by-Angular%2017-red)](https://angular.io/)  beforeEach(() => {

[![Material](https://img.shields.io/badge/Designed%20with-Material-indigo)](https://material.angular.io/)    const spy = jasmine.createSpyObj('CardService', ['getAllCards']);

    TestBed.configureTestingModule({

**Versión 1.0.0** | **Octubre 2025**      declarations: [CardListComponent],

      providers: [{ provide: CardService, useValue: spy }]

</div>    });
  });

  it('should load cards on init', () => {
    // Test implementation
  });
});
```

## 📦 Build & Deploy

### Build de Producción

```bash
# Build optimizado para producción
ng build --configuration production

# Análisis del bundle
ng build --stats-json
npx webpack-bundle-analyzer dist/credibanco-card-system-frontend/stats.json
```

### Optimizaciones de Build

```json
// Optimizaciones habilitadas
✅ Tree shaking automático
✅ Minificación de JS/CSS
✅ Compresión Gzip
✅ Lazy loading de módulos
✅ Service Worker (opcional)
✅ Bundle splitting inteligente
```

### Deploy

Los archivos generados en `dist/` pueden servirse con cualquier servidor web estático:

```bash
# Nginx
server {
    listen 80;
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
}

# Apache
<VirtualHost *:80>
    DocumentRoot /path/to/dist
    <Directory /path/to/dist>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

## � Documentación

### Componentes Principales

| Componente | Función | Ruta |
|------------|---------|------|
| `DashboardComponent` | Panel principal con estadísticas | `/dashboard` |
| `CardListComponent` | Lista de tarjetas con filtros | `/cards` |
| `CardCreateComponent` | Crear nueva tarjeta | `/cards/create` |
| `CardDetailComponent` | Detalles de tarjeta | `/cards/:id` |
| `TransactionListComponent` | Lista de transacciones | `/transactions` |
| `TransactionCreateComponent` | Crear transacción | `/transactions/create` |

### Servicios Principales

| Servicio | Función | Ubicación |
|----------|---------|-----------|
| `CardService` | Gestión de tarjetas | `src/app/core/services/` |
| `TransactionService` | Gestión de transacciones | `src/app/core/services/` |
| `ErrorInterceptor` | Manejo global de errores | `src/app/core/interceptors/` |
| `NoCacheInterceptor` | Prevención de caché | `src/app/core/interceptors/` |

### Configuración IDE

#### VS Code Extensions Recomendadas

```json
{
  "recommendations": [
    "angular.ng-template",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "angular.ng-template"
  ]
}
```

#### Configuración Prettier

```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

### Scripts Útiles

```bash
# Generar componente
ng generate component features/cards/card-example

# Generar servicio
ng generate service core/services/example

# Generar módulo
ng generate module features/example --routing

# Actualizar Angular
ng update @angular/core @angular/cli

# Analizar dependencias
npm audit
npm audit fix
```

### Troubleshooting

#### Problemas Comunes

```bash
# Error: Cannot find module
rm -rf node_modules package-lock.json
npm install

# Error: Port already in use
ng serve --port 4201

# Error: Memory heap out of memory
export NODE_OPTIONS="--max-old-space-size=8192"

# Error: Angular CLI workspace
cd frontend && ng serve
```

## 🤝 Contribución

### Estándares de Código

1. **Naming conventions**: PascalCase para componentes, camelCase para métodos
2. **Comments**: Documentar métodos públicos complejos
3. **Type safety**: Usar tipos TypeScript estrictos
4. **Error handling**: Implementar manejo de errores consistente

### Workflow de Desarrollo

1. 🌟 Crear branch desde `develop`
2. 💻 Implementar feature con tests
3. 🧪 Ejecutar tests y linting
4. 📝 Crear pull request
5. 👥 Code review
6. 🚀 Merge a `develop`

---

## 📞 Soporte y Contacto

**Email**: desarrollo@credibanco.com  
**Documentación**: [Wiki Interno Credibanco]  
**Issues**: [Sistema de Tickets]  

---

<div align="center">

**🏆 Desarrollado con excelencia por el equipo de Credibanco**

![Credibanco](https://img.shields.io/badge/Credibanco-2024-blue?style=for-the-badge)

</div>