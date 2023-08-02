import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './views/pages/Login';
import Logout from './views/pages/Logout';

export default function AppRoute() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={DashboardLayout} />
      </Switch>
    </BrowserRouter>
  );
}
