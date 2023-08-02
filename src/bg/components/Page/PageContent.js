import React from 'react';
import QLDC from '../../../views/pages/qldc';
import ErrorPage from '../../../views/pages/404';
import Alerts from '../../../views/elements/Alerts';
import Grid from '../../../views/elements/Grid';
import Typography from '../../../views/elements/Typography';
import Cards from '../../../views/elements/Cards';
import Dashboard from '../../../views/pages/Dashboard';
import { Switch, Route, Redirect } from 'react-router-dom';

export default function PageContent({ children }) {
  return (
    <main id="primary-content" tabIndex="-1" role="main">
      {children}     
    </main>
  );
}
