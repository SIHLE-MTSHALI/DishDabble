const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function checkUsersWithoutUsernames() {
  try {
    // First, we need to login to get a token
    const loginResponse = await axios.post(`${API_URL}/api/auth`, {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD
    });

    const token = loginResponse.data.token;

    // Now we can make the authenticated request to check for users without usernames
    const checkResponse = await axios.get(`${API_URL}/api/users/check-usernames`, {
      headers: {
        'x-auth-token': token
      }
    });

    console.log('Users without usernames:', checkResponse.data);
  } catch (error) {
    console.error('Error checking users without usernames:', error.response ? error.response.data : error.message);
  }
}

checkUsersWithoutUsernames();