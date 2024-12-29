import { bech32 } from '@scure/base';

export const MANAGER_API_BASE_URL = process.env.MANAGER_API_BASE_URL || 'http://localhost:8080';

declare global {
    interface Window {
        nostr?: {
            getPublicKey: () => Promise<string>;
            signEvent: (event: Record<string, unknown>) => Promise<Event>;
        };
    }
}

async function constructManagementApiEvent(payloadHash: string) {
    return window.nostr?.signEvent({
        pubkey: await window.nostr?.getPublicKey(),
        content: "",
        kind: 27235,
        created_at: Math.floor(new Date().getTime() / 1000),
        tags: [["u", "https://localhost:8080"], ["method", "POST"], ["payload", payloadHash]]
    })
}

async function getPayloadSha256(payload: Record<string, unknown>) {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(payload));
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
}

type EventHash = string;
export async function fromPayload(payload: Record<string, unknown>): Promise<EventHash> {
    const payloadHash = await getPayloadSha256(payload);
    const event = await constructManagementApiEvent(payloadHash);
    const eventBase64 = btoa(JSON.stringify(event));
    return eventBase64;
}

export function npubToHex(npub: string) {
    const prefix = 'npub';
    if (!npub.startsWith(prefix)) {
        throw new Error('Invalid npub format');
    }

    // Decode the bech32 encoded string
    const decoded = bech32.decode(npub as `${string}1${string}`);

    // Convert the decoded words to a Uint8Array
    const words = bech32.fromWords(decoded.words);
    const bytes = new Uint8Array(words);

    // Convert the Uint8Array to a hexadecimal string
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}