import React, { createContext, useContext, useState } from 'react';

// Create a new context instance
const ItemContext = createContext();

// Custom hook to access the ItemContext
export const useItemContext = () => useContext(ItemContext);

// Provider component to wrap around components that need access to items state
export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]); // State to hold the list of items

  // Function to add a new item to the items array
  const addItem = (newItem) => { 
    setItems([...items, newItem]);
  };

  // Example function to remove an item (if needed)
  const removeItem = (itemId) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
  };
 
  // Wrap children components with ItemContext.Provider
  return (
    <ItemContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </ItemContext.Provider>
  );
};
