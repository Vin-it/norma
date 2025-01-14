import { fromEvent, fromFile, fromHash } from '../../utils/blossom.utils';
import { UrlStore } from '../../utils/url.store';

export async function uploadBlossom(file: File) {
	const hash = await fromFile(file);
	return fetch(`${UrlStore.getBaseUrl()}/upload`, {
		method: 'PUT',
		headers: {
			'content-type': file.type,
			'content-length': `${file.size}`,
			Authorization: `Nostr ${hash}`,
		},
		body: file,
	});
}

export async function deleteBlossom(hash: string) {
	const authToken = await fromHash(hash);
	return fetch(`${UrlStore.getBaseUrl()}/${hash}`, {
		method: 'DELETE',
		headers: { Authorization: `Nostr ${authToken}` },
	});
}

export async function listBlossom(pubkey: string) {
	const hash = await fromEvent();
	return await fetch(`${UrlStore.getBaseUrl()}/list/${pubkey}`, {
		method: 'GET',
		headers: {
			Authorization: `Nostr ${hash}`,
		},
	});
}
