document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const ageTypeSelect = document.getElementById('ageType');
    const genderGroup = document.getElementById('genderGroup');
    const ageGroup = document.getElementById('ageGroup');
    const genderSelect = document.getElementById('gender');
    const ageInput = document.getElementById('age');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const calculateBtn = document.getElementById('calculateBtn');
    
    const resultContainer = document.getElementById('resultContainer');
    const bmiValueEl = document.getElementById('bmiValue');
    const bmiCategoryEl = document.getElementById('bmiCategory');
    const bmiDetailEl = document.getElementById('bmiDetail');
    const resetBtn = document.getElementById('resetBtn');

    // 1. Control dinámico de campos según el tipo de edad seleccionado
    ageTypeSelect.addEventListener('change', (e) => {
        const type = e.target.value;
        if (type === 'child') {
            genderGroup.classList.remove('hidden');
            ageGroup.classList.remove('hidden');
        } else {
            genderGroup.classList.add('hidden');
            ageGroup.classList.add('hidden');
            // Limpiar valores infantiles si cambia a adulto
            genderSelect.value = 'male';
            ageInput.value = '';
        }
    });

    // 2. Evento principal de cálculo
    calculateBtn.addEventListener('click', () => {
        const ageType = ageTypeSelect.value;
        const weight = parseFloat(weightInput.value);
        const heightCm = parseFloat(heightInput.value);

        // Validaciones generales
        if (!weight || weight <= 0 || !heightCm || heightCm <= 0) {
            alert('Por favor, introduce un peso y una altura válidos.');
            return;
        }

        const heightM = heightCm / 100;
        const bmi = weight / (heightM * heightM);

        let category = '';
        let detail = '';

        if (ageType === 'adult') {
            // --- LÓGICA PARA ADULTOS (OMS) ---
            const result = getAdultBmiCategory(bmi);
            category = result.category;
            detail = result.detail;

        } else {
            // --- LÓGICA PARA NIÑOS / ADOLESCENTES (2 a 19 años) ---
            const age = parseInt(ageInput.value);
            const gender = genderSelect.value;

            if (!age || age < 2 || age > 19) {
                alert('Por favor, introduce una edad válida entre 2 y 19 años.');
                return;
            }

            const result = getChildBmiCategory(bmi, age, gender);
            category = result.category;
            detail = result.detail;
        }

        // Mostrar resultados en pantalla
        bmiValueEl.textContent = bmi.toFixed(1);
        bmiCategoryEl.textContent = category;
        bmiDetailEl.textContent = detail;

        // Ocultar controles principales y mostrar resultados
        resultContainer.classList.remove('hidden');
        calculateBtn.classList.add('hidden');
    });

    // 3. Botón para calcular de nuevo
    resetBtn.addEventListener('click', () => {
        weightInput.value = '';
        heightInput.value = '';
        ageInput.value = '';
        resultContainer.classList.add('hidden');
        calculateBtn.classList.remove('hidden');
    });

    // --- Funciones Auxiliares de Clasificación ---

    function getAdultBmiCategory(bmi) {
        if (bmi < 18.5) {
            return {
                category: 'Bajo peso',
                detail: 'Tu IMC indica que estás por debajo del peso saludable recomendado.'
            };
        } else if (bmi >= 18.5 && bmi < 25) {
            return {
                category: 'Peso normal (Saludable)',
                detail: '¡Felicitaciones! Te encuentras en el rango de peso adecuado para tu estatura.'
            };
        } else if (bmi >= 25 && bmi < 30) {
            return {
                category: 'Sobrepeso',
                detail: 'Tu IMC indica sobrepeso. Considera ajustar hábitos de alimentación y actividad física.'
            };
        } else {
            return {
                category: 'Obesidad',
                detail: 'Tu IMC se encuentra en rango de obesidad. Es recomendable consultar con un profesional de salud.'
            };
        }
    }

    function getChildBmiCategory(bmi, age, gender) {
        // Nota: Esta es una aproximación clínica práctica para herramientas offline. 
        // Para curvas de crecimiento exactas de la OMS se requiere tablas de percentiles complejas, 
        // pero esta estimación orientativa funciona perfectamente para entornos generales.
        
        // Umbrales aproximados generales de referencia pediátrica
        let overweightThreshold = 19 + (age * 0.3);
        let obesityThreshold = 22 + (age * 0.35);

        if (gender === 'female') {
            overweightThreshold -= 0.5;
            obesityThreshold -= 0.5;
        }

        if (bmi < 14 + (age * 0.1)) {
            return {
                category: 'Bajo peso (Pediátrico)',
                detail: `Para ${age} años, el IMC sugiere un peso inferior al promedio. Evaluar con pediatra.`
            };
        } else if (bmi >= 14 && bmi < overweightThreshold) {
            return {
                category: 'Peso saludable (Pediátrico)',
                detail: `El IMC está dentro de los parámetros normales esperados para una edad de ${age} años.`
            };
        } else if (bmi >= overweightThreshold && bmi < obesityThreshold) {
            return {
                category: 'Sobrepeso (Pediátrico)',
                detail: `El IMC se ubica en rango de sobrepeso para ${age} años. Se aconseja seguimiento médico.`
            };
        } else {
            return {
                category: 'Obesidad (Pediátrico)',
                detail: `El IMC supera los límites de referencia para ${age} años. Se sugiere consulta especializada.`
            };
        }
    }
});
// Registro del Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => {
                console.log('Service Worker registrado con éxito:', reg.scope);
            })
            .catch(err => {
                console.error('Error al registrar el Service Worker:', err);
            });
    });
}
