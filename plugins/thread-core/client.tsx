import React from 'react';
import { useEventEmitter } from '/libs/socket';
import { Route, Navigate } from 'react-router-dom';
// import { useBetween } from 'use-between';

import { Heading } from '/components/text';

// import { useRouterSocket } from '/plugins/entrypoint/client';

// const useSocketRender = (socketHook, name, content) => {
//   const socket = socketHook();
//
//   React.useEffect(() => socket.add(name, content), [socket.add]);
// };

const Dashboard = () => {
  const ee = useEventEmitter();
  const num = ee.emitss('num', 14);

  return (
    <Heading>It Works {num}</Heading>
  );
};

export default (router) => {
  const ee = useEventEmitter();

  // React.useEffect(() => {
  //   return ee.on('num', (num) => {
  //     return num * 2;
  //   });
  // }, []);

  React.useEffect(() => {
    return ee.on('router', () => {
      return (
        <Route key="dashboard" path="/" element={<Dashboard />} />
      );
    });
  }, []);

  return null;
};
