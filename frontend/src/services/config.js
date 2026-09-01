// src/api/config.js

// ... keep your existing code up here ...

// 🛑 MASTER SWITCH: Set to true to bypass real API calls and return fake UI data
export const USE_MOCK_API = true;
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
export const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));


// ⬇️ ADD THIS NEW BLOCK OF CODE ⬇️

// Create a simulated auth service object
export const authAPI = {
    // Mock login function
    login: async (credentials) => {
        // If we are in mock mode, simulate a successful login
        if (USE_MOCK_API) {
            console.log('--- DEV MODE: SIMULATING LOGIN ---', credentials);
            await delay(); // simulate network lag
            // return a fake user object and token
            return {
                status: "success",
                data: {
                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token",
                    user: {
                        fullName: "NCPOR Operator",
                        email: credentials.username || "operator@ncpor.gov",
                        role: "station_master"
                    }
                }
            };
        }

        // --- PRODUCTION: Real API call will go here ---
        // throw new Error("Real API not implemented yet. Use mock mode.");

        // In production, this would be:
        // const response = await fetch(`${BASE_URL}/auth/login`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(credentials)
        // });
        // const data = await response.json();
        // if (!response.ok) throw new Error(data.message || "Login failed");
        // return data;
    },

    // Mock logout function
    logout: async () => {
        if (USE_MOCK_API) {
            console.log('--- DEV MODE: SIMULATING LOGOUT ---');
            await delay();
            return { status: "success" };
        }
        // real API call here
    }
};