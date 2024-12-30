import { EventHash, getPayloadSha256 } from "./general.utils";

export async function constructBlossomUploadEvent(payload: string) {
    const createdAt = Math.floor(new Date().getTime() / 1000);
    return window.nostr?.signEvent({
        pubkey: await window.nostr?.getPublicKey(),
        content: "upload file",
        kind: 24242,
        created_at: createdAt,
        tags: [
            ["t", "upload"],
            ["expiration", `${createdAt + 3600}`],
            ["x", payload]
        ]
    })
}

export async function constructBlossomListEvent() {
    const createdAt = Math.floor(new Date().getTime() / 1000);
    return window.nostr?.signEvent({
        pubkey: await window.nostr?.getPublicKey(),
        content: "list blobs",
        kind: 24242,
        created_at: createdAt,
        tags: [
            ["t", "list"],
            ["expiration", `${createdAt + 3600}`],
        ]
    });
}

export async function constructBlossomDeleteEvent(hash: string) {
    const createdAt = Math.floor(new Date().getTime() / 1000);
    return window.nostr?.signEvent({
        pubkey: await window.nostr?.getPublicKey(),
        content: "delete blob",
        kind: 24242,
        created_at: Math.floor(new Date().getTime() / 1000),
        tags: [
            ["t", "delete"],
            ["expiration", `${createdAt + 3600}`],
            ["x", hash]
        ]
    });
}

export async function fromPayload(payload: File): Promise<EventHash> {
    const payloadHash = await getPayloadSha256(payload);
    const event = await constructBlossomUploadEvent(payloadHash);
    const eventBase64 = btoa(JSON.stringify(event));
    return eventBase64;
}

export async function fromEvent(): Promise<EventHash> {
    const event = await constructBlossomListEvent();
    const eventBase64 = btoa(JSON.stringify(event));
    return eventBase64;
}

export async function fromHash(hash: string): Promise<EventHash> {
    const event = await constructBlossomDeleteEvent(hash);
    const eventBase64 = btoa(JSON.stringify(event));
    return eventBase64;
}