import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Profile from './pages/Profile';
import NotFound from './components/Router/NotFound';
import { routes } from './components/Router/Config';
import Login from './pages/Login';
import { useAppSelector } from './app/hooks';
import { selectLoggedIn } from './pages/Login/authSlice';

const App: React.FC = () => {

  const loggedIn = useAppSelector(selectLoggedIn);

  return (
    <>
      {!loggedIn ? (
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </Router>
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              {routes.map(route => (
                <Route
                  path={route.path}
                  element={route.component}
                  key={`Route_${route.path}`}
                />
              ))}
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      )}
    </>
  );
};

export default App;
