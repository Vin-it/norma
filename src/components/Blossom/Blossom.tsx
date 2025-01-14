import { type ChangeEvent, useCallback, useEffect, useState } from 'react';
import { listAllowedPubkeys } from '../Pubkeys/api';
import { deleteBlossom, listBlossom, uploadBlossom } from './api';

interface Descriptor {
	url: string;
	sha256: string;
}

export function Blossom() {
	const [file, setFile] = useState<File>();
	const [descrptors, setDescriptors] = useState<Descriptor[]>([]);
	const [successMsg, setSuccessMsg] = useState('');
	const [randomStr, setRandomStr] = useState('');

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleUpload = async () => {
		if (!file) return;
		const response = await uploadBlossom(file);
		if (response.ok) {
			const result = await response.json();

			if (typeof result === 'object' && 'url' in result) {
				setRandomStr(Math.random().toString(36));
				setSuccessMsg('Upload successful');
				setTimeout(() => {
					setSuccessMsg('');
				}, 2000);
				setFile(undefined);
				loadData();
			}
		}
	};

	const loadData = useCallback(async () => {
		const response = await listAllowedPubkeys();
		if (response.error !== null) {
			return;
		}
		const pubkeys = response.result;
		const descriptors: Descriptor[] = [];

		for (let i = 0; i < pubkeys.length; i++) {
			const response = await listBlossom(pubkeys[i].pubkey);
			if (response.ok) {
				const descriptorList = (await response.json()) as Descriptor[];
				descriptors.push(...descriptorList);
			}
		}
		setDescriptors(descriptors);
	}, []);

	const deleteBlob = async (hash: string) => {
		const response = await deleteBlossom(hash);
		if (response.ok) {
			loadData();
		}
	};

	useEffect(() => {
		loadData();
	}, [loadData]);

	return (
		<>
			<h3>Blossom</h3>
			<input type="file" key={randomStr} onChange={handleFileChange} />
			<button type="button" onClick={handleUpload}>
				Upload
			</button>
			{successMsg && <p>{successMsg}</p>}
			<hr />
			<div>
				<h3>Blobs</h3>
				<div className="descriptor-list">
					{descrptors.map((d) => (
						<Descriptor key={d.sha256} descriptor={d} deleteFunc={deleteBlob} />
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
				// biome-ignore lint/a11y/useAltText: <explanation>
				<img className="blossom-image-thumbnail" src={descriptor.url} />
			) : (
				<a href={descriptor.url}>{descriptor.url}</a>
			)}
			<span
				onKeyDown={() => deleteFunc(descriptor.sha256)}
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
