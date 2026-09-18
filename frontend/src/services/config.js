/* eslint-disable no-unused-vars */
// src/api/config.js

export const USE_MOCK_API = false; // Set to true to use mock API responses for testing without a backend
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'; 
export const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// --- STRICT DATE VALIDATOR ---
export const validateSession = (showToast, navigateToLogin) => {
    const user = localStorage.getItem("polar_twin_user");
    let sessionDate = localStorage.getItem("polar_twin_session_date");
    
    if (!user || user === "undefined") return null;

    const today = new Date().toDateString();

    // SELF-HEALING FALLBACK
    if (!sessionDate) {
        sessionDate = today;
        localStorage.setItem("polar_twin_session_date", today);
    }

    if (sessionDate !== today) {
        localStorage.removeItem("polar_twin_user");
        localStorage.removeItem("polar_twin_session_date");
        
        if (showToast) showToast("Session expired. Authentication is only valid for 1 day.", "error");
        if (navigateToLogin) navigateToLogin();
        
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (err) {
        localStorage.removeItem("polar_twin_user");
        return null;
    }
};

// --- DATA FORMATTER HELPER ---
// Ensures all 7 required fields + loginDate are strictly formatted
const formatAndStoreSession = (userObj) => {
    const today = new Date().toDateString();
    
    const sessionData = {
        fullName: userObj.fullName || "Operator",
        username: userObj.username || "operator",
        email: userObj.email || "operator@ncpor.gov",
        role: userObj.role || "station_master",
        station: userObj.station || null,
        avatar: userObj.avatar || "",
        createdAt: userObj.createdAt || new Date().toISOString(),
        loginDate: today
    };

    localStorage.setItem("polar_twin_user", JSON.stringify(sessionData));
    localStorage.setItem("polar_twin_session_date", today);
    
    return sessionData;
};

export const authAPI = {
    login: async (credentials) => {
        if (USE_MOCK_API) {
            await delay();
            const sessionData = formatAndStoreSession({
                fullName: "NCPOR Operator",
                username: credentials.username || "operator",
                email: credentials.email || credentials.username || "operator@ncpor.gov",
                role: "station_master",
                station: "Maitri",
            });
            
            return {
                status: "success",
                data: { token: "dummy_token", user: sessionData }
            };
        }

        const response = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', 
            body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");

        // Format and store the exact 7 fields using real backend data
        const sessionData = formatAndStoreSession(data.data.user);
        data.data.user = sessionData; // Update the returned payload
        
        return data;
    },

    register: async (formData) => {
        if (USE_MOCK_API) {
            await delay();
            // In mock mode, extract the values from FormData to create the user object
            const sessionData = formatAndStoreSession({ 
                fullName: formData.get("fullName") || "Test User", 
                username: formData.get("username") || "testuser",
                email: formData.get("email") || "test@ncpor.gov", 
                role: formData.get("role") || "station_master",
                station: formData.get("station") || "Maitri"
            });

            return { 
                status: "success", 
                message: "User registered successfully",
                data: { user: sessionData }
            };
        }

        const response = await fetch(`${BASE_URL}/users/register`, {
            method: 'POST',
            credentials: 'include',
            body: formData 
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Registration failed");

        // Format and store the exact 7 fields using real backend data
        const sessionData = formatAndStoreSession(data.data.user);
        data.data.user = sessionData;
        
        return data;
    },

    logout: async () => {
        localStorage.removeItem("polar_twin_user");
        localStorage.removeItem("polar_twin_session_date");

        if (USE_MOCK_API) {
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

    resetPassword: async (email) => {
        if (USE_MOCK_API) {
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

    updatePassword: async (passwordData) => {
        if (USE_MOCK_API) {
            await delay(600);
            return { status: "success", message: "Password updated successfully." };
        }
        const response = await fetch(`${BASE_URL}/users/update-password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', 
            body: JSON.stringify(passwordData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to update security credentials.");
        return data;
    },

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