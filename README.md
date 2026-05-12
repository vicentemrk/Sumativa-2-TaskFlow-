# TaskFlow — Gestor de Tareas

> Aplicación web de gestión de tareas moderna, segura y responsive, construida con HTML5, CSS3 y Vanilla JavaScript puro.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-Academic-blue?style=flat-square)
![Arquitectura](https://img.shields.io/badge/Arquitectura-IIFE_Modular-8b5cf6?style=flat-square)

---

## 🚀 Descripción

**TaskFlow** es un gestor de tareas tipo SaaS diseñado como proyecto académico de alto nivel. Permite crear, editar, completar, eliminar y exportar tareas con asignación por email, fechas límite y un sistema de prioridades inteligente.

La aplicación se enfoca en la **seguridad**, la **experiencia de usuario (UX)**, la **arquitectura modular** y la **testabilidad del código**, utilizando exclusivamente JavaScript moderno sin dependencias externas.

---

## ✨ Características

### CRUD Completo
- **Crear** tareas con nombre, email del asignado, prioridad y fecha límite opcional.
- **Leer** tareas con filtros por estado (todas / pendientes / completadas).
- **Editar** cualquier campo de una tarea existente a través de un modal dedicado.
- **Eliminar** tareas individuales con animación de salida, o borrado masivo con confirmación.
- **Togglear** el estado completada/pendiente directamente desde la lista.

### Búsqueda y Ordenamiento
- 🔍 **Búsqueda en tiempo real** por nombre o email del asignado.
- 🔃 **Ordenamiento** por fecha de creación, prioridad o fecha límite.

### Exportación de datos
- 📥 **Exportar a JSON** — genera un archivo con todas las tareas, descargable con un clic, usando la Web API nativa (`Blob`, `URL.createObjectURL`).

### Calidad y Seguridad
- 🛡️ **XSS-safe**: uso estricto de `textContent` y la API del DOM, sin `innerHTML`.
- ✅ **Validación robusta**: Regex para emails (RFC 5322) y nombres con sanitización automática.
- ♿ **Accesibilidad**: Focus trap en modales (Tab / Shift+Tab / Escape), atributos ARIA.
- 📱 **Mobile-First**: Interfaz 100% responsive.
- 🌙 **Dark Mode**: persistido en localStorage, respeta `prefers-color-scheme`.

---

## 🏗️ Arquitectura — Módulos IIFE

El código está organizado en **4 módulos [IIFE](https://developer.mozilla.org/es/docs/Glossary/IIFE)** dentro de `app.js`. El patrón IIFE (Immediately Invoked Function Expression) es el predecesor directo de los módulos ES6: encapsula el estado interno y expone solo una API pública, exactamente como `export` en módulos modernos.

```
app.js
├── Store     — Persistencia y CRUD sobre localStorage
├── Query     — Filtrado, búsqueda y ordenamiento (estado de vista)
├── Validator — Validación pura de datos, sin acoplamiento al DOM
└── UI        — Renderizado, toasts, modales y estadísticas
```

### Por qué este diseño

| Principio | Aplicación en TaskFlow |
|-----------|------------------------|
| **Encapsulación** | Cada módulo oculta su implementación; los callers solo ven la interfaz pública. |
| **Módulos profundos** | `Validator` tiene una interfaz mínima (`validar(datos) → {ok, errores/datos}`) que oculta toda la lógica de regex y sanitización. |
| **Separación DOM/Lógica** | `Validator` y `Query` no conocen el DOM → se pueden testear en aislamiento. |
| **Delegación de eventos** | Un solo listener en `#task-list` maneja todas las acciones (toggle, edit, delete). |

### Diagrama de dependencias

```
DOMContentLoaded
      │
      ├─► Store    ◄─── UI
      ├─► Query    ◄─── UI
      ├─► Validator ◄── UI
      └─► UI (renderiza, consume Store + Query + Validator)
```

---

## 🧪 Tests

El archivo `app.test.js` contiene **11 tests de comportamiento** para los módulos `Validator` y `Query`, escritos sin framework externo.

**Cómo ejecutarlos:**
1. Abre `index.html` en el navegador.
2. Abre la consola (F12).
3. Copia y pega el contenido de `app.test.js`.
4. Verás un reporte `✔ PASS / ✘ FAIL` por cada test.

Los tests siguen el ciclo **RED → GREEN → REFACTOR** de TDD y verifican únicamente comportamiento observable a través de la interfaz pública de cada módulo.

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| **HTML5 semántico** | Estructura accesible con roles ARIA |
| **CSS3** | Custom Properties, Grid, Flexbox, animaciones |
| **JavaScript ES6+** | Módulos IIFE, `crypto.randomUUID()`, `Blob`, `URL.createObjectURL` |
| **Web Storage API** | Persistencia sin backend |
| **Web Crypto API** | IDs únicos y seguros |
| **Remix Icon** | Iconografía ligera |
| **Google Fonts — Inter** | Tipografía de alta legibilidad |

---

## 📂 Estructura de archivos

```
Sumativa-2-TaskFlow-/
├── index.html      # Estructura HTML y referencias a recursos
├── styles.css      # Sistema de diseño completo (tokens, componentes, animaciones)
├── app.js          # Lógica de la aplicación (módulos Store, Query, Validator, UI)
├── app.test.js     # Suite de tests de comportamiento (Validator + Query)
└── README.md       # Este archivo
```

---

## 🚀 Despliegue

### Localmente
```bash
git clone https://github.com/vicentemrk/Sumativa-2-TaskFlow-.git
cd Sumativa-2-TaskFlow-
# Abrir index.html directamente en el navegador
# o usar Live Server en VS Code
```

### GitHub Pages
👉 **[Ver TaskFlow en Vivo](https://vicentemrk.github.io/Sumativa-2-TaskFlow-/)**

---

## 🤖 Uso de IA Generativa (Antigravity)

Este proyecto integra mejoras aplicadas con asistencia de **IA (Antigravity / Google DeepMind)**:

| Iteración | Contribución IA |
|-----------|-----------------|
| **v1** | Estructura inicial, paleta de colores, validaciones básicas |
| **v2** | Refactoring XSS-safe, sistema de toasts, dark mode |
| **v3** | Arquitectura modular IIFE, separación DOM/lógica, focus trap, suite de tests TDD |

La IA no escribió el diseño conceptual del proyecto — ese viene del requerimiento académico. Su rol fue **auditar la arquitectura**, **proponer mejoras de seguridad** y **sugerir patrones de testing**.

---

## 👤 Autor

- GitHub: [@vicentemrk](https://github.com/vicentemrk)

---

## 📄 Licencia

Proyecto desarrollado con fines académicos.  
Todos los derechos reservados © 2026.
