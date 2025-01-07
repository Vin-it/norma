import { useEffect, useState } from 'react';
import {
	type PubKeyReason,
	banPubkey,
	listAllowedPubkeys,
	allowPubkey,
	listBannedPubkeys,
} from './api';
import { npubToHex } from '../../utils/general.utils';
import { Errors } from '../Errors/Errors';

export default function Pubkeys() {
	const [mode, setMode] = useState<'whitelist' | 'blacklist'>('whitelist');

	return (
		<div>
			<div
				style={{
					alignItems: 'center',
					display: 'flex',
					gap: '8px',
				}}
			>
				<button type="button" onClick={() => setMode('whitelist')}>
					Whitelist Mode
				</button>
				<button type="button" onClick={() => setMode('blacklist')}>
					Blacklist Mode
				</button>
			</div>
			{mode === 'whitelist' ? <PubkeyWhitelist /> : <PubkeyBlacklist />}
		</div>
	);
}

const PubkeyWhitelist = () => {
	const [allowedPubkeys, setAllowedPubkeys] = useState<PubKeyReason[]>([]);
	const [npubInput, setNpubInput] = useState('');
	const [reasonInput, setReasonInput] = useState('');
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
		const response = await allowPubkey(npubInput, reasonInput);
		if (response.error !== null) {
			setErrors([response.error]);
			return;
		}

		setNpubInput('');
		setAllowedPubkeys([
			...allowedPubkeys,
			{ pubkey: npubToHex(npubInput), reason: reasonInput },
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
			<input
				type="text"
				placeholder="reason"
				value={reasonInput}
				onChange={(e) => setReasonInput(e.target.value)}
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
								pubkey: {ap.pubkey} / reason: {ap.reason}
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
};

const PubkeyBlacklist = () => {
	const [bannedPubkeys, setBannedPubkeys] = useState<PubKeyReason[]>([]);
	const [npubInput, setNpubInput] = useState('');
	const [reasonInput, setReasonInput] = useState('');
	const [errors, setErrors] = useState<string[]>([]);

	useEffect(() => {
		const loadData = async () => {
			const response = await listBannedPubkeys();
			if (response.error !== null) {
				setErrors([response.error]);
				return;
			}
			setBannedPubkeys(response.result);
		};
		loadData();
	}, []);

	const handleBlacklistClick = async () => {
		const response = await banPubkey(npubInput, reasonInput);
		if (response.error !== null) {
			setErrors([response.error]);
			return;
		}

		setNpubInput('');
		setBannedPubkeys([
			...bannedPubkeys,
			{ pubkey: npubToHex(npubInput), reason: reasonInput },
		]);
	};

	const handleAllowClick = async (pubkey: string) => {
		const response = await allowPubkey(pubkey);
		if (response.error !== null) {
			setErrors([response.error]);
			return;
		}
		setBannedPubkeys(bannedPubkeys.filter((wl) => wl.pubkey !== pubkey));
	};

	return (
		<>
			<input
				type="text"
				placeholder="npub"
				value={npubInput}
				onChange={(e) => setNpubInput(e.target.value)}
			/>
			<input
				type="text"
				placeholder="reason"
				value={reasonInput}
				onChange={(e) => setReasonInput(e.target.value)}
			/>
			<button type="button" onClick={handleBlacklistClick}>
				Whitelist npub
			</button>
			<Errors errors={errors} />
			<h3>Blacklisted pubkeys</h3>
			<ul>
				{bannedPubkeys
					.sort((a, b) => `${''}${a.pubkey}`.localeCompare(b.pubkey))
					.map((ap) => {
						return (
							<li className="whitelist" key={ap.pubkey}>
								pubkey: {ap.pubkey} / reason: {ap.reason}
								<span
									className="whitelist-remove"
									onClick={() => handleAllowClick(ap.pubkey)}
									onKeyDown={() => handleAllowClick(ap.pubkey)}
								>
									❌
								</span>
							</li>
						);
					})}
			</ul>
		</>
	);
};
