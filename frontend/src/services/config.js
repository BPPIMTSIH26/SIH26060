// src/api/config.js

// 🛑 MASTER SWITCH: Set to false to use the live MongoDB backend
export const USE_MOCK_API = false; // Set to true for development/testing with mock data
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'; // Default to localhost if env variable is not set
export const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

export const authAPI = {
    // 1. LOGIN
    login: async (credentials) => {
        if (USE_MOCK_API) {
            console.log('--- DEV MODE: SIMULATING LOGIN ---', credentials);
            await delay();
            return {
                status: "success",
                data: {
                    token: "dummy_token",
                    user: {
                        fullName: "NCPOR Operator",
                        email: credentials.username || credentials.email || "operator@ncpor.gov",
                        role: "station_master",
                        avatar: ""
                    }
                }
            };
        }

        // --- PRODUCTION: Real API call ---
        const response = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // CRITICAL: This allows the backend to set the JWT cookie in your browser
            body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }
        
        return data;
    },

    // 2. REGISTER
    register: async (formData) => {
        if (USE_MOCK_API) {
            console.log('--- DEV MODE: SIMULATING REGISTRATION ---');
            await delay();
            return { 
                status: "success", 
                message: "User registered successfully",
                data: { user: { fullName: "Test User", email: "test@ncpor.gov", role: "station_master" } }
            };
        }

        const response = await fetch(`${BASE_URL}/users/register`, {
            method: 'POST',
            credentials: 'include',
            // NOTE: Do NOT set 'Content-Type' manually when sending FormData.
            // The browser will automatically set the correct multipart/form-data boundary.
            body: formData 
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Registration failed");
        }
        
        return data;
    },

    // 3. LOGOUT
    logout: async () => {
        if (USE_MOCK_API) {
            console.log('--- DEV MODE: SIMULATING LOGOUT ---');
            await delay();
            return { status: "success", message: "Logged out" };
        }
        
        const response = await fetch(`${BASE_URL}/users/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Logout failed");
        return data;
    },

    // 4. RESET PASSWORD (Forgot Password flow)
    resetPassword: async (email) => {
        if (USE_MOCK_API) {
            console.log('--- DEV MODE: SIMULATING PASSWORD RESET ---', email);
            await delay();
            return { status: "success", message: "Recovery email sent." };
        }

        const response = await fetch(`${BASE_URL}/users/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to initiate recovery");
        return data;
    },

    // 5. UPDATE PASSWORD (Inside Dashboard)
    updatePassword: async (passwordData) => {
        if (USE_MOCK_API) {
            console.log('--- DEV MODE: SIMULATING PASSWORD UPDATE ---');
            await delay(600);
            return { status: "success", message: "Password updated successfully." };
        }

        const response = await fetch(`${BASE_URL}/users/update-password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Needed so backend knows WHICH user is logged in via cookie
            body: JSON.stringify(passwordData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to update security credentials.");
        return data;
    },

    // 6. VERIFY OTP & RESET PASSWORD
    verifyOtpAndReset: async (dataPayload) => {
        if (USE_MOCK_API) {
            await delay(600);
            return { status: "success", message: "Password reset successfully" };
        }

        const response = await fetch(`${BASE_URL}/users/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataPayload)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Invalid OTP");
        return data;
    },
    
    // 7. SEND REGISTRATION OTP
    sendRegistrationOtp: async (dataPayload) => {
        if (USE_MOCK_API) {
            await delay(600);
            return { status: "success", message: "OTP sent" };
        }

        const response = await fetch(`${BASE_URL}/users/send-registration-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataPayload)
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to send OTP");
        return data;
    },
};