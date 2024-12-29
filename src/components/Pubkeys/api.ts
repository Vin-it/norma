import { MANAGER_API_BASE_URL, fromPayload, npubToHex } from "../../utils/general.utils";

export interface PubKeyReason {
    pubkey: string;
    reason: string;
}

export async function makeReq(payload: Record<string, unknown>) {
    const eventBase64 = await fromPayload(payload);

    return fetch(
        `${MANAGER_API_BASE_URL}/admin/manage`,
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                Authorization: `Nostr ${eventBase64}`
            }
        }
    );
}

export async function loadWhitelist(): Promise<PubKeyReason[]> {
    const payload = { "method": "listallowedpubkeys", "params": [] };

    const res = await makeReq(payload);

    if (res.ok) {
        const data = await res.json();
        return data.result;
    }
    return [];
}

export async function whitelistPubkey(npub: string, reason?: string): Promise<boolean> {
    const payload = { "method": "allowpubkey", "params": [npubToHex(npub), reason ?? "no reason provided"] };

    const res = await makeReq(payload);
    if (res.ok) {
        const data = await res.json();
        return data.result;
    }
    return false;
}

export async function banPubkey(pubkey: string, reason?: string) {
    const payload = { "method": "banpubkey", "params": [pubkey, reason ?? "no reason provided"] };

    const res = await makeReq(payload);
    if (res.ok) {
        const data = await res.json();
        return data.result;
    }
    return false;
}