// Example machine data and failure data
const machines = [
    { id: 1, name: 'well_1', lastTested: '2024-10-01', prediction: 'Failure in 15 days' },
    { id: 2, name: 'well_2', lastTested: '2024-09-25', prediction: 'Failure in 20 days' },
    { id: 3, name: 'well_3', lastTested: '2024-09-30', prediction: 'Failure in 30 days' },
    { id: 4, name: 'well_4', lastTested: '2024-09-29', prediction: 'Failure in 10 days' },
    { id: 5, name: 'well_5', lastTested: '2024-10-03', prediction: 'Failure in 5 days' }
];

const failures = [
    { well: 'well_1', esp_type: '5A-35-2000', date_time: '2020-04-21', label: 'Mehanicke primese' },
    { well: 'well_2', esp_type: '5-30-950', date_time: '2023-01-04', label: 'Talozenje kamenca' },
    { well: 'well_3', esp_type: '5/30/1900', date_time: '2024-02-06', label: 'Nehermeticnost kompozicije tubinga' }
];

// Get machine ID from URL
const params = new URLSearchParams(window.location.search);
const machineId = parseInt(params.get('id'));
const machine = machines.find(m => m.id === machineId);

// Display machine data
document.getElementById('machine-name').innerText = machine.name;
document.getElementById('telemetry-data').innerHTML = `<p>Last Tested: ${machine.lastTested}</p>`;
document.getElementById('prediction').innerHTML = `<p>Prediction: ${machine.prediction}</p>`;

// Display failure type based on well
const failure = failures.find(f => f.well === machine.name);
document.getElementById('failure-data').innerHTML = `<p>Failure Type: ${failure ? failure.label : 'No failures recorded'}</p>`;

// Show form when "Add Measurement" button is clicked
document.getElementById('add-measurement-button').addEventListener('click', () => {
    document.getElementById('measurement-form').style.display = 'block';
});
document.getElementById('close-measurement-form').addEventListener('click', () => {
    document.getElementById('measurement-form').style.display = 'none';
});

// Handle form submission for new measurement
document.getElementById('new-measurement-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const measureDate = document.getElementById('measure_date').value;

    // Update the last tested date in the machine array
    machine.lastTested = measureDate;

    // Update the displayed telemetry data
    document.getElementById('telemetry-data').innerHTML = `<p>Last Tested: ${measureDate}</p>`;

    // Update prediction (static for now)
    const staticPrediction = 'Failure in 10 days'; // Change as needed
    document.getElementById('prediction').innerHTML = `<p>Prediction: ${staticPrediction}</p>`;

    // Hide the form after submission
    document.getElementById('measurement-form').style.display = 'none';
});