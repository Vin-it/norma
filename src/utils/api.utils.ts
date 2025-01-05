import { fromPayload } from './general.utils';
import { UrlStore } from './url.store';

export async function makeReq(payload: Record<string, unknown>) {
	const eventBase64 = await fromPayload(payload);

	return fetch(UrlStore.getFullManagerUrl(), {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: {
			Authorization: `Nostr ${eventBase64}`,
		},
	});
}

export type Nip86Response<T> =
	| { result: T; error: null }
	| { result: null; error: string };
export async function handleResponse<T>(
	res: Response,
): Promise<Nip86Response<T>> {
	if (res.ok) {
		const data = await res.json();
		if (data.error) return { result: null, error: data.error };
		return { result: data.result, error: null };
	}

	return { result: null, error: `request failed with status ${res.status}` };
}
