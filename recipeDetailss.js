import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBxRcnDYo3REAlVpHYpFVyyBg9QZYsOF9w",
    authDomain: "login-page-67088.firebaseapp.com",
    projectId: "login-page-67088",
    storageBucket: "login-page-67088.firebasestorage.app",
    messagingSenderId: "178268713114",
    appId: "1:178268713114:web:dee11f0f1a6496810e6f23"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch the recipe ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get('id');

// Function to load recipe details
const loadRecipeDetails = async () => {
  const recipeRef = doc(db, "recipes", recipeId);
  const recipeDoc = await getDoc(recipeRef);

  if (recipeDoc.exists()) {
    const recipe = recipeDoc.data();
    const recipeDetail = document.getElementById('recipeDetail');
    
    if (recipeDetail) {
      recipeDetail.innerHTML = `

      
      <div class="container recipe-detail-container shadow-lg p-4">
          <div class="row align-items-center">
              <!-- Text Section (Left) -->
              <div class="col-md-6">
                  <h1 class="text-success fw-bold">${recipe.title}</h1>
                  <p class="text-muted fs-5"><strong>👨‍🍳 Author:</strong> ${recipe.author}</p>
                  <p class="text-dark fs-5"><strong>💲 Price:</strong> $${recipe.price}</p>
                  <p class="text-muted fs-5"><strong>⏳ Prep Time:</strong> ${recipe.prepTime || "30 mins"}</p>
                  <p class="text-danger fs-5"><strong>🔥 Difficulty:</strong> ${recipe.difficulty || "Medium"}</p>
                  <p class="text-warning fs-5"><strong>⭐ Rating:</strong> ${recipe.rating || "4.5"} / 5</p>
                  <p class="fs-5"><strong>📝 Description:</strong> ${recipe.description}</p>
                  <p class="text-muted fs-5"><strong>🥦 Ingredients:</strong> ${recipe.ingredients?.join(", ") || "Not specified"}</p>
  
                  <!-- Buttons -->
                  <div class="mt-4">
                      <button class="btn btn-outline-danger btn-lg favorite-btn" onclick="toggleFavorite('${recipeId}')">
                          ❤️ Favorite
                      </button>
                      <button class="btn btn-danger btn-lg ms-3" onclick="deleteRecipe('${recipeId}')">🗑 Delete</button>
                  </div>
              </div>
  
              <!-- Image Section (Right) -->
              <div class="col-md-6 text-center">
                  <img src="${recipe.imageURL}" class="recipe-img img-fluid" alt="Recipe Image">
              </div>
          </div>
      </div>

  `;
  
    }
  }
};

// Toggle Favorite functionality
const toggleFavorite = async (recipeId) => {
  const recipeRef = doc(db, "recipes", recipeId);
  const recipeDoc = await getDoc(recipeRef);
  const currentStatus = recipeDoc.data().isFavorite;

  try {
    // Update the favorite status in Firestore
    await updateDoc(recipeRef, {
      isFavorite: !currentStatus
    });
    console.log(`Favorite status updated for recipe with ID: ${recipeId}`);

    // Update the navbar favorite count immediately
    await updateFavCount();
    
    // Optionally reload the recipe details
    loadRecipeDetails(); // You can remove this line if you don't want to reload the recipe after toggling
  } catch (e) {
    console.error("Error updating favorite status: ", e);
  }
};

// Update the favorite count in the navbar
const updateFavCount = async () => {
  try {
    const snapshot = await getDocs(collection(db, "recipes"));
    const favCount = snapshot.docs.filter(doc => doc.data().isFavorite).length;
    
    const favCountElement = document.getElementById('favCount');
    if (favCountElement) {
      favCountElement.textContent = favCount;
    }
  } catch (e) {
    console.error("Error fetching favorite count: ", e);
  }
};

// Delete Recipe functionality
const deleteRecipe = async (recipeId) => {
  try {
    await deleteDoc(doc(db, "recipes", recipeId));
    alert("Recipe Deleted Successfully..")
    console.log(`Recipe with ID ${recipeId} deleted`);

    // Show a success message
    const recipeDetail = document.getElementById('recipeDetail');
    if (recipeDetail) {
      recipeDetail.innerHTML = '<h5>Recipe successfully deleted. You will be redirected shortly...</h5>';
    }

    // Optionally, redirect to the recipe list page after a short delay
    setTimeout(() => {
      window.location.href = './add-recipe.html'; // Or any page you want to show the updated list
    }, 2000);
  } catch (e) {
    console.error("Error deleting recipe: ", e);
  }
};


// Run the initialization logic once the page is fully loaded
window.onload = async () => {
  await updateFavCount(); // Update the favorite count
  await loadRecipeDetails(); // Load recipe details
};

// Add the functions to the global scope
window.toggleFavorite = toggleFavorite;
window.deleteRecipe = deleteRecipe;


document.querySelectorAll("button").forEach(button => {
  button.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent form submission for testing

      let spinner = document.getElementById("loadingSpinner");
      spinner.classList.remove("d-none"); // Show spinner
      
      setTimeout(() => {
          spinner.classList.add("d-none"); // Hide spinner after 3 seconds
      }, 3000);
  });
});


