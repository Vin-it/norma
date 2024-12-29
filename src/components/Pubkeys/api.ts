import { makeReq } from "../../utils/api.utils";
import { npubToHex } from "../../utils/general.utils";

export interface PubKeyReason {
    pubkey: string;
    reason: string;
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