import { useEffect, useState } from 'react';
import { unblockIp, banIp, type IpBanlist, loadBanlist } from './api';

export function IPs() {
	const [banlist, setBanlist] = useState<IpBanlist[]>([]);
	const [ipInput, setIpInput] = useState('');
	const [reasonInput, setReasonInput] = useState('');

	useEffect(() => {
		const loadData = async () => {
			setBanlist(await loadBanlist());
		};
		loadData();
	}, []);

	const handleBlockIpClick = async () => {
		const success = await banIp(ipInput, reasonInput);
		if (success) setBanlist([...banlist, { ip: ipInput, reason: reasonInput }]);
	};

	const handleUnblockClick = async (ip: string) => {
		const success = await unblockIp(ip);
		if (success) setBanlist(banlist.filter((bl) => bl.ip !== ip));
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
