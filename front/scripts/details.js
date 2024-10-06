// Get machine ID from URL
const params = new URLSearchParams(window.location.search);
const machineId = params.get('name');
let currentPage = 1;
// Fetch machine details from the API
fetch(`http://localhost:3000/get_machines/${machineId}`)
    .then(response => response.json())
    .then(machine => {
        // Display machine data
        document.getElementById('machine-name-info').innerText = machine[0].name;
        document.getElementById('last-tested').innerText = machine[0].poslednji;
        document.getElementById('location').innerText = machine[0].adress;
        document.getElementById('next-inspection').innerText = machine[0].prediction;

        // Display failure type
        document.getElementById('failure-type').innerText = machine[0].failure_type;
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
        if (currentPage > 1) {
            currentPage--;
            loadMeasurements(currentPage);
            document.getElementById('current-page').innerText = `Page ${currentPage}`;
        }
    });
    
    document.getElementById('next-page').addEventListener('click', () => {
        currentPage++;
        loadMeasurements(currentPage);
        document.getElementById('current-page').innerText = `Page ${currentPage}`;
    });

    // Get elements
const validateButton = document.getElementById('validate-button');
const graphModal = document.getElementById('graph-modal');
const closeModalButton = document.getElementById('close-modal');

// Open modal on validate click
validateButton.addEventListener('click', () => {
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;
    const parameter = document.getElementById('parameter').value;
    
    if (!dateFrom || !dateTo || !parameter) {
        alert('Please select valid dates and parameter!');
        return;
    }
    
    // Send GET request to fetch data based on the selected date range and parameter
    fetch(`http://localhost:3000/get_dots/${machineId}/${parameter}/${dateFrom}/${dateTo}`)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('measurement-graph').getContext('2d');
            
            // Extract X (dates) and Y (values) from the returned data
            const dates = data.map(entry => new Date(entry.x).toLocaleDateString());  // X-axis (dates)
            const values = data.map(entry => parseFloat(entry.y));  // Y-axis (values)
            // Find min and max values from the dataset
            const minValue = Math.min(...values);
            const maxValue = Math.max(...values);

            // Calculate a margin to add some space below and above the values
            const margin = (maxValue - minValue) * 0.3;  // 10% margin

             // Destroy existing chart if it exists (to avoid duplicate rendering)
            if (window.myChart) {
                window.myChart.destroy();
            }
            
            // Create new chart
            window.myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates, // X-axis (dates)
                    datasets: [{
                        label: `${parameter} over time`,
                        data: values, // Y-axis (values)
                        backgroundColor: 'rgba(0, 123, 255, 0.2)',
                        borderColor: 'rgba(0, 123, 255, 1)',
                        borderWidth: 2,
                        fill: true
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Dates'
                            }
                        },
                        y: {
                            min: minValue - margin,  // Set minimum Y value with a little margin
                            max: maxValue + margin,  // Set maximum Y value with a little margin
                            title: {
                                display: true,
                                text: 'Parameter Value'
                            }
                        }
                    }
                }
            });

            graphModal.style.display = 'block';  // Show the modal
        })
        .catch(error => console.error('Error fetching graph data:', error));
});

// Close modal on X click
closeModalButton.addEventListener('click', () => {
    graphModal.style.display = 'none';  // Hide the modal
});

// Close modal if clicked outside the content
window.onclick = function(event) {
    if (event.target == graphModal) {
        graphModal.style.display = 'none';
    }
};


const y = document.getElementById('date-from');
y.addEventListener('change',()=>{console.log(y.value)})