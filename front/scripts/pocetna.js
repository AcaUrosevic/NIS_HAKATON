document.addEventListener('DOMContentLoaded', () => {
    // Fetch machine data from the API
    fetch('http://localhost:3000/get_machines')  // Adjust the URL as needed
        .then(response => response.json())
        .then(machines => {
            const machineList = document.getElementById('machine-list');

            // Loop through machines and create list items dynamically
            machines.forEach(machine => {
                const listItem = document.createElement('li');
                listItem.classList.add('machine-item');

                // Create a div to wrap machine data
                const machineInfo = document.createElement('div');
                machineInfo.classList.add('machine-info'); // Add a class for styling

                // Populate machine data inside the div
                machineInfo.innerHTML = `
                    <div>${machine.name}</div>
                    <div>Last Tested: ${machine.poslednji || 'Unknown'}</div>
                    <div class="machine-location">Location: ${machine.adress}</div>
                    <div class="machine-prediction">Prediction: ${machine.prediction}</div>
                    <div class="machine-failure">Failure Type: ${machine.failure_type}</div>
                `;

                // Create the details button
                const detailsButton = document.createElement('a');
                detailsButton.href = `details.html?name=${machine.name}`;
                detailsButton.classList.add('details-button');
                detailsButton.innerText = 'Details';

                // Append the machineInfo div and button to the list item
                listItem.appendChild(machineInfo);
                listItem.appendChild(detailsButton);

                // Append the list item to the machine list
                machineList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching machine data:', error));
});
