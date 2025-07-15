// Datos de la aplicación
let announcements = [];

// Usuarios del sistema
const systemUsers = [
    {
        username: 'admin',
        password: 'admin123',
        name: 'Administrador',
        role: 'admin',
        permissions: ['all']
    },
    {
        username: 'marketing',
        password: 'mkt2023',
        name: 'Equipo Marketing',
        role: 'marketing',
        permissions: ['create', 'edit', 'view']
    },
    {
        username: 'secretaria',
        password: 'sec2023',
        name: 'Equipo Producción',
        role: 'secretaria',
        permissions: ['view', 'status']
    }
];
// Estado de la aplicación
let currentUser = null;

// Cargar datos iniciales
function loadInitialData() {
    try {
        const storedAnnouncements = localStorage.getItem('announcements');
        announcements = storedAnnouncements ? JSON.parse(storedAnnouncements) : [
            {
                id: 1,
                clientName: 'Coca Cola',
                program: 'Matutino',
                scheduleTime: '08:30',
                announcementText: 'Nuevo sabor de Coca Cola disponible ahora!',
                status: 'pending',
                invoiceNumber: 'F001-001',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                clientName: 'Nike',
                program: 'Tarde',
                scheduleTime: '16:45',
                announcementText: 'Just do it! Oferta especial en zapatillas',
                status: 'pending',
                invoiceNumber: 'B002-001',
                createdAt: new Date().toISOString()
            }
        ];

        if (!storedAnnouncements) {
            localStorage.setItem('announcements', JSON.stringify(announcements));
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
        announcements = [];
    }
}

// Inicializar la aplicación
function initApp() {
    loadInitialData();
    
    // Configurar eventos con verificación de existencia
    const toggleViewBtn = document.getElementById('toggleView');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logout');
    
    if (toggleViewBtn) toggleViewBtn.addEventListener('click', toggleAdminView);
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    
    // Mostrar fecha y hora actual
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
}

// Alternar entre vista locutor y admin
function toggleAdminView() {
    const locutorView = document.getElementById('locutorView');
    const adminLogin = document.getElementById('adminLogin');
    
    if (!locutorView || !adminLogin) return;
    
    if (adminLogin.classList.contains('hidden')) {
        adminLogin.classList.remove('hidden');
        locutorView.classList.add('hidden');
        document.getElementById('toggleView').textContent = 'Modo Locutor';
    } else {
        adminLogin.classList.add('hidden');
        locutorView.classList.remove('hidden');
        document.getElementById('toggleView').textContent = 'Modo Administrador';
    }
}

// Función de login 
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username')?.value;
    const password = document.getElementById('password')?.value;
    
    if (!username || !password) {
        showLoginError('Por favor complete todos los campos');
        return;
    }
    
    const user = systemUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Redirigir según el rol
        if (user.role === 'admin') {
            window.location.href = 'admin.html';
        } else if (user.role === 'marketing') {
            window.location.href = 'marketing.html';
        } else if (user.role === 'secretaria') {
            window.location.href = 'secretaria.html';
        }
    } else {
        showLoginError('Usuario o contraseña incorrectos');
    }
}

function showLoginError(message) {
    const errorElement = document.getElementById('loginError');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Manejar logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Actualizar hora actual
function updateCurrentTime() {
    const now = new Date();
    const currentTimeElement = document.getElementById('currentTime');
    const currentDateElement = document.getElementById('currentDate');
    
    if (currentTimeElement) {
        currentTimeElement.textContent = now.toLocaleTimeString();
    }
    
    if (currentDateElement) {
        currentDateElement.textContent = now.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Inicialización segura
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}