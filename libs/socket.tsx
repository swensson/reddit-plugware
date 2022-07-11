import React from 'react';

export const usePortal = () => {
  const ref = React.useRef() as any;
  const [wtf, setWtf] = React.useState(null as any);

  React.useEffect(() => {
    setWtf(ref.current);
  }, []);

  return [wtf, ref];;
};

export const useSocket = () => {
  let content = {};

  return [{
    add: (name, c) => content[name] = c,
    content: content,
  }];
};

const standardWrapper = (wtf) => wtf;

export const Socket = ({ wrapper = standardWrapper, socket }) => {
  return wrapper(Object.values(socket.content));
};

export const Extension = ({ name, children, socket }: any) => {
  socket.add(name, children);

  return null;
};
