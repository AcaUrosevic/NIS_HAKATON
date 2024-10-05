// scripts/pocetna.js
document.addEventListener('DOMContentLoaded', () => {
    // Array of machine objects
    const machines = [
        { id: 1, name: 'well_1', lastTested: '2024-10-01', prediction: 'Failure in 15 days' },
        { id: 2, name: 'well_2', lastTested: '2024-09-25', prediction: 'Failure in 20 days' },
        { id: 3, name: 'well_3', lastTested: '2024-09-30', prediction: 'Failure in 30 days' },
        { id: 4, name: 'well_4', lastTested: '2024-09-29', prediction: 'Failure in 10 days' },
        { id: 5, name: 'well_5', lastTested: '2024-10-03', prediction: 'Failure in 5 days' }
    ];
  
    // Get the machine list element
    const machineList = document.getElementById('machine-list');
  
    // Loop through machines and create list items
    machines.forEach(machine => {
      const listItem = document.createElement('li');
      listItem.classList.add('machine-item');
      
      listItem.innerHTML = `
        <span>${machine.name} (Last tested: ${machine.lastTested})</span>
        <a href="details.html?id=${machine.id}" class="details-button">Details</a>
      `;
      
      machineList.appendChild(listItem);
    });
  });
  
  