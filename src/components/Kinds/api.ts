import { handleResponse, makeReq } from '../../utils/api.utils';

export async function loadAllowedKinds() {
	const payload = { method: 'listallowedkinds', params: [] };
	const res = await makeReq(payload);
	return handleResponse<number[]>(res);
}

export async function allowKind(kind: number) {
	const payload = { method: 'allowkind', params: [kind] };
	const res = await makeReq(payload);
	return handleResponse<true>(res);
}

export async function disallowKind(kind: number) {
	const payload = { method: 'disallowkind', params: [kind] };
	const res = await makeReq(payload);
	return handleResponse<true>(res);
}
