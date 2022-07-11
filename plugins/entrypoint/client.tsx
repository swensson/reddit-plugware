import React from 'react';
import { Socket, useSocket } from '/libs/socket';
import { BrowserRouter, Routes } from 'react-router-dom';

export default () => {
  const [socket] = useSocket();

  return [(
    <Socket socket={socket} wrapper={(data) => (
      <div key="router">
        <BrowserRouter>
          <Routes>
            {data}
          </Routes>
        </BrowserRouter>
      </div>
    )}  />
  ), socket];
};
