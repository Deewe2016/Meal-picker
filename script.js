const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Default categories
let categories = JSON.parse(localStorage.getItem('mealCategories')) || [
  "Cupertino", "Santa Clara", "Mountain View", "San Jose"
];

// Default restaurants with cuisine, price, and days
let restaurants = JSON.parse(localStorage.getItem('mealRestaurants')) || [
  { name: "Tacos El Gordo", category: "San Jose", price: "$", cuisine: "Mexican", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  { name: "In-N-Out", category: "Santa Clara", price: "$", cuisine: "American", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  { name: "Ramen Nagi", category: "Cupertino", price: "$$", cuisine: "Asian", days: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }
];

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
        <span class="tag">${item.cuisine || "Other"}</span>
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
  const cuisineSelect = document.getElementById('cuisineSelect');
  
  const name = input.value.trim();
  const category = categorySelect.value;
  const price = priceSelect.value;
  const cuisine = cuisineSelect.value;

  const selectedDays = Array.from(document.querySelectorAll('.day-input:checked'))
                            .map(cb => cb.value);

  if (name !== "" && category !== "" && selectedDays.length > 0) {
    restaurants.push({ name: name, category: category, price: price, cuisine: cuisine, days: selectedDays });
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

  const checkedCities = Array.from(document.querySelectorAll('.city-filter:checked')).map(cb => cb.value);
  const checkedPrices = Array.from(document.querySelectorAll('.price-filter:checked')).map(cb => cb.value);
  const checkedCuisines = Array.from(document.querySelectorAll('.cuisine-filter:checked')).map(cb => cb.value);

  if (checkedCities.length === 0 || checkedPrices.length === 0 || checkedCuisines.length === 0) {
    document.getElementById('winner').textContent = "Select at least 1 city, price, and cuisine!";
    return;
  }

  let filteredPool = restaurants.filter(item => {
    const matchesCity = checkedCities.includes(item.category);
    const matchesPrice = checkedPrices.includes(item.price || "$$");
    const matchesCuisine = checkedCuisines.includes(item.cuisine || "Other");
    const isOpenToday = item.days ? item.days.includes(todayName) : true; 
    return matchesCity && matchesPrice && matchesCuisine && isOpenToday;
  });

  if (filteredPool.length === 0) {
    document.getElementById('winner').textContent = `No matching places open on ${todayName}!`;
    return;
  }

  if (filteredPool.length > 1 && lastWinner !== "") {
    filteredPool = filteredPool.filter(item => item.name !== lastWinner);
  }

  const winnerDisplay = document.getElementById('winner');
  let counter = 0;

  const spinInterval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * filteredPool.length);
    winnerDisplay.textContent = filteredPool[randomIndex].name;
    counter++;

    if (counter > 15) {
      clearInterval(spinInterval);
      const finalWinner = filteredPool[Math.floor(Math.random() * filteredPool.length)];
      
      lastWinner = finalWinner.name;
      localStorage.setItem('lastMealWinner', lastWinner);

      winnerDisplay.textContent = `🎉 ${finalWinner.name} (${finalWinner.price}, ${finalWinner.category})!`;
    }
  }, 100);
}

// 📲 SHARE / EXPORT FUNCTIONALITY
function exportData() {
  const package = {
    categories: categories,
    restaurants: restaurants
  };
  // Converts all data to a single text string
  const encodedData = btoa(JSON.stringify(package));
  
  navigator.clipboard.writeText(encodedData);
  alert("Family Share Code copied to clipboard! Text it to your parents!");
}

// 📲 IMPORT FUNCTIONALITY
function importData() {
  const input = document.getElementById('importInput').value.trim();
  if (!input) {
    alert("Please paste a Share Code first!");
    return;
  }

  try {
    const decodedData = JSON.parse(atob(input));
    if (decodedData.categories && decodedData.restaurants) {
      categories = decodedData.categories;
      restaurants = decodedData.restaurants;
      
      renderCategories();
      renderList();
      
      document.getElementById('importInput').value = "";
      alert("Restaurant list updated successfully!");
    }
  } catch (e) {
    alert("Invalid Share Code! Make sure you copied the exact code.");
  }
}
