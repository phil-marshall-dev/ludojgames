import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootswatch/dist/spacelab/bootstrap.min.css'
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider, Outlet
} from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { sessionLoader } from './loaders';
import { Col, Container, Row } from 'react-bootstrap';
import SettingsPage from './pages/SettingsPage';
import { authAction } from './actions';

const Layout = () => (
  <Container>
    <Navbar />
    <main>
      <Row className="justify-content-md-center mt-3">
        <Col md={6} xs={12}>
          <Outlet />
        </Col>
      </Row>
    </main>
    <Footer />
  </Container>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    loader: sessionLoader,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'profile/:id', element: <ProfilePage /> },
      { path: 'game/:id', element: <GamePage /> },
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
