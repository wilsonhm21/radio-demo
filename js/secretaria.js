document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'secretaria') {
        window.location.href = 'index.html';
    }

    // Configurar fecha/hora actual
    function updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        document.getElementById('currentDateTime').textContent = now.toLocaleDateString('es-ES', options);
    }
    updateDateTime();
    setInterval(updateDateTime, 60000);

    // Configurar eventos
    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    document.getElementById('comunicadoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveComunicado();
    });

    // Cargar comunicados al iniciar
    loadComunicados();
});

function saveComunicado() {
    const form = document.getElementById('comunicadoForm');
    
    const newComunicado = {
        id: Date.now(),
        type: 'comunicado',
        clientName: form.clientName.value,
        program: form.program.value,
        scheduleTime: form.scheduleTime.value,
        announcementText: form.announcementText.value,
        status: 'pending',
        invoiceNumber: `COM-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString()
    };

    // Guardar en localStorage
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    announcements.push(newComunicado);
    localStorage.setItem('announcements', JSON.stringify(announcements));

    // Resetear formulario
    form.reset();
    
    // Recargar lista
    loadComunicados();
    
    // Mostrar feedback
    alert('Comunicado registrado exitosamente!');
}

function loadComunicados() {
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const tbody = document.querySelector('#comunicadosTable tbody');
    tbody.innerHTML = '';

    // Filtrar solo comunicados
    const comunicados = announcements.filter(item => item.type === 'comunicado');

    // Ordenar por fecha más reciente
    comunicados.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    comunicados.forEach(com => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${com.clientName}</td>
            <td>${com.program}</td>
            <td>${com.scheduleTime}</td>
            <td class="status-${com.status}">${com.status}</td>
        `;
        tbody.appendChild(row);
    });
}