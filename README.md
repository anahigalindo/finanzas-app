# 💰 Finanzas App

> **ES** | [EN](#-finanzas-app-english)

---

## 💰 Finanzas App

Aplicación web de finanzas personales desarrollada en React. Permite visualizar y gestionar cuentas, categorías, transacciones y presupuestos, con un dashboard interactivo de gráficas en tiempo real.

🔗 **Backend:** [finanzas-api](https://github.com/anahigalindo/finanzas-api)

---

### 🛠️ Stack

- React 18 + Vite
- React Router DOM (navegación y rutas protegidas)
- TanStack React Query (estado del servidor y caché)
- Zustand (estado global de autenticación)
- Axios (peticiones HTTP con interceptores)
- React Hook Form + Zod (formularios y validación)
- Recharts (gráficas interactivas)
- Tailwind CSS (estilos)

---

### ✨ Funcionalidades

- 🔐 Login y registro con token Sanctum — rutas protegidas por sesión
- 📊 Dashboard con resumen mensual: balance, ingresos, gastos y ahorro
- 📈 Gráfica de línea: evolución de ingresos vs gastos en los últimos 6 meses
- 🍩 Gráfica de dona: distribución de gastos por categoría
- 🏦 Gestión de cuentas con saldo actualizado en tiempo real
- 🏷️ Gestión de categorías con color e ícono personalizados
- 💸 Registro de transacciones (ingresos, gastos y transferencias) con filtros por tipo y fecha
- 🎯 Presupuestos por categoría con barra de progreso y alerta de exceso
- 🔄 Actualización automática de la UI al crear o eliminar datos (sin recargar la página)
- ⏳ Skeleton loaders mientras cargan los datos

---

### 📁 Estructura del proyecto

```
src/
├── api/
│   └── axios.js              # Instancia de Axios con interceptores
├── components/
│   └── layout/
│       └── MainLayout.jsx    # Sidebar de navegación
├── hooks/
│   ├── useAccounts.js
│   ├── useCategories.js
│   ├── useTransactions.js
│   ├── useBudgets.js
│   └── useReports.js
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── dashboard/
│   │   └── Dashboard.jsx
│   ├── accounts/
│   │   └── Accounts.jsx
│   ├── transactions/
│   │   └── Transactions.jsx
│   ├── categories/
│   │   └── Categories.jsx
│   └── budgets/
│       └── Budgets.jsx
├── store/
│   └── authStore.js          # Estado global con Zustand
├── App.jsx                   # Rutas públicas y privadas
└── main.jsx                  # Providers: React Query, React Router
```

---

### 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/anahigalindo/finanzas-app.git
cd finanzas-app

# Instalar dependencias
npm install

# Levantar el servidor de desarrollo
npm run dev
```

> Asegúrate de que el backend esté corriendo en `http://127.0.0.1:8000` antes de iniciar la app.

---

### 🏗️ Decisiones técnicas

**React Query para estado del servidor**
Todas las peticiones a la API se manejan con React Query. Al crear o eliminar un dato se invalidan las queries relacionadas, actualizando la UI automáticamente sin recargar la página.

**Zustand para autenticación**
El token y el estado de sesión se guardan en Zustand y en `localStorage`. Un interceptor de Axios agrega el token a cada petición automáticamente. Si el servidor responde con 401, el usuario es redirigido al login.

**React Hook Form + Zod**
Los formularios usan React Hook Form para el manejo eficiente del estado y Zod para definir las reglas de validación con TypeScript-like schemas.

**Rutas protegidas**
`PrivateRoute` redirige al login si no hay sesión activa. `PublicRoute` redirige al dashboard si ya hay sesión, evitando que un usuario autenticado vea el login.

---

### 👤 Autora

Desarrollado por **Anahi Galindo**  
🔗 GitHub: [@anahigalindo](https://github.com/anahigalindo)

---
---

## 💰 Finanzas App (English)

Personal finance web application built with React. Manage accounts, categories, transactions and budgets, with an interactive real-time charts dashboard.

🔗 **Backend:** [finanzas-api](https://github.com/anahigalindo/finanzas-api)

---

### 🛠️ Stack

- React 18 + Vite
- React Router DOM (navigation and protected routes)
- TanStack React Query (server state and caching)
- Zustand (global authentication state)
- Axios (HTTP requests with interceptors)
- React Hook Form + Zod (forms and validation)
- Recharts (interactive charts)
- Tailwind CSS (styling)

---

### ✨ Features

- 🔐 Login and register with Sanctum token — session-protected routes
- 📊 Dashboard with monthly summary: balance, income, expenses and savings
- 📈 Line chart: income vs expenses over the last 6 months
- 🍩 Pie chart: expense breakdown by category
- 🏦 Account management with real-time balance updates
- 🏷️ Category management with custom color and icon
- 💸 Transaction tracking (income, expenses and transfers) with type and date filters
- 🎯 Category budgets with progress bar and exceeded alert
- 🔄 Automatic UI updates when creating or deleting data (no page reload)
- ⏳ Skeleton loaders while data is loading

---

### 📁 Project Structure

```
src/
├── api/
│   └── axios.js              # Axios instance with interceptors
├── components/
│   └── layout/
│       └── MainLayout.jsx    # Navigation sidebar
├── hooks/
│   ├── useAccounts.js
│   ├── useCategories.js
│   ├── useTransactions.js
│   ├── useBudgets.js
│   └── useReports.js
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── dashboard/
│   │   └── Dashboard.jsx
│   ├── accounts/
│   │   └── Accounts.jsx
│   ├── transactions/
│   │   └── Transactions.jsx
│   ├── categories/
│   │   └── Categories.jsx
│   └── budgets/
│       └── Budgets.jsx
├── store/
│   └── authStore.js          # Global state with Zustand
├── App.jsx                   # Public and private routes
└── main.jsx                  # Providers: React Query, React Router
```

---

### 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/anahigalindo/finanzas-app.git
cd finanzas-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

> Make sure the backend is running on `http://127.0.0.1:8000` before starting the app.

---

### 🏗️ Technical Decisions

**React Query for server state**
All API requests are handled with React Query. When data is created or deleted, related queries are invalidated, automatically updating the UI without reloading the page.

**Zustand for authentication**
The token and session state are stored in Zustand and `localStorage`. An Axios interceptor automatically adds the token to every request. If the server responds with 401, the user is redirected to login.

**React Hook Form + Zod**
Forms use React Hook Form for efficient state management and Zod to define validation rules with TypeScript-like schemas.

**Protected routes**
`PrivateRoute` redirects to login if there is no active session. `PublicRoute` redirects to the dashboard if there is already a session, preventing an authenticated user from seeing the login page.

---

### 👤 Author

Developed by **Anahi Galindo**  
🔗 GitHub: [@anahigalindo](https://github.com/anahigalindo)
