import React, { useState } from 'react';

const API_KEY = 'f8e275d6afff41b7ae23f5c06a47cb49';

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

  const handleIngredientChange = (index, value) => {
    const updated = [...ingredientInputs];
    updated[index] = value;
    setIngredientInputs(updated);
  };

  const addIngredientField = () => {
    setIngredientInputs([...ingredientInputs, '']);
  };

  const fetchRecipes = async () => {
    const ingredients = ingredientInputs.filter(Boolean).join(','); // remove empty values
    if (!ingredients) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=3&apiKey=${API_KEY}`
      );
      const data = await res.json();

      const detailedRecipes = await Promise.all(
        data.map(async (recipe) => {
          const infoRes = await fetch(
            `https://api.spoonacular.com/recipes/${recipe.id}/information?includeNutrition=false&apiKey=${API_KEY}`
          );
          const info = await infoRes.json();
          return {
            ...recipe,
            instructions: info.analyzedInstructions?.[0]?.steps || [],
            title: info.title,
          };
        })
      );

      setRecipes(detailedRecipes);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecipes();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">🍳 ChatChefs</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        {ingredientInputs.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            value={ingredient}
            list="ingredient-suggestions"
            onChange={(e) => handleIngredientChange(index, e.target.value)}
            placeholder={`Ingredient ${index + 1}`}
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
        ))}

        <datalist id="ingredient-suggestions">
          {commonIngredients.map((item, idx) => (
            <option key={idx} value={item} />
          ))}
        </datalist>

        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={addIngredientField}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 w-full"
          >
            ➕ Add Ingredient
          </button>

          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full"
          >
            🍽️ Find Recipes
          </button>
        </div>
      </form>

      {loading && <p className="text-center">Loading recipes...</p>}

      <div className="space-y-8">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white shadow rounded-xl p-4 border border-orange-100"
          >
            <h2 className="text-xl font-semibold text-gray-800">{recipe.title}</h2>
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full rounded-lg my-4"
            />
            <p className="font-medium text-gray-700">Steps:</p>
            <ol className="list-decimal list-inside mb-4 text-gray-600">
              {recipe.instructions.length > 0 ? (
                recipe.instructions.map((step, index) => (
                  <li key={index}>{step.step}</li>
                ))
              ) : (
                <li>No instructions available.</li>
              )}
            </ol>
            <a
              href={`https://spoonacular.com/recipes/${slugify(recipe.title)}-${recipe.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              View Full Recipe 🍽️
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeFinder;
