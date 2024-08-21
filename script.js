// script.js
document.addEventListener('DOMContentLoaded', () => {
    const addProductBtn = document.getElementById('addProductBtn');
    const removeAllBtn = document.getElementById('removeAllBtn');
    const newSectionBtn = document.getElementById('newSectionBtn');
    const sectionsContainer = document.getElementById('sectionsContainer');

    let sectionCount = 1;
    let productCount = 0;

    addProductBtn.addEventListener('click', () => {
        const activeSection = document.querySelector('.productSection.active');
        if (!activeSection) {
            alert('Por favor, crea una nueva sección primero.');
            return;
        }

        productCount++;
        const productName = prompt("Nombre del Producto:");
        const price = parseFloat(prompt("Precio del Producto (CLP):"));
        const volume = parseFloat(prompt("Volumen del Producto:"));
        const unit = prompt("Unidad del Volumen (ml, g, kg, L, etc.):").toLowerCase();

        if (productName && !isNaN(price) && !isNaN(volume) && volume > 0 && unit) {
            const costPerUnit = calculateCostPerUnit(price, volume, unit);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${productCount}</td>
                <td>${productName}</td>
                <td>${price.toFixed(2)}</td>
                <td>${volume.toFixed(2)}</td>
                <td>${unit}</td>
                <td>${costPerUnit.toFixed(2)}</td>
                <td><button class="remove-btn">Eliminar</button></td>
            `;
            activeSection.querySelector('.productTable tbody').appendChild(row);

            row.querySelector('.remove-btn').addEventListener('click', () => {
                row.remove();
                sortTable(activeSection);
            });

            sortTable(activeSection);
        } else {
            alert("Por favor, ingresa valores válidos.");
        }
    });

    removeAllBtn.addEventListener('click', () => {
        const activeSection = document.querySelector('.productSection.active');
        if (activeSection) {
            activeSection.querySelector('.productTable tbody').innerHTML = '';
            activeSection.querySelector('.difference').textContent = '';
        }
    });

    newSectionBtn.addEventListener('click', () => {
        sectionCount++;
        const section = document.createElement('section');
        section.className = 'productSection';
        section.innerHTML = `
            <h2>Sección ${sectionCount}</h2>
            <table class="productTable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre del Producto</th>
                        <th>Precio (CLP)</th>
                        <th>Volumen</th>
                        <th>Unidad</th>
                        <th>Costo por Unidad (CLP/unidad)</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Los productos se agregarán aquí -->
                </tbody>
            </table>
            <div class="difference"></div>
        `;
        sectionsContainer.appendChild(section);
        setActiveSection(section);
    });

    function setActiveSection(section) {
        const allSections = document.querySelectorAll('.productSection');
        allSections.forEach(sec => sec.classList.remove('active'));
        section.classList.add('active');
    }

    function sortTable(section) {
        const rows = Array.from(section.querySelector('.productTable tbody').querySelectorAll('tr'));
        rows.sort((a, b) => {
            const costA = parseFloat(a.querySelector('td:nth-child(6)').textContent);
            const costB = parseFloat(b.querySelector('td:nth-child(6)').textContent);
            return costA - costB;
        });

        section.querySelector('.productTable tbody').innerHTML = '';
        rows.forEach(row => section.querySelector('.productTable tbody').appendChild(row));

        highlightRows(section);
    }

    function highlightRows(section) {
        const rows = section.querySelectorAll('.productTable tbody tr');
        if (rows.length > 0) {
            rows.forEach(row => row.classList.remove('green', 'red')); // Elimina los colores antiguos

            rows[0].classList.add('green'); // Producto más barato
            rows[rows.length - 1].classList.add('red'); // Producto más caro

            const cheapestCost = parseFloat(rows[0].querySelector('td:nth-child(6)').textContent);
            const mostExpensiveCost = parseFloat(rows[rows.length - 1].querySelector('td:nth-child(6)').textContent);

            section.querySelector('.difference').textContent = `Diferencia de costo entre el producto más barato y el más caro: ${(mostExpensiveCost - cheapestCost).toFixed(2)} CLP/unidad`;
        } else {
            section.querySelector('.difference').textContent = ''; // Limpiar la diferencia si no hay productos
        }
    }

    function calculateCostPerUnit(price, volume, unit) {
        // Convertir todas las unidades a mililitros para la comparación
        const volumeInMl = convertToMl(volume, unit);
        return price / volumeInMl;
    }

    function convertToMl(volume, unit) {
        switch (unit) {
            case 'ml':
                return volume;
            case 'l':
                return volume * 1000;
            case 'g':
                return volume; // Asumiendo que la densidad del producto es 1 g/ml para simplificar
            case 'kg':
                return volume * 1000;
            default:
                alert("Unidad no reconocida. Se asumirá 1 ml.");
                return volume; // Valor por defecto
        }
    }

    // Inicialmente, establecemos la primera sección como activa
    setActiveSection(document.querySelector('.productSection'));
});