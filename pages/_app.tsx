import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { IState, defaultData, AppContext } from '../context/AppContext';
import { updatedDiff } from 'deep-object-diff';

function MyApp({ Component, pageProps }: AppProps) {
  const [appData, setAppData] = useState<IState>(defaultData);
  const mySetAppData = (toUpdateValues: Partial<IState>): IState => {
    const diffUpdate = updatedDiff(appData, toUpdateValues);
    const toUpdate = { ...appData, ...toUpdateValues } as IState;

    console.debug(`StateUpdate: ${new Date().toISOString()} :`, diffUpdate);
    setAppData(toUpdate);
    return toUpdate;
  };
  return (
    <>
      <AppContext.Provider value={{ ...appData, setAppData: v => mySetAppData(v) }}>
        <Component {...pageProps} />
      </AppContext.Provider>
    </>
  );
}

export default MyApp;
