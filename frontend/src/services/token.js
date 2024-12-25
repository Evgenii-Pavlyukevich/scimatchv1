const API_URL = import.meta.env.VITE_API_URL;

export const tokenService = {
  async getToken(credentials) {
    const formData = {
      grant_type: 'password',
      username: credentials.email,
      password: credentials.password,
      scope: '',
      client_id: '',
      client_secret: ''
    };

    const formBody = new URLSearchParams(formData).toString();

    console.log('Login request body:', formBody);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to get token');
    }

    return {
      ...data,
      status: response.status,
    };
  }
}; 