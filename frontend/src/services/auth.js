// src/api/auth.js
import { USE_MOCK_API, BASE_URL, delay } from './config';

export const authAPI = {
    login: async (credentials) => {
        // --- DEV MODE (MOCK) ---
        if (USE_MOCK_API) {
            await delay(); 
            
            // 1. Grab what you typed in the login box
            const identifier = (credentials.email || credentials.username || "").toLowerCase();
            
            // 2. Default to Station Master
            let mockRole = "station_master";
            let mockName = "Station Master Delta";

            // 3. Dynamically assign roles based on what you typed!
            if (identifier.includes("logistics")) {
                mockRole = "logistics";
                mockName = "Logistics Officer Echo";
            } else if (identifier.includes("authority") || identifier.includes("admin")) {
                mockRole = "authority";
                mockName = "Authority Prime";
            }

            return {
                status: "success",
                data: {
                    user: {
                        fullName: mockName,
                        email: identifier || "operator@ncpor.gov",
                        role: mockRole, 
                        avatar: ""
                    }
                }
            };
        }

        // --- PRODUCTION (REAL API) ---
        const response = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");
        return data;
    },
    
    register: async (formData) => {
        if (USE_MOCK_API) {
            await delay();
            return { status: "success", message: "User registered successfully" };
        }

        const response = await fetch(`${BASE_URL}/users/register`, {
            method: 'POST',
            body: formData 
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Registration failed");
        return data;
    },

    logout: async () => {
        if (USE_MOCK_API) {
            await delay(400);
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

        const response = await fetch(`${BASE_URL}/users/reset-password`, {
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
            await delay(600); // Simulate network latency
            // In a real app, you'd verify the old password here
            return { status: "success", message: "Password updated successfully." };
        }

        const response = await fetch(`${BASE_URL}/users/update-password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Needed so backend knows WHICH user is logged in
            body: JSON.stringify(passwordData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to update security credentials.");
        return data;
    }
};