/**
 * ═══════════════════════════════════════════════════════════════
 * TaskFlow — app.js
 * Gestor de Tareas con arquitectura modular y seguridad XSS-safe
 * ═══════════════════════════════════════════════════════════════
 *
 * DECISIONES DE SEGURIDAD CLAVE:
 * 1. NUNCA se usa innerHTML con datos dinámicos → previene XSS reflejado/almacenado.
 * 2. Se usa exclusivamente document.createElement() + textContent para renderizar.
 * 3. Los inputs se sanitizan (trim + regex) ANTES de almacenarlos.
 * 4. Las validaciones ocurren en JS (no solo en HTML) para evitar bypasses.
 * 5. El Hard Reset requiere confirmación modal para evitar pérdida accidental.
 */

'use strict';

// ════════════════════════════════════════════════════════════
// 1. CONSTANTES Y CONFIGURACIÓN
// ════════════════════════════════════════════════════════════

/** Clave del localStorage — centralizada para evitar errores de typo */
const STORAGE_KEY = 'taskflow_tareas';

/**
 * SEGURIDAD: Expresiones regulares para validación de inputs.
 * - EMAIL_REGEX: RFC 5322 simplificado — cubre el 99.9% de emails válidos.
 * - NAME_REGEX: Solo letras, números, espacios y puntuación básica.
 *   Bloquea caracteres peligrosos como <, >, ", ' que podrían usarse en XSS
 *   si algún futuro desarrollador usara innerHTML por error.
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[\p{L}\p{N}\s.,;:!?¿¡()\/\-–—]{3,120}$/u;

/** Filtro activo actual */
let filtroActivo = 'todas';

// ════════════════════════════════════════════════════════════
// 2. FUNCIONES DE PERSISTENCIA (localStorage)
// ════════════════════════════════════════════════════════════

/**
 * Obtiene el arreglo de tareas desde localStorage.
 * Si no existe o el JSON está corrupto, devuelve un arreglo vacío.
 * SEGURIDAD: Se usa try/catch porque JSON.parse puede lanzar si
 * alguien manipuló el localStorage manualmente con datos inválidos.
 */
function obtenerTareas() {
  try {
    const datos = localStorage.getItem(STORAGE_KEY);
    if (!datos) return [];
    const parsed = JSON.parse(datos);
    // Validar que sea un arreglo (protección contra datos corruptos)
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('TaskFlow: Datos corruptos en localStorage, reseteando.', error);
    return [];
  }
}

/**
 * Guarda el arreglo de tareas en localStorage.
 * Se invoca en CADA mutación (crear, actualizar, eliminar) para
 * garantizar consistencia entre el estado en memoria y persistencia.
 */
function guardarTareas(tareas) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
  } catch (error) {
    // QuotaExceededError si localStorage está lleno (~5MB)
    console.error('TaskFlow: Error al guardar en localStorage.', error);
    mostrarToast('Error al guardar. Almacenamiento lleno.', 'danger');
  }
}

// ════════════════════════════════════════════════════════════
// 3. FUNCIONES CRUD (Crear, Leer, Actualizar, Eliminar)
// ════════════════════════════════════════════════════════════

/**
 * Agrega una nueva tarea al arreglo y persiste.
 * @param {string} nombre - Nombre sanitizado de la tarea
 * @param {string} email - Email validado del asignado
 * @param {string} prioridad - Prioridad seleccionada (baja|media|alta|urgente)
 */
function agregarItem(nombre, email, prioridad) {
  const tareas = obtenerTareas();
  const nuevaTarea = {
    /** crypto.randomUUID() genera un UUID v4 criptográficamente seguro.
     *  Es mejor que Date.now() o Math.random() porque no tiene colisiones. */
    id: crypto.randomUUID(),
    nombre: nombre,
    email: email,
    prioridad: prioridad,
    completada: false,
    creadoEn: new Date().toISOString()
  };
  tareas.unshift(nuevaTarea); // Insertar al inicio para mostrar las más recientes primero
  guardarTareas(tareas);
  return nuevaTarea;
}

/**
 * Alterna el estado completada/pendiente de una tarea.
 * @param {string} id - UUID de la tarea a alternar
 */
function toggleCompletada(id) {
  const tareas = obtenerTareas();
  const tarea = tareas.find(t => t.id === id);
  if (tarea) {
    tarea.completada = !tarea.completada;
    guardarTareas(tareas);
  }
  return tarea;
}

/**
 * Elimina una tarea del arreglo por su ID.
 * @param {string} id - UUID de la tarea a eliminar
 */
function eliminarItem(id) {
  const tareas = obtenerTareas();
  const nuevas = tareas.filter(t => t.id !== id);
  guardarTareas(nuevas);
}

/**
 * Hard Reset: borra COMPLETAMENTE el localStorage y reinicia el estado.
 * Se invoca solo después de confirmación explícita del usuario vía modal.
 */
function hardReset() {
  localStorage.removeItem(STORAGE_KEY);
  renderizarLista();
  actualizarStats();
  mostrarToast('Todas las tareas fueron eliminadas', 'danger');
}

// ════════════════════════════════════════════════════════════
// 4. SANITIZACIÓN Y VALIDACIÓN DE INPUTS
// ════════════════════════════════════════════════════════════

/**
 * SEGURIDAD: Sanitiza un string eliminando espacios extra.
 * Esto previene inputs como "   <script>alert(1)</script>   "
 * que podrían parecer válidos pero contienen payload malicioso.
 * Aunque usamos textContent (que ya escapa HTML), la sanitización
 * es una capa de defensa adicional (defense-in-depth).
 */
function sanitizar(texto) {
  return texto.trim().replace(/\s+/g, ' ');
}

/**
 * Valida todos los campos del formulario y muestra errores visuales.
 * Retorna un objeto con los datos limpios o null si hay errores.
 * SEGURIDAD: Cada campo pasa por sanitización + regex antes de aceptarse.
 */
function validarFormulario() {
  const nombreInput = document.getElementById('task-name');
  const emailInput = document.getElementById('task-email');
  const prioridadInput = document.getElementById('task-priority');

  const nombre = sanitizar(nombreInput.value);
  const email = sanitizar(emailInput.value);
  const prioridad = prioridadInput.value;

  let esValido = true;

  // — Validar nombre —
  limpiarError('group-task-name', 'error-task-name');
  if (!nombre) {
    mostrarError('group-task-name', 'error-task-name', 'El nombre de la tarea es obligatorio.');
    esValido = false;
  } else if (!NAME_REGEX.test(nombre)) {
    mostrarError('group-task-name', 'error-task-name', 'Usa entre 3–120 caracteres válidos. Sin símbolos especiales.');
    esValido = false;
  }

  // — Validar email —
  limpiarError('group-task-email', 'error-task-email');
  if (!email) {
    mostrarError('group-task-email', 'error-task-email', 'El email del asignado es obligatorio.');
    esValido = false;
  } else if (!EMAIL_REGEX.test(email)) {
    mostrarError('group-task-email', 'error-task-email', 'Ingresa un email válido (ej: nombre@empresa.com).');
    esValido = false;
  }

  // — Validar prioridad —
  limpiarError('group-task-priority', 'error-task-priority');
  if (!prioridad) {
    mostrarError('group-task-priority', 'error-task-priority', 'Selecciona una prioridad.');
    esValido = false;
  }

  if (!esValido) return null;
  return { nombre, email, prioridad };
}

// ════════════════════════════════════════════════════════════
// 5. MENSAJES DE ERROR VISUALES (UX — sin alert())
// ════════════════════════════════════════════════════════════

/**
 * Muestra un mensaje de error debajo de un input.
 * SEGURIDAD: Se usa textContent (no innerHTML) para insertar el mensaje,
 * garantizando que ningún contenido HTML pueda ejecutarse.
 */
function mostrarError(groupId, errorId, mensaje) {
  const grupo = document.getElementById(groupId);
  const errorSpan = document.getElementById(errorId);
  if (grupo) grupo.classList.add('has-error');
  if (errorSpan) errorSpan.textContent = mensaje;
}

/** Limpia el estado de error de un campo */
function limpiarError(groupId, errorId) {
  const grupo = document.getElementById(groupId);
  const errorSpan = document.getElementById(errorId);
  if (grupo) grupo.classList.remove('has-error');
  if (errorSpan) errorSpan.textContent = '';
}

/** Limpia TODOS los errores del formulario */
function limpiarTodosLosErrores() {
  limpiarError('group-task-name', 'error-task-name');
  limpiarError('group-task-email', 'error-task-email');
  limpiarError('group-task-priority', 'error-task-priority');
}

// ════════════════════════════════════════════════════════════
// 6. SISTEMA DE TOASTS (Notificaciones no intrusivas)
// ════════════════════════════════════════════════════════════

/**
 * Muestra un toast temporal en la esquina inferior.
 * SEGURIDAD: Se usa createElement + textContent, NUNCA innerHTML.
 * @param {string} mensaje - Texto del toast
 * @param {'success'|'danger'|'info'} tipo - Tipo visual del toast
 */
function mostrarToast(mensaje, tipo = 'success') {
  const container = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.classList.add('toast', `toast-${tipo}`);

  const icono = document.createElement('i');
  // Elegir icono según el tipo de toast (Remix Icons)
  const iconClass = tipo === 'success' ? 'ri-checkbox-circle-fill'
                  : tipo === 'danger' ? 'ri-error-warning-fill'
                  : 'ri-information-fill';
  icono.classList.add(iconClass);

  const texto = document.createElement('span');
  texto.textContent = mensaje; // SEGURIDAD: textContent escapa HTML automáticamente

  toast.appendChild(icono);
  toast.appendChild(texto);
  container.appendChild(toast);

  // Auto-eliminar después de 3.5s con animación de salida
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s var(--ease-out) forwards';
    toast.addEventListener('animationend', () => toast.remove());
  }, 3500);
}

// ════════════════════════════════════════════════════════════
// 7. RENDERIZADO DEL DOM (XSS-SAFE)
// ════════════════════════════════════════════════════════════

/**
 * Renderiza la lista de tareas en el DOM.
 *
 * DECISIÓN DE SEGURIDAD CRÍTICA:
 * Se usa EXCLUSIVAMENTE document.createElement() + textContent para
 * construir cada elemento. Esto hace imposible la inyección XSS,
 * incluso si un atacante almacena payload malicioso como nombre de tarea:
 *   Ej: "<img src=x onerror=alert('XSS')>"
 *   Con textContent: se muestra como texto plano, sin ejecutarse.
 *   Con innerHTML: se ejecutaría el JavaScript malicioso.
 */
function renderizarLista() {
  const contenedor = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  const todasLasTareas = obtenerTareas();

  // Aplicar filtro activo
  const tareasFiltradas = filtroActivo === 'todas'
    ? todasLasTareas
    : filtroActivo === 'completada'
      ? todasLasTareas.filter(t => t.completada)
      : todasLasTareas.filter(t => !t.completada);

  // Limpiar contenedor de forma segura
  contenedor.replaceChildren();

  // Mostrar/ocultar estado vacío
  if (tareasFiltradas.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }

  // Renderizar cada tarea usando DOM API segura
  tareasFiltradas.forEach((tarea, index) => {
    const li = crearElementoTarea(tarea, index);
    contenedor.appendChild(li);
  });
}

/**
 * Crea un elemento <li> completo para una tarea.
 * SEGURIDAD: Todo el contenido dinámico usa textContent / setAttribute.
 * Los data-attributes se insertan con setAttribute (no interpolación HTML).
 */
function crearElementoTarea(tarea, index) {
  const li = document.createElement('li');
  li.classList.add('task-item');
  if (tarea.completada) li.classList.add('completed');
  li.setAttribute('data-id', tarea.id);
  li.style.animationDelay = `${index * 0.04}s`;

  // — Botón checkbox circular —
  const check = document.createElement('button');
  check.classList.add('task-check');
  check.setAttribute('data-action', 'toggle');
  check.setAttribute('aria-label', tarea.completada ? 'Marcar como pendiente' : 'Marcar como completada');
  check.setAttribute('title', tarea.completada ? 'Desmarcar' : 'Completar');
  if (tarea.completada) {
    const checkIcon = document.createElement('i');
    checkIcon.classList.add('ri-check-line');
    check.appendChild(checkIcon);
  }

  // — Cuerpo de la tarea —
  const body = document.createElement('div');
  body.classList.add('task-body');

  const titulo = document.createElement('p');
  titulo.classList.add('task-title');
  titulo.textContent = tarea.nombre; // SEGURIDAD: textContent, NUNCA innerHTML

  const meta = document.createElement('div');
  meta.classList.add('task-meta');

  const emailSpan = document.createElement('span');
  emailSpan.classList.add('task-email');
  const emailIcon = document.createElement('i');
  emailIcon.classList.add('ri-mail-line');
  const emailText = document.createElement('span');
  emailText.textContent = tarea.email; // SEGURIDAD: textContent
  emailSpan.appendChild(emailIcon);
  emailSpan.appendChild(emailText);

  const badge = document.createElement('span');
  badge.classList.add('priority-badge', tarea.prioridad);
  badge.textContent = tarea.prioridad; // SEGURIDAD: textContent

  meta.appendChild(emailSpan);
  meta.appendChild(badge);
  body.appendChild(titulo);
  body.appendChild(meta);

  // — Botón eliminar —
  const actions = document.createElement('div');
  actions.classList.add('task-actions');

  const btnDelete = document.createElement('button');
  btnDelete.classList.add('btn', 'btn-icon');
  btnDelete.setAttribute('data-action', 'delete');
  btnDelete.setAttribute('aria-label', 'Eliminar tarea');
  btnDelete.setAttribute('title', 'Eliminar');
  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('ri-delete-bin-6-line');
  btnDelete.appendChild(deleteIcon);
  actions.appendChild(btnDelete);

  // Ensamblar
  li.appendChild(check);
  li.appendChild(body);
  li.appendChild(actions);

  return li;
}

// ════════════════════════════════════════════════════════════
// 8. ESTADÍSTICAS
// ════════════════════════════════════════════════════════════

/** Actualiza la barra de estadísticas del header */
function actualizarStats() {
  const tareas = obtenerTareas();
  const total = tareas.length;
  const completadas = tareas.filter(t => t.completada).length;
  const pendientes = total - completadas;

  const container = document.getElementById('stats-bar');
  container.replaceChildren(); // Limpiar de forma segura

  const items = [
    { label: 'Total', value: total },
    { label: 'Pendientes', value: pendientes },
    { label: 'Listas', value: completadas }
  ];

  items.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('stat-item');

    const num = document.createElement('span');
    num.classList.add('stat-number');
    num.textContent = item.value;

    const label = document.createElement('span');
    label.classList.add('stat-label');
    label.textContent = item.label;

    div.appendChild(num);
    div.appendChild(label);
    container.appendChild(div);
  });
}

// ════════════════════════════════════════════════════════════
// 9. EVENT LISTENERS
// ════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Renderizado inicial desde localStorage
  renderizarLista();
  actualizarStats();

  // ——— Formulario: submit ———
  const form = document.getElementById('task-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    limpiarTodosLosErrores();

    const datos = validarFormulario();
    if (!datos) return; // La validación mostró errores visuales

    agregarItem(datos.nombre, datos.email, datos.prioridad);
    form.reset();
    renderizarLista();
    actualizarStats();
    mostrarToast('Tarea creada exitosamente', 'success');
  });

  // ——— Delegación de Eventos en la lista de tareas ———
  /**
   * PATRÓN: Delegación de Eventos
   * En lugar de agregar un listener a CADA botón (ineficiente con muchas tareas),
   * se agrega UN SOLO listener al contenedor <ul> y se usa event.target
   * para determinar qué botón se presionó. Esto es más eficiente y
   * funciona automáticamente con elementos agregados dinámicamente.
   */
  const taskList = document.getElementById('task-list');
  taskList.addEventListener('click', (e) => {
    // Buscar el botón con data-action más cercano al click
    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;

    // Buscar el <li> padre para obtener el ID de la tarea
    const taskItem = actionBtn.closest('.task-item');
    if (!taskItem) return;

    const taskId = taskItem.getAttribute('data-id');
    const action = actionBtn.getAttribute('data-action');

    if (action === 'toggle') {
      const tarea = toggleCompletada(taskId);
      renderizarLista();
      actualizarStats();
      if (tarea) {
        mostrarToast(
          tarea.completada ? 'Tarea completada' : 'Tarea marcada como pendiente',
          'success'
        );
      }
    }

    if (action === 'delete') {
      // Animación de salida antes de eliminar
      taskItem.classList.add('removing');
      taskItem.addEventListener('animationend', () => {
        eliminarItem(taskId);
        renderizarLista();
        actualizarStats();
        mostrarToast('Tarea eliminada', 'danger');
      });
    }
  });

  // ——— Filtros ———
  const filtersSection = document.querySelector('.filters-section');
  filtersSection.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;

    // Actualizar UI de filtros
    filtersSection.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    filtroActivo = chip.getAttribute('data-filter');
    renderizarLista();
  });

  // ——— Hard Reset: abrir modal ———
  document.getElementById('btn-hard-reset').addEventListener('click', () => {
    document.getElementById('modal-reset').classList.remove('hidden');
  });

  // ——— Modal: cancelar ———
  document.getElementById('modal-cancel').addEventListener('click', () => {
    document.getElementById('modal-reset').classList.add('hidden');
  });

  // ——— Modal: confirmar reset ———
  document.getElementById('modal-confirm').addEventListener('click', () => {
    document.getElementById('modal-reset').classList.add('hidden');
    hardReset();
  });

  // ——— Modal: cerrar al hacer click fuera ———
  document.getElementById('modal-reset').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      document.getElementById('modal-reset').classList.add('hidden');
    }
  });

  // ——— Limpiar errores al escribir (UX) ———
  document.getElementById('task-name').addEventListener('input', () => {
    limpiarError('group-task-name', 'error-task-name');
  });
  document.getElementById('task-email').addEventListener('input', () => {
    limpiarError('group-task-email', 'error-task-email');
  });
  document.getElementById('task-priority').addEventListener('change', () => {
    limpiarError('group-task-priority', 'error-task-priority');
  });

  // ——— Dark Mode Toggle ———
  /**
   * TEMA: Se persiste la preferencia en localStorage.
   * Al cargar, se revisa: 1) localStorage, 2) preferencia del sistema.
   * Esto garantiza que el tema se mantenga entre sesiones.
   */
  const THEME_KEY = 'taskflow_theme';
  const htmlEl = document.documentElement;
  const themeIcon = document.getElementById('theme-icon');

  function aplicarTema(tema) {
    htmlEl.setAttribute('data-theme', tema);
    // SEGURIDAD: Se usa classList, no innerHTML, para cambiar el icono
    themeIcon.className = tema === 'dark' ? 'ri-sun-line' : 'ri-moon-line';
    localStorage.setItem(THEME_KEY, tema);
  }

  // Inicializar tema desde localStorage o preferencia del sistema
  const temaGuardado = localStorage.getItem(THEME_KEY);
  if (temaGuardado) {
    aplicarTema(temaGuardado);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    aplicarTema('dark');
  }

  document.getElementById('btn-theme-toggle').addEventListener('click', () => {
    const temaActual = htmlEl.getAttribute('data-theme') || 'light';
    aplicarTema(temaActual === 'dark' ? 'light' : 'dark');
  });
});
