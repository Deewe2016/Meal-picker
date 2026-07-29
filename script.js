const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Default categories
let categories = JSON.parse(localStorage.getItem('mealCategories')) || [
  "Cupertino", "Santa Clara", "Mountain View", "San Jose"
];

// Default cuisines
let cuisines = JSON.parse(localStorage.getItem('mealCuisines')) || [
  "Mexican", "Asian", "American", "Italian"
];

// Default restaurants
let restaurants = JSON.parse(localStorage.getItem('mealRestaurants')) || [
  { name: "Tacos El Gordo", category: "San Jose", price: "$", cuisine: "Mexican", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  { name: "In-N-Out", category: "Santa Clara", price: "$", cuisine: "American", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  { name: "Ramen Nagi", category: "Cupertino", price: "$$", cuisine: "Asian", days: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }
];

let lastWinner = localStorage.getItem('lastMealWinner') || "";
let editIndex = -1; // -1 means we are adding a NEW restaurant. Otherwise, it holds the index of what we are editing!

// Initial Render
renderCategories();
renderCuisines();
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

function renderCuisines() {
  const checkboxContainer = document.getElementById('cuisineCheckboxes');
  const selectDropdown = document.getElementById('cuisineSelect');

  checkboxContainer.innerHTML = '';
  selectDropdown.innerHTML = '';

  cuisines.forEach((cui, index) => {
    const label = document.createElement('label');
    label.className = 'checkbox-label';
    label.innerHTML = `
      <input type="checkbox" value="${cui}" class="cuisine-filter" checked>
      ${cui}
      <span class="delete-btn" onclick="removeCuisine(${index})" title="Delete Cuisine">✕</span>
    `;
    checkboxContainer.appendChild(label);

    const option = document.createElement('option');
    option.value = cui;
    option.textContent = cui;
    selectDropdown.appendChild(option);
  });

  localStorage.setItem('mealCuisines', JSON.stringify(cuisines));
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
      <div>
        <span class="edit-btn" onclick="startEdit(${index})" title="Edit Restaurant">✏️</span>
        <span class="delete-btn" onclick="removeRestaurant(${index})" title="Delete Restaurant">✕</span>
      </div>
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

function addCuisine() {
  const input = document.getElementById('newCuisineInput');
  const cuiName = input.value.trim();

  if (cuiName !== "" && !cuisines.includes(cuiName)) {
    cuisines.push(cuiName);
    input.value = "";
    renderCuisines();
  }
}

function removeCuisine(index) {
  const cuisineToRemove = cuisines[index];
  cuisines.splice(index, 1);
  restaurants = restaurants.filter(item => item.cuisine !== cuisineToRemove);
  renderCuisines();
  renderList();
}

// ✏️ START EDITING: Fills input controls with selected restaurant data
function startEdit(index) {
  editIndex = index;
  const item = restaurants[index];

  document.getElementById('restaurantInput').value = item.name;
  document.getElementById('categorySelect').value = item.category;
  document.getElementById('priceSelect').value = item.price || "$$";
  document.getElementById('cuisineSelect').value = item.cuisine || "Other";

  // Check the correct day checkboxes
  const dayInputs = document.querySelectorAll('.day-input');
  dayInputs.forEach(cb => {
    cb.checked = item.days ? item.days.includes(cb.value) : true;
  });

  // Change UI text to show Edit Mode
  document.getElementById('formTitle').textContent = "Edit Restaurant:";
  document.getElementById('saveBtn').textContent = "Save Changes";
  document.getElementById('cancelBtn').style.display = "block";
}

// 💾 SAVE RESTAURANT: Handles both ADDING and EDITING
function saveRestaurant() {
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

  if (name !== "" && category !== "" && cuisine !== "" && selectedDays.length > 0) {
    const updatedData = { name, category, price, cuisine, days: selectedDays };

    if (editIndex === -1) {
      // Add New
      restaurants.push(updatedData);
    } else {
      // Update Existing
      restaurants[editIndex] = updatedData;
    }

    resetForm();
    renderList();
  }
}

function cancelEdit() {
  resetForm();
}

function resetForm() {
  editIndex = -1;
  document.getElementById('restaurantInput').value = "";
  document.getElementById('formTitle').textContent = "Add a Restaurant:";
  document.getElementById('saveBtn').textContent = "Add Restaurant";
  document.getElementById('cancelBtn').style.display = "none";

  // Reset checkboxes back to checked
  document.querySelectorAll('.day-input').forEach(cb => cb.checked = true);
}

function removeRestaurant(index) {
  restaurants.splice(index, 1);
  if (editIndex === index) {
    resetForm();
  }
  renderList();
}

// Spin Algorithm
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
    const matchesCuisine = checkedCuisines.includes(item.cuisine);
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

// Share/Import Data
function exportData() {
  const package = {
    categories: categories,
    cuisines: cuisines,
    restaurants: restaurants
  };
  const encodedData = btoa(JSON.stringify(package));
  navigator.clipboard.writeText(encodedData);
  alert("Family Share Code copied to clipboard! Text it to your parents!");
}

function importData() {
  const input = document.getElementById('importInput').value.trim();
  if (!input) {
    alert("Please paste a Share Code first!");
    return;
  }

  try {
    const decodedData = JSON.parse(atob(input));
    if (decodedData.categories && decodedData.cuisines && decodedData.restaurants) {
      categories = decodedData.categories;
      cuisines = decodedData.cuisines;
      restaurants = decodedData.restaurants;
      
      renderCategories();
      renderCuisines();
      renderList();
      
      document.getElementById('importInput').value = "";
      alert("Restaurant list updated successfully!");
    }
  } catch (e) {
    alert("Invalid Share Code! Make sure you copied the exact code.");
  }
}
