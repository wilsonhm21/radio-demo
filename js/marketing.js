document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'marketing') {
        window.location.href = 'index.html';
    }

    // Configurar eventos
    document.getElementById('logout').addEventListener('click', handleLogout);
    document.getElementById('audioFile').addEventListener('change', handleAudioUpload);
    document.getElementById('publicidadForm').addEventListener('submit', handleSubmit);

    // Cargar datos iniciales
    loadPublicidades();
});

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

function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const audioFile = document.getElementById('audioFile').files[0];

    if (!audioFile) {
        alert('Debes seleccionar un archivo de audio');
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

    // Guardar en localStorage
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    announcements.push(newPublicidad);
    localStorage.setItem('announcements', JSON.stringify(announcements));

    // Resetear formulario
    form.reset();
    document.getElementById('fileName').textContent = 'No se ha seleccionado ningún archivo';
    document.getElementById('audioPreview').style.display = 'none';

    // Mostrar notificación
    showNotification('Publicidad creada exitosamente', 'success');
    loadPublicidades();
}

function loadPublicidades() {
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const tbody = document.querySelector('#publicidadTable tbody');
    tbody.innerHTML = '';

    // Filtrar solo publicidades
    const publicidades = announcements.filter(item => item.type === 'publicidad');

    publicidades.forEach(pub => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pub.clientName}</td>
            <td>${pub.program}</td>
            <td>${pub.scheduleTime}</td>
            <td class="status-${pub.status}">${pub.status}</td>
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

function showNotification(message, type) {
    // Implementar notificación bonita (puedes usar Toastify.js o similar)
    alert(message); // Temporal
}

function editPublicidad(id) {
    // Implementar lógica de edición
    console.log('Editar publicidad:', id);
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