import { USE_MOCK_API, BASE_URL, delay } from './config';
import mockShopData from './data/shop-data.json';

// Adapter to translate backend schema to your React component props
const formatOrder = (order) => {
    // Translate Backend Status -> Frontend Status
    const statusMap = {
        'PENDING_AUTHORITY': 'PENDING',
        'PENDING_LOGISTICS': 'APPROVED',
        'IN_TRANSIT': 'SHIPPED',
        'DELIVERED': 'DELIVERED',
        'REJECTED': 'REJECTED'
    };

    return {
        id: order.order_id,
        item: order.item,
        qty: order.qty,
        priority: order.priority,
        category: order.category,
        notes: order.notes,
        status: statusMap[order.status] || order.status,
        requestedBy: order.ordered_by?.name || "Unknown",
        approvedBy: order.approval_details?.approved_by_name,
        handledBy: order.logistics_details?.handled_by_name,
        rejectReason: order.approval_details?.rejection_reason,
        etaDays: order.logistics_details?.estimated_delivery_days,
        requestDate: order.createdAt
    };
};

export const shopAPI = {
    // 1. Fetch all orders
    getRequisitions: async (stationId, options = {}) => {
        if (USE_MOCK_API) return { status: "success", data: { requisitions: [] } };

        const response = await fetch(`${BASE_URL}/orders/${stationId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            signal: options.signal
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch requisitions");
        
        // Run data through the adapter!
        const formattedReqs = data.data.map(formatOrder);
        return { status: "success", data: { requisitions: formattedReqs } };
    },

    // 2. Create new order
    createOrder: async (stationId, orderData) => {
        const response = await fetch(`${BASE_URL}/orders/${stationId}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(orderData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return { ...data, data: formatOrder(data.data) };
    },

    // 3. Approve/Reject order
    reviewOrder: async (stationId, orderId, actionData) => {
        const response = await fetch(`${BASE_URL}/orders/${stationId}/${orderId}/review`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(actionData) // { action: 'approve' | 'reject', rejectionReason }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return { ...data, data: formatOrder(data.data) };
    },

    // 4. Ship/Deliver order
    deliverOrder: async (stationId, orderId, statusData) => {
        const response = await fetch(`${BASE_URL}/orders/${stationId}/${orderId}/deliver`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(statusData) // { status: 'IN_TRANSIT' | 'DELIVERED', estimatedDeliveryDays }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return { ...data, data: formatOrder(data.data) };
    },

    // 5. Direct Inventory Log
    directEntry: async (stationId, entryData) => {
        const response = await fetch(`${BASE_URL}/orders/${stationId}/direct-entry`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(entryData) // { item, category, qty }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    }
};