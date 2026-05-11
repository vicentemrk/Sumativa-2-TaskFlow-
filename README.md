# TaskFlow — Gestor de Tareas

> Aplicación web de gestión de tareas moderna, segura y responsive, construida con HTML5, CSS3 y Vanilla JavaScript.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-Academic-blue?style=flat-square)

---

## 🚀 Descripción

**TaskFlow** es un gestor de tareas tipo SaaS diseñado como proyecto académico de alto nivel. Permite crear, completar y eliminar tareas con asignación por email y un sistema de prioridades inteligente. 

La aplicación se enfoca en la **seguridad**, la **experiencia de usuario (UX)** y la **eficiencia del código**, utilizando exclusivamente JavaScript moderno sin dependencias externas.

### ✨ Características principales

- **💎 CRUD Completo**: Sistema intuitivo para crear, leer, marcar como completadas y eliminar tareas.
- **💾 Persistencia Inteligente**: Los datos se sincronizan automáticamente con `localStorage` para no perder información al cerrar el navegador.
- **🛡️ Seguridad End-to-End**: Implementación de políticas XSS-safe mediante el uso riguroso de `textContent` y la API del DOM, evitando `innerHTML`.
- **✅ Validación Robusta**: Motores de validación con Regex para emails (RFC 5322) y nombres de tareas, incluyendo sanitización automática de entradas.
- **📱 Mobile-First Design**: Interfaz 100% fluida y adaptativa diseñada para ofrecer la mejor experiencia en cualquier dispositivo.
- **⚡ Rendimiento Optimizado**: Uso de delegación de eventos y manipulación eficiente del DOM para una respuesta instantánea.
- **🎨 Estética Premium**: Tipografía Inter, iconos de Phosphor Icons y animaciones sutiles que elevan la calidad visual.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Categoría | Uso |
|---|---|---|
| **HTML5** | Estructura | Marcado semántico y accesibilidad. |
| **CSS3** | Diseño | Custom Properties (Variables), Grid Layout, Flexbox y Animaciones. |
| **JavaScript ES6+** | Lógica | Programación funcional, manipulación de DOM y validación. |
| **Google Fonts** | Tipografía | Inter (400–800) para una legibilidad superior. |
| **Phosphor Icons** | Iconografía | v2.1.1 para una interfaz limpia y moderna. |
| **Web Storage API** | Datos | `localStorage` para persistencia sin base de datos externa. |
| **Web Crypto API** | Seguridad | `crypto.randomUUID()` para la generación segura de identificadores. |

---

## 📂 Despliegue y Uso

### Localmente
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/vicentemrk/Sumativa-2-TaskFlow-.git
   cd Sumativa-2-TaskFlow-
   ```
2. **Abrir en el navegador:**
   Simplemente abre el archivo `index.html` en tu navegador favorito o utiliza una extensión como *Live Server*.

### GitHub Pages
La aplicación está configurada para despliegue automático. Puedes ver la versión en vivo aquí:
👉 **[Ver TaskFlow en Vivo](https://vicentemrk.github.io/Sumativa-2-TaskFlow-/)**

---

## 🤖 Uso de IA Generativa

Este proyecto integra mejores prácticas sugeridas por **IA (Antigravity)**, destacando:

1. **Seguridad Avanzada**: Refactorización de funciones de renderizado para eliminar vulnerabilidades de XSS persistente.
2. **Lógica de Validación**: Creación de expresiones regulares de alta precisión para el filtrado de datos.
3. **Arquitectura Modular**: Organización del código en módulos lógicos (Data, Logic, Render) para máxima mantenibilidad.
4. **Diseño Visual**: Consultoría en teoría del color y espaciado para lograr un look & feel de producto SaaS real.

---

## 👤 Autor

**Vicente** — Desarrollador Full Stack en formación.
- GitHub: [@vicentemrk](https://github.com/vicentemrk)

---

## 📄 Licencia

Este proyecto ha sido desarrollado con fines académicos para la asignatura de Desarrollo Web.
Todos los derechos reservados © 2026.
