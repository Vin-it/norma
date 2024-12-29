import { MANAGER_API_BASE_URL, fromPayload } from "./general.utils";

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