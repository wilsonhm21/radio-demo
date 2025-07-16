document.addEventListener('DOMContentLoaded', function() {
    // Datos iniciales de programación
    let programacion = [
        // ========== LUNES A VIERNES ==========
        { 
            dias: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'], 
            horaInicio: '03:00', 
            horaFin: '04:30', 
            programa: 'QHICHWA RIMAYNINCHICK', 
            contenido: 'Programa en quechua con contenido informativo cultural', 
            tipo: 'cultural', 
            idioma: 'quechua' 
        },
        { 
            dias: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'], 
            horaInicio: '04:35', 
            horaFin: '04:45', 
            programa: 'MICROPROGRAMA DINASTÍA', 
            contenido: 'Espacio contratado', 
            tipo: 'contratado', 
            idioma: 'español' 
        },
        { 
            dias: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'], 
            horaInicio: '04:50', 
            horaFin: '05:00', 
            programa: 'MUNDO NATURAL', 
            contenido: 'Espacio contratado', 
            tipo: 'contratado', 
            idioma: 'español' 
        },
        { 
            dias: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'], 
            horaInicio: '05:05', 
            horaFin: '07:30', 
            programa: 'ONDA AZUL NOTICIAS - EDICIÓN CENTRAL', 
            contenido: 'Informativo (noticias locales, nacionales, internacionales y deportivas)', 
            tipo: 'informativo', 
            idioma: 'español' 
        },
        { 
            dias: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'], 
            horaInicio: '07:35', 
            horaFin: '09:00', 
            programa: 'PARTICIPACIÓN CIUDADANA', 
            contenido: 'Análisis y debate sobre temas de coyuntura', 
            tipo: 'debate', 
            idioma: 'español' 
        },
        { 
            dias: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'], 
            horaInicio: '09:05', 
            horaFin: '09:30', 
            programa: 'ESPACIO MUSICAL', 
            contenido: 'Música variada', 
            tipo: 'musical', 
            idioma: 'español' 
        },
        { 
            dias: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'], 
            horaInicio: '09:35', 
            horaFin: '09:55', 
            programa: 'SEMILLAS DE VIDA', 
            contenido: 'Evangelización - católico', 
            tipo: 'religioso', 
            idioma: 'español' 
        },
        { 
            dias: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'], 
            horaInicio: '10:05', 
            horaFin: '11:45', 
            programa: 'PRIMERO LO NUESTRO', 
            contenido: 'Magazín sobre el folklore puneño', 
            tipo: 'cultural', 
            idioma: 'español' 
        },
        { 
            dias: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'], 
            horaInicio: '11:45', 
            horaFin: '13:00', 
            programa: 'ONDA AZUL NOTICIAS - EDICIÓN MEDIO DÍA', 
            contenido: 'Informativo (noticias locales, nacionales, internacionales y deportivas)', 
            tipo: 'informativo', 
            idioma: 'español' 
        },
        { 
            dias: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'], 
            horaInicio: '13:05', 
            horaFin: '14:00', 
            programa: 'GACETA DEPORTIVA', 
            contenido: 'Informativo deportivo (noticias locales, nacionales e internacionales)', 
            tipo: 'deportivo', 
            idioma: 'español' 
        },
        { 
            dias: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'], 
            horaInicio: '14:05', 
            horaFin: '16:00', 
            programa: 'ONDA JUVENIL', 
            contenido: 'Programa juvenil de musica tropical', 
            tipo: 'musical', 
            idioma: 'español' 
        },
        { 
            dias: ['lunes', 'miercoles', 'viernes'], 
            horaInicio: '16:05', 
            horaFin: '17:00', 
            programa: 'COMEX PERÚ', 
            contenido: 'Programa contratado', 
            tipo: 'contratado', 
            idioma: 'español' 
        },
        { 
            dias: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'], 
            horaInicio: '17:05', 
            horaFin: '19:00', 
            programa: 'AYMARA ARUSA', 
            contenido: 'Programa en aymara con contenido informativo - musical', 
            tipo: 'cultural', 
            idioma: 'aymara' 
        },
        { 
            dias: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'], 
            horaInicio: '19:05', 
            horaFin: '20:00', 
            programa: 'ONDA AZUL NOTICIAS - EDICIÓN NOCTURNA', 
            contenido: 'Informativo (noticias locales, nacionales, internacionales y deportivas)', 
            tipo: 'informativo', 
            idioma: 'español' 
        },
        { 
            dias: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'], 
            horaInicio: '20:05', 
            horaFin: '22:00', 
            programa: 'EL SABORCITO DE LA NOCHE', 
            contenido: 'Musical variado y saludos por cumpleaños', 
            tipo: 'musical', 
            idioma: 'español' 
        },

        // ========== SÁBADOS ==========
        { 
            dias: ['sabado'], 
            horaInicio: '03:00', 
            horaFin: '05:00', 
            programa: 'POR LAS RUTAS DEL RECUERDO', 
            contenido: 'Programa musical folclórico con información agraria', 
            tipo: 'musical', 
            idioma: 'español' 
        },
        { 
            dias: ['sabado'], 
            horaInicio: '05:05', 
            horaFin: '07:30', 
            programa: 'ONDA AZUL NOTICIAS - EDICIÓN CENTRAL', 
            contenido: 'Informativo (noticias locales, nacionales, internacionales y deportivas)', 
            tipo: 'informativo', 
            idioma: 'español' 
        },
        { 
            dias: ['sabado'], 
            horaInicio: '07:35', 
            horaFin: '08:00', 
            programa: 'CONCERTACIÓN EDUCATIVA', 
            contenido: 'Espacio contratado - DREP Puno', 
            tipo: 'contratado', 
            idioma: 'español' 
        },
        { 
            dias: ['sabado'], 
            horaInicio: '08:05', 
            horaFin: '08:30', 
            programa: 'HORIZONTE ESCOLAR', 
            contenido: 'Espacio contratado - UGEL Chucuito - Juli', 
            tipo: 'contratado', 
            idioma: 'español' 
        },
        { 
            dias: ['sabado'], 
            horaInicio: '08:35', 
            horaFin: '09:00', 
            programa: 'ESPACIO JURIDICO', 
            contenido: 'Analisis y consejería sobre temas legales', 
            tipo: 'educativo', 
            idioma: 'español' 
        },
        { 
            dias: ['sabado'], 
            horaInicio: '09:05', 
            horaFin: '09:30', 
            programa: 'VIDA SALUDABLE', 
            contenido: 'Programa sobre salud y alimentación', 
            tipo: 'educativo', 
            idioma: 'español' 
        },
        { 
            dias: ['sabado'], 
            horaInicio: '09:35', 
            horaFin: '10:00', 
            programa: 'AGENDA EDUCATIVA', 
            contenido: 'Espacio contratado - UGEL Puno', 
            tipo: 'contratado', 
            idioma: 'español' 
        },
        { 
            dias: ['sabado'], 
            horaInicio: '10:05', 
            horaFin: '12:00', 
            programa: '¡QUÉ MAÑANA!', 
            contenido: 'Programa de musica tropical actual', 
            tipo: 'musical', 
            idioma: 'español' 
        },
        { 
            dias: ['sabado'], 
            horaInicio: '12:05', 
            horaFin: '13:00', 
            programa: 'ONDA AZUL NOTICIAS - EDICIÓN MEDIO DÍA', 
            contenido: 'Informativo (noticias locales, nacionales, internacionales y deportivas)', 
            tipo: 'informativo', 
            idioma: 'español' 
        },
        { 
            dias: ['sabado'], 
            horaInicio: '13:05', 
            horaFin: '14:00', 
            programa: 'ESPACIO MUSICAL', 
            contenido: 'Música variada', 
            tipo: 'musical', 
            idioma: 'español' 
        },
        { 
            dias: ['sabado'], 
            horaInicio: '14:05', 
            horaFin: '16:00', 
            programa: 'ANTOLOGIAS', 
            contenido: 'Programa musical con temas del recuerdo', 
            tipo: 'musical', 
            idioma: 'español' 
        },
        { 
            dias: ['sabado'], 
            horaInicio: '16:05', 
            horaFin: '17:00', 
            programa: 'LOS INFILTRADOS', 
            contenido: 'Programa conducido por adolescentes', 
            tipo: 'juvenil', 
            idioma: 'español' 
        },
        { 
            dias: ['sabado'], 
            horaInicio: '17:05', 
            horaFin: '20:00', 
            programa: 'FIESTA DE MI TIERRA', 
            contenido: 'Programa musical folclórico', 
            tipo: 'musical', 
            idioma: 'español' 
        },
        { 
            dias: ['sabado'], 
            horaInicio: '20:05', 
            horaFin: '22:00', 
            programa: 'EL SABORCITO DE LA NOCHE', 
            contenido: 'Musical variado y saludos por cumpleaños', 
            tipo: 'musical', 
            idioma: 'español' 
        },

        // ========== DOMINGOS ==========
        { 
            dias: ['domingo'], 
            horaInicio: '03:00', 
            horaFin: '05:00', 
            programa: 'POR LAS RUTAS DEL RECUERDO', 
            contenido: 'Programa musical folclórico con información agraria', 
            tipo: 'musical', 
            idioma: 'español' 
        },
        { 
            dias: ['domingo'], 
            horaInicio: '05:05', 
            horaFin: '07:00', 
            programa: 'ONDA AZUL NOTICIAS - EDICIÓN CENTRAL', 
            contenido: 'Informativo (noticias locales, nacionales, internacionales y deportivas)', 
            tipo: 'informativo', 
            idioma: 'español' 
        },
        { 
            dias: ['domingo'], 
            horaInicio: '07:05', 
            horaFin: '08:30', 
            programa: 'MISA DOMINICAL', 
            contenido: 'Transmisión de la Santa Misa Dominical', 
            tipo: 'religioso', 
            idioma: 'español' 
        },
        { 
            dias: ['domingo'], 
            horaInicio: '08:35', 
            horaFin: '10:00', 
            programa: 'PENSAR PUNO', 
            contenido: 'Análisis de contexto cultural y social', 
            tipo: 'cultural', 
            idioma: 'español' 
        },
        { 
            dias: ['domingo'], 
            horaInicio: '10:05', 
            horaFin: '11:00', 
            programa: 'ENTRE ESCOLARES', 
            contenido: 'Programa conducido por niños', 
            tipo: 'infantil', 
            idioma: 'español' 
        },
        { 
            dias: ['domingo'], 
            horaInicio: '11:05', 
            horaFin: '12:30', 
            programa: '¡QUÉ MAÑANA!', 
            contenido: 'Programa de musica tropical actual', 
            tipo: 'musical', 
            idioma: 'español' 
        },
        { 
            dias: ['domingo'], 
            horaInicio: '12:35', 
            horaFin: '14:00', 
            programa: 'EL MARIACHI', 
            contenido: 'Programa musical mexicano', 
            tipo: 'musical', 
            idioma: 'español' 
        },
        { 
            dias: ['domingo'], 
            horaInicio: '14:05', 
            horaFin: '15:00', 
            programa: 'ESPACIO MUSICAL', 
            contenido: 'Música variada', 
            tipo: 'musical', 
            idioma: 'español' 
        },
        { 
            dias: ['domingo'], 
            horaInicio: '15:05', 
            horaFin: '17:00', 
            programa: 'GACETA DEPORTIVA', 
            contenido: 'Informativo deportivo (noticias locales, nacionales e internacionales)', 
            tipo: 'deportivo', 
            idioma: 'español' 
        },
        { 
            dias: ['domingo'], 
            horaInicio: '17:05', 
            horaFin: '19:00', 
            programa: 'RETRETA DOMINICAL', 
            contenido: 'Selección de composiciones de bandas musicales', 
            tipo: 'musical', 
            idioma: 'español' 
        },
        { 
            dias: ['domingo'], 
            horaInicio: '19:05', 
            horaFin: '20:00', 
            programa: 'ONDA AZUL NOTICIAS - EDICIÓN NOCTURNA', 
            contenido: 'Informativo (noticias locales, nacionales, internacionales y deportivas)', 
            tipo: 'informativo', 
            idioma: 'español' 
        },
        { 
            dias: ['domingo'], 
            horaInicio: '20:05', 
            horaFin: '22:00', 
            programa: 'EL VACILÓN DE LA NOCHE', 
            contenido: 'Musical variado y saludos por cumpleaños', 
            tipo: 'musical', 
            idioma: 'español' 
        }
    ];

    // Variables para paginación
    let elementosPorPagina = 10;
    let paginaActual = 1;
    let programasFiltrados = [];
    const btnPrimeraPagina = document.getElementById('btnPrimeraPagina');
    const btnPaginaAnterior = document.getElementById('btnPaginaAnterior');
    const btnPaginaSiguiente = document.getElementById('btnPaginaSiguiente');
    const btnUltimaPagina = document.getElementById('btnUltimaPagina');
    const numerosPagina = document.getElementById('numerosPagina');
    const paginacionInfo = document.getElementById('paginacionInfo');
    const selectRegistros = document.getElementById('selectRegistros');

    const form = document.getElementById('programacionForm');
    const tabla = document.getElementById('tablaProgramacion').querySelector('tbody');
    const filtroDia = document.getElementById('filtroDia');
    const btnAplicarFiltro = document.getElementById('aplicarFiltro');
    const btnLimpiar = document.getElementById('limpiar');
    
    // Configurar checkboxes para días múltiples
    const diasSemana = [
        { value: 'lunes', label: 'Lunes' },
        { value: 'martes', label: 'Martes' },
        { value: 'miercoles', label: 'Miércoles' },
        { value: 'jueves', label: 'Jueves' },
        { value: 'viernes', label: 'Viernes' },
        { value: 'sabado', label: 'Sábado' },
        { value: 'domingo', label: 'Domingo' }
    ];
    
    // Reemplazar el select de días por checkboxes
    const diaSemanaSelect = document.getElementById('diaSemana');
    const diasCheckboxContainer = document.createElement('div');
    diaSemanaSelect.parentNode.replaceChild(diasCheckboxContainer, diaSemanaSelect);
    
    diasCheckboxContainer.innerHTML = `
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Días de emisión:</label>
        <div class="dias-checkboxes" style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${diasSemana.map(dia => `
                <label style="display: flex; align-items: center; gap: 5px;">
                    <input type="checkbox" name="dias" value="${dia.value}">
                    ${dia.label}
                </label>
            `).join('')}
        </div>
    `;

    // Cargar datos iniciales
    filtrarYRenderizar();

    // Manejar envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const diasSeleccionados = Array.from(document.querySelectorAll('input[name="dias"]:checked')).map(cb => cb.value);
        
        if (diasSeleccionados.length === 0) {
            mostrarNotificacion('Seleccione al menos un día de emisión', 'error');
            return;
        }
        
        const nuevoPrograma = {
            dias: diasSeleccionados,
            horaInicio: form.horaInicio.value,
            horaFin: form.horaFin.value,
            programa: form.programa.value,
            contenido: form.contenido.value,
            tipo: form.tipoPrograma.value,
            idioma: form.idioma.value
        };
        
        // Validar solapamiento de horarios
        if (existeSolapamiento(nuevoPrograma)) {
            mostrarNotificacion('Error: El horario se solapa con otro programa existente', 'error');
            return;
        }
        
        programacion.push(nuevoPrograma);
        filtrarYRenderizar();
        form.reset();
        document.querySelectorAll('input[name="dias"]').forEach(cb => cb.checked = false);
        
        mostrarNotificacion('Programa agregado correctamente', 'success');
    });

    // Función para validar solapamientos
    function existeSolapamiento(nuevoPrograma) {
        return programacion.some(programa => {
            // Verificar si comparten algún día
            const diasComunes = programa.dias.filter(dia => nuevoPrograma.dias.includes(dia));
            if (diasComunes.length === 0) return false;
            
            // Convertir horas a minutos para comparación
            const inicioExistente = tiempoAMinutos(programa.horaInicio);
            const finExistente = tiempoAMinutos(programa.horaFin);
            const inicioNuevo = tiempoAMinutos(nuevoPrograma.horaInicio);
            const finNuevo = tiempoAMinutos(nuevoPrograma.horaFin);
            
            // Comprobar solapamiento
            return (inicioNuevo >= inicioExistente && inicioNuevo < finExistente) ||
                   (finNuevo > inicioExistente && finNuevo <= finExistente) ||
                   (inicioNuevo <= inicioExistente && finNuevo >= finExistente);
        });
    }
    
    function tiempoAMinutos(tiempo) {
        const [horas, minutos] = tiempo.split(':').map(Number);
        return horas * 60 + minutos;
    }

    // Limpiar formulario
    btnLimpiar.addEventListener('click', function() {
        form.reset();
        document.querySelectorAll('input[name="dias"]').forEach(cb => cb.checked = false);
    });

    // Filtrar programación
    btnAplicarFiltro.addEventListener('click', function() {
        filtrarYRenderizar();
    });

    // Función principal para filtrar y renderizar
    function filtrarYRenderizar() {
        const diaFiltro = filtroDia.value;
        programasFiltrados = [];
        
        // Aplanar la estructura y aplicar filtros
        programacion.forEach(programa => {
            programa.dias.forEach(dia => {
                if (diaFiltro === 'todos' || dia === diaFiltro) {
                    programasFiltrados.push({
                        ...programa,
                        dia: dia
                    });
                }
            });
        });
        
        // Ordenar
        programasFiltrados.sort((a, b) => {
            const ordenDias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
            const indexA = ordenDias.indexOf(a.dia);
            const indexB = ordenDias.indexOf(b.dia);
            
            if (indexA !== indexB) return indexA - indexB;
            return tiempoAMinutos(a.horaInicio) - tiempoAMinutos(b.horaInicio);
        });
        
        // Resetear a primera página
        paginaActual = 1;
        renderizarTabla();
    }

    // Función para renderizar la tabla con paginación
    function renderizarTabla() {
        const tablaBody = document.querySelector('#tablaProgramacion tbody');
        tablaBody.innerHTML = '';
        
        if (programasFiltrados.length === 0) {
            const fila = document.createElement('tr');
            fila.innerHTML = '<td colspan="6" style="text-align: center;">No hay programas para mostrar</td>';
            tablaBody.appendChild(fila);
            actualizarControlesPaginacion();
            return;
        }
        
        // Calcular índices para la paginación
        const inicio = (paginaActual - 1) * elementosPorPagina;
        const fin = Math.min(inicio + elementosPorPagina, programasFiltrados.length);
        
        // Renderizar solo los programas de la página actual
        for (let i = inicio; i < fin; i++) {
            const programa = programasFiltrados[i];
            const fila = document.createElement('tr');
            
            fila.innerHTML = `
                <td>${capitalizeFirstLetter(programa.dia)}</td>
                <td>${programa.horaInicio} - ${programa.horaFin}</td>
                <td>${programa.programa}</td>
                <td>${programa.contenido}</td>
                <td>${capitalizeFirstLetter(programa.tipo)}</td>
                <td class="acciones">
                    <button onclick="editarPrograma(${i})">Editar</button>
                    <button onclick="eliminarPrograma(${i})">Eliminar</button>
                </td>
            `;
            
            tablaBody.appendChild(fila);
        }
        
        actualizarControlesPaginacion();
    }

    // Función para actualizar los controles de paginación
    function actualizarControlesPaginacion() {
        const totalPaginas = Math.ceil(programasFiltrados.length / elementosPorPagina);
        
        // Actualizar información
        const inicio = (paginaActual - 1) * elementosPorPagina + 1;
        const fin = Math.min(paginaActual * elementosPorPagina, programasFiltrados.length);
        paginacionInfo.textContent = `Mostrando ${inicio}-${fin} de ${programasFiltrados.length} programas`;
        
        // Habilitar/deshabilitar botones
        btnPrimeraPagina.disabled = paginaActual === 1;
        btnPaginaAnterior.disabled = paginaActual === 1;
        btnPaginaSiguiente.disabled = paginaActual === totalPaginas || totalPaginas === 0;
        btnUltimaPagina.disabled = paginaActual === totalPaginas || totalPaginas === 0;
        
        // Generar números de página
        numerosPagina.innerHTML = '';
        
        if (totalPaginas > 0) {
            const paginasAMostrar = 5; // Máximo de números de página a mostrar
            let inicioPaginas = Math.max(1, paginaActual - Math.floor(paginasAMostrar / 2));
            let finPaginas = Math.min(totalPaginas, inicioPaginas + paginasAMostrar - 1);
            
            // Ajustar si no estamos mostrando suficientes páginas
            if (finPaginas - inicioPaginas + 1 < paginasAMostrar) {
                inicioPaginas = Math.max(1, finPaginas - paginasAMostrar + 1);
            }
            
            // Agregar botón para la primera página si es necesario
            if (inicioPaginas > 1) {
                agregarBotonPagina(1);
                if (inicioPaginas > 2) {
                    agregarSeparador();
                }
            }
            
            // Agregar páginas principales
            for (let i = inicioPaginas; i <= finPaginas; i++) {
                agregarBotonPagina(i);
            }
            
            // Agregar botón para la última página si es necesario
            if (finPaginas < totalPaginas) {
                if (finPaginas < totalPaginas - 1) {
                    agregarSeparador();
                }
                agregarBotonPagina(totalPaginas);
            }
        }
    }

    function agregarBotonPagina(numeroPagina) {
        const btn = document.createElement('button');
        btn.textContent = numeroPagina;
        btn.className = 'paginacion-btn';
        if (numeroPagina === paginaActual) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', () => {
            paginaActual = numeroPagina;
            renderizarTabla();
        });
        numerosPagina.appendChild(btn);
    }

    function agregarSeparador() {
        const span = document.createElement('span');
        span.textContent = '...';
        span.className = 'separador-pagina';
        numerosPagina.appendChild(span);
    }

    // Event listeners para los botones de paginación
    btnPrimeraPagina.addEventListener('click', () => {
        paginaActual = 1;
        renderizarTabla();
    });

    btnPaginaAnterior.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderizarTabla();
        }
    });

    btnPaginaSiguiente.addEventListener('click', () => {
        const totalPaginas = Math.ceil(programasFiltrados.length / elementosPorPagina);
        if (paginaActual < totalPaginas) {
            paginaActual++;
            renderizarTabla();
        }
    });

    btnUltimaPagina.addEventListener('click', () => {
        paginaActual = Math.ceil(programasFiltrados.length / elementosPorPagina);
        renderizarTabla();
    });

    // Event listener para cambiar número de registros por página
    selectRegistros.addEventListener('change', (e) => {
        elementosPorPagina = parseInt(e.target.value);
        paginaActual = 1;
        renderizarTabla();
    });

    // Función para mostrar notificaciones
    function mostrarNotificacion(mensaje, tipo) {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion ${tipo}`;
        notificacion.textContent = mensaje;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.classList.add('mostrar');
        }, 10);
        
        setTimeout(() => {
            notificacion.classList.remove('mostrar');
            setTimeout(() => {
                document.body.removeChild(notificacion);
            }, 300);
        }, 3000);
    }

    // Funciones globales para editar y eliminar
    window.editarPrograma = function(index) {
        const programa = programasFiltrados[index];
        
        // Buscar el programa original en el array programacion
        const programaOriginal = programacion.find(p => 
            p.programa === programa.programa && 
            p.horaInicio === programa.horaInicio && 
            p.horaFin === programa.horaFin
        );
        
        if (programaOriginal) {
            // Marcar los checkboxes correspondientes
            document.querySelectorAll('input[name="dias"]').forEach(cb => {
                cb.checked = programaOriginal.dias.includes(cb.value);
            });
            
            // Llenar el formulario
            form.horaInicio.value = programaOriginal.horaInicio;
            form.horaFin.value = programaOriginal.horaFin;
            form.programa.value = programaOriginal.programa;
            form.contenido.value = programaOriginal.contenido;
            form.tipoPrograma.value = programaOriginal.tipo;
            form.idioma.value = programaOriginal.idioma;
            
            // Eliminar el programa original
            programacion = programacion.filter(p => p !== programaOriginal);
            
            mostrarNotificacion('Programa cargado para edición', 'info');
            filtrarYRenderizar();
        }
    };

    window.eliminarPrograma = function(index) {
        const programa = programasFiltrados[index];
        
        if (confirm(`¿Está seguro de eliminar el programa "${programa.programa}" del día ${capitalizeFirstLetter(programa.dia)}?`)) {
            // Encontrar y eliminar el programa original
            programacion = programacion.filter(p => 
                !(p.programa === programa.programa && 
                  p.horaInicio === programa.horaInicio && 
                  p.horaFin === programa.horaFin)
            );
            
            mostrarNotificacion('Programa eliminado correctamente', 'success');
            filtrarYRenderizar();
        }
    };

    // Función helper para capitalizar strings
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});