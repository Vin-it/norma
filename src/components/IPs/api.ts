import { makeReq } from '../../utils/api.utils';

export interface IpBanlist {
	ip: string;
	reason: string;
}

export async function loadBanlist() {
	const payload = { method: 'listblockedips', params: [] };

	const res = await makeReq(payload);

	if (res.ok) {
		const data = await res.json();
		return data.result;
	}
	return [];
}

export async function banIp(ip: string, reason: string) {
	const payload = { method: 'blockip', params: [ip, reason] };

	const res = await makeReq(payload);

	if (res.ok) {
		const data = await res.json();
		if (data.error) return false;
		return true;
	}

	return false;
}

export async function unblockIp(ip: string) {
	const payload = { method: 'unblockip', params: [ip] };

	const res = await makeReq(payload);

	if (res.ok) {
		const data = await res.json();
		if (data.error) return false;
		return true;
	}

	return false;
}
