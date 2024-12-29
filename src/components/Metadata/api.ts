import { makeReq } from "../../utils/api.utils";
import { MANAGER_API_BASE_URL } from "../../utils/general.utils";

export async function loadMetadata() {
    const res = await fetch(
        `${MANAGER_API_BASE_URL}`,
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