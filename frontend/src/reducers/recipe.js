import {
  GET_RECIPES,
  GET_RECIPE,
  ADD_RECIPE,
  UPDATE_RECIPE,
  DELETE_RECIPE,
  RECIPE_ERROR,
  SEARCH_RECIPES,
  LIKE_RECIPE,
  UNLIKE_RECIPE,
  SAVE_RECIPE,
  UNSAVE_RECIPE,
  RATE_RECIPE,
  GET_TRENDING_RECIPES,
  GET_FEED_RECIPES,
  UPDATE_RECIPE_LIKES,
  UPDATE_RECIPE_COMMENTS,
  GET_MORE_RECIPES
} from '../actions/types';

const initialState = {
  recipes: [],
  recipe: null,
  trendingRecipes: [],
  feedRecipes: [],
  loading: true,
  error: {},
  hasMore: true,
  page: 1
};

const recipeReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_RECIPES:
    case SEARCH_RECIPES:
    case GET_TRENDING_RECIPES:
    case GET_FEED_RECIPES:
      return {
        ...state,
        recipes: payload.recipes,
        hasMore: payload.hasMore,
        page: payload.currentPage,
        loading: false
      };
    case GET_MORE_RECIPES:
      return {
        ...state,
        recipes: [...state.recipes, ...payload.recipes],
        hasMore: payload.hasMore,
        page: payload.currentPage,
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
    case UPDATE_RECIPE_LIKES:
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
    case SAVE_RECIPE:
    case UNSAVE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe._id === payload.id ? { ...recipe, saves: payload.saves } : recipe
        ),
        recipe: state.recipe && state.recipe._id === payload.id
          ? { ...state.recipe, saves: payload.saves }
          : state.recipe,
        loading: false
      };
    case RATE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe._id === payload.id ? { ...recipe, ratings: payload.ratings } : recipe
        ),
        recipe: state.recipe && state.recipe._id === payload.id
          ? { ...state.recipe, ratings: payload.ratings }
          : state.recipe,
        loading: false
      };
    case UPDATE_RECIPE_COMMENTS:
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe._id === payload.id ? { ...recipe, comments: payload.comments } : recipe
        ),
        recipe: state.recipe && state.recipe._id === payload.id
          ? { ...state.recipe, comments: payload.comments }
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