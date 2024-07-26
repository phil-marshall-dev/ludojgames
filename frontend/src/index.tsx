import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootswatch/dist/spacelab/bootstrap.min.css'
import './index.css'
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider, Outlet,
  useLoaderData
} from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import LoginPage from './pages/LoginPage';
import LobbyPage from './pages/LobbyPage';
import ProfilePage from './pages/ProfilePage';
import { sessionLoader, gameLoader, profileLoader } from './loaders';
import { Container } from 'react-bootstrap';
import SettingsPage from './pages/SettingsPage';
import { authAction } from './actions';
import { ISession } from './types';

// Add polyfills
if (!Array.prototype.at) {
  Array.prototype.at = function (n) {
    n = Math.trunc(n) || 0;
    if (n < 0) n += this.length;
    if (n < 0 || n >= this.length) return undefined;
    return this[n];
  };
}

const Layout = () => {
  const session = useLoaderData() as ISession
  return (
    <Container fluid style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar session={session} />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet context={session} />
      </main>
      <Footer />
    </Container>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    loader: sessionLoader,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'profile/:id', element: <ProfilePage />, loader: profileLoader },
      { path: ':gameName/lobby', element: <LobbyPage /> },
      { path: ':gameName/games/:gameId', element: <GamePage />, loader: gameLoader },
      {
        path: 'login',
        element: <LoginPage />,
        action: authAction,
      },
      { path: 'settings', element: <SettingsPage /> },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
