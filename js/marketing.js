document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'marketing') {
        window.location.href = 'index.html';
        return;
    }

    // Configurar eventos principales
    document.getElementById('logout').addEventListener('click', handleLogout);
    document.getElementById('audioFile').addEventListener('change', handleAudioUpload);
    document.getElementById('basicPublicidadForm').addEventListener('submit', handleBasicSubmit);
    document.getElementById('fullPautaForm').addEventListener('submit', handlePautaSubmit);
    document.getElementById('addSchedule').addEventListener('click', addScheduleTime);
    document.getElementById('searchInput').addEventListener('input', filterPublicidades);
    document.getElementById('filterProgram').addEventListener('change', filterPublicidades);
    
    // Configurar pestañas
    setupTabs();

    // Inicializar formulario de pauta
    initPautaForm();

    // Cargar datos iniciales
    loadPublicidades();
});

/* ===== FUNCIONES PRINCIPALES ===== */

function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function handleAudioUpload(e) {
    const file = e.target.files[0];
    const fileName = document.getElementById('fileName');
    const audioPreview = document.getElementById('audioPreview');

    if (file) {
        fileName.textContent = file.name;
        audioPreview.style.display = 'block';
        audioPreview.src = URL.createObjectURL(file);
    } else {
        fileName.textContent = 'No se ha seleccionado ningún archivo';
        audioPreview.style.display = 'none';
    }
}

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

/* ===== FORMULARIO BÁSICO ===== */

function handleBasicSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const audioFile = document.getElementById('audioFile').files[0];

    if (!audioFile) {
        showNotification('Debes seleccionar un archivo de audio', 'error');
        return;
    }

    const newPublicidad = {
        id: Date.now(),
        type: 'publicidad',
        clientName: form.clientName.value,
        program: form.program.value,
        scheduleTime: form.scheduleTime.value,
        announcementText: form.announcementText.value,
        audio: audioFile.name,
        status: 'pending',
        invoiceNumber: `PUB-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString()
    };

    savePublicidad(newPublicidad);
    form.reset();
    document.getElementById('fileName').textContent = 'No se ha seleccionado ningún archivo';
    document.getElementById('audioPreview').style.display = 'none';
    showNotification('Publicidad creada exitosamente', 'success');
}

/* ===== HOJA DE PAUTA ===== */

function initPautaForm() {
    // Generar número de pauta
    const today = new Date();
    const pautaNumber = `00405-${today.getFullYear()}`;
    document.getElementById('pautaNumber').value = pautaNumber;
    
    // Establecer fecha actual
    document.getElementById('pautaDate').valueAsDate = today;
    
    // Agregar 3 horarios por defecto
    for (let i = 0; i < 3; i++) {
        addScheduleTime();
    }
}

function addScheduleTime() {
    const container = document.getElementById('scheduleContainer');
    const scheduleItem = document.createElement('div');
    scheduleItem.className = 'schedule-item';
    scheduleItem.innerHTML = `
        <input type="time" class="schedule-time" required>
        <button type="button" class="btn-remove-schedule">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(scheduleItem);
    
    // Agregar evento para eliminar horario
    scheduleItem.querySelector('.btn-remove-schedule').addEventListener('click', () => {
        container.removeChild(scheduleItem);
    });
}

function handlePautaSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const scheduleTimes = Array.from(document.querySelectorAll('.schedule-time')).map(input => input.value);
    
    if (scheduleTimes.length === 0) {
        showNotification('Debes agregar al menos un horario', 'error');
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
        horarios: scheduleTimes,
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
    loadPublicidades();
}

function generatePautaExcel(pautaData) {
    // Crear libro de Excel
    const wb = XLSX.utils.book_new();
    
    // Datos para la hoja de cálculo
    const wsData = [
        ["HOJA DE PAUTA", "", "", "", "", pautaData.pautaNumber],
        ["640 A.M. / 95.7 F.M.", "", "", "", "", ""],
        ["E-MAIL: nmaguera@radioondasztil.com", "", "", "", "", ""],
        ["FECHA DE EMISIÓN:", "", "", "", "", pautaData.fechaEmision],
        ["SEÑORES:", pautaData.cliente, "", "RUC:", pautaData.ruc, ""],
        ["CIUDAD:", "PUNO - PERU", "", "", "", ""],
        [],
        ["RADIO:", "ONDA AZUL ASOCIACION CIVIL", "", "ORDEN N°", pautaData.pautaNumber, ""],
        ["UBICACIÓN:", "PUNO/PUNO/PUNO", "", "TOTAL DE AVISOS:", "0", ""],
        ["CLIENTE:", pautaData.cliente, "", "HORARIOS:", pautaData.tipoHorarios, ""],
        ["PRODUCTO:", pautaData.producto, "", "IDIOMA:", pautaData.idioma, ""],
        ["MOTIVO:", pautaData.motivo, "", "SEGUNDOS:", pautaData.duracion + '"', ""],
        ["PERIODO:", pautaData.periodo, "", "CANTIDAD DE SPOT:", pautaData.cantidadSpots, ""],
        ["", "", "", "COSTO CON IGV:", pautaData.costo, ""],
        [],
        ["HORARIOS PROGRAMADOS"],
        ...pautaData.horarios.map(horario => [horario])
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Pauta Publicitaria");
    
    // Descargar el archivo
    XLSX.writeFile(wb, `Pauta_${pautaData.pautaNumber}.xlsx`);
}

/* ===== GESTIÓN DE PUBLICIDADES ===== */

function savePublicidad(publicidad) {
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    announcements.push(publicidad);
    localStorage.setItem('announcements', JSON.stringify(announcements));
    loadPublicidades();
}

function loadPublicidades() {
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const tbody = document.querySelector('#publicidadTable tbody');
    tbody.innerHTML = '';

    // Filtrar solo publicidades (no pautas completas)
    const publicidades = announcements.filter(item => item.type === 'publicidad');

    publicidades.forEach(pub => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pub.clientName}</td>
            <td>${pub.program}</td>
            <td>${pub.scheduleTime}</td>
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

function filterPublicidades() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const programFilter = document.getElementById('filterProgram').value;
    const rows = document.querySelectorAll('#publicidadTable tbody tr');
    
    rows.forEach(row => {
        const clientName = row.cells[0].textContent.toLowerCase();
        const program = row.cells[1].textContent;
        
        const matchesSearch = clientName.includes(searchTerm);
        const matchesProgram = programFilter === '' || program === programFilter;
        
        row.style.display = matchesSearch && matchesProgram ? '' : 'none';
    });
}

/* ===== FUNCIONES DE INTERFAZ ===== */

function showNotification(message, type) {
    // Implementación básica - puedes reemplazar con Toastify o similar
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function editPublicidad(id) {
    const announcements = JSON.parse(localStorage.getItem('announcements'));
    const publicidad = announcements.find(item => item.id === id);
    
    if (!publicidad) return;
    
    // Cambiar a pestaña de publicidad
    document.querySelector('.tab-btn[data-tab="publicidad"]').click();
    
    // Llenar formulario
    const form = document.getElementById('basicPublicidadForm');
    form.clientName.value = publicidad.clientName;
    form.program.value = publicidad.program;
    form.scheduleTime.value = publicidad.scheduleTime;
    form.announcementText.value = publicidad.announcementText;
    
    // Mostrar nombre de archivo (no se puede pre-cargar el archivo por seguridad)
    document.getElementById('fileName').textContent = publicidad.audio || 'No se ha seleccionado ningún archivo';
    
    // Eliminar el registro antiguo
    const updatedAnnouncements = announcements.filter(item => item.id !== id);
    localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
    
    showNotification('Edita la publicidad y guarda los cambios', 'info');
}

function deletePublicidad(id) {
    if (confirm('¿Estás seguro de eliminar esta publicidad?')) {
        let announcements = JSON.parse(localStorage.getItem('announcements'));
        announcements = announcements.filter(item => item.id !== id);
        localStorage.setItem('announcements', JSON.stringify(announcements));
        showNotification('Publicidad eliminada', 'success');
        loadPublicidades();
    }
}

/* ===== FUNCIONES GLOBALES ===== */
// Hacer funciones disponibles globalmente para eventos en línea
window.editPublicidad = editPublicidad;
window.deletePublicidad = deletePublicidad;