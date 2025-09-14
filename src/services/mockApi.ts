// Utility function to simulate API response delay
export const delay = (ms?: number): Promise<void> => {
    const randomDelay = ms || Math.floor(Math.random() * 600) + 200; // 200-800ms
    return new Promise(resolve => setTimeout(resolve, randomDelay));
};

// Utility function to log API calls
export const logApiCall = (apiName: string, method: string, payload?: any, response?: any): void => {
    const timestamp = new Date().toISOString();
    const logStyle = 'color: #3498db; font-weight: bold;';

    console.group(`%c🚀 API Call: ${apiName}.${method}`, logStyle);
    console.log('⏰ Timestamp:', timestamp);

    if (payload !== undefined) {
        console.log('📤 Payload:', payload);
    }

    if (response !== undefined) {
        console.log('📥 Response:', response);
    }

    console.groupEnd();
};
