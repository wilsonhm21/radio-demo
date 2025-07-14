// Inicializar panel de administración
function initAdminPanel() {
    // Verificar autenticación
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('adminName').textContent = currentUser.name;
    loadAnnouncements();
    setupForm();
    setupFilters();
}

// Cargar anuncios
function loadAnnouncements(filterDate = null) {
    const announcementsList = document.getElementById('adminAnnouncementsList');
    announcementsList.innerHTML = '';
    
    let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    
    // Filtrar por fecha si es necesario
    if (filterDate) {
        announcements = announcements.filter(ann => {
            return ann.createdAt.split('T')[0] === filterDate;
        });
    }
    
    if (announcements.length === 0) {
        announcementsList.innerHTML = '<div class="announcement-item">No hay anuncios</div>';
        return;
    }
    
    // Ordenar por fecha y hora
    announcements.sort((a, b) => {
        const dateCompare = new Date(a.createdAt) - new Date(b.createdAt);
        if (dateCompare !== 0) return dateCompare;
        return a.scheduleTime.localeCompare(b.scheduleTime);
    });
    
    announcements.forEach(announcement => {
        const announcementItem = document.createElement('div');
        announcementItem.className = `announcement-item ${announcement.status}`;
        announcementItem.innerHTML = `
            <div class="announcement-time">${announcement.scheduleTime} - ${announcement.program}</div>
            <div class="announcement-client">${announcement.clientName} (${announcement.invoiceNumber})</div>
            <div class="announcement-text">${announcement.announcementText}</div>
            <div class="announcement-status">${getStatusText(announcement.status)}</div>
            <div class="announcement-actions">
                <button class="btn-edit" data-id="${announcement.id}">Editar</button>
                <button class="btn-delete" data-id="${announcement.id}">Eliminar</button>
            </div>
        `;
        announcementsList.appendChild(announcementItem);
    });
    
    // Configurar eventos de los botones
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editAnnouncement(btn.dataset.id));
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteAnnouncement(btn.dataset.id));
    });
}

// Configurar formulario
function setupForm() {
    document.getElementById('announcementForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const clientName = document.getElementById('clientName').value;
        const program = document.getElementById('program').value;
        const scheduleTime = document.getElementById('scheduleTime').value;
        const announcementText = document.getElementById('announcementText').value;
        const invoiceNumber = document.getElementById('invoiceNumber').value;
        
        // Crear nuevo anuncio
        const newAnnouncement = {
            id: Date.now(),
            clientName,
            program,
            scheduleTime,
            announcementText,
            invoiceNumber,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        // Guardar en localStorage
        const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
        announcements.push(newAnnouncement);
        localStorage.setItem('announcements', JSON.stringify(announcements));
        
        // Recargar lista y limpiar formulario
        loadAnnouncements();
        this.reset();
        
        // Generar automáticamente número de factura para el próximo
        if (invoiceNumber.startsWith('F')) {
            const nextNum = parseInt(invoiceNumber.split('-')[1]) + 1;
            document.getElementById('invoiceNumber').value = `F001-${nextNum.toString().padStart(3, '0')}`;
        } else if (invoiceNumber.startsWith('B')) {
            const nextNum = parseInt(invoiceNumber.split('-')[1]) + 1;
            document.getElementById('invoiceNumber').value = `B002-${nextNum.toString().padStart(3, '0')}`;
        }
    });
}

// Configurar filtros
function setupFilters() {
    document.getElementById('applyFilter').addEventListener('click', function() {
        const filterDate = document.getElementById('filterDate').value;
        loadAnnouncements(filterDate);
    });
}

// Editar anuncio
function editAnnouncement(id) {
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const announcement = announcements.find(ann => ann.id == id);
    
    if (!announcement) return;
    
    // Llenar formulario con los datos del anuncio
    document.getElementById('clientName').value = announcement.clientName;
    document.getElementById('program').value = announcement.program;
    document.getElementById('scheduleTime').value = announcement.scheduleTime;
    document.getElementById('announcementText').value = announcement.announcementText;
    document.getElementById('invoiceNumber').value = announcement.invoiceNumber;
    
    // Eliminar el anuncio antiguo
    deleteAnnouncement(id, false);
}

// Eliminar anuncio
function deleteAnnouncement(id, reload = true) {
    let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    announcements = announcements.filter(ann => ann.id != id);
    localStorage.setItem('announcements', JSON.stringify(announcements));
    
    if (reload) {
        loadAnnouncements();
    }
}

// Obtener texto del estado
function getStatusText(status) {
    switch(status) {
        case 'pending': return 'PENDIENTE';
        case 'current': return 'EN CURSO';
        case 'completed': return 'COMPLETADO';
        default: return '';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initAdminPanel);