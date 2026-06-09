document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS DEL CHATBOT ---
    const trigger = document.getElementById('chat-trigger');
    const container = document.getElementById('chat-container');
    const btnCerrar = document.getElementById('btn-cerrar');
    const inputUsuario = document.getElementById('input-usuario');
    const btnEnviar = document.getElementById('btn-enviar');
    const boxMensajes = document.getElementById('box-mensajes');
    const btnConsultarCard = document.querySelectorAll('.card-propiedad');

    let isOpen = false;

    function abrirCerrarChat() {
        isOpen = !isOpen;
        container.style.display = isOpen ? 'flex' : 'none';
        if (isOpen) inputUsuario.focus();
    }

    trigger.addEventListener('click', abrirCerrarChat);
    btnCerrar.addEventListener('click', abrirCerrarChat);

    function insertarMensaje(texto, emisor) {
        const div = document.createElement('div');
        div.className = `msg ${emisor === 'user' ? 'u-msg' : 'b-msg'}`;
        div.innerHTML = texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        boxMensajes.appendChild(div);
        boxMensajes.scrollTop = boxMensajes.scrollHeight;
    }

    function procesarMensaje() {
        const mensaje = inputUsuario.value.trim();
        if (mensaje === '') return;

        insertarMensaje(mensaje, 'user');
        inputUsuario.value = '';

        setTimeout(() => {
            evaluarRespuestaIA(mensaje);
        }, 800);
    }

    btnEnviar.addEventListener('click', procesarMensaje);
    inputUsuario.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') procesarMensaje();
    });

    btnConsultarCard.forEach(card => {
        const boton = card.querySelector('.btn-consultar');
        const nombrePropiedad = card.getAttribute('data-name');

        boton.addEventListener('click', () => {
            if (!isOpen) abrirCerrarChat();
            insertarMensaje(`Hola, me interesa conocer las condiciones para: **${nombrePropiedad}**`, 'user');

            setTimeout(() => {
                insertarMensaje(`¡Excelente propiedad! Para **${nombrePropiedad}** actualmente estamos agendando visitas corporativas y particulares. ¿Te gustaría conocer los requisitos de ingreso con recibo de sueldo o preferís dejar un contacto para agendar un día esta semana?`, 'bot');
            }, 800);
        });
    });

    function evaluarRespuestaIA(msg) {
        const texto = msg.toLowerCase();
        let respuesta = "";

        if (texto.includes('requisito') || texto.includes('necesito') || texto.includes('garantia') || texto.includes('recibo')) {
            respuesta = "Para alquilar con nosotros solicitamos: <br>1. **Recibo de sueldo** del titular (que triplique el costo locativo).<br>2. **Dos garantes** con ingresos demostrables en la provincia de Salta.<br>¿Cumplís con este perfil o querés consultar por seguros de caución?";
        } 
        else if (texto.includes('visita') || texto.includes('ver') || texto.includes('conocer') || texto.includes('coordinar')) {
            respuesta = "Coordinamos visitas programadas de Lunes a Sábados. Por favor, escribime tu **nombre completo y celular**, y el tasador asignado te llamará de inmediato para guardar tu turno.";
        } 
        else if (texto.includes('comision') || texto.includes('gasto') || texto.includes('deposito') || texto.includes('pagar para entrar')) {
            respuesta = "Los costos de ingreso estándar incluyen: 1 mes de adelanto, 1 mes de depósito en garantía y honorarios del corredor matriculado según ley provincial. ¿Te gustaría calcular el total exacto para alguna de nuestras unidades?";
        } 
        else {
            respuesta = "Recibido. He registrado tu consulta en nuestro sistema operativo inmobiliario. Dejame un **número de WhatsApp de contacto** y te enviaremos las fichas técnicas extendidas y planos en PDF.";
        }

        insertarMensaje(respuesta, 'bot');
    }

    // --- LÓGICA DE FILTRADO DINÁMICO DE LA WEB ---
    const filterType = document.getElementById('filter-type');
    const filterZone = document.getElementById('filter-zone');
    const searchSubmit = document.getElementById('search-submit');

    searchSubmit.addEventListener('click', () => {
        const selectedType = filterType.value;
        const selectedZone = filterZone.value;

        btnConsultarCard.forEach(card => {
            const cardType = card.getAttribute('data-type');
            const cardZone = card.getAttribute('data-zone');

            // Lógica condicional de visibilidad
            const matchesType = (selectedType === 'all' || cardType === selectedType);
            const matchesZone = (selectedZone === 'all' || cardZone === selectedZone);

            if (matchesType && matchesZone) {
                card.style.display = 'flex'; // Muestra la tarjeta
            } else {
                card.style.display = 'none'; // Oculta la tarjeta que no coincide
            }
        });

        // Hacer scroll automático hacia la sección del catálogo filtrado
        document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
    });
});