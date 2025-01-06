import { useEffect, useState } from 'react';
import { allowKind, disallowKind, listAllowedKinds } from './api';
import { Errors } from '../Errors/Errors';

export default function Kinds() {
	const [allowedKinds, setAllowedKinds] = useState<number[]>([]);
	const [kindInput, setKindInput] = useState('');
	const [errors, setErrors] = useState<string[]>([]);

	useEffect(() => {
		const loadData = async () => {
			const response = await listAllowedKinds();
			if (response.error !== null) {
				setErrors([response.error]);
				return;
			}
			setAllowedKinds(response.result);
		};
		loadData();
	}, []);

	const handleAllowClick = async () => {
		const response = await allowKind(Number(kindInput));
		if (response.error !== null) {
			setErrors([response.error]);
			return;
		}
		setKindInput('');
		setAllowedKinds((prevState) => [...prevState, Number(kindInput)]);
	};

	const handleDisallowClick = async (kind: number) => {
		const response = await disallowKind(kind);
		if (response.error !== null) {
			setErrors([response.error]);
			return;
		}
		setAllowedKinds((prevState) => prevState.filter((k) => k !== kind));
	};

	return (
		<>
			<input
				type="number"
				placeholder="kind"
				value={kindInput}
				onChange={(e) => setKindInput(e.target.value)}
			/>
			<button type="button" onClick={handleAllowClick}>
				Whitelist kind
			</button>
			<Errors errors={errors} />
			<h3>Allowed Kinds</h3>
			<ul>
				{allowedKinds.sort().map((k) => (
					<li key={k}>
						{k}
						<span
							className="whitelist-remove"
							onClick={() => handleDisallowClick(k)}
							onKeyDown={() => handleDisallowClick(k)}
						>
							{' '}
							❌
						</span>
					</li>
				))}
			</ul>
		</>
	);
}
