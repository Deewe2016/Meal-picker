// Days map helper
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Default categories
let categories = JSON.parse(localStorage.getItem('mealCategories')) || [
  "Cupertino", "Santa Clara", "Mountain View", "San Jose"
];

// Default restaurants with assigned categories and open days
let restaurants = JSON.parse(localStorage.getItem('mealRestaurants')) || [
  { name: "Tacos El Gordo", category: "San Jose", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  { name: "In-N-Out", category: "Santa Clara", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  { name: "Ramen Nagi", category: "Cupertino", days: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }
];

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
  const select = document.getElementById('categorySelect');
  const name = input.value.trim();
  const category = select.value;

  // Get selected open days
  const selectedDays = Array.from(document.querySelectorAll('.day-input:checked'))
                            .map(cb => cb.value);

  if (name !== "" && category !== "" && selectedDays.length > 0) {
    restaurants.push({ name: name, category: category, days: selectedDays });
    input.value = "";
    renderList();
  }
}

function removeRestaurant(index) {
  restaurants.splice(index, 1);
  renderList();
}

function pickRestaurant() {
  // 1. Get today's day string (e.g., "Mon", "Tue")
  const todayIndex = new Date().getDay();
  const todayName = dayNames[todayIndex];

  // 2. Find which city checkboxes are currently checked
  const checkedCities = Array.from(document.querySelectorAll('.city-filter:checked'))
                            .map(cb => cb.value);

  if (checkedCities.length === 0) {
    document.getElementById('winner').textContent = "Select at least 1 city!";
    return;
  }

  // 3. Filter pool by city AND check if open today!
  const filteredPool = restaurants.filter(item => {
    const matchesCity = checkedCities.includes(item.category);
    // If old items don't have days array yet, default to open
    const isOpenToday = item.days ? item.days.includes(todayName) : true; 
    return matchesCity && isOpenToday;
  });

  if (filteredPool.length === 0) {
    document.getElementById('winner').textContent = `No places open on ${todayName} in selected cities!`;
    return;
  }

  // 4. Spin animation
  const winnerDisplay = document.getElementById('winner');
  let counter = 0;

  const spinInterval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * filteredPool.length);
    winnerDisplay.textContent = filteredPool[randomIndex].name;
    counter++;

    if (counter > 15) {
      clearInterval(spinInterval);
      const finalWinner = filteredPool[Math.floor(Math.random() * filteredPool.length)];
      winnerDisplay.textContent = `🎉 ${finalWinner.name} (${finalWinner.category})!`;
    }
  }, 100);
}
