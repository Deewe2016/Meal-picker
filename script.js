// Default categories
let categories = JSON.parse(localStorage.getItem('mealCategories')) || [
  "Cupertino", "Santa Clara", "Mountain View", "San Jose"
];

// Default restaurants with assigned categories
let restaurants = JSON.parse(localStorage.getItem('mealRestaurants')) || [
  { name: "Tacos El Gordo", category: "San Jose" },
  { name: "In-N-Out", category: "Santa Clara" },
  { name: "Ramen Nagi", category: "Palo Alto" }
];

// Initial Render
renderCategories();
renderList();

// Display category checkboxes & dropdown choices
function renderCategories() {
  const checkboxContainer = document.getElementById('filterCheckboxes');
  const selectDropdown = document.getElementById('categorySelect');

  checkboxContainer.innerHTML = '';
  selectDropdown.innerHTML = '';

  categories.forEach((cat) => {
    // 1. Build Filter Checkboxes
    const label = document.createElement('label');
    label.className = 'checkbox-label';
    label.innerHTML = `
      <input type="checkbox" value="${cat}" class="city-filter" checked>
      ${cat}
    `;
    checkboxContainer.appendChild(label);

    // 2. Build Dropdown Options for adding restaurants
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    selectDropdown.appendChild(option);
  });

  localStorage.setItem('mealCategories', JSON.stringify(categories));
}

// Render the restaurant list on screen
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

// Add a new custom category/city
function addCategory() {
  const input = document.getElementById('newCategoryInput');
  const catName = input.value.trim();

  if (catName !== "" && !categories.includes(catName)) {
    categories.push(catName);
    input.value = "";
    renderCategories();
  }
}

// Add a restaurant assigned to selected category
function addRestaurant() {
  const input = document.getElementById('restaurantInput');
  const select = document.getElementById('categorySelect');
  const name = input.value.trim();
  const category = select.value;

  if (name !== "" && category !== "") {
    restaurants.push({ name: name, category: category });
    input.value = "";
    renderList();
  }
}

// Delete a restaurant
function removeRestaurant(index) {
  restaurants.splice(index, 1);
  renderList();
}

// Pick from selected categories only
function pickRestaurant() {
  // Find which checkboxes are currently checked
  const checkedBoxes = Array.from(document.querySelectorAll('.city-filter:checked'))
                            .map(cb => cb.value);

  if (checkedBoxes.length === 0) {
    document.getElementById('winner').textContent = "Select at least 1 city!";
    return;
  }

  // Filter pool down to matching cities
  const filteredPool = restaurants.filter(item => checkedBoxes.includes(item.category));

  if (filteredPool.length === 0) {
    document.getElementById('winner').textContent = "No places in selected cities!";
    return;
  }

  // Spin animation among filtered pool
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
