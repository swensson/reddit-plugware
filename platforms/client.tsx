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

import Entrypoint from '/plugins/entrypoint/client';
import Dashboard from '/plugins/thread-core/client';

/* Render plugins */

root.render(
  <>
    <Entrypoint />
    <Dashboard />
  </>
);
