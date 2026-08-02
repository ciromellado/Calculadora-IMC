const authScreen = document.getElementById('authScreen');
const appScreen = document.getElementById('appScreen');
const activateBtn = document.getElementById('activateBtn');
const logoutBtn = document.getElementById('logoutBtn');
const licenseInput = document.getElementById('licenseKey');
const authError = document.getElementById('authError');

const ageTypeSelect = document.getElementById('ageType');
const genderGroup = document.getElementById('genderGroup');
const ageGroup = document.getElementById('ageGroup');

// Mostrar u ocultar campos de niños según selección
ageTypeSelect.addEventListener('change', () => {
    if (ageTypeSelect.value === 'child') {
        genderGroup.classList.remove('hidden');
        ageGroup.classList.remove('hidden');
    } else {
        genderGroup.classList.add('hidden');
        ageGroup.classList.add('hidden');
    }
});

// Comprobar licencia guardada al iniciar
window.addEventListener('DOMContentLoaded', () => {
    const savedLicense = localStorage.getItem('imc_license_token');
    if (savedLicense) {
        mostrarCalculadora();
    }
});

// Activación de Licencia conectada a Cloudflare Worker (Versión Segura)
activateBtn.addEventListener('click', async () => {
    const key = licenseInput.value.trim();
    if (!key) {
        mostrarError('Por favor, introduce una clave.');
        return;
    }

    let deviceId = localStorage.getItem('imc_device_id');
    if (!deviceId) {
        deviceId = 'dev_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('imc_device_id', deviceId);
    }

    activateBtn.textContent = 'Verificando...';
    activateBtn.disabled = true;

    try {
        const WORKER_URL = "https://imc-licencias.ciromellado.workers.dev/api/verify";
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                licenseKey: key,
                deviceId: deviceId
            })
        });

        // 1. Obtenemos el texto primero para validar que no esté vacío
        const responseText = await response.text();

        if (!responseText || responseText.trim() === "") {
            throw new Error("El servidor devolvió una respuesta vacía.");
        }

        // 2. Intentamos parsear de forma segura por si el servidor devuelve HTML o texto plano en vez de JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseErr) {
            throw new Error("Respuesta no válida del servidor: " + responseText.substring(0, 50));
        }

        if (response.ok && data.success) {
            localStorage.setItem('imc_license_token', key);
            mostrarCalculadora();
        } else {
            mostrarError(data.message || 'Clave no válida o ya en uso.');
        }

    } catch (err) {
        console.error("Error en la validación:", err);
        mostrarError(err.message || 'Error de conexión o respuesta inválida del servidor.');
    } finally {
        activateBtn.textContent = 'Activar Aplicación';
        activateBtn.disabled = false;
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('imc_license_token');
    appScreen.classList.add('hidden');
    authScreen.classList.remove('hidden');
    licenseInput.value = '';
});

function mostrarCalculadora() {
    authScreen.classList.add('hidden');
    appScreen.classList.remove('hidden');
}

function mostrarError(mensaje) {
    authError.textContent = mensaje;
    authError.classList.remove('hidden');
}

// Lógica de cálculo mixta (Adultos y Niños)
document.getElementById('calculateBtn').addEventListener('click', () => {
    const type = ageTypeSelect.value;
    const weightInput = document.getElementById('weight').value;
    const heightInput = document.getElementById('height').value;

    if (!weightInput || !heightInput) {
        alert('Por favor, completa los campos de peso y altura.');
        return;
    }

    const weight = parseFloat(weightInput);
    let height = parseFloat(heightInput);

    // Corrección automática si ponen metros (ej: 1.75 en vez de 175)
    if (height < 3) height = height * 100;

    if (height < 50 || height > 250 || weight < 5 || weight > 500) {
        alert('Por favor, introduce valores lógicos.');
        return;
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const roundedBmi = bmi.toFixed(1);

    let category = '';
    let color = '';
    let detail = '';

    if (type === 'adult') {
        // Lógica Adultos
        if (bmi < 18.5) {
            category = 'Bajo peso';
            color = '#3b82f6';
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Peso normal (Saludable)';
            color = '#10b981';
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Sobrepeso';
            color = '#f59e0b';
        } else {
            category = 'Obesidad';
            color = '#ef4444';
        }
        detail = 'Criterio estándar para adultos (20+ años)';
    } else {
        // Lógica Niños / Adolescentes (Simulación simplificada de Percentiles OMS)
        const age = parseInt(document.getElementById('age').value);
        if (!age || age < 2 || age > 19) {
            alert('Por favor, introduce una edad válida para niños (entre 2 y 19 años).');
            return;
        }

        if (bmi < 14) {
            category = 'Bajo peso (Percentil < 5)';
            color = '#3b82f6';
        } else if (bmi >= 14 && bmi < 22) {
            category = 'Peso saludable (Percentil 5 al 85)';
            color = '#10b981';
        } else if (bmi >= 22 && bmi < 26) {
            category = 'Sobrepeso (Percentil 85 al 95)';
            color = '#f59e0b';
        } else {
            category = 'Obesidad (Percentil > 95)';
            color = '#ef4444';
        }
        detail = `Evaluación pediátrica orientativa (Edad: ${age} años)`;
    }

    const resultContainer = document.getElementById('resultContainer');
    const bmiValueEl = document.getElementById('bmiValue');
    const bmiCategoryEl = document.getElementById('bmiCategory');
    const bmiDetailEl = document.getElementById('bmiDetail');

    bmiValueEl.textContent = roundedBmi;
    bmiValueEl.style.color = color;
    bmiCategoryEl.textContent = category;
    bmiCategoryEl.style.color = color;
    bmiDetailEl.textContent = detail;

    resultContainer.classList.remove('hidden');
});

// Botón de Reiniciar / Borrar
const resetBtn = document.getElementById('resetBtn');

resetBtn.addEventListener('click', () => {
    document.getElementById('weight').value = '';
    document.getElementById('height').value = '';
    document.getElementById('age').value = '';
    
    document.getElementById('resultContainer').classList.add('hidden');
    
    ageTypeSelect.value = 'adult';
    genderGroup.classList.add('hidden');
    ageGroup.classList.add('hidden');
    
    document.getElementById('weight').focus();
});

// Service Worker para offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log(err));
    });
}