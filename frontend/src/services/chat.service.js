const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const sendMessage = async (message, history = []) => {
    const api = `${BASE_URL}/api/chat`;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
            history,
        }),
    };
    const response = await fetch(api, options);

    const result = await response.json();

    if (!response.ok || result.success === false) {
        throw new Error(result.message || "Failed to generate response");
    }

    return result;
};
