import { useEffect, useState } from 'react';
import { allowEvent, banEvent, type IDReason, listBannedEvents } from './api';
import { Errors } from '../Errors/Errors';

export function Events() {
	const [bannedEvents, setBannedEvents] = useState<IDReason[]>([]);
	const [errors, setErrors] = useState<string[]>([]);
	const [idInput, setIdInput] = useState('');
	const [reasonInput, setReasonInput] = useState('');

	useEffect(() => {
		const loadData = async () => {
			const response = await listBannedEvents();
			if (response.error !== null) {
				setErrors([response.error]);
				return;
			}
			setBannedEvents(response.result);
		};
		loadData();
	}, []);

	const handleBanEventClick = async () => {
		const response = await banEvent(idInput, reasonInput);
		if (response.error !== null) {
			setErrors([response.error]);
			return;
		}
		setBannedEvents((prevState) => [
			...prevState,
			{ id: idInput, reason: reasonInput },
		]);
	};

	const handleAllowClick = async (id: string, reason?: string) => {
		const response = await allowEvent(id, reason);
		if (response.error !== null) {
			setErrors([response.error]);
			return;
		}

		setBannedEvents((prevState) => prevState.filter((be) => be.id !== id));
	};

	return (
		<div>
			<input
				type="text"
				placeholder="Event ID"
				value={idInput}
				onChange={(e) => setIdInput(e.target.value)}
			/>
			<input
				type="text"
				placeholder="Reason"
				value={reasonInput}
				onChange={(e) => setReasonInput(e.target.value)}
			/>
			<button type="button" onClick={handleBanEventClick}>
				Block Event
			</button>
			<Errors errors={errors} />

			<ul>
				{bannedEvents.sort().map((be) => (
					<li key={be.id}>
						<b>Event ID: </b>
						{be.id} / <b>Event Reason: </b>
						{be.reason}
						<span
							className="whitelist-remove"
							onClick={() => handleAllowClick(be.id)}
							onKeyDown={() => handleAllowClick(be.id)}
						>
							{' '}
							❌
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
