document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'secretaria') {
        window.location.href = 'index.html';
        return;
    }

    // Configurar eventos
    document.getElementById('logout').addEventListener('click', handleLogout);
    document.getElementById('comunicadoForm').addEventListener('submit', handleSubmit);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('filterProgram').addEventListener('change', filterComunicados);

    // Cargar comunicados al iniciar
    loadComunicados();
});

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
    saveComunicado();
}

// Guardar nuevo comunicado
function saveComunicado() {
    const form = document.getElementById('comunicadoForm');
    
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

    // Obtener todos los announcements existentes
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    
    // Agregar el nuevo comunicado
    announcements.push(newComunicado);
    
    // Guardar de vuelta en announcements
    saveAllAnnouncements(announcements);

    // Resetear formulario
    form.reset();
    
    // Recargar lista y mostrar feedback
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

    // Ordenar por fecha más reciente
    comunicados.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    comunicados.forEach(com => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${com.clientName}</td>
        <td>${com.program}</td>
        <td>${com.scheduleTime}</td>
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

// Buscar comunicados
function handleSearch() {
    const searchTerm = this.value.toLowerCase();
    const comunicados = getComunicados();
    
    const filtered = comunicados.filter(com => 
        com.clientName.toLowerCase().includes(searchTerm) || 
        com.announcementText.toLowerCase().includes(searchTerm)
    );
    
    renderComunicados(filtered);
}

// Filtrar por programa
function filterComunicados() {
    const program = this.value;
    const comunicados = getComunicados();
    
    if (!program) {
        renderComunicados(comunicados);
        return;
    }
    
    const filtered = comunicados.filter(com => com.program === program);
    renderComunicados(filtered);
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
    form.priority.value = comunicado.priority;
    
    // Cambiar el botón de submit a "Actualizar"
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar Comunicado';
    submitBtn.dataset.editingId = id;
    
    // Scroll al formulario
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Eliminar comunicado
function deleteComunicado(id) {
    if (!confirm('¿Estás seguro de eliminar este comunicado?')) return;
    
    // Obtener todos los announcements
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    
    // Filtrar para eliminar solo el comunicado específico
    const updatedAnnouncements = announcements.filter(item => 
        !(item.id == id && item.type === 'comunicado')
    );
    
    // Guardar cambios
    saveAllAnnouncements(updatedAnnouncements);
    
    // Recargar
    loadComunicados();
    showAlert('Comunicado eliminado correctamente', 'success');
}

// Actualizar comunicado existente
function updateComunicado(id) {
    const form = document.getElementById('comunicadoForm');
    
    // Obtener todos los announcements
    let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const index = announcements.findIndex(com => com.id == id && com.type === 'comunicado');
    
    if (index === -1) return;
    
    // Actualizar el comunicado
    announcements[index] = {
        ...announcements[index],
        clientName: form.clientName.value,
        program: form.program.value,
        scheduleTime: form.scheduleTime.value,
        announcementText: form.announcementText.value,
        priority: form.priority.value,
        updatedAt: new Date().toISOString()
    };
    
    // Guardar cambios
    saveAllAnnouncements(announcements);
    
    // Resetear formulario
    form.reset();
    
    // Restaurar botón de submit
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Registrar Comunicado';
    delete submitBtn.dataset.editingId;
    
    // Recargar lista y mostrar feedback
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