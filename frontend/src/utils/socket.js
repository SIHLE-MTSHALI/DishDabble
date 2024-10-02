import io from 'socket.io-client';

let socket;

export const initiateSocket = (userId) => {
  console.log('Initiating socket connection');
  socket = io(process.env.REACT_APP_API_URL);
  console.log('Connecting socket...');
  if (socket && userId) {
    socket.emit('join', userId);
    console.log('User joined room:', userId);
  }
};

export const disconnectSocket = () => {
  console.log('Disconnecting socket...');
  if (socket) socket.disconnect();
};

export const subscribeToNotifications = (callback) => {
  if (!socket) {
    console.error('No socket connection.');
    return;
  }

  socket.on('notification', (data) => {
    console.log('Received notification:', data);
    callback(null, { type: 'notification', payload: data });
  });

  socket.on('recipeLiked', (data) => {
    console.log('Recipe liked:', data);
    callback(null, { type: 'recipeLiked', payload: data });
  });

  socket.on('recipeCommented', (data) => {
    console.log('Recipe commented:', data);
    callback(null, { type: 'recipeCommented', payload: data });
  });

  socket.on('followerUpdated', (data) => {
    console.log('Follower updated:', data);
    callback(null, { type: 'followerUpdated', payload: data });
  });
};

export const emitLikeRecipe = (recipeId) => {
  if (socket) {
    console.log('Emitting likeRecipe event for recipe:', recipeId);
    socket.emit('likeRecipe', { recipeId });
  }
};

export const emitCommentRecipe = (recipeId, comment) => {
  if (socket) {
    console.log('Emitting commentRecipe event for recipe:', recipeId);
    socket.emit('commentRecipe', { recipeId, comment });
  }
};

export const emitFollowUser = (userId) => {
  if (socket) {
    console.log('Emitting followUser event for user:', userId);
    socket.emit('followUser', { userId });
  }
};

export default socket;