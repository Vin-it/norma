import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router';
import Pubkeys from './components/Pubkeys/Pubkeys';
import Kinds from './components/Kinds/Kinds';
import Metadata from './components/Metadata/Metadata';
import { Blossom } from './components/Blossom/Blossom';
import { IPs } from './components/IPs/IP';
import { Events } from './components/Events/Events';

document.onreadystatechange = () => {
	if (document.readyState === 'complete') {
		const rootEl = document.getElementById('root');
		if (rootEl) {
			const root = ReactDOM.createRoot(rootEl);
			root.render(
				<BrowserRouter>
					<Routes>
						<Route element={<App />}>
							<Route path="/" element={<Metadata />} />
							<Route path="/events" element={<Events />} />
							<Route path="/pubkeys" element={<Pubkeys />} />
							<Route path="/kinds" element={<Kinds />} />
							<Route path="/blossom" element={<Blossom />} />
							<Route path="/ips" element={<IPs />} />
						</Route>
					</Routes>
				</BrowserRouter>,
			);
		}
	}
};
