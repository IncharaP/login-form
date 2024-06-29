// ItemContext.js
import React, { createContext, useContext, useState } from 'react';

const ItemContext = createContext(); // Create a new context instance

export const useItemContext = () => useContext(ItemContext); // Custom hook to access the ItemContext

// Provider component to wrap around components that need access to items state
export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]); // State to hold the list of items

   // Function to add a new item to the items array
  const addItem = (newItem) => {
    setItems([...items, newItem]);
  };

  // Wrap children components with ItemContext.Provider
  return (
    <ItemContext.Provider value={{ items, addItem }}>
      {children}
    </ItemContext.Provider>
  );
};
