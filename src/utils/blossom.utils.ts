import { type EventHash, getPayloadSha256 } from './general.utils';

type TagType = 'upload' | 'list' | 'delete';

export async function constructBlossomBaseEvent({
	content,
	payloadHash,
	tagType,
}: { content: string; payloadHash?: string; tagType: TagType }) {
	const createdAt = Math.floor(new Date().getTime() / 1000);
	const tags = [
		['t', tagType],
		['expiration', `${createdAt + 3600}`],
	];
	if (payloadHash) {
		tags.push(['x', payloadHash]);
	}
	return window.nostr?.signEvent({
		pubkey: await window.nostr?.getPublicKey(),
		content,
		kind: 24242,
		created_at: createdAt,
		tags,
	});
}

export async function fromPayload(payload: File): Promise<EventHash> {
	const payloadHash = await getPayloadSha256(payload);
	const event = await constructBlossomBaseEvent({
		payloadHash,
		content: `upload ${payload.name}.${payload.type}`,
		tagType: 'upload',
	});
	const eventBase64 = btoa(JSON.stringify(event));
	return eventBase64;
}

export async function fromEvent(): Promise<EventHash> {
	const event = await constructBlossomBaseEvent({
		content: 'List blobs',
		tagType: 'list',
	});
	const eventBase64 = btoa(JSON.stringify(event));
	return eventBase64;
}

export async function fromHash(hash: string): Promise<EventHash> {
	const event = await constructBlossomBaseEvent({
		content: 'delete blob',
		tagType: 'delete',
		payloadHash: hash,
	});

	const eventBase64 = btoa(JSON.stringify(event));
	return eventBase64;
}
