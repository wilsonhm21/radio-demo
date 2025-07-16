document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'marketing') {
        window.location.href = 'index.html';
        return;
    }

    // Configurar eventos principales
    document.getElementById('logout').addEventListener('click', handleLogout);
    
    document.querySelector('.btn-browse').addEventListener('click', () => {
        document.getElementById('audioFile').click();
    });
    
    document.getElementById('audioFile').addEventListener('change', handleAudioUpload);

    document.getElementById('basicPublicidadForm').addEventListener('submit', handleBasicSubmit);
    document.getElementById('fullPautaForm').addEventListener('submit', handlePautaSubmit);
    document.getElementById('addSchedule').addEventListener('click', addScheduleTime);
    
    // NUEVO: Listener para el botón de agregar horario en el formulario de Publicidad
    document.getElementById('addPublicidadSchedule').addEventListener('click', () => addPublicidadScheduleTime());

    document.getElementById('searchInput').addEventListener('input', filterPublicidades);
    document.getElementById('filterProgram').addEventListener('change', filterPublicidades);
    
    // Configurar pestañas
    setupTabs();

    // Inicializar formulario de pauta
    initPautaForm();
    
    // --- CORRECCIÓN CLAVE AQUÍ: Asegurarse de que haya al menos UN campo de horario vacío en publicidad al cargar ---
    // Solo si no hay ninguno, para evitar duplicados iniciales.
    const publicidadScheduleContainer = document.getElementById('publicidadScheduleContainer');
    if (publicidadScheduleContainer.children.length === 0) {
        addPublicidadScheduleTime(); 
    }

    // --- NUEVO: Configurar interconexión de formularios ---
    setupPautaToPublicidadLink();

    // Cargar datos iniciales
    loadPublicidades();
});

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/* ===== FUNCIONES PRINCIPALES ===== */

function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function handleAudioUpload(e) {
    const file = e.target.files[0];
    const fileName = document.getElementById('fileName');
    const audioPreview = document.getElementById('audioPreview');

    if (file) {
        fileName.textContent = file.name;
        audioPreview.style.display = 'block';
        audioPreview.src = URL.createObjectURL(file);
    } else {
        fileName.textContent = 'Ningún archivo seleccionado';
        audioPreview.src = '';
        audioPreview.style.display = 'none';
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/* ===== SISTEMA DE PESTAÑAS ===== */

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos los botones y contenidos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Agregar active al botón clickeado
            btn.classList.add('active');
            
            // Mostrar el contenido correspondiente
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(`${tabId}-form`).classList.add('active');
        });
    });
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/* ===== FORMULARIO BÁSICO (PUBLICIDAD) ===== */

// Función para agregar un campo de horario y programa al formulario de publicidad
function addPublicidadScheduleTime(initialTime = '', initialProgram = '') {
    const container = document.getElementById('publicidadScheduleContainer');
    const scheduleItem = document.createElement('div');
    scheduleItem.className = 'schedule-item'; // Clase para estilos, si tienes
    scheduleItem.innerHTML = `
        <input type="time" class="publicidad-schedule-time" value="${initialTime}" required>
        <select class="publicidad-schedule-program" required>
            <option value="Matutino" ${initialProgram === 'Matutino' ? 'selected' : ''}>Matutino</option>
            <option value="Tarde" ${initialProgram === 'Tarde' ? 'selected' : ''}>Tarde</option>
            <option value="Noche" ${initialProgram === 'Noche' ? 'selected' : ''}>Noche</option>
        </select>
        <button type="button" class="btn-remove-schedule">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(scheduleItem);

    // Event listener para eliminar el horario
    scheduleItem.querySelector('.btn-remove-schedule').addEventListener('click', () => {
        container.removeChild(scheduleItem);
        // CORRECCIÓN: Si eliminas el último horario, solo añade uno nuevo si el contenedor queda vacío.
        if (container.children.length === 0) {
            addPublicidadScheduleTime(); // Añade un campo vacío si se eliminó el último
        }
    });
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function handleBasicSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const audioFile = document.getElementById('audioFile').files[0];

    if (!audioFile) {
        showNotification('Debes seleccionar un archivo de audio', 'error');
        return;
    }

    // NUEVO: Recopilar todos los horarios y programas del formulario de publicidad
    // *** CORRECCIÓN CLAVE: FILTRAR HORARIOS VACÍOS ***
    const publicitySchedules = Array.from(document.querySelectorAll('#publicidadScheduleContainer .schedule-item'))
        .map(item => {
            return {
                time: item.querySelector('.publicidad-schedule-time').value,
                program: item.querySelector('.publicidad-schedule-program').value
            };
        })
        .filter(schedule => schedule.time !== ''); // Filtrar cualquier horario donde el campo de tiempo esté vacío

    if (publicitySchedules.length === 0) {
        showNotification('Debes agregar al menos un horario válido para la publicidad', 'error');
        return;
    }

    const newPublicidad = {
        id: Date.now(),
        type: 'publicidad',
        clientName: form.clientName.value,
        horarios: publicitySchedules, // Esto ahora contendrá solo horarios válidos
        announcementText: form.announcementText.value,
        audio: audioFile.name,
        status: 'pending',
        invoiceNumber: `PUB-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString()
    };

    savePublicidad(newPublicidad);
    form.reset();
    document.getElementById('fileName').textContent = 'Ningún archivo seleccionado';
    document.getElementById('audioPreview').style.display = 'none';
    document.getElementById('audioPreview').src = '';
    
    // Limpiar y añadir un horario vacío por defecto después de guardar
    document.getElementById('publicidadScheduleContainer').innerHTML = ''; 
    addPublicidadScheduleTime(); // Añade un campo vacío para el siguiente registro
    
    showNotification('Publicidad creada exitosamente', 'success');
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/* ===== HOJA DE PAUTA ===== */

function initPautaForm() {
    // Generar número de pauta
    const today = new Date();
    const pautaNumber = `00405-${today.getFullYear()}`;
    document.getElementById('pautaNumber').value = pautaNumber;
    
    // Establecer fecha actual
    document.getElementById('pautaDate').valueAsDate = today;
    
    // Agregar 3 horarios por defecto
    const scheduleContainer = document.getElementById('scheduleContainer');
    // CORRECCIÓN: Solo añadir horarios si el contenedor está vacío.
    if (scheduleContainer.children.length === 0) {
        for (let i = 0; i < 3; i++) {
            addScheduleTime();
        }
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function addScheduleTime() {
    const container = document.getElementById('scheduleContainer');
    const scheduleItem = document.createElement('div');
    scheduleItem.className = 'schedule-item';
    scheduleItem.innerHTML = `
        <input type="time" class="schedule-time" required>
        <input type="text" class="schedule-program" placeholder="Programa (ej. Matutino)" required>
        <button type="button" class="btn-remove-schedule">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(scheduleItem);
    
    // Agregar evento para eliminar horario
    scheduleItem.querySelector('.btn-remove-schedule').addEventListener('click', () => {
        container.removeChild(scheduleItem);
        // CORRECCIÓN: Si eliminas el último horario, solo añade uno nuevo si el contenedor queda vacío.
        if (container.children.length === 0) {
            addScheduleTime(); // Añade un campo vacío si se eliminó el último
        }
    });
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function handlePautaSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    // Obtener los horarios y programas de los campos dinámicos
    // *** CORRECCIÓN CLAVE: FILTRAR HORARIOS VACÍOS ***
    const scheduleEntries = Array.from(document.querySelectorAll('#scheduleContainer .schedule-item'))
        .map(item => {
            return {
                time: item.querySelector('.schedule-time').value,
                program: item.querySelector('.schedule-program').value
            };
        })
        .filter(schedule => schedule.time !== '' && schedule.program !== ''); // Filtrar por tiempo Y programa

    if (scheduleEntries.length === 0) {
        showNotification('Debes agregar al menos un horario válido para la pauta', 'error');
        return;
    }

    const pautaData = {
        id: Date.now(),
        type: 'pauta', 
        pautaNumber: form.pautaNumber.value,
        fechaEmision: form.pautaDate.value,
        cliente: form.pautaClient.value,
        ruc: form.pautaRuc.value,
        producto: form.pautaProduct.value,
        motivo: form.pautaReason.value,
        periodo: form.pautaPeriod.value,
        idioma: form.pautaLanguage.value,
        duracion: form.pautaDuration.value,
        cantidadSpots: form.pautaSpots.value,
        tipoHorarios: form.pautaScheduleType.value,
        horarios: scheduleEntries, // Ahora guarda objetos {time, program} válidos
        costo: form.pautaCost.value,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    // Guardar en localStorage
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    announcements.push(pautaData);
    localStorage.setItem('announcements', JSON.stringify(announcements));

    // Generar Excel
    generatePautaExcel(pautaData);
    
    showNotification('Hoja de pauta generada exitosamente', 'success');
    form.reset(); // Resetear el formulario después de enviar
    // Limpiar y reiniciar los horarios de pauta
    document.getElementById('scheduleContainer').innerHTML = '';
    initPautaForm(); // Re-inicializar para tener 3 campos de horarios por defecto
    loadPublicidades(); // Recargar la tabla
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function generatePautaExcel(pautaData) {
    const wb = XLSX.utils.book_new();
    
    const wsData = [
        ["HOJA DE PAUTA", "", "", "", "", pautaData.pautaNumber],
        ["640 A.M. / 95.7 F.M.", "", "", "", "", ""],
        ["E-MAIL: nmaguera@radioondasztil.com", "", "", "", "", ""],
        ["FECHA DE EMISIÓN:", "", "", "", "", pautaData.fechaEmision],
        ["SEÑORES:", pautaData.cliente, "", "RUC:", pautaData.ruc, ""],
        ["CIUDAD:", "PUNO - PERU", "", "", "", ""],
        [],
        ["RADIO:", "ONDA AZUL ASOCIACION CIVIL", "", "ORDEN N°", pautaData.pautaNumber, ""],
        ["UBICACIÓN:", "PUNO/PUNO/PUNO", "", "TOTAL DE AVISOS:", pautaData.cantidadSpots, ""],
        ["CLIENTE:", pautaData.cliente, "", "HORARIOS:", pautaData.tipoHorarios, ""],
        ["PRODUCTO:", pautaData.producto, "", "IDIOMA:", pautaData.idioma, ""],
        ["MOTIVO:", pautaData.motivo, "", "SEGUNDOS:", pautaData.duracion + '"', ""],
        ["PERIODO:", pautaData.periodo, "", "CANTIDAD DE SPOT:", pautaData.cantidadSpots, ""],
        ["", "", "", "COSTO CON IGV:", pautaData.costo, ""],
        [],
        ["HORARIOS PROGRAMADOS"],
        ["HORA", "PROGRAMA"]
    ];
    
    pautaData.horarios.forEach(entry => {
        wsData.push([entry.time, entry.program]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Pauta Publicitaria");
    
    XLSX.writeFile(wb, `Pauta_${pautaData.cliente}_${pautaData.fechaEmision}.xlsx`);
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/* ===== GESTIÓN DE PUBLICIDADES ===== */

function savePublicidad(publicidad) {
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    // Actualizar si existe, o añadir si es nueva
    const existingIndex = announcements.findIndex(item => item.id === publicidad.id);
    if (existingIndex > -1) {
        announcements[existingIndex] = publicidad;
    } else {
        announcements.push(publicidad);
    }
    localStorage.setItem('announcements', JSON.stringify(announcements));
    loadPublicidades();
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function loadPublicidades() {
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const tbody = document.querySelector('#publicidadTable tbody');
    tbody.innerHTML = '';

    // Filtrar tanto 'publicidad' como 'pauta' si quieres ver ambos tipos en esta tabla.
    // O mantener solo 'publicidad' si esta tabla es específica para ellas.
    // Para ver solo publicidades:
    const publicidades = announcements.filter(item => item.type === 'publicidad');
    // Para ver ambos tipos (pauta y publicidad):
    // const publicidades = announcements.filter(item => item.type === 'publicidad' || item.type === 'pauta');


    publicidades.forEach(pub => {
        const row = document.createElement('tr');
        
        let clientDisplayName = pub.clientName ?? 'Desconocido';
        let announcementDisplayText = pub.announcementText ?? 'Sin texto de anuncio';

        // Si es una pauta, ajusta la información que se muestra
        if (pub.type === 'pauta') {
            clientDisplayName = pub.cliente ?? 'Desconocido';
            announcementDisplayText = `Pauta: "${pub.producto ?? 'N/A'}" (${pub.duracion ?? 'N/A'} seg) - ${pub.motivo ?? 'N/A'}`;
        }

        // Concatenar todos los horarios en una cadena para mostrar en la tabla
        const horariosTexto = pub.horarios && pub.horarios.length > 0 
                                 ? pub.horarios.map(h => `${h.time} (${h.program ?? 'N/A'})`).join(', ')
                                 : 'No especificado';
        
        row.innerHTML = `
            <td>${clientDisplayName}</td>
            <td>${horariosTexto}</td>
            <td>${announcementDisplayText}</td> 
            <td><span class="status status-${pub.status}">${pub.status}</span></td>
            <td>
                <button class="action-btn" onclick="editPublicidad(${pub.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" onclick="deletePublicidad(${pub.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function filterPublicidades() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const programFilter = document.getElementById('filterProgram').value.toLowerCase(); // Convertir a minúsculas
    const rows = document.querySelectorAll('#publicidadTable tbody tr');
    
    rows.forEach(row => {
        const clientName = row.cells[0].textContent.toLowerCase();
        const horariosText = row.cells[1].textContent.toLowerCase(); 
        
        const matchesSearch = clientName.includes(searchTerm);
        const matchesProgram = programFilter === '' || horariosText.includes(`(${programFilter})`); // Buscar el programa entre paréntesis
        
        row.style.display = matchesSearch && matchesProgram ? '' : 'none';
    });
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/* ===== FUNCIONES DE INTERFAZ ===== */

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function editPublicidad(id) {
    const announcements = JSON.parse(localStorage.getItem('announcements'));
    const publicidad = announcements.find(item => item.id === id);
    
    if (!publicidad) return;
    
    // Cambiar a pestaña de publicidad
    document.querySelector('.tab-btn[data-tab="publicidad"]').click();
    
    // Llenar formulario
    const form = document.getElementById('basicPublicidadForm');
    form.clientName.value = publicidad.clientName;
    form.announcementText.value = publicidad.announcementText;
    
    // Limpiar horarios existentes en el formulario de publicidad antes de cargar los de la publicidad
    const publicidadScheduleContainer = document.getElementById('publicidadScheduleContainer');
    publicidadScheduleContainer.innerHTML = '';

    // Cargar todos los horarios de la publicidad
    if (publicidad.horarios && publicidad.horarios.length > 0) {
        publicidad.horarios.forEach(h => {
            addPublicidadScheduleTime(h.time, h.program);
        });
    } else {
        // CORRECCIÓN: Si no hay horarios, añadir uno vacío por defecto
        addPublicidadScheduleTime(); 
    }
    
    // Manejar el archivo de audio
    const fileNameElement = document.getElementById('fileName');
    const audioPreviewElement = document.getElementById('audioPreview');

    if (publicidad.audio) {
        fileNameElement.textContent = publicidad.audio;
        // No podemos cargar el audio real desde el nombre del archivo, solo mostrar su nombre
        // audioPreviewElement.src = `ruta/a/tus/audios/${publicidad.audio}`; // Si tienes una ruta conocida
        audioPreviewElement.style.display = 'none'; // No se puede previsualizar si no está el path real
    } else {
        fileNameElement.textContent = 'Ningún archivo seleccionado';
        audioPreviewElement.src = '';
        audioPreviewElement.style.display = 'none';
    }
    
    showNotification('Edita la publicidad y guarda los cambios', 'info');
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function deletePublicidad(id) {
    if (confirm('¿Estás seguro de eliminar esta publicidad?')) {
        let announcements = JSON.parse(localStorage.getItem('announcements'));
        announcements = announcements.filter(item => item.id !== id);
        localStorage.setItem('announcements', JSON.stringify(announcements));
        showNotification('Publicidad eliminada', 'success');
        loadPublicidades();
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/* ===== FUNCIONES GLOBALES ===== */
// Hacer funciones disponibles globalmente para eventos en línea (como en los botones de tabla)
window.editPublicidad = editPublicidad;
window.deletePublicidad = deletePublicidad;

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// --- NUEVA FUNCIÓN PARA INTERCONEXIÓN ---
function setupPautaToPublicidadLink() {
    const pautaClientInput = document.getElementById('pautaClient');
    const pautaProductInput = document.getElementById('pautaProduct');
    const pautaDurationInput = document.getElementById('pautaDuration');
    const pautaScheduleTypeSelect = document.getElementById('pautaScheduleType');
    const pautaLanguageSelect = document.getElementById('pautaLanguage');

    const clientNameInput = document.getElementById('clientName');
    const announcementTextInput = document.getElementById('announcementText');
    const publicidadScheduleContainer = document.getElementById('publicidadScheduleContainer'); // Referencia al nuevo contenedor

    // Escuchar cambios en los campos relevantes del formulario de Pauta
    pautaClientInput.addEventListener('input', updatePublicidadForm);
    pautaProductInput.addEventListener('input', updatePublicidadForm);
    pautaDurationInput.addEventListener('input', updatePublicidadForm);
    pautaScheduleTypeSelect.addEventListener('change', updatePublicidadForm);
    pautaLanguageSelect.addEventListener('change', updatePublicidadForm);

    // Observar adiciones/remociones de horarios en la Pauta para actualizar Publicidad
    const scheduleContainer = document.getElementById('scheduleContainer');
    const config = { childList: true, subtree: true }; 
    const observer = new MutationObserver(updatePublicidadForm);
    observer.observe(scheduleContainer, config);

    function updatePublicidadForm() {
        // Copiar 'Señores' de Pauta a 'Cliente' de Publicidad
        clientNameInput.value = pautaClientInput.value;

        // Sugerencia para el mensaje de publicidad
        const product = pautaProductInput.value;
        const duration = pautaDurationInput.value;
        const lang = pautaLanguageSelect.value;
        const type = pautaScheduleTypeSelect.value;
        
        let message = `Publicidad para "${product}" (${duration} seg)`;
        if (lang && lang !== 'CASTELLANO') {
            message += ` en ${lang}`;
        }
        if (type && type !== 'ROTATIVOS') {
            message += ` - Horario ${type}`;
        }
        announcementTextInput.value = message;

        // NUEVA LÓGICA PARA MÚLTIPLES HORARIOS DE PUBLICIDAD
        // 1. Limpiar horarios existentes en el formulario de publicidad
        publicidadScheduleContainer.innerHTML = ''; 

        // 2. Obtener todos los horarios y programas de la Pauta
        const pautaScheduleItems = Array.from(document.querySelectorAll('#scheduleContainer .schedule-item'));
        
        if (pautaScheduleItems.length > 0) {
            pautaScheduleItems.forEach(item => {
                const time = item.querySelector('.schedule-time').value;
                const program = item.querySelector('.schedule-program').value;
                // Usar la nueva función para añadir cada horario al formulario de publicidad
                addPublicidadScheduleTime(time, program); 
            });
        } else {
            // Si no hay horarios en la pauta, añade uno vacío por defecto a la publicidad
            addPublicidadScheduleTime(); 
        }
    }
    // Ejecutar una vez al inicio para reflejar cualquier valor inicial
    updatePublicidadForm();
}