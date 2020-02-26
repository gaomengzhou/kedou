import React from 'react';
import { BrowserRouter, HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.scss';
import TabBar from './components/TabBer';
import routes from './routes';
import './style/globalStyle.scss';
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
