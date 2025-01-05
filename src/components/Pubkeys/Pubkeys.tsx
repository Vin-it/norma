import { useEffect, useState } from 'react';
import {
	type PubKeyReason,
	banPubkey,
	loadWhitelist,
	whitelistPubkey,
} from './api';
import { npubToHex } from '../../utils/general.utils';
import { Errors } from '../Errors/Errors';

export default function Pubkeys() {
	const [whitelist, setWhitelist] = useState<PubKeyReason[]>([]);
	const [npubInput, setNpubInput] = useState('');
	const [errors, setErrors] = useState<string[]>([]);

	useEffect(() => {
		const loadData = async () => {
			const response = await loadWhitelist();
			if (response.error !== null) {
				setErrors([response.error]);
				return;
			}
			setWhitelist(response.result);
		};
		loadData();
	}, []);

	const handleWhitelistClick = async () => {
		const response = await whitelistPubkey(npubInput);
		if (response.error !== null) {
			setErrors([response.error]);
			return;
		}

		setNpubInput('');
		setWhitelist([...whitelist, { pubkey: npubToHex(npubInput), reason: '' }]);
	};

	const handleBanClick = async (pubkey: string) => {
		const response = await banPubkey(pubkey);
		if (response.error !== null) {
			setErrors([response.error]);
			return;
		}
		setWhitelist(whitelist.filter((wl) => wl.pubkey !== pubkey));
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
			<Errors errors={errors} />
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
