const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Default categories
let categories = JSON.parse(localStorage.getItem('mealCategories')) || [
  "Cupertino", "Santa Clara", "Mountain View", "San Jose"
];

// Default restaurants with price and days
let restaurants = JSON.parse(localStorage.getItem('mealRestaurants')) || [
  { name: "Tacos El Gordo", category: "San Jose", price: "$", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  { name: "In-N-Out", category: "Santa Clara", price: "$", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  { name: "Ramen Nagi", category: "Cupertino", price: "$$", days: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }
];

// Track last picked winner from LocalStorage
let lastWinner = localStorage.getItem('lastMealWinner') || "";

// Initial Render
renderCategories();
renderList();

function renderCategories() {
  const checkboxContainer = document.getElementById('filterCheckboxes');
  const selectDropdown = document.getElementById('categorySelect');

  checkboxContainer.innerHTML = '';
  selectDropdown.innerHTML = '';

  categories.forEach((cat, index) => {
    const label = document.createElement('label');
    label.className = 'checkbox-label';
    label.innerHTML = `
      <input type="checkbox" value="${cat}" class="city-filter" checked>
      ${cat}
      <span class="delete-btn" onclick="removeCategory(${index})" title="Delete City">✕</span>
    `;
    checkboxContainer.appendChild(label);

    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    selectDropdown.appendChild(option);
  });

  localStorage.setItem('mealCategories', JSON.stringify(categories));
}

function renderList() {
  const listElement = document.getElementById('restaurantList');
  listElement.innerHTML = '';

  restaurants.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <span class="tag price-tag">${item.price || "$$"}</span>
        <span class="tag">${item.category}</span>
      </div>
      <span class="delete-btn" onclick="removeRestaurant(${index})">✕</span>
    `;
    listElement.appendChild(li);
  });

  localStorage.setItem('mealRestaurants', JSON.stringify(restaurants));
}

function addCategory() {
  const input = document.getElementById('newCategoryInput');
  const catName = input.value.trim();

  if (catName !== "" && !categories.includes(catName)) {
    categories.push(catName);
    input.value = "";
    renderCategories();
  }
}

function removeCategory(index) {
  const categoryToRemove = categories[index];
  categories.splice(index, 1);
  restaurants = restaurants.filter(item => item.category !== categoryToRemove);
  renderCategories();
  renderList();
}

function addRestaurant() {
  const input = document.getElementById('restaurantInput');
  const categorySelect = document.getElementById('categorySelect');
  const priceSelect = document.getElementById('priceSelect');
  
  const name = input.value.trim();
  const category = categorySelect.value;
  const price = priceSelect.value;

  const selectedDays = Array.from(document.querySelectorAll('.day-input:checked'))
                            .map(cb => cb.value);

  if (name !== "" && category !== "" && selectedDays.length > 0) {
    restaurants.push({ name: name, category: category, price: price, days: selectedDays });
    input.value = "";
    renderList();
  }
}

function removeRestaurant(index) {
  restaurants.splice(index, 1);
  renderList();
}

function pickRestaurant() {
  const todayIndex = new Date().getDay();
  const todayName = dayNames[todayIndex];

  // Get checked cities
  const checkedCities = Array.from(document.querySelectorAll('.city-filter:checked'))
                            .map(cb => cb.value);

  // Get checked price ranges
  const checkedPrices = Array.from(document.querySelectorAll('.price-filter:checked'))
                            .map(cb => cb.value);

  if (checkedCities.length === 0) {
    document.getElementById('winner').textContent = "Select at least 1 city!";
    return;
  }

  if (checkedPrices.length === 0) {
    document.getElementById('winner').textContent = "Select at least 1 price tag!";
    return;
  }

  // Filter pool by city, price, and open days!
  let filteredPool = restaurants.filter(item => {
    const matchesCity = checkedCities.includes(item.category);
    const matchesPrice = checkedPrices.includes(item.price || "$$");
    const isOpenToday = item.days ? item.days.includes(todayName) : true; 
    return matchesCity && matchesPrice && isOpenToday;
  });

  if (filteredPool.length === 0) {
    document.getElementById('winner').textContent = `No matching places open on ${todayName}!`;
    return;
  }

  // SMART MEMORY: If we have more than 1 option, temporarily remove the last winner so we don't repeat!
  if (filteredPool.length > 1 && lastWinner !== "") {
    filteredPool = filteredPool.filter(item => item.name !== lastWinner);
  }

  // Spin animation
  const winnerDisplay = document.getElementById('winner');
  let counter = 0;

  const spinInterval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * filteredPool.length);
    winnerDisplay.textContent = filteredPool[randomIndex].name;
    counter++;

    if (counter > 15) {
      clearInterval(spinInterval);
      const finalWinner = filteredPool[Math.floor(Math.random() * filteredPool.length)];
      
      // Save this winner so it doesn't get picked next time!
      lastWinner = finalWinner.name;
      localStorage.setItem('lastMealWinner', lastWinner);

      winnerDisplay.textContent = `🎉 ${finalWinner.name} (${finalWinner.price}, ${finalWinner.category})!`;
    }
  }, 100);
}
