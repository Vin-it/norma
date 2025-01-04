import { useEffect, useState } from 'react';
import { loadMetadata, loadSupportedMethods } from './api';
import { makeReq } from '../../utils/api.utils';
import { useUrlContext } from '../../UrlContext';

interface Metadata {
	name: string;
	pubkey: string;
	description: string;
	icon: string;
}

export default function Metadata() {
	const [metadata, setMetadata] = useState<Metadata>({
		name: '',
		pubkey: '',
		description: '',
		icon: '',
	});
	const [supportedMethods, setSupportedMethods] = useState<string[]>([]);
	const { api, handleSetApi, resetStore } = useUrlContext();

	const loadData = async () => {
		const supportedMethods = await loadSupportedMethods();
		const metadata = await loadMetadata();
		setMetadata(metadata);
		setSupportedMethods(supportedMethods);
	};

	useEffect(() => {
		loadData();
	}, [api.MANAGER_API_BASE_URL, api.MANAGER_API_ENDPOINT]);

	const handleRelayNameUpdate = async (name: string) => {
		const res = await makeReq({ method: 'changerelayname', params: [name] });
		if (res.ok) {
			const result = await res.json();
			if (result.error) return false;
			return true;
		}
		return false;
	};

	const handleDescriptionUpdate = async (description: string) => {
		const res = await makeReq({
			method: 'changerelaydescription',
			params: [description],
		});
		if (res.ok) {
			const result = await res.json();
			if (result.error) return false;
			return true;
		}
		return false;
	};

	const handleIconUpdate = async (iconUrl: string) => {
		const res = await makeReq({ method: 'changerelayicon', params: [iconUrl] });
		if (res.ok) {
			const result = await res.json();
			if (result.error) return false;
			return true;
		}
		return false;
	};

	const handleBaseUrlUpdate = async (baseUrl: string) => {
		handleSetApi(baseUrl);
		return true;
	};
	const handleEndpointUpdate = async (endpoint: string) => {
		handleSetApi(undefined, endpoint);
		return true;
	};

	return (
		<>
			<div className="metadata">
				<EditableInput
					display="Name"
					value={metadata.name}
					func={handleRelayNameUpdate}
				/>
				<EditableInput
					display="Description"
					value={metadata.description}
					func={handleDescriptionUpdate}
				/>
				<EditableInput
					display="Icon Url"
					value={metadata.icon}
					func={handleIconUpdate}
				/>
				<EditableInput
					display="Relay Management API URL"
					value={api.MANAGER_API_BASE_URL ?? ''}
					func={handleBaseUrlUpdate}
				/>
				<EditableInput
					display="Relay Management API Endpoint"
					value={api.MANAGER_API_ENDPOINT ?? ''}
					func={handleEndpointUpdate}
				/>
				<span>
					<b>Owner:</b> {metadata.pubkey}
				</span>
				<div className="supported-methods">
					<span>
						<b>Supported Methods:</b>
					</span>
					{supportedMethods.map((s, idx) => (
						<span key={idx}>
							{' '}
							✅ {s} {idx === supportedMethods.length ? ',' : ''}
						</span>
					))}
				</div>
				<button
					onClick={() => {
						const confirmed = confirm('are you sure?');
						if (confirmed) {
							resetStore();
						}
					}}
				>
					⚠️ RESET
				</button>
			</div>
		</>
	);
}

interface EditableInputProps {
	display: string;
	value: string;
	func: (value: string) => Promise<boolean>;
}

function EditableInput({ display, value, func }: EditableInputProps) {
	const [editing, setEditing] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>(value);

	useEffect(() => {
		if (!inputValue) setInputValue(value);
	}, [value]);

	const handleSaveClick = async () => {
		setEditing(false);
		const result = await func(inputValue);
		if (!result) setInputValue(value);
	};

	return (
		<div style={{ display: 'flex', gap: '10px' }}>
			{editing ? (
				<>
					<input
						type="text"
						placeholder={display}
						value={inputValue}
						onChange={(e) => setInputValue(e.currentTarget.value)}
					/>
					<button
						onClick={handleSaveClick}
						className="column column-offset-10 column-10"
					>
						Save
					</button>
				</>
			) : (
				<>
					<span>
						<b>{display}: </b>
						{inputValue.includes('http') ? (
							<a href={inputValue}>{inputValue}</a>
						) : (
							inputValue
						)}
					</span>
					<span
						style={{ cursor: 'pointer' }}
						onClick={() => setEditing((prevState) => !prevState)}
					>
						✎
					</span>
				</>
			)}
		</div>
	);
}
