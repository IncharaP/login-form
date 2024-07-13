import React, { createContext, useState, useEffect } from 'react';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [ordersList, setOrdersList] = useState([]);
  const [totalOrderedProducts, setTotalOrderedProducts] = useState(0);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrdersList(storedOrders);

    const totalProducts = storedOrders.reduce((total, order) => total + order.quantity, 0);
    setTotalOrderedProducts(totalProducts);
  }, []);

  useEffect(() => {
    const totalProducts = ordersList.reduce((total, order) => total + order.quantity, 0);
    setTotalOrderedProducts(totalProducts);
    localStorage.setItem('orders', JSON.stringify(ordersList));
    localStorage.setItem('totalOrderedProducts', totalProducts.toString());
  }, [ordersList]); // Dependency array

  const addNewOrder = (newOrder) => {
    setOrdersList((prevOrders) => [...prevOrders, newOrder]);
  };

  return (
    <OrdersContext.Provider value={{ ordersList, totalOrderedProducts, addNewOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersContext;
