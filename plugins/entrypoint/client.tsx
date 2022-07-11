import React from 'react';
// import { Socket, useSocket } from '/libs/socket';
// import { useBetween } from 'use-between';
import { BrowserRouter, Routes } from 'react-router-dom';

import { useEventEmitter } from '/libs/socket';

// export const useRouterSocket = () => useBetween(useNewSocket);

export default () => {
  const socket = useEventEmitter();
  const content = socket.emitps('router');

  return (
    <BrowserRouter>
      <Routes>
        {content}
      </Routes>
    </BrowserRouter>
  )
};
