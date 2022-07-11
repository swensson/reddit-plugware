import React from 'react';
import ReactDOM from 'react-dom/client';

const node = document.getElementById('app') as any;

document.body.style.overflow = 'hidden';

node.style.width = '100vw';
node.style.height = '100vh';
node.style.display = 'flex';
node.style.flexDirection = 'column';
node.style.alignItems = 'center';
node.style.justifyContent = 'center';

const root = ReactDOM.createRoot(node);

/* Import plugins */

import entrypoint from '/plugins/entrypoint/client';
import authentication from '/plugins/authentication/client';

/* Combine them */

const App = () => {
  const [$routes, router] = entrypoint();
  // const [$authentication] = authentication(router);
  // const [$auth, ...auth] = useAuth(router);
  // const [$pass] = usePassword(auth, router);

  // We should list them in a reverse order
  return (<>{$routes}</>);
};

root.render(
  <App />
);

