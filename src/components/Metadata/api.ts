import { makeReq } from "../../utils/api.utils";
import { UrlStore } from "../../utils/url.store";

export async function loadMetadata() {
    const res = await fetch(
        `${UrlStore.getBaseUrl()}`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/nostr+json'
            }
        }
    );

    if (res.ok) {
        return res.json();
    }

    return {};
}

export async function loadSupportedMethods() {
    const res = await makeReq({ method: "supportedmethods", params: [] });
    if (res.ok) {
        const data = await res.json();
        if (data.error) return [];
        return data.result;
    }

    return [];
}