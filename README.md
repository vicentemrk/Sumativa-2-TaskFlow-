# TaskFlow — Gestor de Tareas

> Aplicación web de gestión de tareas moderna, segura y responsive, construida con HTML5, CSS y Vanilla JavaScript.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## Descripción

**TaskFlow** es un gestor de tareas tipo SaaS diseñado como proyecto académico de alto nivel. Permite crear, completar y eliminar tareas con asignación por email y sistema de prioridades (Baja, Media, Alta, Urgente). Los datos persisten en `localStorage`, y toda la interfaz se actualiza dinámicamente sin recargar la página.

### Características principales

- **CRUD completo**: Crear, leer, actualizar estado y eliminar tareas.
- **Persistencia local**: Los datos se guardan automáticamente en `localStorage`.
- **Seguridad XSS-safe**: Se usa exclusivamente `document.createElement()` + `textContent`. Prohibido `innerHTML`.
- **Validación avanzada**: Regex para email (`RFC 5322 simplificado`) y nombres de tarea. Sanitización de inputs.
- **UX moderna**: Toasts no intrusivos, animaciones fluidas, modal de confirmación para Hard Reset.
- **Mobile-First**: Diseño 100% responsive con breakpoints para móvil, tablet y escritorio.
- **Delegación de eventos**: Un solo listener en el contenedor `<ul>` para todos los botones de acción.
- **Iconografía Phosphor Icons**: Librería ligera y moderna.
- **Tipografía Inter**: Fuente profesional de Google Fonts.

---

## Tecnologías utilizadas

| Tecnología | Versión / Detalle | Uso |
|---|---|---|
| HTML5 | Semántico | Estructura de la aplicación |
| CSS3 | Custom Properties, Grid, Flexbox | Diseño responsive y sistema de diseño |
| JavaScript ES6+ | Vanilla (sin frameworks) | Lógica de negocio, DOM, validaciones |
| Google Fonts | Inter 400–800 | Tipografía moderna |
| Phosphor Icons | v2.1.1 (CDN) | Iconos de interfaz |
| localStorage | Web Storage API | Persistencia de datos |
| crypto.randomUUID() | Web Crypto API | Generación de IDs únicos |

---

---

## Instrucciones de despliegue (GitHub Pages)

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/vicentemrk/Sumativa2.git
   cd Sumativa2
   ```

2. **Abrir localmente:**
   Abre `index.html` directamente en tu navegador, o usa un servidor local:
   ```bash
   npx serve .
   ```

3. **Desplegar en GitHub Pages:**
   - Ve a **Settings → Pages** en tu repositorio de GitHub.
   - En **Source**, selecciona la rama `main` y la carpeta `/ (root)`.
   - Haz click en **Save**.
   - Tu app estará disponible en: `https://vicentemrk.github.io/Sumativa2/`

---

## Uso de IA

Durante el desarrollo de este proyecto, se utilizó **IA generativa (Google Gemini / Antigravity)** como herramienta de apoyo para:

### 1. Generación de validaciones Regex

**Prompt:**
> "Genera una expresión regular para validar emails según RFC 5322 simplificado, y otra para nombres de tarea que permita letras Unicode, números y puntuación básica pero bloquee caracteres peligrosos para XSS como `<`, `>`, `\"`, `'`."

**Resultado aplicado:**
```javascript
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[\p{L}\p{N}\s.,;:!?¿¡()\-–—]{3,120}$/u;
```
La IA explicó que el flag `u` habilita soporte Unicode (`\p{L}` para letras en cualquier idioma), lo cual mejoró la accesibilidad del formulario para usuarios hispanohablantes.

### 2. Refactorización de seguridad XSS

**Prompt:**
> "Revisa mi función de renderizado que usa `innerHTML` para mostrar tareas. ¿Es vulnerable a XSS? Refactoriza para usar solo DOM API segura."

**Mejora aplicada:** Se reemplazó completamente `innerHTML` por `document.createElement()` + `textContent` en la función `crearElementoTarea()`. La IA demostró cómo un payload como `<img src=x onerror=alert('XSS')>` se ejecutaría con `innerHTML` pero se renderizaría como texto inofensivo con `textContent`.

### 3. Estructura del proyecto y buenas prácticas

**Prompt:**
> "Estructura un task manager con arquitectura modular: funciones de persistencia separadas de funciones CRUD, separadas de funciones de renderizado. Usa delegación de eventos para los botones dentro de la lista."

**Mejora aplicada:** El código se organizó en 9 secciones claramente delimitadas con funciones puras y reutilizables (`obtenerTareas()`, `guardarTareas()`, `renderizarLista()`, etc.), facilitando el mantenimiento y testing.

### 4. Diseño UI/UX premium

**Prompt:**
> "Diseña un sistema de CSS con custom properties para un task manager tipo SaaS. Incluye paleta de colores para prioridades, sombras suaves, y animaciones de entrada/salida."

**Mejora aplicada:** Se creó un design system completo con tokens CSS (`--color-*`, `--shadow-*`, `--radius-*`), animaciones `slideIn`/`slideOut` para las tareas, y una paleta profesional con colores semánticos para cada nivel de prioridad.

---

## Autor

**Vicente** — [@vicentemrk](https://github.com/vicentemrk)

---

## Licencia

Este proyecto es de uso académico. Todos los derechos reservados © 2026.
