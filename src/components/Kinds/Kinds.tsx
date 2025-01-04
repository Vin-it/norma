import { useEffect, useState } from 'react';
import { allowKind, disallowKind, loadAllowedKinds } from './api';

export default function Kinds() {
	const [allowedKinds, setAllowedKinds] = useState<number[]>([]);
	const [kindInput, setKindInput] = useState('');

	useEffect(() => {
		const loadData = async () => {
			const whitelist = await loadAllowedKinds();
			setAllowedKinds(whitelist);
		};
		loadData();
	}, []);

	const handleAllowClick = async () => {
		const result = await allowKind(Number(kindInput));
		if (result) {
			setKindInput('');
			setAllowedKinds([...allowedKinds, Number(kindInput)]);
		}
	};

	const handleDisallowClick = async (kind: number) => {
		const result = await disallowKind(kind);
		if (result) setAllowedKinds(allowedKinds.filter((k) => k !== kind));
	};

	return (
		<>
			<h3>Allowed Kinds</h3>
			<input
				type="number"
				placeholder="kind"
				value={kindInput}
				onChange={(e) => setKindInput(e.target.value)}
			/>
			<button type="button" onClick={handleAllowClick}>
				Whitelist kind
			</button>
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
