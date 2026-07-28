// Array to hold restaurant choices (Loads from LocalStorage if available)
let restaurants = JSON.parse(localStorage.getItem('familyRestaurants')) || [
  "Pizza",
  "Tacos",
  "Burgers"
];

// Display stored restaurants on page load
renderList();

function renderList() {
  const listElement = document.getElementById('restaurantList');
  listElement.innerHTML = '';

  restaurants.forEach((place, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${place}</span>
      <span class="delete-btn" onclick="removeRestaurant(${index})">✕</span>
    `;
    listElement.appendChild(li);
  });

  // Save to LocalStorage so data persists
  localStorage.setItem('familyRestaurants', JSON.stringify(restaurants));
}

function addRestaurant() {
  const input = document.getElementById('restaurantInput');
  const name = input.value.trim();

  if (name !== "") {
    restaurants.push(name);
    input.value = "";
    renderList();
  }
}

function removeRestaurant(index) {
  restaurants.splice(index, 1);
  renderList();
}

function pickRestaurant() {
  if (restaurants.length === 0) {
    document.getElementById('winner').textContent = "Add some places first!";
    return;
  }

  const winnerDisplay = document.getElementById('winner');
  let counter = 0;

  // Rapidly shuffle through names to create a "spinning" effect
  const spinInterval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * restaurants.length);
    winnerDisplay.textContent = restaurants[randomIndex];
    counter++;

    // Stop after 15 quick shuffles (~1.5 seconds)
    if (counter > 15) {
      clearInterval(spinInterval);
      const finalWinner = restaurants[Math.floor(Math.random() * restaurants.length)];
      winnerDisplay.textContent = `🎉 ${finalWinner}!`;
    }
  }, 100);
}
