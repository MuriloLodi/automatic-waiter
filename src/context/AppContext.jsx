import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { mockUsers, mockProducts, mockOrders } from '../data/mockData';

const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  products: mockProducts,
  orders: mockOrders,
  cart: [],
  currentOrder: null,
  loading: false,
  error: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true, 
        loading: false,
        error: null 
      };
    
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        cart: [],
        currentOrder: null 
      };
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => 
        item.productId === action.payload.productId && 
        item.observations === action.payload.observations
      );
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.productId === action.payload.productId && 
            item.observations === action.payload.observations
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      
      return {
        ...state,
        cart: [...state.cart, action.payload]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((_, index) => index !== action.payload)
      };
    
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map((item, index) =>
          index === action.payload.index ? { ...item, ...action.payload.updates } : item
        )
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'CREATE_ORDER':
      const newOrder = {
        id: String(Date.now()).slice(-6).padStart(6, '0'),
        customerId: state.user.id,
        items: state.cart,
        status: 'pending',
        paymentMethod: action.payload.paymentMethod,
        total: action.payload.total,
        createdAt: new Date().toISOString(),
        estimatedTime: Math.max(...state.cart.map(item => {
          const product = state.products.find(p => p.id === item.productId);
          return product ? product.prepTime : 15;
        })),
        history: [
          { 
            status: 'aguardando', 
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), 
            description: 'Pedido recebido' 
          }
        ]
      };
      
      return {
        ...state,
        orders: [newOrder, ...state.orders],
        currentOrder: newOrder,
        cart: []
      };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { 
                ...order, 
                status: action.payload.status,
                history: [
                  ...order.history,
                  {
                    status: action.payload.status,
                    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    description: action.payload.description
                  }
                ]
              }
            : order
        ),
        currentOrder: state.currentOrder?.id === action.payload.orderId
          ? { 
              ...state.currentOrder, 
              status: action.payload.status,
              history: [
                ...state.currentOrder.history,
                {
                  status: action.payload.status,
                  time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                  description: action.payload.description
                }
              ]
            }
          : state.currentOrder
      };
    
    case 'ADD_PRODUCT':
      const newProduct = {
        ...action.payload,
        id: Math.max(...state.products.map(p => p.id)) + 1,
        available: true
      };
      return {
        ...state,
        products: [...state.products, newProduct]
      };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? { ...product, ...action.payload } : product
        )
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('automaticWaiter_user');
    const savedCart = localStorage.getItem('automaticWaiter_cart');
    const savedOrders = localStorage.getItem('automaticWaiter_orders');
    const savedProducts = localStorage.getItem('automaticWaiter_products');

    if (savedUser) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: JSON.parse(savedUser) });
    }
    
    if (savedCart) {
      dispatch({ type: 'SET_CART', payload: JSON.parse(savedCart) });
    }
    
    if (savedOrders) {
      dispatch({ type: 'SET_ORDERS', payload: JSON.parse(savedOrders) });
    }
    
    if (savedProducts) {
      dispatch({ type: 'SET_PRODUCTS', payload: JSON.parse(savedProducts) });
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('automaticWaiter_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('automaticWaiter_user');
    }
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem('automaticWaiter_cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    localStorage.setItem('automaticWaiter_orders', JSON.stringify(state.orders));
  }, [state.orders]);

  useEffect(() => {
    localStorage.setItem('automaticWaiter_products', JSON.stringify(state.products));
  }, [state.products]);

  // Actions
  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return { success: true };
    } else {
      dispatch({ type: 'SET_ERROR', payload: 'Email ou senha inválidos' });
      return { success: false, error: 'Email ou senha inválidos' };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const addToCart = (product, quantity = 1, observations = '') => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        observations
      }
    });
  };

  const removeFromCart = (index) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: index });
  };

  const updateCartItem = (index, updates) => {
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { index, updates } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const createOrder = (paymentMethod) => {
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    dispatch({ 
      type: 'CREATE_ORDER', 
      payload: { paymentMethod, total } 
    });
  };

  const updateOrderStatus = (orderId, status, description) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId, status, description }
    });
  };

  const addProduct = (productData) => {
    dispatch({ type: 'ADD_PRODUCT', payload: productData });
  };

  const updateProduct = (productData) => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: productData });
  };

  const deleteProduct = (productId) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: productId });
  };

  const value = {
    ...state,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    createOrder,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

