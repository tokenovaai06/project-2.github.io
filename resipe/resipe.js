const apiKey = 'a22937705c6d45b2aa740c27f6d5a23a';  
let recipes = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

async function searchRecipes() {
    const query = document.getElementById('search-input').value;
    if (!query) return;

    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    recipes = data.results;
    renderRecipes(recipes);
}

function renderRecipes(recipes) {
    const recipeGrid = document.getElementById('recipe-grid');
    recipeGrid.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="https://spoonacular.com/recipeImages/${recipe.id}-312x231.jpg" alt="${recipe.title}" onclick="showRecipeDetails(${recipe.id})">
            <h3>${recipe.title}</h3>
            <button class="favorite-button ${favorites.includes(recipe.id) ? 'filled' : ''}" onclick="toggleFavorite(${recipe.id})">
                &#9733;
            </button>
        `;
        recipeGrid.appendChild(recipeCard);
    });
}

async function showRecipeDetails(recipeId) {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <h2>${data.title}</h2>
        <img src="${data.image}" alt="${data.title}">
        <p>${data.instructions || 'No instructions available.'}</p>
        <button class="close-button" onclick="closeModal()">Close</button>
    `;
    document.getElementById('recipe-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('recipe-modal').style.display = 'none';
}

function toggleFavorite(recipeId) {
    if (favorites.includes(recipeId)) {
        favorites = favorites.filter(id => id !== recipeId);
    } else {
        favorites.push(recipeId);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderRecipes(recipes);
}

function showFavorites() {
    const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id));
    renderRecipes(favoriteRecipes);
}

function goHome() {
    renderRecipes(recipes);
}
