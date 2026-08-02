document.addEventListener('DOMContentLoaded', () => {
    const authScreen = document.getElementById('authScreen');
    const appScreen = document.getElementById('appScreen');
    const licenseKeyInput = document.getElementById('licenseKey');
    const activateBtn = document.getElementById('activateBtn');
    const authError = document.getElementById('authError');
    const logoutBtn = document.getElementById('logoutBtn');

    // 1. Claves válidas de ejemplo (puedes modificarlas, guardarlas en una BD o usar una API)
    const validKeys = [
        "VIP-1234-ABCD",
        "VIP-5678-EFGH",
        "VIP-9876-WXYZ"
    ];

    // 2. Verificar si ya hay una sesión activa al cargar la página
    const currentSession = localStorage.getItem('imc_active_license');
    if (currentSession) {
        authScreen.classList.add('hidden');
        appScreen.classList.remove('hidden');
    }

    // 3. Evento para el botón de activación
    activateBtn.addEventListener('click', () => {
        const enteredKey = licenseKeyInput.value.trim();

        // Validación básica de campos vacíos
        if (!enteredKey) {
            showError("Por favor, introduce una clave.");
            return;
        }

        // Comprobar si la clave es válida
        if (validKeys.includes(enteredKey)) {
            // Guardar en localStorage para mantener la sesión
            localStorage.setItem('imc_active_license', enteredKey);
            
            // Ocultar error si lo había
            authError.classList.add('hidden');
            
            // Transición de pantallas
            authScreen.classList.add('hidden');
            appScreen.classList.remove('hidden');
            
            // Limpiar input
            licenseKeyInput.value = '';
        } else {
            showError("Clave inválida o ya en uso.");
        }
    });

    // 4. Evento para cerrar sesión (Cerrar sesión / Desactivar)
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('imc_active_license');
            appScreen.classList.add('hidden');
            authScreen.classList.remove('hidden');
            licenseKeyInput.value = '';
        });
    }

    // Función auxiliar para mostrar errores
    function showError(message) {
        authError.textContent = message;
        authError.classList.remove('hidden');
    }
});
