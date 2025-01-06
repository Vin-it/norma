import { useEffect, useState } from 'react';
import { unblockIp, blockIp, type IpBanlist, listBlockedIps } from './api';
import { Errors } from '../Errors/Errors';

export function IPs() {
	const [banlist, setBanlist] = useState<IpBanlist[]>([]);
	const [ipInput, setIpInput] = useState('');
	const [reasonInput, setReasonInput] = useState('');
	const [errors, setErrors] = useState<string[]>([]);

	useEffect(() => {
		const loadData = async () => {
			const response = await listBlockedIps();
			if (response.error !== null) {
				setErrors([response.error]);
				return;
			}
			setBanlist(response.result);
		};
		loadData();
	}, []);

	const handleBlockIpClick = async () => {
		const response = await blockIp(ipInput, reasonInput);
		if (response.error !== null) {
			setErrors([response.error]);
			return;
		}
		setBanlist((prevState) => [
			...prevState,
			{ ip: ipInput, reason: reasonInput },
		]);
	};

	const handleUnblockClick = async (ip: string) => {
		const response = await unblockIp(ip);
		if (response.error !== null) {
			setErrors([response.error]);
			return;
		}

		setBanlist(banlist.filter((bl) => bl.ip !== ip));
	};

	return (
		<div>
			<input
				type="text"
				placeholder="IP"
				value={ipInput}
				onChange={(e) => setIpInput(e.target.value)}
			/>
			<input
				type="text"
				placeholder="reason"
				value={reasonInput}
				onChange={(e) => setReasonInput(e.target.value)}
			/>
			<button type="button" onClick={handleBlockIpClick}>
				Block IP
			</button>
			<Errors errors={errors} />
			<h3>Banned IPs</h3>
			<ul>
				{banlist.map((bl) => {
					return (
						<li key={bl.ip}>
							<span>
								<b>IP: </b>
								{bl.ip}
							</span>
							{' / '}
							<span>
								<b>Reason: </b>
								{bl.reason}
							</span>
							<span
								className="whitelist-remove"
								onClick={() => handleUnblockClick(bl.ip)}
								onKeyDown={() => handleUnblockClick(bl.ip)}
							>
								❌
							</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
