import { tokenService } from './token';

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  async signUp(userData) {
    const currentDate = new Date().toISOString();
    const fullUserData = {
      ...userData,
      telegram: 0,
      yandex: true,
      is_active: true,
      created_at: currentDate,
      confiramtion_code: "",
      limit_urls: 20,
      limit_images: 5,
      purchase_date: currentDate,
      tarif_of_user: "free"
    };

    const response = await fetch(`${API_URL}/users/create_user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(fullUserData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to sign up');
    }
    
    return response.json();
  },

  async signIn(credentials) {
    try {
      // Check user credentials - this is the only endpoint used in the working implementation
      const response = await fetch(`${API_URL}/users/check_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Invalid credentials');
      }

      // If successful, return a simulated token response
      return {
        status: 200,
        access_token: 'dummy_token', // We'll need to implement proper token management later
        token_type: 'bearer'
      };
    } catch (error) {
      throw error;
    }
  },

  async resetPassword(email) {
    const response = await fetch(`${API_URL}/users/reset_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to reset password');
    }

    return response.json();
  },

  async verifyResetCode(email, code) {
    const response = await fetch(`${API_URL}/users/check_code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Invalid code');
    }

    return response.json();
  },
}; 