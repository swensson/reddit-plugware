import React from 'react';

import { EventEmitter } from '/libs/events';
import { useBetween } from 'use-between';

const ees = new Map<string, EventEmitter<any>>();

const ee = (name: string) => {
  if (!ees.has(name)) {
    ees.set(name, new EventEmitter());
  }

  return ees.get(name) as any;
};

const useForceUpdate = () => {
  const [bool, setBool] = React.useState(0);
  return [React.useCallback(() => setBool((b) => (b + 1) % 20), [setBool]), bool] as const;
};

export const _useEventEmitter = () => {
  const [forceUpdate, ticker] = useForceUpdate();

  return React.useMemo(() => ({
    on: <T,>(name: string, listener: (data: T) => any) => { ee(name).on(listener); forceUpdate(); return () => { ee(name).off(listener); forceUpdate(); }; },

    emitsa: <T,>(name: string, data: T) => ee(name).emitsa(data),
    emitss: <T,>(name: string, data: T) => ee(name).emitss(data),
    emitpa: <T,>(name: string, data: T) => ee(name).emitpa(data),
    emitps: <T,>(name: string, data: T) => ee(name).emitps(data),
  }), [forceUpdate, ticker]);
};

export const useEventEmitter = () => useBetween(_useEventEmitter);
