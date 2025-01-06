import { handleResponse, makeReq } from '../../utils/api.utils';

export interface IpBanlist {
	ip: string;
	reason: string;
}

export async function listBlockedIps() {
	const payload = { method: 'listblockedips', params: [] };
	const res = await makeReq(payload);
	return handleResponse<IpBanlist[]>(res);
}

export async function blockIp(ip: string, reason: string) {
	const payload = { method: 'blockip', params: [ip, reason] };
	const res = await makeReq(payload);
	return handleResponse<true>(res);
}

export async function unblockIp(ip: string) {
	const payload = { method: 'unblockip', params: [ip] };
	const res = await makeReq(payload);
	return handleResponse<true>(res);
}
