document.addEventListener('DOMContentLoaded', () => {
    // Array of machine objects
    const machines = [
        { id: 1, name: 'Well 1', lastTested: '2024-10-01', location: 'Location A' },
        { id: 2, name: 'Well 2', lastTested: '2024-09-25', location: 'Location B' },
        { id: 3, name: 'Well 3', lastTested: '2024-09-30', location: 'Location C' },
        { id: 4, name: 'Well 4', lastTested: '2024-09-29', location: 'Location D' },
        { id: 5, name: 'Well 5', lastTested: '2024-10-03', location: 'Location E' }
    ];

    // Get the machine list element
    const machineList = document.getElementById('machine-list');

    // Loop through machines and create list items
    machines.forEach(machine => {
        const listItem = document.createElement('li');
        listItem.classList.add('machine-item');

        // Create a div to wrap machine data
        const machineInfo = document.createElement('div');
        machineInfo.classList.add('machine-info'); // Add a class for styling

        // Populate machine data inside the div
        machineInfo.innerHTML = `
            <div>${machine.name}</div>
            <div>Last Tested: ${machine.lastTested}</div>
            <div class="machine-location">Location: ${machine.location}</div>
        `;

        // Create the details button
        const detailsButton = document.createElement('a');
        detailsButton.href = `details.html?id=${machine.id}`;
        detailsButton.classList.add('details-button');
        detailsButton.innerText = 'Details';

        // Append the machineInfo div and button to the list item
        listItem.appendChild(machineInfo);
        listItem.appendChild(detailsButton);

        // Append the list item to the machine list
        machineList.appendChild(listItem);
    });
});
