import { fromPayload } from "./general.utils";
import { UrlStore } from "./url.store";

export async function makeReq(payload: Record<string, unknown>) {
    const eventBase64 = await fromPayload(payload);

    return fetch(
        UrlStore.getFullManagerUrl(),
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                Authorization: `Nostr ${eventBase64}`
            }
        }
    );
}