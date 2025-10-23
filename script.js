// ===== Sample recipes =====
const RECIPES = [
  {
    id: "r1",
    title: "Classic Chicken Stew",
    cuisine: "Kenyan",
    description: "Comforting stew with tender chicken and potatoes.",
    ingredients: ["chicken", "potatoes", "onion", "garlic", "tomato", "carrot"],
    steps: [
      "Sauté onion, garlic and tomato.",
      "Add chicken pieces and brown.",
      "Add potatoes, carrots and water, simmer until cooked."
    ],
    image: "https://images.unsplash.com/photo-1708782344071-35ed44b849a9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880"

  },
  {
    id: "r2",
    title: "Vegetable Stir-fry",
    cuisine: "Asian",
    description: "Quick, colorful veg stir-fry for busy nights.",
    ingredients: ["broccoli","bell pepper","carrot","soy sauce","garlic"],
    steps: ["Prep vegetables","Stir fry in hot pan","Add sauce and serve"],
    image: "https://images.unsplash.com/photo-1511910849309-0dffb8785146?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
  },
  {
    id: "r3",
    title: "Avocado Toast",
    cuisine: "International",
    description: "Simple, healthy breakfast.",
    ingredients: ["bread","avocado","lemon","salt","pepper"],
    steps: ["Toast bread","Smash avocado with lemon and salt","Spread and enjoy"],
    image: "https://plus.unsplash.com/premium_photo-1676106623583-e68dd66683e3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
  },
  {
    id: "r4",
    title: "Spicy Lentil Soup",
    cuisine: "African",
    description: "Hearty lentil soup with warm spices.",
    ingredients: ["red lentils","onion","ginger","garam masala","tomato"],
    steps: ["Sauté aromatics","Add lentils and water","Simmer until soft"],
    image: "https://images.unsplash.com/photo-1560260330-727f7f5c0277?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVudGlsJTIwY3Vycnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600"
  },
  {
    id: "r5",
    title: "Pasta Pomodoro",
    cuisine: "Italian",
    description: "Fresh tomato sauce and basil with pasta.",
    ingredients: ["pasta","tomato","basil","garlic","olive oil"],
    steps: ["Cook pasta","Make sauce","Mix and serve with basil"],
    image: "https://images.unsplash.com/photo-1592774912353-72756004ecbb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1174"
  }
];

// ===== State & DOM nodes =====
let state = { showingFavorites: false, query: "", selectedCuisine: "" };
const recipesNode = document.getElementById("recipes");
const searchInput = document.getElementById("search");
const cuisineFilter = document.getElementById("cuisineFilter");
const noResults = document.getElementById("noResults");
const showFavoritesBtn = document.getElementById("showFavorites");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModal");

const localKey = "recipe_favs_v1";
function loadFavorites(){ try{ return JSON.parse(localStorage.getItem(localKey)) || []; }catch(e){return []}}
function saveFavorites(arr){ localStorage.setItem(localKey, JSON.stringify(arr)) }

// ===== Utility =====
function uniq(arr){ return [...new Set(arr)] }
function getAllCuisines(){ return uniq(RECIPES.map(r=>r.cuisine)).sort() }

// ===== Render filter options =====
function populateCuisineFilter(){
  const cuisines = getAllCuisines();
  cuisines.forEach(c=>{
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    cuisineFilter.appendChild(opt);
  })
}
populateCuisineFilter();

// ===== Render recipes =====
function renderRecipes(list){
  recipesNode.innerHTML = "";
  if(list.length === 0){ noResults.hidden = false; return }
  noResults.hidden = true;
  const favs = loadFavorites();
  list.forEach(r=>{
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img alt="${r.title}" src="${r.image}">
      <h3>${r.title}</h3>
      <p class="muted">${r.description}</p>
      <div class="meta">
        <small class="muted">${r.cuisine}</small>
        <div>
          <button class="openBtn" data-id="${r.id}">View</button>
          <button class="favBtn" data-id="${r.id}">${favs.includes(r.id) ? "★" : "☆"}</button>
        </div>
      </div>
    `;
    recipesNode.appendChild(card);
  });
}

// ===== Search & filter logic =====
function filterAndSearch(){
  const all = RECIPES.slice();
  const favs = loadFavorites();
  let filtered = all.filter(r=>{
    if(state.showingFavorites && !favs.includes(r.id)) return false;
    if(state.selectedCuisine && r.cuisine !== state.selectedCuisine) return false;
    const q = state.query.trim().toLowerCase();
    if(!q) return true;
    // search in title and ingredients
    const inTitle = r.title.toLowerCase().includes(q);
    const inIngredients = r.ingredients.some(i=>i.toLowerCase().includes(q));
    return inTitle || inIngredients;
  });
  renderRecipes(filtered);
}

// ===== Debounce for search =====
function debounce(fn, wait=250){
  let t; return (...args)=>{
    clearTimeout(t); t = setTimeout(()=>fn(...args), wait);
  }
}
const debouncedSearch = debounce((val)=>{
  state.query = val;
  filterAndSearch();
}, 200);

// ===== Events =====
searchInput.addEventListener("input", e => debouncedSearch(e.target.value));
cuisineFilter.addEventListener("change", e => { state.selectedCuisine = e.target.value; filterAndSearch(); });
showFavoritesBtn.addEventListener("click", ()=>{
  state.showingFavorites = !state.showingFavorites;
  showFavoritesBtn.textContent = state.showingFavorites ? "All recipes" : "Favorites";
  filterAndSearch();
});

// Event delegation for card buttons
recipesNode.addEventListener("click", (e)=>{
  const open = e.target.closest(".openBtn");
  const fav = e.target.closest(".favBtn");
  if(open){
    const id = open.dataset.id;
    openModal(id);
  } else if(fav){
    const id = fav.dataset.id;
    toggleFavorite(id);
    filterAndSearch(); // re-render to update star
  }
});

// ===== Favorites =====
function toggleFavorite(id){
  const arr = loadFavorites();
  const idx = arr.indexOf(id);
  if(idx === -1) arr.push(id); else arr.splice(idx,1);
  saveFavorites(arr);
}

// ===== Modal handling =====
function openModal(id){
  const r = RECIPES.find(x => x.id === id);
  if(!r) return;
  modalBody.innerHTML = `
    <h2>${r.title}</h2>
    <p class="muted">${r.cuisine} • ${r.description}</p>
    <img style="width:100%;max-height:300px;object-fit:cover;border-radius:10px;margin:10px 0" src="${r.image}" alt="${r.title}">
    <h3>Ingredients</h3>
    <ul>${r.ingredients.map(i=>`<li>${i}</li>`).join("")}</ul>
    <h3>Steps</h3>
    <ol>${r.steps.map(s=>`<li>${s}</li>`).join("")}</ol>
  `;
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}

closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e)=>{ if(e.target === modal) closeModal(); });
document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") closeModal(); });

// ===== Init =====
renderRecipes(RECIPES);
