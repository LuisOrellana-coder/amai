document.addEventListener('DOMContentLoaded', () => {
    // --- BASE DE DATOS DE PRECIOS (Valores estimados en CLP) ---

    // Costo base por tamaño. Incluye ingredientes básicos (harina, huevo, azúcar),
    // mano de obra base y costos fijos (luz, gas, uso de maquinaria).
    const COSTOS_BASE = {
        10: 15000, // para 10-15 personas
        20: 25000, // para 20-25 personas
        30: 35000, // para 30-35 personas
        40: 45000, // para 40-50 personas
    };

    // Costos adicionales por tipo de bizcocho (ingredientes más caros)
    const COSTOS_BIZCOCHO = {
        vainilla: 0,
        chocolate: 2000,
        'red-velvet': 3500,
        zanahoria: 3000,
    };

    // Costos por relleno
    const COSTOS_RELLENO = {
        manjar: 2500,
        'crema-pastelera': 2000,
        'mermelada-frutilla': 1500,
        'mousse-chocolate': 3500,
        'crema-lucuma': 4000,
    };

    // Costos por cobertura (refleja la complejidad y el costo del material)
    const COSTOS_COBERTURA = {
        merengue: 1500,
        buttercream: 3000,
        ganache: 5000,
        fondant: 8000, // Más caro por material y mano de obra
    };

    // Costos de los extras
    const COSTOS_EXTRAS = {
        frutas: 4500,
        'drip-cake': 3000,
        flores: 6000,
        'figura-fondant': 7000,
    };

    // --- ELEMENTOS DEL DOM ---
    const form = document.getElementById('cake-calculator-form');
    const priceBreakdownDiv = document.getElementById('price-breakdown');
    const finalPriceP = document.getElementById('final-price');
    const rellenosContainer = document.getElementById('rellenos-container');

    // --- LÓGICA DE CÁLCULO ---

    function formatCurrency(value) {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
    }

    function calculatePrice() {
        const formData = new FormData(form);
        let total = 0;
        let breakdownHTML = '';

        // 1. Costo Base por Tamaño
        const size = formData.get('size');
        total += COSTOS_BASE[size];
        breakdownHTML += `<div class="price-item"><span class="label">Costo Base (${size} pers.)</span><span class="cost">${formatCurrency(COSTOS_BASE[size])}</span></div>`;

        // 2. Costo del Bizcocho
        const bizcocho = formData.get('bizcocho');
        if (COSTOS_BIZCOCHO[bizcocho] > 0) {
            total += COSTOS_BIZCOCHO[bizcocho];
            breakdownHTML += `<div class="price-item"><span class="label">Bizcocho de ${bizcocho.replace('-', ' ')}</span><span class="cost">${formatCurrency(COSTOS_BIZCOCHO[bizcocho])}</span></div>`;
        }

        // 3. Costo de Rellenos
        const rellenos = formData.getAll('relleno');
        if (rellenos.length > 0) {
            breakdownHTML += `<div class="price-item"><span class="label">Rellenos:</span><span class="cost"></span></div>`;
            rellenos.forEach(relleno => {
                total += COSTOS_RELLENO[relleno];
                breakdownHTML += `<div class="price-item" style="padding-left: 1rem;"><span class="label">- ${relleno.replace('-', ' ')}</span><span class="cost">${formatCurrency(COSTOS_RELLENO[relleno])}</span></div>`;
            });
        }

        // 4. Costo de Cobertura
        const cobertura = formData.get('cobertura');
        total += COSTOS_COBERTURA[cobertura];
        breakdownHTML += `<div class="price-item"><span class="label">Cobertura de ${cobertura.replace('-', ' ')}</span><span class="cost">${formatCurrency(COSTOS_COBERTURA[cobertura])}</span></div>`;

        // 5. Costo de Extras
        const extras = formData.getAll('extra');
        if (extras.length > 0) {
            breakdownHTML += `<div class="price-item"><span class="label">Extras:</span><span class="cost"></span></div>`;
            extras.forEach(extra => {
                total += COSTOS_EXTRAS[extra];
                breakdownHTML += `<div class="price-item" style="padding-left: 1rem;"><span class="label">- ${extra.replace('-', ' ')}</span><span class="cost">${formatCurrency(COSTOS_EXTRAS[extra])}</span></div>`;
            });
        }

        // Actualizar la UI
        priceBreakdownDiv.innerHTML = breakdownHTML;
        finalPriceP.textContent = formatCurrency(total);
    }

    // Limitar la selección de rellenos a un máximo de 2
    function limitRellenoSelection() {
        const checkedRellenos = rellenosContainer.querySelectorAll('input[type="checkbox"]:checked');
        const allRellenos = rellenosContainer.querySelectorAll('input[type="checkbox"]');

        if (checkedRellenos.length >= 2) {
            allRellenos.forEach(checkbox => {
                if (!checkbox.checked) {
                    checkbox.disabled = true;
                }
            });
        } else {
            allRellenos.forEach(checkbox => {
                checkbox.disabled = false;
            });
        }
    }

    // --- EVENT LISTENERS ---
    form.addEventListener('change', calculatePrice);
    rellenosContainer.addEventListener('change', limitRellenoSelection);

    // --- CÁLCULO INICIAL ---
    calculatePrice();
    limitRellenoSelection();
});

