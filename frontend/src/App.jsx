
import { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

const emptyForm = {
  name: "",
  category: "Breakfast",
  ingredients: "",
  steps: "",
  cookingTime: ""
};

const categories = [
  "Breakfast", "Lunch", "Dinner", "Snack", "Dessert"
];

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadRecipes() {
    setLoading(true);
    try {
      const data = await request("/recipes");
      setRecipes(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecipes();
  }, []);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditing(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const time = Number(form.cookingTime);

    if (
      !form.name.trim() ||
      !form.ingredients.trim() ||
      !form.steps.trim() ||
      !Number.isInteger(time) ||
      time < 1 ||
      time > 1440
    ) {
      setError("Fill in every field. Cooking time must be a whole number from 1 to 1440.");
      return;
    }

    setSaving(true);

    try {
      const payload = { ...form, cookingTime: time };
      const result = editing
        ? await request(`/recipes/${editing}`, {
            method: "PUT",
            body: JSON.stringify(payload)
          })
        : await request("/recipes", {
            method: "POST",
            body: JSON.stringify(payload)
          });

      setMessage(result.message);
      resetForm();
      await loadRecipes();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(recipe) {
    setEditing(recipe._id);
    setForm({
      name: recipe.name,
      category: recipe.category,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      cookingTime: String(recipe.cookingTime)
    });

    setSelected(null);
    setMessage("");
    setError("");

    document.getElementById("recipe-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  async function deleteRecipe(recipe) {
    if (!window.confirm(`Delete "${recipe.name}" permanently?`)) return;

    setMessage("");
    setError("");

    try {
      const result = await request(`/recipes/${recipe._id}`, {
        method: "DELETE"
      });

      setMessage(result.message);
      if (selected?._id === recipe._id) setSelected(null);
      if (editing === recipe._id) resetForm();
      await loadRecipes();
    } catch (err) {
      setError(err.message);
    }
  }

  const filtered = recipes.filter(recipe =>
    `${recipe.name} ${recipe.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-icon">✳</span>
          little<span>recipe</span>book
        </a>
        <a className="nav-link" href="#collection">My collection ↗</a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">YOUR PERSONAL KITCHEN JOURNAL</span>
            <h1>Good food.<br /><em>Good memories.</em></h1>
            <p>
              Keep your favourite recipes in one place.
              Save the flavours you love and make them again.
            </p>
            <a className="primary-button" href="#recipe-form">
              + Add a recipe
            </a>
            <div className="hero-stats">
              <div>
                <strong>{recipes.length}</strong>
                <span>Recipes saved</span>
              </div>
              <div className="stat-divider" />
              <div>
                <strong>5</strong>
                <span>Food categories</span>
              </div>
            </div>
          </div>

          <div className="hero-art">
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1000&q=85"
              alt="A colourful table of fresh food"
            />
            <div className="floating-note">
              <span>♡</span>
              Made with love, saved forever.
            </div>
          </div>
        </section>

        <section className="collection section" id="collection">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A LITTLE SOMETHING DELICIOUS</span>
              <h2>Your recipe collection<span>.</span></h2>
            </div>
            <span className="count-pill">{recipes.length} recipes</span>
          </div>

          <input
            className="search"
            type="search"
            placeholder="⌕  Search by recipe name or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search recipes"
          />

          {message && <p className="notice success">{message}</p>}
          {error && <p className="notice failure">{error}</p>}

          {loading ? (
            <p className="empty">Gathering your recipes...</p>
          ) : filtered.length === 0 ? (
            <div className="empty">
              <span>♡</span>
              <h3>{search ? "No recipes found" : "Your book is waiting"}</h3>
              <p>
                {search
                  ? "Try another name or category."
                  : "Add your first favourite recipe below."}
              </p>
            </div>
          ) : (
            <div className="recipe-grid">
              {filtered.map(recipe => (
                <article className="recipe-card" key={recipe._id}>
                  <button
                    className="card-main"
                    onClick={() => setSelected(recipe)}
                    aria-label={`View ${recipe.name}`}
                  >
                    <div className="card-art">
                      <span className="category-pill">{recipe.category}</span>
                      <span className="card-heart">♡</span>
                      <span className="card-initial">
                        {recipe.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="card-info">
                      <h3>{recipe.name}</h3>
                      <p>◷ &nbsp;{recipe.cookingTime} minutes</p>
                      <span className="view-link">View recipe ↗</span>
                    </div>
                  </button>

                  <div className="card-actions">
                    <button onClick={() => startEdit(recipe)}>Edit</button>
                    <button
                      className="delete-button"
                      onClick={() => deleteRecipe(recipe)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="form-section section" id="recipe-form">
          <div className="form-intro">
            <span className="eyebrow">FROM YOUR KITCHEN</span>
            <h2>{editing ? "A little recipe update." : "Save something delicious."}</h2>
            <p>
              Write down the ingredients, the little steps,
              and everything that makes this dish yours.
            </p>
            <span className="form-decoration">bon appétit ♡</span>
          </div>

          <form className="recipe-form" onSubmit={handleSubmit}>
            <label>
              Recipe name
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="e.g. Grandma's chocolate cake"
                maxLength={100}
                required
              />
            </label>

            <div className="form-row">
              <label>
                Category
                <select
                  name="category"
                  value={form.category}
                  onChange={updateField}
                  required
                >
                  {categories.map(category => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label>
                Cooking time (minutes)
                <input
                  name="cookingTime"
                  type="number"
                  min="1"
                  max="1440"
                  step="1"
                  value={form.cookingTime}
                  onChange={updateField}
                  placeholder="30"
                  required
                />
              </label>
            </div>

            <label>
              Ingredients
              <textarea
                name="ingredients"
                value={form.ingredients}
                onChange={updateField}
                placeholder={"2 cups flour\n1 cup milk\n..."}
                rows="4"
                required
              />
            </label>

            <label>
              Preparation steps
              <textarea
                name="steps"
                value={form.steps}
                onChange={updateField}
                placeholder={"1. Prepare the ingredients\n2. Mix everything together\n..."}
                rows="5"
                required
              />
            </label>

            <div className="form-actions">
              <button className="primary-button" type="submit" disabled={saving}>
                {saving ? "Saving..." : editing ? "Save changes ↗" : "Save recipe ↗"}
              </button>
              {editing && (
                <button className="cancel-button" type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
      </main>

      <footer>
        <a className="brand" href="#">✳ little<span>recipe</span>book</a>
        <p>A collection of things worth cooking, and sharing.</p>
        <span>Made with ♡</span>
      </footer>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <section
            className="detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close details"
            >
              ×
            </button>

            <span className="eyebrow">FROM YOUR RECIPE BOOK</span>
            <h2 id="detail-title">{selected.name}</h2>
            <p className="detail-meta">
              {selected.category} · {selected.cookingTime} minutes
            </p>

            <h3>Ingredients</h3>
            <p className="detail-text">{selected.ingredients}</p>

            <h3>Preparation steps</h3>
            <p className="detail-text">{selected.steps}</p>

            <div className="form-actions">
              <button className="primary-button" onClick={() => startEdit(selected)}>
                Edit recipe
              </button>
              <button
                className="cancel-button"
                onClick={() => deleteRecipe(selected)}
              >
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
