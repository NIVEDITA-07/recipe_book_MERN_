
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map(url => url.trim())
    : "http://localhost:5173"
}));
app.use(express.json());

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  category: {
    type: String,
    required: true,
    enum: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"]
  },
  ingredients: {
    type: String,
    required: true,
    trim: true
  },
  steps: {
    type: String,
    required: true,
    trim: true
  },
  cookingTime: {
    type: Number,
    required: true,
    min: 1,
    max: 1440,
    validate: {
      validator: Number.isInteger,
      message: "Cooking time must be a whole number."
    }
  }
}, { timestamps: true });

const Recipe = mongoose.model("Recipe", recipeSchema);

app.get("/", (req, res) => {
  res.json({ message: "Recipe Book API is running" });
});

// Get all recipes
app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch recipes." });
  }
});

// Get one recipe
app.get("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: "Invalid recipe ID." });
  }
});

// Add a recipe
app.post("/api/recipes", async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json({
      message: "Recipe added successfully!",
      recipe
    });
  } catch (error) {
    res.status(400).json({
      message: error.name === "ValidationError"
        ? Object.values(error.errors).map(e => e.message).join(" ")
        : "Could not add recipe."
    });
  }
});

// Edit a recipe
app.put("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    res.json({ message: "Recipe updated successfully!", recipe });
  } catch (error) {
    res.status(400).json({
      message: error.name === "ValidationError"
        ? Object.values(error.errors).map(e => e.message).join(" ")
        : "Could not update recipe."
    });
  }
});

// Delete a recipe
app.delete("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }
    res.json({ message: "Recipe deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Invalid recipe ID." });
  }
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
