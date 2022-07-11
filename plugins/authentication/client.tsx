import React from 'react';
import { Extension } from '/libs/socket';
import { Route, Navigate } from 'react-router-dom';
import { useBetween } from 'use-between';

import { usePromise, useLocalStorage, useGithubAuthFlow } from './utils';

/* API calls for the server */

const call = (url: string, params: any) =>
  fetch(`http://localhost:8090${url}`, { ...params, headers: { ...params.headers, 'Content-Type': 'application/json' } })
    .then((r) => r.status === 200 ? Promise.resolve(r.json()) : Promise.reject(r.json()));

const exchangeCode = (code: string) =>
  call('/auth/github', { method: 'POST', body: JSON.stringify({ code }) });

const getUser = (jwt: string) =>
  call(`/auth?jwt=${jwt}`, { method: 'GET' });

/* Shared auth state hook, import this anywhere auth is needed */

const _useAuth = () => {
  const [jwt, setJwt] = useLocalStorage('jwt');
  const [user] = usePromise(React.useMemo(() => jwt ? getUser(jwt) : null, [jwt]));

  const logout = React.useCallback(() => setJwt(''), [setJwt]);

  return { jwt, setJwt, user, logout };
};

export const useAuth = () => useBetween(_useAuth);

/* Actual components */

const Auth = () => {
  const { jwt, setJwt } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const [loginViaGithub] = useGithubAuthFlow(async (code) => {
    setLoading(true);
    exchangeCode(code).then((jwt) => {
      setJwt(jwt);
    }).catch((err) => {
      alert('Something went wrong');
      setLoading(false);
    });
  });

  if (!!jwt) {
    return <Navigate to="/" />
  }

  return (
    <div>
      <h1>Authenticate please</h1>
      <button disabled={loading} onClick={loginViaGithub}>Login with github</button>
    </div>
  );
};

const Page = () => {
  const { jwt, user, logout } = useAuth();

  if (!jwt) {
    return <Navigate to="/auth" />
  }

  return (
    <div>
      <h1>Authenticated</h1>
      <div>{JSON.stringify(user)}</div><br />
      <button onClick={logout}>Logout</button>
    </div>
  );
};

/* The hook-like plugin, we extend the router to add routes */

export default (router) => {
  return [(
    <Extension name="auth" socket={router}>
      <Route path="/" element={<Page />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<h1>Page not found, go to <a href="/">Dashboard</a></h1>} />
    </Extension>
  )];
};
