import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRecipe, updateRecipe } from '../../actions/recipe';
import { TextField, Button, Typography, Container, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const RecipeForm = ({ recipeId }) => {
  const dispatch = useDispatch();
  const recipeToEdit = useSelector(state => 
    recipeId ? state.recipe.recipes.find(r => r._id === recipeId) : null
  );

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [],
    instructions: [],
    prepTime: '',
    cookTime: '',
    difficulty: '',
    servings: '',
    tags: []
  });

  useEffect(() => {
    if (recipeToEdit) {
      setFormData(recipeToEdit);
    }
  }, [recipeToEdit]);

  const { title, description, ingredients, instructions, prepTime, cookTime, difficulty, servings, tags } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (recipeId) {
      dispatch(updateRecipe(recipeId, formData));
    } else {
      dispatch(addRecipe(formData));
    }
    // Redirect or show success message
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        {recipeId ? 'Edit Recipe' : 'Add New Recipe'}
      </Typography>
      <Box component="form" onSubmit={onSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          name="title"
          value={title}
          onChange={onChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={description}
          onChange={onChange}
          multiline
          rows={4}
          required
        />
        {/* Add fields for ingredients and instructions */}
        <TextField
          fullWidth
          margin="normal"
          label="Preparation Time (minutes)"
          name="prepTime"
          type="number"
          value={prepTime}
          onChange={onChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Cooking Time (minutes)"
          name="cookTime"
          type="number"
          value={cookTime}
          onChange={onChange}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Difficulty</InputLabel>
          <Select
            name="difficulty"
            value={difficulty}
            onChange={onChange}
            required
          >
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Servings"
          name="servings"
          type="number"
          value={servings}
          onChange={onChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Tags (comma-separated)"
          name="tags"
          value={tags.join(', ')}
          onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          {recipeId ? 'Update Recipe' : 'Add Recipe'}
        </Button>
      </Box>
    </Container>
  );
};

export default RecipeForm;