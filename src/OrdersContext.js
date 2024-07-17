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
    localStorage.setItem('totalOrderedProducts', totalProducts); // Update local storage initially
  }, []);

  const updateOrderStatus = (index, status) => {
    const updatedOrders = [...ordersList];
    updatedOrders[index] = { ...updatedOrders[index], status: status };
    setOrdersList(updatedOrders);
  };

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(ordersList));
    const totalProducts = ordersList.reduce((total, order) => total + order.quantity, 0);
    setTotalOrderedProducts(totalProducts);
    localStorage.setItem('totalOrderedProducts', totalProducts); // Update local storage on ordersList change
  }, [ordersList]);

  return (
    <OrdersContext.Provider value={{ ordersList, totalOrderedProducts, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersContext;
