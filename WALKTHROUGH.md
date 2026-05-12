# TaskFlow — Walkthrough del Código

Guía para entender el proyecto de inicio a fin. Orden: qué hace cada archivo → cómo fluye una acción del usuario → por qué se tomó cada decisión.

---

## 1. Archivos del proyecto

| Archivo | Qué hace |
|---------|----------|
| `index.html` | Estructura de la página. Define todos los elementos del DOM (formularios, lista, modales, header). No tiene lógica. |
| `styles.css` | Todo el diseño visual: colores, tipografía, animaciones, dark mode. No tiene lógica. |
| `app.js` | **Toda la lógica**. Dividido en 4 módulos. |
| `app.test.js` | 13 tests de comportamiento para verificar que `Validator` y `Query` funcionan correctamente. Se ejecutan en la consola del browser. |

---

## 2. Los 4 módulos de `app.js`

El código usa el patrón **IIFE** (función que se ejecuta sola) para crear módulos — igual que `import/export` en proyectos modernos, pero sin herramientas externas.

### 🗄️ Store — "La base de datos"
**Qué hace:** guarda y lee las tareas en `localStorage` del browser.

```
Store.obtener()              → lee tareas del localStorage
Store.agregar({ datos })     → crea tarea nueva con ID único
Store.editar(id, { datos })  → modifica tarea existente
Store.toggle(id)             → marca como completada/pendiente
Store.eliminar(id)           → borra por ID
Store.resetear()             → borra todo
```

**Por qué separado:** si mañana cambiamos localStorage por una API real, solo tocamos `Store`. El resto del código no cambia.

---

### 🔍 Query — "El buscador y filtro"
**Qué hace:** filtra, busca y ordena un array de tareas. Es una **función pura** — recibe datos, devuelve datos, no toca el DOM.

```
Query.setFiltro('completada')   → solo muestra completadas
Query.setBusqueda('diseño')     → filtra por nombre/email
Query.setOrden('prioridad')     → ordena urgente → alta → media → baja
Query.aplicar(tareas)           → devuelve el array procesado
```

**Por qué separado:** se puede testear sin browser. `Query.aplicar([...])` funciona en cualquier entorno JS.

---

### ✅ Validator — "El validador de formularios"
**Qué hace:** recibe los datos del formulario y devuelve si son válidos o qué error tiene cada campo.

```
Validator.validar({ nombre, email, prioridad, fechaLimite })
  → { ok: true,  datos: { nombre: "limpio", email: "...", ... } }
  → { ok: false, errores: { email: "Email inválido", ... } }
```

**Reglas que aplica:**
- Nombre: entre 3 y 120 caracteres, sin símbolos raros
- Email: formato válido (Regex RFC 5322)
- Prioridad: no puede estar vacía
- Fecha: no puede ser anterior a hoy

**Por qué separado:** no sabe nada del DOM → se testea en aislamiento → los tests en `app.test.js` lo prueban directamente.

---

### 🎨 UI — "El que muestra todo"
**Qué hace:** controla todo lo visual. Consume `Store`, `Query` y `Validator`. No tiene lógica de negocio propia.

```
UI.refrescar()                  → re-renderiza lista + stats
UI.toast("mensaje", "success")  → muestra notificación flotante
UI.mostrarErrores(errores, modo)→ pinta errores en formulario
UI.abrirModalEdicion(id)        → abre modal con datos de tarea
UI.cerrarModalEdicion()         → cierra modal
UI.exportarJSON()               → descarga tareas como archivo .json
UI.crearFocusTrap(modal, fn)    → encierra el Tab dentro del modal
```

---

## 3. Flujo completo — "El usuario crea una tarea"

```
Usuario completa el formulario → clic en "Agregar tarea"
  │
  ├─ 1. DOMContentLoaded captura el submit del #task-form
  ├─ 2. Lee los valores del DOM (nombre, email, prioridad, fecha)
  ├─ 3. Validator.validar({ nombre, email, prioridad, fechaLimite })
  │       ├─ Si errores → UI.mostrarErrores() → para aquí
  │       └─ Si ok → continúa con datos saneados (trim aplicado)
  ├─ 4. Store.agregar(datos) → genera ID con crypto.randomUUID() → guarda en localStorage
  ├─ 5. UI.refrescar() → renderizarLista() + actualizarStats()
  └─ 6. UI.toast("Tarea creada exitosamente", "success")
```

---

## 4. Flujo completo — "El usuario edita una tarea"

```
Clic en ✏️ (botón editar)
  │
  ├─ 1. Delegación de eventos en #task-list detecta data-action="edit"
  ├─ 2. UI.abrirModalEdicion(id) → carga datos de la tarea en el modal
  ├─ 3. Usuario modifica campos → clic en "Guardar cambios"
  ├─ 4. Validator.validar() → si ok → Store.editar(id, datos)
  ├─ 5. UI.cerrarModalEdicion()
  └─ 6. UI.refrescar() + UI.toast("Tarea actualizada")
```

---

## 5. Decisiones técnicas clave

### ¿Por qué no `innerHTML`?
`innerHTML` permite inyección XSS — si alguien pone `<script>` en el nombre de la tarea, se ejecuta. Usamos `textContent` y la API del DOM → el texto siempre es texto, nunca código.

### ¿Por qué IIFE en vez de funciones globales?
Las variables de `Store` (ej: la clave de localStorage) no son accesibles desde afuera — solo la API pública. Con funciones globales, cualquier parte del código podría romper el estado.

### ¿Por qué delegación de eventos en la lista?
Un solo listener en `#task-list` maneja toggle/edit/delete para todas las tareas. Si tuviéramos un listener por tarea, crear 100 tareas = 300 listeners en memoria.

### ¿Por qué `crypto.randomUUID()`?
Genera IDs únicos seguros (UUID v4) usando entropía del sistema operativo. `Math.random()` es predecible — dos tabs abiertos podrían generar el mismo ID.

### ¿Por qué focus trap en los modales?
Accesibilidad: usuarios con teclado o lectores de pantalla no deben poder "escapar" del modal con Tab. El foco debe ciclar dentro hasta que se cierre.

---

## 6. Cómo ejecutar los tests

```
1. Abrir index.html en Chrome/Firefox
2. F12 → pestaña "Consola"
3. Copiar todo el contenido de app.test.js
4. Pegar en la consola → Enter
```

Resultado esperado:
```
── Validator
  ✔ PASS email vacío → error email
  ✔ PASS email inválido (sin @) → error email
  ✔ PASS email con subdominio válido → sin error email
  ✔ PASS nombre vacío → error nombre
  ✔ PASS nombre muy corto (2 chars) → error nombre
  ✔ PASS fecha límite anterior a hoy → error fechaLimite
  ✔ PASS prioridad vacía → error prioridad
  ✔ PASS datos válidos → ok:true con datos saneados

── Query
  ✔ PASS filtro "completada" devuelve solo completadas
  ✔ PASS filtro "pendiente" devuelve solo pendientes
  ✔ PASS búsqueda "gamma" (minúsculas) encuentra "Gamma"
  ✔ PASS orden "prioridad" → urgente > alta > baja
  ✔ PASS orden "fecha" → más próxima primero

TaskFlow Tests — ✔ Todos los tests pasaron (13/13)
```

---

## 7. Resumen en una frase por módulo

| Módulo | Una frase |
|--------|-----------|
| **Store** | Guarda y recupera tareas de localStorage |
| **Query** | Filtra, busca y ordena sin tocar el DOM |
| **Validator** | Valida datos del formulario y devuelve errores o datos limpios |
| **UI** | Dibuja todo en pantalla consumiendo los otros 3 módulos |
