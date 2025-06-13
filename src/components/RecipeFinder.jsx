import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SPOON_API_KEY = 'f8e275d6afff41b7ae23f5c06a47cb49';
const EDAMAM_APP_ID = 'YOUR_EDAMAM_APP_ID';
const EDAMAM_APP_KEY = 'YOUR_EDAMAM_APP_KEY';

const commonIngredients = [
  'tomato', 'onion', 'garlic', 'chicken', 'beef', 'egg', 'bread', 'cheese', 'milk', 'butter',
  'flour', 'sugar', 'rice', 'pasta', 'potato', 'carrot', 'spinach', 'mushroom', 'pepper', 'oil',
];

const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

function RecipeFinder() {
  const [ingredientInputs, setIngredientInputs] = useState(['']);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleIngredientChange = (index, value) => {
    const updated = [...ingredientInputs];
    updated[index] = value;
    setIngredientInputs(updated);
  };

  const addIngredientField = () => {
    setIngredientInputs([...ingredientInputs, '']);
  };

  const fetchFromEdamam = async (ingredients) => {
    const query = ingredients.join(',');
    const res = await fetch(
      `https://api.edamam.com/search?q=${query}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&to=3`
    );
    const data = await res.json();
    return data.hits.map((hit, idx) => ({
      id: `edamam-${idx}`,
      title: hit.recipe.label,
      image: hit.recipe.image,
      instructions: hit.recipe.ingredientLines.map((step) => ({ step })),
      sourceUrl: hit.recipe.url,
    }));
  };

  const fetchRecipes = async () => {
    const ingredients = ingredientInputs.filter(Boolean);
    if (ingredients.length === 0) return;

    setLoading(true);
    try {
      const spoonacularRes = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(',')}&number=3&apiKey=${SPOON_API_KEY}`
      );
      const data = await spoonacularRes.json();

      const detailedRecipes = await Promise.all(
        data.map(async (recipe) => {
          const infoRes = await fetch(
            `https://api.spoonacular.com/recipes/${recipe.id}/information?includeNutrition=false&apiKey=${SPOON_API_KEY}`
          );
          const info = await infoRes.json();
          return {
            id: recipe.id,
            title: info.title,
            image: recipe.image,
            instructions: info.analyzedInstructions?.[0]?.steps || [],
            sourceUrl: `https://spoonacular.com/recipes/${slugify(info.title)}-${recipe.id}`,
          };
        })
      );

      setRecipes(detailedRecipes);
    } catch (error) {
      console.error('Spoonacular failed, trying Edamam:', error);
      try {
        const fallbackRecipes = await fetchFromEdamam(ingredients);
        setRecipes(fallbackRecipes);
      } catch (fallbackError) {
        console.error('Edamam also failed:', fallbackError);
        setRecipes([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecipes();
  };

  return (
    <div className="max-w-5xl mx-auto min-h-screen bg-orange-50 p-6 text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-orange-200 rounded-lg mb-6 shadow-md">
        <h1 className="text-3xl font-bold text-orange-700 flex items-center gap-2">
          🍲 RecipeRadar
        </h1>
        <button
          onClick={() => navigate('/')}
          className="text-orange-800 font-semibold hover:underline"
        >
          Home
        </button>
      </nav>

      {/* Description */}
      <p className="text-center text-lg text-gray-700 mb-6">
        Enter the ingredients you have, and let’s find some delicious ideas together! 🧑‍🍳
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        {ingredientInputs.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            value={ingredient}
            list="ingredient-suggestions"
            onChange={(e) => handleIngredientChange(index, e.target.value)}
            placeholder={`🥕 Ingredient ${index + 1}`}
            className="border border-gray-300 rounded-md px-4 py-2 w-3/4 md:w-1/2 mx-auto block text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

        ))}

        <datalist id="ingredient-suggestions">
          {commonIngredients.map((item, idx) => (
            <option key={idx} value={item} />
          ))}
        </datalist>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={addIngredientField}
            className="min-w-[220px] bg-orange-100 border border-orange-300 hover:bg-orange-200 text-orange-800 font-semibold px-4 py-2 rounded-md transition transform hover:scale-105 shadow-sm"
          >
            ➕ Add Ingredient
          </button>

          <button
            type="submit"
            className="min-w-[220px] bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-2 rounded-md font-semibold hover:from-orange-500 hover:to-orange-700 transition"
          >
            🍽️ Find Recipes
          </button>
        </div>

      </form>

      {/* Loading */}
      {loading && (
        <div className="text-center my-6 text-orange-500 animate-pulse font-medium">
          🔄 Searching tasty recipes...
        </div>
      )}

      {/* Recipe Results */}
      <div className="space-y-8">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white shadow-lg hover:shadow-xl transition-shadow border border-orange-100 rounded-xl overflow-hidden"
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{recipe.title}</h2>
              <p className="font-medium text-gray-700">Steps:</p>
              <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-1">
                {recipe.instructions.length > 0 ? (
                  recipe.instructions.map((step, index) => (
                    <li key={index}>{step.step}</li>
                  ))
                ) : (
                  <li>No instructions available.</li>
                )}
              </ol>
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
              >
                🍴 View Full Recipe
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeFinder;
