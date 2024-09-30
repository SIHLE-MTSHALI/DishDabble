import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addRecipe, updateRecipe, getRecipe } from '../../actions/recipe';
import { TextField, Button, Typography, Container, Box, Select, MenuItem, InputLabel, FormControl, Chip, Input } from '@mui/material';

const RecipeForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { recipe, loading } = useSelector(state => state.recipe);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [{ name: '', quantity: '', unit: '' }],
    instructions: [''],
    prepTime: '',
    cookTime: '',
    difficulty: '',
    servings: '',
    tags: [],
    images: []
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getRecipe(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && recipe && !loading) {
      setFormData({
        title: recipe.title || '',
        description: recipe.description || '',
        ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [{ name: '', quantity: '', unit: '' }],
        instructions: recipe.instructions.length > 0 ? recipe.instructions : [''],
        prepTime: recipe.prepTime || '',
        cookTime: recipe.cookTime || '',
        difficulty: recipe.difficulty || '',
        servings: recipe.servings || '',
        tags: recipe.tags || [],
        images: recipe.images || []
      });
      if (recipe.images && recipe.images.length > 0) {
        setImagePreview(recipe.images[0]);
      }
    }
  }, [id, recipe, loading]);

  const { title, description, ingredients, instructions, prepTime, cookTime, difficulty, servings, tags } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'ingredients' || key === 'instructions' || key === 'tags') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === 'images') {
        formData[key].forEach(image => {
          formDataToSend.append('images', image);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    if (id) {
      await dispatch(updateRecipe(id, formDataToSend));
    } else {
      await dispatch(addRecipe(formDataToSend));
    }
    navigate('/recipes');
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...ingredients, { name: '', quantity: '', unit: '' }]
    });
  };

  const removeIngredient = index => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addInstruction = () => {
    setFormData({ ...formData, instructions: [...instructions, ''] });
  };

  const removeInstruction = index => {
    const newInstructions = instructions.filter((_, i) => i !== index);
    setFormData({ ...formData, instructions: newInstructions });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, images: [file] });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        {id ? 'Edit Recipe' : 'Add New Recipe'}
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
        <Typography variant="h6" gutterBottom>Ingredients</Typography>
        {ingredients.map((ingredient, index) => (
          <Box key={index} display="flex" alignItems="center" mb={2}>
            <TextField
              label="Name"
              value={ingredient.name}
              onChange={e => {
                const newIngredients = [...ingredients];
                newIngredients[index].name = e.target.value;
                setFormData({ ...formData, ingredients: newIngredients });
              }}
              required
              sx={{ mr: 1 }}
            />
            <TextField
              label="Quantity"
              value={ingredient.quantity}
              onChange={e => {
                const newIngredients = [...ingredients];
                newIngredients[index].quantity = e.target.value;
                setFormData({ ...formData, ingredients: newIngredients });
              }}
              required
              sx={{ mr: 1 }}
            />
            <TextField
              label="Unit"
              value={ingredient.unit}
              onChange={e => {
                const newIngredients = [...ingredients];
                newIngredients[index].unit = e.target.value;
                setFormData({ ...formData, ingredients: newIngredients });
              }}
              required
              sx={{ mr: 1 }}
            />
            <Button onClick={() => removeIngredient(index)}>Remove</Button>
          </Box>
        ))}
        <Button onClick={addIngredient}>Add Ingredient</Button>

        <Typography variant="h6" gutterBottom>Instructions</Typography>
        {instructions.map((instruction, index) => (
          <Box key={index} display="flex" alignItems="center" mb={2}>
            <TextField
              fullWidth
              label={`Step ${index + 1}`}
              value={instruction}
              onChange={e => {
                const newInstructions = [...instructions];
                newInstructions[index] = e.target.value;
                setFormData({ ...formData, instructions: newInstructions });
              }}
              required
              sx={{ mr: 1 }}
            />
            <Button onClick={() => removeInstruction(index)}>Remove</Button>
          </Box>
        ))}
        <Button onClick={addInstruction}>Add Instruction</Button>

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
        <Box mt={2} mb={2}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => {
                const newTags = tags.filter((_, i) => i !== index);
                setFormData({ ...formData, tags: newTags });
              }}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
        <Box mt={2} mb={2}>
          <Input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
          />
          {imagePreview && (
            <Box mt={2}>
              <img src={imagePreview} alt="Recipe preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </Box>
          )}
        </Box>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          {id ? 'Update Recipe' : 'Add Recipe'}
        </Button>
      </Box>
    </Container>
  );
};

export default RecipeForm;