import {
  GET_RECIPES,
  GET_RECIPE,
  ADD_RECIPE,
  UPDATE_RECIPE,
  DELETE_RECIPE,
  RECIPE_ERROR,
  SEARCH_RECIPES,
  LIKE_RECIPE,
  UNLIKE_RECIPE
} from '../actions/types';

const initialState = {
  recipes: [],
  recipe: null,
  loading: true,
  error: {}
};

const recipeReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_RECIPES:
    case SEARCH_RECIPES:
      return {
        ...state,
        recipes: payload,
        loading: false
      };
    case GET_RECIPE:
      return {
        ...state,
        recipe: payload,
        loading: false
      };
    case ADD_RECIPE:
      return {
        ...state,
        recipes: [payload, ...state.recipes],
        loading: false
      };
    case UPDATE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe._id === payload._id ? payload : recipe
        ),
        recipe: payload,
        loading: false
      };
    case DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter(recipe => recipe._id !== payload),
        loading: false
      };
    case LIKE_RECIPE:
    case UNLIKE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe._id === payload.id ? { ...recipe, likes: payload.likes } : recipe
        ),
        recipe: state.recipe && state.recipe._id === payload.id
          ? { ...state.recipe, likes: payload.likes }
          : state.recipe,
        loading: false
      };
    case RECIPE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
};

export default recipeReducer;