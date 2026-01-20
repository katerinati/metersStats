import { createContext } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { storeMeter } from './rootStore.ts';
import MetersTable from './MetersTable.tsx';
export const StoreContext = createContext(storeMeter);

createRoot(document.getElementById('root')!).render(
  <StoreContext.Provider value={storeMeter}>
    <MetersTable />
  </StoreContext.Provider>
);
