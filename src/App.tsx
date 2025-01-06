import { Link } from 'react-router';
import { Outlet } from 'react-router';

import './App.css';
import 'milligram/dist/milligram.min.css';

import { useState } from 'react';
import { UrlContext } from './UrlContext';
import { useUrlStore } from './use-url-store';

const App = () => {
	const { isStoreInit, api, handleSetApi, resetStore } = useUrlStore();

	return (
		<UrlContext.Provider value={{ api, handleSetApi, resetStore }}>
			<div className="wrapper">
				<div className="container">
					<div className="navbar">
						<div className="navbar-left">
							<h2 className="title">Norma</h2>
							<h6>A Nostr Relay Management Panel</h6>
						</div>
						{isStoreInit ? (
							<div className="navbar-right">
								<Link to="/">Home</Link>
								<Link to="/events">Events</Link>
								<Link to="/pubkeys">Pubkeys</Link>
								<Link to="/ips">IPs</Link>
								<Link to="/kinds">Kinds</Link>
								<Link to="/blossom">Blossom</Link>
							</div>
						) : null}
					</div>

					{isStoreInit ? (
						<Outlet />
					) : (
						<InitializeApp handleSetApi={handleSetApi} />
					)}
				</div>
			</div>
		</UrlContext.Provider>
	);
};

export default App;

function InitializeApp({
	handleSetApi,
}: { handleSetApi: (baseUrl: string, endpoint: string) => void }) {
	const [baseUrl, setBaseUrl] = useState('');
	const [endpoint, setEndpoint] = useState('');

	return (
		<div>
			<p>To get started, we need two things entered below.</p>
			<p>
				First, please enter "Relay base url", which is the http(s) (not wss!)
				URL of your relay without the endpoint path. For example,
				https://myrelay.com
			</p>
			<p>
				Second, please enter the "Relay management endpoint path", so we know
				where to send NIP-86 requests. For example, /admin/manage. Both values
				combined it would look like https://myrelay.com/manage
			</p>
			Relay base url:{' '}
			<input
				type="text"
				value={baseUrl}
				onChange={(e) => setBaseUrl(e.currentTarget.value)}
				placeholder="Example, http://myrelay.com"
			/>
			Relay management endpoint:{' '}
			<input
				type="text"
				value={endpoint}
				onChange={(e) => setEndpoint(e.currentTarget.value)}
				placeholder="Example, /admin/manage"
			/>
			<button
				type="button"
				onClick={() => {
					if (!baseUrl || !endpoint) return;
					const sanitizedBaseUrl = baseUrl.replace(/\/+$/, '');
					handleSetApi(sanitizedBaseUrl, endpoint);
				}}
			>
				Save
			</button>
		</div>
	);
}
