import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router';
import Pubkeys from './components/Pubkeys/Pubkeys';
import Kinds from './components/Kinds/Kinds';
import Metadata from './components/Metadata/Metadata';

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    const rootEl = document.getElementById('root');
    if (rootEl) {
      const root = ReactDOM.createRoot(rootEl);
      root.render(
        <BrowserRouter>
          <Routes>
            <Route element={<App />}>
              <Route path="/" element={<Metadata />} />
              <Route path="/pubkeys" element={<Pubkeys />} />
              <Route path="/kinds" element={<Kinds />} />
            </Route>
          </Routes>
        </BrowserRouter>,
      );
    }
  }
};
