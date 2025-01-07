import { useCallback, useEffect, useState } from 'react';
import {
	changeRelayDescription,
	changeRelayIcon,
	changeRelayName,
	loadMetadata,
	loadSupportedMethods,
} from './api';
import { useUrlContext } from '../../UrlContext';
import type { Nip86Response } from '../../utils/api.utils';
import { Errors } from '../Errors/Errors';

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
	const [error, setError] = useState<string>('');
	const { api, handleSetApi, resetStore } = useUrlContext();

	const loadAndSetSupportedMethods = useCallback(async () => {
		const response = await loadSupportedMethods();
		if (response.error !== null) {
			setError(response.error);
			return;
		}
		setSupportedMethods(response.result);
	}, []);
	const loadAndSetMetadata = useCallback(async () => {
		const metadata = await loadMetadata();
		setMetadata(metadata);
	}, []);

	useEffect(() => {
		loadAndSetSupportedMethods();
		loadAndSetMetadata();
	}, [loadAndSetMetadata, loadAndSetSupportedMethods]);

	const handleBaseUrlUpdate = async (
		baseUrl: string,
	): Promise<{ error: null; result: true }> => {
		handleSetApi(baseUrl);
		await loadSupportedMethods();
		return { error: null, result: true };
	};
	const handleEndpointUpdate = async (
		endpoint: string,
	): Promise<{ error: null; result: true }> => {
		handleSetApi(undefined, endpoint);
		await loadSupportedMethods();
		return { error: null, result: true };
	};

	return (
		<>
			<div className="metadata">
				<EditableInput
					display="Name"
					value={metadata.name}
					func={changeRelayName}
				/>
				<EditableInput
					display="Description"
					value={metadata.description}
					func={changeRelayDescription}
				/>
				<EditableInput
					style={{ overflowWrap: 'anywhere' }}
					display="Icon Url"
					value={metadata.icon}
					func={changeRelayIcon}
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
					{supportedMethods.length > 0
						? supportedMethods.map((s, idx) => (
								<span key={s}>
									{' '}
									✅ {s} {idx === supportedMethods.length ? ',' : ''}
								</span>
							))
						: ' Server returned empty list for supported methods'}
					<br />
					<Errors errors={[error]} />
				</div>
				<button
					type="button"
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
	func: (value: string) => Promise<Nip86Response<true>>;
	style?: React.CSSProperties;
}

function EditableInput({ display, value, func, style }: EditableInputProps) {
	const [editing, setEditing] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>(value);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		if (!inputValue) setInputValue(value);
	}, [value, inputValue]);

	const handleSaveClick = async () => {
		setEditing(false);
		const response = await func(inputValue);
		if (response.error) {
			setInputValue(value);
			setError(response.error);
			return;
		}
	};

	return (
		<div style={{ display: 'flex', gap: '10px', ...(style ?? {}) }}>
			{editing ? (
				<>
					<input
						type="text"
						placeholder={display}
						value={inputValue}
						onChange={(e) => setInputValue(e.currentTarget.value)}
					/>
					<button
						type="button"
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
					<Errors errors={[error]} />
					<span
						style={{ cursor: 'pointer' }}
						onClick={() => setEditing((prevState) => !prevState)}
						onKeyDown={() => setEditing((prevState) => !prevState)}
					>
						✎
					</span>
				</>
			)}
		</div>
	);
}
