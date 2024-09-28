import {
  GET_RECIPES,
  GET_RECIPE,
  ADD_RECIPE,
  UPDATE_RECIPE,
  DELETE_RECIPE,
  RECIPE_ERROR
} from '../actions/types';

const initialState = {
  recipes: [],
  recipe: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_RECIPES:
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
        loading: false
      };
    case DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter(recipe => recipe._id !== payload),
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
}