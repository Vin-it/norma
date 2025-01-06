import { handleResponse, makeReq } from '../../utils/api.utils';
import { UrlStore } from '../../utils/url.store';

export async function loadMetadata() {
	const res = await fetch(`${UrlStore.getBaseUrl()}`, {
		method: 'GET',
		headers: {
			Accept: 'application/nostr+json',
		},
	});

	if (res.ok) {
		return res.json();
	}

	return {};
}

export async function loadSupportedMethods() {
	const res = await makeReq({ method: 'supportedmethods', params: [] });
	return handleResponse<string[]>(res);
}

export const changeRelayName = async (name: string) => {
	const res = await makeReq({ method: 'changerelayname', params: [name] });
	return handleResponse<true>(res);
};

export const changeRelayDescription = async (description: string) => {
	const res = await makeReq({
		method: 'changerelaydescription',
		params: [description],
	});
	return handleResponse<true>(res);
};

export const changeRelayIcon = async (iconUrl: string) => {
	const res = await makeReq({ method: 'changerelayicon', params: [iconUrl] });
	return handleResponse<true>(res);
};
