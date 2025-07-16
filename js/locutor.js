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
    
    // Verificar anuncios cada minuto (ajustado a cada 10 segundos para pruebas más rápidas)
    setInterval(checkForUpcomingAnnouncements, 10000); // Antes 60000 (1 minuto)
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

// Cargar anuncios con estilos mejorados (MODIFICADO)
function loadAnnouncements() {
    const today = new Date().toISOString().split('T')[0];
    const announcementsList = document.getElementById('announcementsList');
    announcementsList.innerHTML = ''; // Limpiar la lista existente
    
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    
    // Filtrar y normalizar los anuncios para el día de hoy
    const todayAnnouncements = announcements.filter(ann => {
        // Usa 'createdAt' para la fecha de registro/creación para ambos tipos.
        const announcementDate = ann.createdAt?.split('T')[0]; 
        
        // Asegúrate de que tenga una fecha de creación válida para hoy y no esté completado.
        const isToday = announcementDate === today;
        const isNotCompleted = ann.status !== 'completed';

        // Asegúrate de que tiene horarios para mostrar, ya sea en el nuevo array o la propiedad antigua.
        const hasSchedules = (ann.horarios && ann.horarios.length > 0) || ann.scheduleTime;

        return isToday && isNotCompleted && hasSchedules;

    }).sort((a, b) => {
        // Accede al primer horario de forma segura para ordenar
        const timeA = (a.horarios && a.horarios.length > 0) ? (a.horarios[0].time ?? '') : (a.scheduleTime ?? '');
        const timeB = (b.horarios && b.horarios.length > 0) ? (b.horarios[0].time ?? '') : (b.scheduleTime ?? '');
        
        return timeA.localeCompare(timeB);
    });
    
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
        // MODIFICACIÓN CLAVE: Añadir clase específica por tipo de anuncio
        // Asumiendo que 'type' puede ser 'publicidad', 'comunicado', 'pauta'
        announcementItem.className = `announcement-card ${announcement.status} announcement-type-${announcement.type || 'comunicado'}`; 
        // Si 'type' no está definido, se asumirá 'comunicado' por defecto
        
        let displayTimes = 'N/A';
        let displayProgram = 'N/A';
        let displayClientName = announcement.clientName ?? 'Desconocido'; 
        let displayAnnouncementText = announcement.announcementText ?? 'Sin texto'; 
        let iconHtml = '<i class="fas fa-building"></i>'; // Icono por defecto para publicidad
        
        // Lógica para horarios y programa
        if (announcement.horarios && announcement.horarios.length > 0) {
            displayTimes = announcement.horarios.map(h => `${h.time}`).join(', ');
            displayProgram = announcement.horarios[0].program ?? 'Sin programa'; 
        } else if (announcement.scheduleTime && announcement.program) {
            displayTimes = announcement.scheduleTime;
            displayProgram = announcement.program;
        }

        // Si es de tipo 'pauta', ajusta el texto del anuncio y el cliente
        if (announcement.type === 'pauta') {
            displayClientName = announcement.cliente ?? 'Desconocido'; // Usa 'cliente' para pautas
            displayAnnouncementText = `Pauta: "${announcement.producto ?? 'N/A'}" (${announcement.duracion ?? 'N/A'} seg)`;
            iconHtml = '<i class="fas fa-file-invoice"></i>'; // Icono para pauta
        } else if (announcement.type === 'comunicado') {
            iconHtml = '<i class="fas fa-bullhorn"></i>'; // Icono para comunicado
        }
        // Para 'publicidad', se mantiene el icono por defecto 'fas fa-building' y clientName/announcementText
        
        announcementItem.innerHTML = `
            <div class="announcement-header">
                <span class="announcement-time">${displayTimes}</span>
                <span class="announcement-program">${displayProgram}</span>
                ${announcement.status === 'current' ? 
                    '<span class="announcement-status"><i class="fas fa-broadcast-tower"></i> EN VIVO</span>' : ''}
            </div>
            <div class="announcement-body">
                <div class="announcement-client">
                    ${iconHtml}
                    ${displayClientName}
                </div>
                <div class="announcement-text">
                    <i class="fas fa-quote-left"></i>
                    ${displayAnnouncementText}
                </div>
            </div>
            <button class="play-button" data-id="${announcement.id}">
                <i class="fas fa-play-circle"></i> Iniciar
            </button>
        `;
        announcementsList.appendChild(announcementItem);
    });

    // Añadir event listeners a los botones de reproducción
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const announcementId = parseInt(e.currentTarget.dataset.id);
            const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
            const announcementToPlay = announcements.find(ann => ann.id === announcementId);
            if (announcementToPlay) {
                startAnnouncement(announcementToPlay);
            }
        });
    });
}

// Verificar anuncios próximos con mejor feedback visual
function checkForUpcomingAnnouncements() {
    const now = new Date();
    const currentHours = now.getHours().toString().padStart(2, '0');
    const currentMinutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHours}:${currentMinutes}`;
    
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    
    // Normalizar los anuncios para poder filtrarlos y encontrar el 'current' o 'next'
    const allScheduledItems = [];
    announcements.forEach(ann => {
        // Solo considerar anuncios de hoy y que no estén completados
        if (ann.createdAt?.split('T')[0] === now.toISOString().split('T')[0] && ann.status !== 'completed') {
            if (ann.horarios && ann.horarios.length > 0) {
                ann.horarios.forEach(h => {
                    allScheduledItems.push({
                        originalAnn: ann, // Referencia al anuncio completo
                        scheduledTime: h.time, // Tiempo específico de este horario
                        scheduledProgram: h.program
                    });
                });
            } else if (ann.scheduleTime) { 
                allScheduledItems.push({
                    originalAnn: ann,
                    scheduledTime: ann.scheduleTime,
                    scheduledProgram: ann.program 
                });
            }
        }
    });

    // Ordenar todos los items programados por tiempo
    allScheduledItems.sort((a, b) => (a.scheduledTime ?? '').localeCompare(b.scheduledTime ?? ''));
    
    // Verificar si algún anuncio debe comenzar AHORA
    // Importante: un anuncio debe estar 'pending' para poder 'empezar'
    const currentScheduledItem = allScheduledItems.find(item => 
        item.scheduledTime === currentTime && item.originalAnn.status === 'pending'
    );
    
    if (currentScheduledItem) {
        // Solo iniciar si no hay otro anuncio "current" en este momento para evitar duplicados
        // y si el anuncio a iniciar no es ya 'current'
        if (!currentAnnouncement || currentAnnouncement.id !== currentScheduledItem.originalAnn.id || currentScheduledItem.originalAnn.status !== 'current') {
            startAnnouncement(currentScheduledItem.originalAnn); // Pasar el anuncio original
            return; // Detener la búsqueda para evitar procesar múltiples anuncios a la misma hora
        }
    }
    
    // Verificar próximos anuncios (en los próximos 5 minutos)
    const nextScheduledItem = allScheduledItems.find(item => {
        // Asegúrate de que el estado es 'pending' antes de considerar como 'próximo'
        if (item.originalAnn.status !== 'pending') return false; 

        const [hoursStr, minutesStr] = (item.scheduledTime ?? '').split(':');
        // Validar si hours y minutes son números válidos antes de parseInt
        const hours = parseInt(hoursStr);
        const minutes = parseInt(minutesStr);

        if (isNaN(hours) || isNaN(minutes)) return false; 

        const annTime = new Date();
        annTime.setHours(hours, minutes, 0, 0); // Ajustar segundos y milisegundos a 0

        const diffInMinutes = (annTime - now) / (1000 * 60);
        return diffInMinutes > 0 && diffInMinutes <= 5;
    });
    
    const nextAlert = document.getElementById('nextAlert');
    if (nextScheduledItem) {
        const [hours, minutes] = (nextScheduledItem.scheduledTime ?? '').split(':');
        const annTime = new Date();
        annTime.setHours(parseInt(hours), parseInt(minutes));
        
        const diffInMinutes = Math.ceil((annTime - now) / (1000 * 60));
        nextAlert.innerHTML = `
            <i class="fas fa-bell"></i>
            <strong>Próximo anuncio:</strong> ${nextScheduledItem.scheduledTime} - ${nextScheduledItem.originalAnn.clientName ?? 'Desconocido'} 
            (en ${diffInMinutes} min)
        `;
        nextAlert.classList.add('active');
    } else {
        nextAlert.textContent = '';
        nextAlert.classList.remove('active');
    }
}

// Iniciar anuncio con mejor UI (MODIFICADO)
function startAnnouncement(announcement) {
    // Pausar y resetear cualquier audio previamente reproduciéndose (Importante)
    const modalAudioPlayer = document.getElementById('modalAudioPlayer');
    if (modalAudioPlayer && !modalAudioPlayer.paused) {
        modalAudioPlayer.pause();
        modalAudioPlayer.currentTime = 0;
    }

    // Si ya hay un anuncio "current" y es el mismo ID, no hacer nada para evitar re-iniciar
    if (currentAnnouncement && currentAnnouncement.id === announcement.id && announcement.status === 'current') {
        return; 
    }

    currentAnnouncement = announcement; // Establecer el anuncio actual
    
    // Actualizar el estado del anuncio a 'current' en localStorage (si no lo está ya)
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const updatedAnnouncements = announcements.map(ann => {
        if (ann.id === announcement.id) {
            // Solo cambiar el estado si es 'pending'
            if (ann.status === 'pending') {
                return { ...ann, status: 'current' };
            }
        }
        return ann;
    });
    
    localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
    loadAnnouncements(); // Recargar la lista para que la tarjeta cambie de estilo

    // Mostrar modal y rellenar con datos
    const modal = document.getElementById('announcementModal');
    const modalClient = document.getElementById('modalClient');
    const modalText = document.getElementById('modalText');
    const modalAudioSource = document.getElementById('modalAudioSource');

    // Limpiar clases de tipo previas en el modal y añadir la actual
    modal.classList.remove('modal-type-publicidad', 'modal-type-comunicado', 'modal-type-pauta');
    modal.classList.add(`modal-type-${announcement.type || 'comunicado'}`); // Añade la clase según el tipo

    // Rellenar el modal con los datos del anuncio y controlar el audio
    if (announcement.type === 'pauta') {
        modalClient.textContent = announcement.cliente ?? 'Desconocido'; // Usar 'cliente' para pautas
        modalText.textContent = `Pauta: "${announcement.producto ?? 'N/A'}" (${announcement.duracion ?? 'N/A'} seg) - ${announcement.motivo ?? 'N/A'}`;
        modalAudioPlayer.style.display = 'none'; // Ocultar reproductor
        modalAudioSource.src = ''; // Limpiar src
    } else if (announcement.type === 'publicidad') {
        modalClient.textContent = announcement.clientName ?? 'Desconocido';
        modalText.textContent = announcement.announcementText ?? 'Sin texto';
        
        // Configurar audio para publicidad
        if (announcement.audio) {
            // MUY IMPORTANTE: La ruta al archivo de audio.
            // Asume que los audios están en una carpeta 'audio/' en la raíz de tu proyecto.
            modalAudioSource.src = `audio/${announcement.audio}`; 
            modalAudioPlayer.load(); // Cargar el nuevo audio
            modalAudioPlayer.style.display = 'block'; // Mostrar el reproductor
            modalAudioPlayer.play().catch(e => console.error("Error al reproducir el audio:", e)); // Intentar reproducir automáticamente
        } else {
            modalAudioPlayer.style.display = 'none';
            modalAudioSource.src = '';
        }
    } else { // Comunicado o cualquier otro tipo por defecto
        modalClient.textContent = announcement.clientName ?? 'Desconocido';
        modalText.textContent = announcement.announcementText ?? 'Sin texto';
        modalAudioPlayer.style.display = 'none'; // Ocultar reproductor
        modalAudioSource.src = '';
    }
    
    modal.classList.remove('hidden'); // Mostrar el modal
    
    // Iniciar temporizador del anuncio
    if (announcementTimer) {
        clearInterval(announcementTimer);
    }

    let secondsLeft = 30; // Duración por defecto
    // Si la publicidad/pauta tiene una duración definida, usarla
    if (announcement.duracion && !isNaN(parseInt(announcement.duracion))) {
        secondsLeft = parseInt(announcement.duracion);
    }
    // Para comunicados, puedes establecer una duración fija si lo deseas, o que se maneje manualmente
    else if (announcement.type === 'comunicado') {
        secondsLeft = 20; // Ejemplo: Comunicado dura 20 segundos
    }

    updateModalTimer(secondsLeft);
    
    announcementTimer = setInterval(() => {
        secondsLeft--;
        updateModalTimer(secondsLeft);
        
        if (secondsLeft <= 0) {
            clearInterval(announcementTimer);
            if (modalAudioPlayer && !modalAudioPlayer.paused) {
                modalAudioPlayer.pause(); // Pausar el audio si todavía está sonando
                modalAudioPlayer.currentTime = 0; // Reiniciar el audio
            }
            completeCurrentAnnouncement(); // Auto-completar
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

// Completar anuncio actual (MODIFICADO para detener audio)
function completeCurrentAnnouncement() {
    if (!currentAnnouncement) return; // Si no hay anuncio actual, salir
    
    clearInterval(announcementTimer); // Detener el temporizador
    
    // Pausar y resetear el reproductor de audio si está activo
    const modalAudioPlayer = document.getElementById('modalAudioPlayer');
    if (modalAudioPlayer) {
        modalAudioPlayer.pause();
        modalAudioPlayer.currentTime = 0;
        modalAudioPlayer.style.display = 'none'; // Ocultar el reproductor
    }

    // Actualizar el estado del anuncio a 'completed' en localStorage
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const updatedAnnouncements = announcements.map(ann => {
        if (ann.id === currentAnnouncement.id) {
            return { ...ann, status: 'completed' };
        }
        return ann;
    });
    
    localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
    
    currentAnnouncement = null; // Limpiar el anuncio actual
    
    // Ocultar modal y recargar lista para remover el anuncio completado
    const modal = document.getElementById('announcementModal');
    modal.classList.add('hidden');
    // Limpiar clases de tipo del modal
    modal.classList.remove('modal-type-publicidad', 'modal-type-comunicado', 'modal-type-pauta');
    
    loadAnnouncements(); 
    checkForUpcomingAnnouncements(); // Verificar si hay otro anuncio próximo
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initLocutorView);