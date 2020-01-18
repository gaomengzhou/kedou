import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.scss';
import TabBar from './components/TabBer';
import routes from './routes';
function App() {
  return (
    <HashRouter>
      <Switch>
        <Redirect from="/" to="/video" exact />
        {routes.map(e => <Route {...e} />)}
      </Switch>
      <TabBar />
    </HashRouter>
  );
}

export default App;
