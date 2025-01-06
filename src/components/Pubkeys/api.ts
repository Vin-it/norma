import {
	handleResponse,
	makeReq,
	type Nip86Response,
} from '../../utils/api.utils';
import { npubToHex } from '../../utils/general.utils';

export interface PubKeyReason {
	pubkey: string;
	reason: string;
}

export async function listAllowedPubkeys(): Promise<
	Nip86Response<PubKeyReason[]>
> {
	const payload = { method: 'listallowedpubkeys', params: [] };

	const res = await makeReq(payload);

	return handleResponse<PubKeyReason[]>(res);
}

export async function allowPubkey(
	npub: string,
	reason?: string,
): Promise<Nip86Response<true>> {
	const payload = {
		method: 'allowpubkey',
		params: [npubToHex(npub), reason ?? 'no reason provided'],
	};

	const res = await makeReq(payload);
	return handleResponse<true>(res);
}

export async function banPubkey(
	pubkey: string,
	reason?: string,
): Promise<Nip86Response<true>> {
	const payload = {
		method: 'banpubkey',
		params: [pubkey, reason ?? 'no reason provided'],
	};

	const res = await makeReq(payload);
	return handleResponse<true>(res);
}
