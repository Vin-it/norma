export class UrlStore {
	/**
	 * This should be the base domain like https://myrelayurl.com, http(s) not ws(s)!
	 */
	private static MANAGER_API_BASE_URL: string | null = localStorage.getItem(
		'MANAGER_API_BASE_URL',
	);
	/**
	 * This should the endpoint like /admin/manage MANAGER_API_BASE_URL + MANAGER_API_ENDPOINT
	 * should give the full URL like https://myrelayurl.com/admin/manage for calling the RPC like nip-86
	 */
	private static MANAGER_API_ENDPOINT: string | null = localStorage.getItem(
		'MANAGER_API_ENDPOINT',
	);

	static setBaseUrl(value: string) {
		this.MANAGER_API_BASE_URL = value;
		localStorage.setItem('MANAGER_API_BASE_URL', value);
	}

	static setEndpoint(value: string) {
		this.MANAGER_API_ENDPOINT = value;
		localStorage.setItem('MANAGER_API_ENDPOINT', value);
	}

	static resetStore() {
		localStorage.removeItem('MANAGER_API_ENDPOINT');
		localStorage.removeItem('MANAGER_API_BASE_URL');
	}

	static getBaseUrlUnsafe() {
		return this.MANAGER_API_BASE_URL;
	}

	static getManagerEndpointUnsafe() {
		return this.MANAGER_API_ENDPOINT;
	}

	static getBaseUrl() {
		if (!this.MANAGER_API_BASE_URL)
			throw Error('MANAGER_API_BASE_URL is not set!');
		return this.MANAGER_API_BASE_URL;
	}

	static getEndpoint() {
		if (!this.MANAGER_API_ENDPOINT)
			throw Error('MANAGER_API_ENDPOINT is not set!');
		return this.MANAGER_API_ENDPOINT;
	}

	static getFullManagerUrl() {
		if (!this.MANAGER_API_BASE_URL || !this.MANAGER_API_ENDPOINT)
			throw new Error(
				'Both MANAGER_API_BASE_URL and MANAGER_API_ENDPOINT must be set',
			);
		return `${this.MANAGER_API_BASE_URL}${this.MANAGER_API_ENDPOINT}`;
	}
}
