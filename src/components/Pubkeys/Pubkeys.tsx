import { useEffect, useState } from 'react';
import {
	type PubKeyReason,
	banPubkey,
	listAllowedPubkeys,
	allowPubkey,
} from './api';
import { npubToHex } from '../../utils/general.utils';
import { Errors } from '../Errors/Errors';

export default function Pubkeys() {
	const [allowedPubkeys, setAllowedPubkeys] = useState<PubKeyReason[]>([]);
	const [npubInput, setNpubInput] = useState('');
	const [errors, setErrors] = useState<string[]>([]);

	useEffect(() => {
		const loadData = async () => {
			const response = await listAllowedPubkeys();
			if (response.error !== null) {
				setErrors([response.error]);
				return;
			}
			setAllowedPubkeys(response.result);
		};
		loadData();
	}, []);

	const handleWhitelistClick = async () => {
		const response = await allowPubkey(npubInput);
		if (response.error !== null) {
			setErrors([response.error]);
			return;
		}

		setNpubInput('');
		setAllowedPubkeys([
			...allowedPubkeys,
			{ pubkey: npubToHex(npubInput), reason: '' },
		]);
	};

	const handleBanClick = async (pubkey: string) => {
		const response = await banPubkey(pubkey);
		if (response.error !== null) {
			setErrors([response.error]);
			return;
		}
		setAllowedPubkeys(allowedPubkeys.filter((wl) => wl.pubkey !== pubkey));
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
				{allowedPubkeys
					.sort((a, b) => `${''}${a.pubkey}`.localeCompare(b.pubkey))
					.map((ap) => {
						return (
							<li className="whitelist" key={ap.pubkey}>
								{ap.pubkey}
								<span
									className="whitelist-remove"
									onClick={() => handleBanClick(ap.pubkey)}
									onKeyDown={() => handleBanClick(ap.pubkey)}
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
