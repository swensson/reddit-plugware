import React from 'react';

const CLIENT_ID = String(process.env.GH_CLIENT_ID);
const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
const REDIRECT_URL = 'http://localhost:1234/auth'; // ???

export const usePromise = (pr) => {
  const [state, setState] = React.useState(null);

  React.useEffect(() => {
    Promise.resolve(pr).then((data) => setState(data));
  }, [pr]);

  return [state];
};

const useSearchParam = (name: string, defaultValue: string | null) => {
  return [
    new URLSearchParams(window.location.search).get(name) || defaultValue,
    (value: string) => {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set(name, value);
      window.location.search = searchParams.toString();
    },
  ] as const;
};

export const useGithubAuthFlow = (cb: (code: string) => void) => {
  // First of all we initiate the flow by redirecting
  // user to a specific page
  const kickoff = React.useCallback(() => {
    window.open(`${GITHUB_OAUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=user:email`, '_blank');
  }, []);

  // Then we watch for a code from the query string
  // and, if it changes, we call the success callback
  const [code] = useSearchParam('code', null);

  React.useEffect(() => {
    if (code !== null) {
      cb(code);
    }
  }, [code]);

  return [kickoff];
};

const useWindowEventListener = (name: string, listener: any) => {
  React.useEffect(() => {
    window.addEventListener(name, listener);
    return () => window.removeEventListener(name, listener);
  }, [listener]);
};

export const useLocalStorage = (name: string) => {
  const [value, $setValue] = React.useState(localStorage.getItem(name) || null);

  const setValue = React.useCallback((value: string) => {
    $setValue(value);
    localStorage.setItem(name, value);
  }, [$setValue]);

  useWindowEventListener('storage', React.useCallback((e) => {
    if (e.key === name) {
      $setValue(localStorage.getItem(name));
    }
  }, [$setValue]))

  return [value, setValue];
};
