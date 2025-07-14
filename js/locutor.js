// Variables globales
let currentAnnouncement = null;
let announcementTimer = null;

// Inicializar vista locutor
function initLocutorView() {
    updateCurrentDateTime();
    setInterval(updateCurrentDateTime, 1000);
    loadAnnouncements();
    checkForUpcomingAnnouncements();
    
    // Configurar eventos
    document.getElementById('completeAnnouncement')?.addEventListener('click', completeCurrentAnnouncement);
    
    // Verificar anuncios cada minuto
    setInterval(checkForUpcomingAnnouncements, 60000);
}

// Actualizar fecha y hora actual
function updateCurrentDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    const dateTimeStr = now.toLocaleDateString('es-ES', options).replace(',', '');
    document.getElementById('currentTime').textContent = dateTimeStr;
}

// Cargar anuncios con estilos mejorados
function loadAnnouncements() {
    const today = new Date().toISOString().split('T')[0];
    const announcementsList = document.getElementById('announcementsList');
    announcementsList.innerHTML = '';
    
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const todayAnnouncements = announcements.filter(ann => {
        return ann.createdAt.split('T')[0] === today && ann.status !== 'completed';
    }).sort((a, b) => a.scheduleTime.localeCompare(b.scheduleTime));
    
    if (todayAnnouncements.length === 0) {
        announcementsList.innerHTML = `
            <div class="empty-announcement">
                <i class="fas fa-info-circle"></i>
                <p>No hay anuncios programados para hoy</p>
            </div>
        `;
        return;
    }
    
    todayAnnouncements.forEach(announcement => {
        const announcementItem = document.createElement('div');
        announcementItem.className = `announcement-card ${announcement.status}`;
        announcementItem.innerHTML = `
            <div class="announcement-header">
                <span class="announcement-time">${announcement.scheduleTime}</span>
                <span class="announcement-program">${announcement.program}</span>
                ${announcement.status === 'current' ? 
                    '<span class="announcement-status"><i class="fas fa-broadcast-tower"></i> EN VIVO</span>' : ''}
            </div>
            <div class="announcement-body">
                <div class="announcement-client">
                    <i class="fas fa-building"></i>
                    ${announcement.clientName}
                </div>
                <div class="announcement-text">
                    <i class="fas fa-quote-left"></i>
                    ${announcement.announcementText}
                </div>
            </div>
        `;
        announcementsList.appendChild(announcementItem);
    });
}

// Verificar anuncios próximos con mejor feedback visual
function checkForUpcomingAnnouncements() {
    const now = new Date();
    const currentHours = now.getHours().toString().padStart(2, '0');
    const currentMinutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHours}:${currentMinutes}`;
    
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const upcomingAnnouncements = announcements.filter(ann => {
        return ann.status === 'pending' && 
               ann.createdAt.split('T')[0] === now.toISOString().split('T')[0];
    });
    
    // Verificar si algún anuncio debe comenzar ahora
    const currentAnn = upcomingAnnouncements.find(ann => ann.scheduleTime === currentTime);
    
    if (currentAnn) {
        startAnnouncement(currentAnn);
        return;
    }
    
    // Verificar próximos anuncios (en los próximos 5 minutos)
    const nextAnnouncement = upcomingAnnouncements.find(ann => {
        const [hours, minutes] = ann.scheduleTime.split(':');
        const annTime = new Date();
        annTime.setHours(parseInt(hours), parseInt(minutes));
        
        const diffInMinutes = (annTime - now) / (1000 * 60);
        return diffInMinutes > 0 && diffInMinutes <= 5;
    });
    
    const nextAlert = document.getElementById('nextAlert');
    if (nextAnnouncement) {
        const [hours, minutes] = nextAnnouncement.scheduleTime.split(':');
        const annTime = new Date();
        annTime.setHours(parseInt(hours), parseInt(minutes));
        
        const diffInMinutes = Math.ceil((annTime - now) / (1000 * 60));
        nextAlert.innerHTML = `
            <i class="fas fa-bell"></i>
            <strong>Próximo anuncio:</strong> ${nextAnnouncement.scheduleTime} - ${nextAnnouncement.clientName} 
            (en ${diffInMinutes} min)
        `;
        nextAlert.classList.add('active');
    } else {
        nextAlert.textContent = '';
        nextAlert.classList.remove('active');
    }
}

// Iniciar anuncio con mejor UI
function startAnnouncement(announcement) {
    currentAnnouncement = announcement;
    
    // Actualizar estado en la lista
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const updatedAnnouncements = announcements.map(ann => {
        if (ann.id === announcement.id) {
            return { ...ann, status: 'current' };
        }
        return ann;
    });
    
    localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
    loadAnnouncements();
    
    // Mostrar modal con mejor diseño
    const modal = document.getElementById('announcementModal');
    document.getElementById('modalClient').textContent = announcement.clientName;
    document.getElementById('modalText').textContent = announcement.announcementText;
    modal.classList.remove('hidden');
    
    // Iniciar temporizador (30 segundos para el anuncio)
    let secondsLeft = 30;
    updateModalTimer(secondsLeft);
    
    announcementTimer = setInterval(() => {
        secondsLeft--;
        updateModalTimer(secondsLeft);
        
        if (secondsLeft <= 0) {
            clearInterval(announcementTimer);
            // Auto-completar si llega a cero
            completeCurrentAnnouncement();
        }
    }, 1000);
}

// Actualizar temporizador del modal con formato mejorado
function updateModalTimer(seconds) {
    const timerElement = document.getElementById('modalTimer');
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    
    timerElement.innerHTML = `
        <span class="timer-label">TIEMPO RESTANTE:</span>
        <span class="timer-digits">${mins}:${secs}</span>
    `;
    
    // Cambiar color cuando quedan menos de 10 segundos
    if (seconds <= 10) {
        timerElement.classList.add('warning');
    } else {
        timerElement.classList.remove('warning');
    }
}

// Completar anuncio actual
function completeCurrentAnnouncement() {
    if (!currentAnnouncement) return;
    
    clearInterval(announcementTimer);
    
    // Actualizar estado en la lista
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const updatedAnnouncements = announcements.map(ann => {
        if (ann.id === currentAnnouncement.id) {
            return { ...ann, status: 'completed' };
        }
        return ann;
    });
    
    localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
    currentAnnouncement = null;
    
    // Ocultar modal y recargar lista
    document.getElementById('announcementModal').classList.add('hidden');
    loadAnnouncements();
    checkForUpcomingAnnouncements();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initLocutorView);