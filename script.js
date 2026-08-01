// Pre-loaded dataset with 3+ star restaurants in Peninsula/South Bay cities
const restaurants = [
  {
    id: 1,
    name: "Qing Shu Malatang",
    city: "Cupertino",
    cuisine: "Sichuan / Malatang",
    stars: 4,
    url: "https://www.qingshumalatangnnaibrotherfish.com/"
  },
  {
    id: 2,
    name: "CuanYue Malatang",
    city: "Sunnyvale",
    cuisine: "Sichuan / Malatang",
    stars: 4,
    url: "https://www.cuanyuemalatangca.com/"
  },
  {
    id: 3,
    name: "YGF Malatang Noodles & Pots",
    city: "Cupertino",
    cuisine: "Sichuan / Malatang",
    stars: 4,
    url: "https://www.yelp.com/biz/ygf-malatang-cupertino"
  },
  {
    id: 4,
    name: "Jang Su Jang",
    city: "Santa Clara",
    cuisine: "Korean",
    stars: 4,
    url: "http://jangsujang.com/"
  },
  {
    id: 5,
    name: "Yayoi",
    city: "Cupertino",
    cuisine: "Japanese",
    stars: 4,
    url: "http://www.yayoi-us.com/"
  },
  {
    id: 6,
    name: "Phở Hà Nội",
    city: "San Jose",
    cuisine: "Vietnamese",
    stars: 4,
    url: "http://www.phohanoiusa.com/"
  },
  {
    id: 7,
    name: "Amber India",
    city: "Palo Alto",
    cuisine: "Indian",
    stars: 4,
    url: "https://www.amber-india.com/"
  },
  {
    id: 8,
    name: "The Habit Burger Grill",
    city: "Sunnyvale",
    cuisine: "American",
    stars: 3,
    url: "https://order.habitburger.com/"
  }
];

// Function to pick a random restaurant and render it to the page
function pickRestaurant() {
  const randomIndex = Math.floor(Math.random() * restaurants.length);
  const selected = restaurants[randomIndex];

  const resultContainer = document.getElementById('result');

  if (resultContainer) {
    resultContainer.innerHTML = `
      <h2>🎉 Tonight's Winner: ${selected.name}</h2>
      <p>📍 <strong>City:</strong> ${selected.city}</p>
      <p>🍲 <strong>Cuisine:</strong> ${selected.cuisine}</p>
      <p>⭐ <strong>Rating:</strong> ${'⭐'.repeat(selected.stars)}</p>
      <a href="${selected.url}" target="_blank" rel="noopener noreferrer" class="order-btn">
        🛒 Place Order / View Menu
      </a>
    `;
  }
}
