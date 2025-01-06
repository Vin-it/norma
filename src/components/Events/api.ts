import { handleResponse, makeReq } from '../../utils/api.utils';

export interface IDReason {
	id: string;
	reason: string;
}

export async function loadBanlistEvents() {
	const payload = { method: 'listbannedevents', params: [] };
	const res = await makeReq(payload);
	return handleResponse<IDReason[]>(res);
}

export async function banEvent(id: string, reason?: string) {
	const payload = { method: 'banevent', params: [id, reason ?? ''] };
	const res = await makeReq(payload);
	return handleResponse<true[]>(res);
}

export async function allowEvent(id: string, reason?: string) {
	const payload = { method: 'allowevent', params: [id, reason ?? ''] };
	const res = await makeReq(payload);
	return handleResponse<true[]>(res);
}
