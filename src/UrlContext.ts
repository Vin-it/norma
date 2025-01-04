import { createContext, useContext } from "react";

export interface ApiObject {
    MANAGER_API_BASE_URL: string | null;
    MANAGER_API_ENDPOINT: string | null;
}

export interface UrlContext {
    api: ApiObject
    handleSetApi: (baseUrl?: string, endpoint?: string) => void
    resetStore: () => void;
}
export const UrlContext = createContext<UrlContext | null>(null);

export const useUrlContext = () => {
    const urlContext = useContext(UrlContext);
    if (!urlContext) {
        throw new Error('Url context was used before init');
    }

    return urlContext;
}