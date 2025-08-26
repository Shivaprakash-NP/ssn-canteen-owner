import { createContext } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // The owner app doesn't need complex state like the student app,
  // but the provider is still required for the components that use the context.
  const value = {
    // You can add any shared state for the owner app here if needed later.
    setSelectedCanteen: () => {}, // Provide dummy functions to prevent errors
    setCart: () => {},
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};