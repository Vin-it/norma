import { type ChangeEvent, useEffect, useState } from 'react';
import { fromEvent, fromHash, fromPayload } from '../../utils/blossom.utils';
import { loadWhitelist } from '../Pubkeys/api';
import { UrlStore } from '../../utils/url.store';

interface Descriptor {
	url: string;
	sha256: string;
}

export function Blossom() {
	const [file, setFile] = useState<File>();
	const [descrptors, setDescriptors] = useState<Descriptor[]>([]);

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleUpload = async () => {
		if (!file) return;

		const hash = await fromPayload(file);
		const response = await fetch(`${UrlStore.getBaseUrl()}/upload`, {
			method: 'PUT',
			headers: {
				'content-type': file.type,
				'content-length': `${file.size}`,
				Authorization: `Nostr ${hash}`,
			},
			body: file,
		});

		if (response.ok) {
			const result = await response.json();
			if (result) {
				loadData();
			}
		}
	};
	const loadData = async () => {
		const pubkeys = await loadWhitelist();
		const hash = await fromEvent();
		const descriptors: Descriptor[] = [];

		for (let i = 0; i < pubkeys.length; i++) {
			const response = await fetch(
				`${UrlStore.getBaseUrl()}/list/${pubkeys[i].pubkey}`,
				{
					method: 'GET',
					headers: {
						Authorization: `Nostr ${hash}`,
					},
				},
			);
			if (response.ok) {
				const descriptorList = (await response.json()) as Descriptor[];
				descriptors.push(...descriptorList);
			}
		}
		setDescriptors(descriptors);
	};

	const deleteBlob = async (hash: string) => {
		const authToken = await fromHash(hash);

		const response = await fetch(`${UrlStore.getBaseUrl()}/${hash}`, {
			method: 'DELETE',
			headers: { Authorization: `Nostr ${authToken}` },
		});

		if (response.ok) {
			loadData();
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	return (
		<>
			<h1>Blossom</h1>
			<input type="file" onChange={handleFileChange} />
			<button onClick={handleUpload}>Upload</button>
			<hr />
			<div>
				<h3>Blobs</h3>
				<div className="descriptor-list">
					{descrptors.map((d) => (
						<Descriptor descriptor={d} deleteFunc={deleteBlob} />
					))}
				</div>
			</div>
		</>
	);
}

interface DescriptorProps {
	descriptor: Descriptor;
	deleteFunc: (sha256: string) => Promise<void>;
}

function Descriptor({ descriptor, deleteFunc }: DescriptorProps) {
	return (
		<div className="descriptor" key={descriptor.sha256}>
			{isImageUrl(descriptor.url) ? (
				<img
					className="blossom-image-thumbnail"
					src={descriptor.url.replace('https://', 'http://')}
				/>
			) : (
				<a href={descriptor.url}>{descriptor.url}</a>
			)}
			<span
				className="whitelist-remove"
				onClick={() => deleteFunc(descriptor.sha256)}
			>
				❌
			</span>
		</div>
	);
}

function isImageUrl(str: string) {
	return (
		str.indexOf('png') > -1 ||
		str.indexOf('jpg') > -1 ||
		str.indexOf('jpeg') > -1 ||
		str.indexOf('gif') > -1 ||
		str.indexOf('webp') > -1
	);
}
