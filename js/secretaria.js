document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'secretaria') {
        window.location.href = 'index.html';
        return;
    }

    // Cargar programación de radio
    const programacionRadio = JSON.parse(localStorage.getItem('programacionRadio')) || [];
    
    // Configurar eventos
    document.getElementById('logout').addEventListener('click', handleLogout);
    document.getElementById('comunicadoForm').addEventListener('submit', handleSubmit);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Inicializar filtro de programas
    initProgramFilter(programacionRadio);
    
    // Cargar comunicados al iniciar
    loadComunicados();
});

// Inicializar filtro de programas con datos reales
function initProgramFilter(programacion) {
    const filterProgram = document.getElementById('filterProgram');
    filterProgram.innerHTML = '<option value="">Todos los programas</option>';
    
    // Obtener programas únicos y ordenados
    const programasUnicos = [
        ...new Set(
            programacion.flatMap(prog => prog.dias.map(() => prog.programa))
        )
    ].sort();
    
    // Llenar el select
    programasUnicos.forEach(programa => {
        const option = document.createElement('option');
        option.value = programa;
        option.textContent = programa;
        filterProgram.appendChild(option);
    });
    
    // Agregar evento de filtrado
    filterProgram.addEventListener('change', filterComunicados);
}


// Obtener solo comunicados (filtrado desde announcements)
function getComunicados() {
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    return announcements.filter(item => item.type === 'comunicado');
}

// Guardar todos los announcements (preservando otros tipos)
function saveAllAnnouncements(updatedAnnouncements) {
    localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
}

// Manejar logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Manejar envío de formulario
function handleSubmit(e) {
    e.preventDefault();
    
    const form = document.getElementById('comunicadoForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (submitBtn.dataset.editingId) {
        updateComunicado(submitBtn.dataset.editingId);
    } else {
        saveComunicado();
    }
}

// Guardar nuevo comunicado
function saveComunicado() {
    const form = document.getElementById('comunicadoForm');
    const programacionRadio = JSON.parse(localStorage.getItem('programacionRadio')) || [];
    
    // Validar que el programa exista
    const programaSeleccionado = form.program.value;
    const programaExiste = programacionRadio.some(prog => 
        prog.programa === programaSeleccionado
    );
    
    if (!programaExiste && programaSeleccionado) {
        showAlert('El programa seleccionado no existe en la programación', 'error');
        return;
    }

    const newComunicado = {
        id: Date.now(),
        type: 'comunicado',
        clientName: form.clientName.value,
        program: form.program.value,
        scheduleTime: form.scheduleTime.value,
        announcementText: form.announcementText.value,
        invoiceNumber: form.invoiceNumber.value,
        priority: form.priority.value,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    announcements.push(newComunicado);
    saveAllAnnouncements(announcements);

    form.reset();
    loadComunicados();
    showAlert('Comunicado registrado exitosamente!', 'success');
}

// Cargar comunicados en la tabla
function loadComunicados() {
    const comunicados = getComunicados();
    renderComunicados(comunicados);
}

// Renderizar comunicados en la tabla
function renderComunicados(comunicados) {
    const tbody = document.querySelector('#comunicadosTable tbody');
    tbody.innerHTML = '';

    comunicados.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    comunicados.forEach(com => {
        const row = document.createElement('tr');
        row.dataset.program = com.program; // Para filtrado
        row.innerHTML = `
            <td>${com.clientName}</td>
            <td>${com.program}</td>
            <td>${formatTime(com.scheduleTime)}</td>
            <td>${com.invoiceNumber}</td>
            <td><span class="priority-${com.priority}">${
                com.priority === 'urgent' ? 'Urgente' : 
                com.priority === 'high' ? 'Alta' : 'Normal'
            }</span></td>
            <td>
                <button class="btn-action edit-btn" data-id="${com.id}"><i class="fas fa-edit"></i></button>
                <button class="btn-action delete-btn" data-id="${com.id}"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Agregar eventos a los botones
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editComunicado(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteComunicado(btn.dataset.id));
    });
}

// Formatear hora
function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

// Buscar comunicados
function handleSearch() {
    const searchTerm = this.value.toLowerCase();
    const comunicados = getComunicados();
    
    const filtered = comunicados.filter(com => 
        com.clientName.toLowerCase().includes(searchTerm) || 
        com.announcementText.toLowerCase().includes(searchTerm) ||
        com.invoiceNumber.toLowerCase().includes(searchTerm)
    );
    
    renderComunicados(filtered);
}

// Filtrar por programa
function filterComunicados() {
    const program = this.value;
    const rows = document.querySelectorAll('#comunicadosTable tbody tr');
    
    rows.forEach(row => {
        if (!program || row.dataset.program === program) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Editar comunicado
function editComunicado(id) {
    const comunicados = getComunicados();
    const comunicado = comunicados.find(com => com.id == id);
    
    if (!comunicado) return;
    
    const form = document.getElementById('comunicadoForm');
    form.clientName.value = comunicado.clientName;
    form.program.value = comunicado.program;
    form.scheduleTime.value = comunicado.scheduleTime;
    form.announcementText.value = comunicado.announcementText;
    form.invoiceNumber.value = comunicado.invoiceNumber;
    form.priority.value = comunicado.priority;
    
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar Comunicado';
    submitBtn.dataset.editingId = id;
    
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Eliminar comunicado
function deleteComunicado(id) {
    if (!confirm('¿Estás seguro de eliminar este comunicado?')) return;
    
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const updatedAnnouncements = announcements.filter(item => 
        !(item.id == id && item.type === 'comunicado')
    );
    
    saveAllAnnouncements(updatedAnnouncements);
    loadComunicados();
    showAlert('Comunicado eliminado correctamente', 'success');
}

// Actualizar comunicado existente
function updateComunicado(id) {
    const form = document.getElementById('comunicadoForm');
    let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const index = announcements.findIndex(com => com.id == id && com.type === 'comunicado');
    
    if (index === -1) return;
    
    announcements[index] = {
        ...announcements[index],
        clientName: form.clientName.value,
        program: form.program.value,
        scheduleTime: form.scheduleTime.value,
        announcementText: form.announcementText.value,
        invoiceNumber: form.invoiceNumber.value,
        priority: form.priority.value,
        updatedAt: new Date().toISOString()
    };
    
    saveAllAnnouncements(announcements);
    form.reset();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Registrar Comunicado';
    delete submitBtn.dataset.editingId;
    
    loadComunicados();
    showAlert('Comunicado actualizado exitosamente!', 'success');
}

// Mostrar notificación
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}