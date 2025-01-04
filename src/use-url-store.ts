import { useState } from 'react';
import { UrlStore } from './utils/url.store';

export const useUrlStore = () => {
	const [api, setApi] = useState({
		MANAGER_API_BASE_URL: UrlStore.getBaseUrlUnsafe(),
		MANAGER_API_ENDPOINT: UrlStore.getManagerEndpointUnsafe(),
	});

	const handleSetApi = (baseUrl?: string, endpoint?: string) => {
		const localBaseURl = baseUrl ?? UrlStore.getBaseUrl();
		const localEndpoint = endpoint ?? UrlStore.getEndpoint();

		UrlStore.setBaseUrl(localBaseURl);
		UrlStore.setEndpoint(localEndpoint);
		setApi({
			MANAGER_API_BASE_URL: localBaseURl,
			MANAGER_API_ENDPOINT: localEndpoint,
		});
	};

	const resetStore = () => {
		setApi({
			MANAGER_API_BASE_URL: null,
			MANAGER_API_ENDPOINT: null,
		});
		UrlStore.resetStore();
	};

	return {
		isStoreInit: Boolean(api.MANAGER_API_BASE_URL && api.MANAGER_API_ENDPOINT),
		api,
		handleSetApi,
		resetStore,
	};
};
