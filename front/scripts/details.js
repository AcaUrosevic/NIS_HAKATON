// Get machine ID from URL
const params = new URLSearchParams(window.location.search);
const machineId = params.get('name');
let currentPage = 1;
// Fetch machine details from the API
fetch(`http://localhost:3000/get_machines/${machineId}`)
    .then(response => response.json())
    .then(machine => {
        // Display machine data
        document.getElementById('machine-name').innerText = machine[0].name;
        document.getElementById('telemetry-data').innerHTML = `<p>Last Tested: ${machine[0].poslednji}</p>`;
        document.getElementById('prediction').innerHTML = `<p>Prediction: ${machine[0].prediction}</p>`;
        document.getElementById('well').value = machine[0].name;

        // Display failure type
        document.getElementById('failure-data').innerHTML = `<p>Failure Type: ${machine[0].failure_type}</p>`;
    })
    .catch(error => console.error('Error fetching machine details:', error));

    const addMeasurementButton = document.getElementById('add-measurement-button');
    const measurementForm = document.getElementById('measurement-form');
    const closeMeasurementFormButton = document.getElementById('close-measurement-form');
    

    addMeasurementButton.addEventListener('click', () => {
        measurementForm.style.display = 'block'; // Show the form
    });
    
    closeMeasurementFormButton.addEventListener('click', () => {
        measurementForm.style.display = 'none'; // Hide the form
    });

    document.getElementById('new-measurement-form').addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission behavior
    
        // Gather form data
        const well = document.getElementById('well').value;
        const measure_date = document.getElementById('measure_date').value;
        const napon_ab = document.getElementById('napon_ab').value;
        const napon_bc = document.getElementById('napon_bc').value;
        const napon_ca = document.getElementById('napon_ca').value;
        const struja_a = document.getElementById('struja_a').value;
        const struja_b = document.getElementById('struja_b').value;
        const struja_c = document.getElementById('struja_c').value;
        const koef_kap = document.getElementById('koef_kap').value;
        const frekvencija = document.getElementById('frekvencija').value;
        const radno_opterecenje = document.getElementById('radno_opterecenje').value;
        const aktivna_snaga = document.getElementById('aktivna_snaga').value;
        const pritisak = document.getElementById('pritisak').value;
        const temp_motora = document.getElementById('temp_motora').value;
        const temp_busotina = document.getElementById('temp_busotina').value;
    
        // Create a JSON object with the form data
        const measurementData = {
            well: well,
            measure_date: measure_date,
            napon_ab: napon_ab,
            napon_bc: napon_bc,
            napon_ca: napon_ca,
            struja_a: struja_a,
            struja_b: struja_b,
            struja_c: struja_c,
            koef_kap: koef_kap,
            frekvencija: frekvencija,
            radno_opterecenje: radno_opterecenje,
            aktivna_snaga: aktivna_snaga,
            pritisak: pritisak,
            temp_motora: temp_motora,
            temp_busotina: temp_busotina
        };
    
        // Send POST request with form data as JSON
        fetch('http://localhost:3000/add_measurement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(measurementData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Measurement added:', data);
            // Optionally, you can hide the form after successful submission
            measurementForm.style.display = 'none';
        })
        .catch(error => console.error('Error adding measurement:', error));
    });
    function loadMeasurements(page = 1) {
        fetch(`http://localhost:3000/get_measurements/${machineId}?page=${page}`)
            .then(response => response.json())
            .then(data => {
                const tbody = document.getElementById('measurement-tbody');
                tbody.innerHTML = '';  // Clear the table
    
                // Loop through the measurement data and append rows to the table
                data.forEach(measurement => {
                    const row = `<tr>
                        <td>${measurement.measure_date}</td>
                        <td>${measurement.napon_ab}</td>
                        <td>${measurement.napon_bc}</td>
                        <td>${measurement.napon_ca}</td>
                        <td>${measurement.struja_a}</td>
                        <td>${measurement.struja_b}</td>
                        <td>${measurement.struja_c}</td>
                        <td>${measurement.koef_kap}</td>
                        <td>${measurement.frekvencija}</td>
                        <td>${measurement.radno_opterecenje}</td>
                        <td>${measurement.aktivna_snaga}</td>
                        <td>${measurement.pritisak}</td>
                        <td>${measurement.temp_motora}</td>
                        <td>${measurement.temp_busotina}</td>
                    </tr>`;
                    tbody.insertAdjacentHTML('beforeend', row);
                });
            })
            .catch(error => console.error('Error loading measurements:', error));
    }
    // Load initial measurements
    loadMeasurements(currentPage);
    
    // Pagination controls
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage >= 1) {
            currentPage--;
            loadMeasurements(currentPage);
            document.getElementById('current-page').innerText = `Page ${currentPage + 1}`;
        }
    });
    
    document.getElementById('next-page').addEventListener('click', () => {
        currentPage++;
        loadMeasurements(currentPage);
        document.getElementById('current-page').innerText = `Page ${currentPage + 1}`;
    });
