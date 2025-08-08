import axios from 'axios';

const chapaApi = axios.create({
    baseURL: '/api/chapa',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Types for API requests and responses
export interface InitializePaymentRequest {
    amount: string;
    currency: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    tx_ref: string;
    callback_url: string;
    return_url: string;
}

export interface InitiateTransferRequest {
    account_number: string;
    amount: string;
    bank_code: string;
    account_name: string;
}

export interface Bank {
    id: string;
    name: string;
    code: string;
}

// API functions
export const chapaService = {
    // Initialize payment
    initializePayment: async (data: InitializePaymentRequest) => {

        const response = await chapaApi.post('/initialize', data);
        return response.data;
    },

    // Get available banks
    getBanks: async (): Promise<Bank[]> => {
        const response = await chapaApi.get('/banks');
        return response.data.data || [];
    },

    // Initiate transfer
    initiateTransfer: async (data: InitiateTransferRequest) => {
        const response = await chapaApi.post('/transfers/initiate', data);
        return response.data;
    },

    // Verify payment (if needed)
    verifyPayment: async (txRef: string) => {
        const response = await chapaApi.get(`/payment/verify/${txRef}`);
        return response.data;
    },
};

// Helper function to generate transaction reference
export const generateTxRef = () => {
    return `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};