// Get machine ID from URL
const params = new URLSearchParams(window.location.search);
const machineId = params.get('name');
// Fetch machine details from the API
fetch(`http://localhost:3000/get_machines/${machineId}`)
    .then(response => response.json())
    .then(machine => {
        // Display machine data
        document.getElementById('machine-name').innerText = machine[0].name;
        document.getElementById('telemetry-data').innerHTML = `<p>Last Tested: ${machine[0].poslednji}</p>`;
        document.getElementById('prediction').innerHTML = `<p>Prediction: ${machine[0].prediction}</p>`;

        // Display failure type
        document.getElementById('failure-data').innerHTML = `<p>Failure Type: ${machine[0].failure_type}</p>`;
    })
    .catch(error => console.error('Error fetching machine details:', error));
