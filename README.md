# TaskFlow — Gestor de Tareas

> Gestor tareas moderno, seguro, responsive. HTML5 + CSS3 + Vanilla JS.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-Academic-blue?style=flat-square)
![Arquitectura](https://img.shields.io/badge/Arquitectura-IIFE_Modular-8b5cf6?style=flat-square)

---

## 🚀 Descripción

**TaskFlow** gestor tareas tipo SaaS, proyecto académico. Crea, edita, completa, elimina y exporta tareas con email, fechas límite y prioridades. Sin dependencias externas.

---

## ✨ Características

### CRUD Completo
- **Crear** — nombre, email, prioridad, fecha límite opcional.
- **Leer** — filtros por estado (todas / pendientes / completadas).
- **Editar** — modal dedicado, todos los campos.
- **Eliminar** — individual con animación o borrado masivo con confirmación.
- **Toggle** — completada/pendiente desde la lista.

### Búsqueda y Ordenamiento
- 🔍 **Búsqueda en tiempo real** por nombre o email.
- 🔃 **Orden** por creación, prioridad o fecha límite.

### Exportación
- 📥 **Exportar JSON** — `Blob` + `URL.createObjectURL`, descarga con un clic.

### Calidad y Seguridad
- 🛡️ **XSS-safe**: `textContent` + DOM API, sin `innerHTML`.
- ✅ **Validación**: Regex RFC 5322 + sanitización automática.
- ♿ **Accesibilidad**: Focus trap modales (Tab / Shift+Tab / Escape), ARIA.
- 📱 **Mobile-First**: 100% responsive.
- 🌙 **Dark Mode**: persistido en localStorage, respeta `prefers-color-scheme`.

---

## 🏗️ Arquitectura — Módulos IIFE

4 módulos [IIFE](https://developer.mozilla.org/es/docs/Glossary/IIFE) en `app.js`. Encapsula estado interno, expone solo API pública — mismo concepto que `export` en ES6.

```
app.js
├── Store     — CRUD sobre localStorage
├── Query     — Filtrado, búsqueda, ordenamiento (estado vista)
├── Validator — Validación pura, sin DOM
└── UI        — Renderizado, toasts, modales, stats
```

| Principio | Aplicación |
|-----------|-----------|
| **Encapsulación** | Impl oculta, solo API pública visible |
| **Módulos profundos** | `Validator.validar(datos) → {ok, errores/datos}` — regex + sanitización ocultos |
| **Sin DOM en lógica** | `Validator` y `Query` testables en aislamiento |
| **Delegación eventos** | Un listener en `#task-list` maneja toggle/edit/delete |

```
DOMContentLoaded
      ├─► Store    ◄─── UI
      ├─► Query    ◄─── UI
      ├─► Validator ◄── UI
      └─► UI (consume Store + Query + Validator)
```

---

## 🧪 Tests

`app.test.js` — 13 tests de comportamiento. Sin framework.

**Ejecutar:**
1. Abrir `index.html` en browser.
2. Consola (F12).
3. Pegar contenido de `app.test.js`.
4. Ver reporte `✔ PASS / ✘ FAIL`.

Ciclo TDD: **RED → GREEN → REFACTOR**. Testea solo interfaz pública.

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| **HTML5 semántico** | Estructura, roles ARIA |
| **CSS3** | Custom Properties, Grid, Flexbox, animaciones |
| **JavaScript ES6+** | IIFE, `crypto.randomUUID()`, `Blob`, `URL.createObjectURL` |
| **Web Storage API** | Persistencia sin backend |
| **Web Crypto API** | IDs únicos seguros |
| **Remix Icon** | Iconografía ligera |
| **Google Fonts — Inter** | Tipografía legible |

---

## 📂 Estructura

```
Sumativa-2-TaskFlow-/
├── index.html      # HTML + referencias recursos
├── styles.css      # Design system (tokens, componentes, animaciones)
├── app.js          # Store + Query + Validator + UI
├── app.test.js     # 13 tests comportamiento
└── README.md
```

---

## 🚀 Despliegue

```bash
git clone https://github.com/vicentemrk/Sumativa-2-TaskFlow-.git
cd Sumativa-2-TaskFlow-
# Abrir index.html o usar Live Server
```

👉 **[Ver en vivo — GitHub Pages](https://vicentemrk.github.io/Sumativa-2-TaskFlow-/)**

---

## 🤖 IA Generativa (Antigravity)

| Iteración | Contribución |
|-----------|-------------|
| **v1** | Estructura, paleta, validaciones básicas |
| **v2** | XSS-safe, toasts, dark mode |
| **v3** | Arquitectura IIFE, separación DOM/lógica, focus trap, tests TDD |

IA auditó arquitectura, seguridad y testing. Diseño conceptual: requerimiento académico.

---

## 👤 Autor

- GitHub: [@vicentemrk](https://github.com/vicentemrk)

---

## 📄 Licencia

Proyecto fines académicos. Todos derechos reservados © 2026.
