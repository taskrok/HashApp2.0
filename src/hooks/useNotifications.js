import { useState } from 'react';

export const useNotifications = () => {  const [notifications, setNotifications] = useState([]);
  
  const addNotification = (type, message, action = null) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message, action, timestamp: new Date() }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };
  
  return { notifications, addNotification };
};