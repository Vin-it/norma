import { useEffect, useState } from 'react';
import {
	type PubKeyReason,
	banPubkey,
	loadWhitelist,
	whitelistPubkey,
} from './api';
import { npubToHex } from '../../utils/general.utils';

export default function Pubkeys() {
	const [whitelist, setWhitelist] = useState<PubKeyReason[]>([]);
	const [npubInput, setNpubInput] = useState('');

	useEffect(() => {
		const loadData = async () => {
			const whitelist = await loadWhitelist();
			setWhitelist(whitelist);
		};
		loadData();
	}, []);

	const handleWhitelistClick = async () => {
		const result = await whitelistPubkey(npubInput);
		if (result) {
			setNpubInput('');
			setWhitelist([
				...whitelist,
				{ pubkey: npubToHex(npubInput), reason: '' },
			]);
		}
	};

	const handleBanClick = async (pubkey: string) => {
		const result = await banPubkey(pubkey);
		if (result) setWhitelist(whitelist.filter((wl) => wl.pubkey !== pubkey));
	};

	return (
		<>
			<input
				type="text"
				placeholder="npub"
				value={npubInput}
				onChange={(e) => setNpubInput(e.target.value)}
			/>
			<button type="button" onClick={handleWhitelistClick}>
				Whitelist npub
			</button>
			<h3>whitelisted pubkeys</h3>
			<ul>
				{whitelist
					.sort((a, b) => `${''}${a.pubkey}`.localeCompare(b.pubkey))
					.map((wl) => {
						return (
							<li className="whitelist" key={wl.pubkey}>
								{wl.pubkey}
								<span
									className="whitelist-remove"
									onClick={() => handleBanClick(wl.pubkey)}
									onKeyDown={() => handleBanClick(wl.pubkey)}
								>
									❌
								</span>
							</li>
						);
					})}
			</ul>
		</>
	);
}
