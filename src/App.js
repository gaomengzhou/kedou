import React from 'react';
import './App.scss';
import TabBar from './components/TabBer';
import routes from './routes';
import './style/globalStyle.scss'
import { HashRouter, Route, Redirect, Switch, BrowserRouter, Link } from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
      <HashRouter>
        <Switch>
          <Redirect from="/" to="/video" exact />
          {routes.map(e => <Route {...e} />)}
        </Switch>
        <TabBar />
      </HashRouter>
    </BrowserRouter>
  );
}

export default App;
