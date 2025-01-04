import { makeReq } from '../../utils/api.utils';

export async function loadAllowedKinds(): Promise<number[]> {
	const payload = { method: 'listallowedkinds', params: [] };

	const res = await makeReq(payload);

	if (res.ok) {
		const data = await res.json();
		if (data.error) return [];
		return data.result;
	}
	return [];
}

export async function allowKind(kind: number): Promise<boolean> {
	const payload = { method: 'allowkind', params: [kind] };

	const res = await makeReq(payload);

	if (res.ok) {
		const data = await res.json();
		if (data.error) return false;
		return data.result;
	}
	return false;
}

export async function disallowKind(kind: number): Promise<boolean> {
	const payload = { method: 'disallowkind', params: [kind] };

	const res = await makeReq(payload);

	if (res.ok) {
		const data = await res.json();
		if (data.error) return false;
		return data.result;
	}
	return false;
}
