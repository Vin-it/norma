import { Link } from 'react-router';
import { Outlet } from "react-router";

import './App.css';
import 'milligram/dist/milligram.min.css';


const App = () => {
  return (
    <div className="content">
      <div className="navbar">
        <div className="navbar-left">
          <h2 className="title">Relay Management Panel</h2>
        </div>
        <div className="navbar-right">
          <Link to="/">Home</Link>
          <Link to="/pubkeys">Pubkeys</Link>
          <Link to="/kinds">Kinds</Link>
          <Link to="/blossom">Blossom</Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default App;
