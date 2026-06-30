export const getApiKey = (): string | null => localStorage.getItem('gymforge_api_key');
export const setApiKey = (key: string) => localStorage.setItem('gymforge_api_key', key);
export const clearApiKey = () => localStorage.removeItem('gymforge_api_key');
