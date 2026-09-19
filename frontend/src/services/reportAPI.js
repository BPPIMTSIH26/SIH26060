import { USE_MOCK_API, BASE_URL, delay } from './config';
// Ensure you have saved the JSON file as exactly this name in your data folder
import mockReportData from './data/mock-report.json'; 

export const reportAPI = {
    getStationReport: async (stationId, reportType = 'daily', options = {}) => {
        // 1. MOCK API MODE (Reads from your local JSON file)
        if (USE_MOCK_API) {
            await delay(700); 
            
            // We dynamically overwrite the station name and report type 
            // so the mock data updates realistically when you click different dropdowns
            const dynamicMock = { 
                ...mockReportData, 
                station_id: stationId,
                station_name: `${stationId} Antarctic Research Station`,
                report_metadata: { 
                    ...mockReportData.report_metadata, 
                    report_type: reportType 
                }
            };
            
            // Must return the { data: ... } wrapper to match the frontend expectations
            return { status: "success", data: dynamicMock };
        }

        // 2. REAL BACKEND MODE (Connects to Express)
        const response = await fetch(`${BASE_URL}/reports/${stationId}?report_type=${reportType}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            signal: options.signal
        });
        
        const rawResponse = await response.json();
        
        if (!response.ok) {
            throw new Error(rawResponse.error || rawResponse.message || "Failed to fetch report data");
        }
        
        return { status: "success", data: rawResponse };
    }
};