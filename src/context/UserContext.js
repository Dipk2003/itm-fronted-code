import React, { createContext, useContext, useReducer, useEffect } from 'react';
import API_CONFIG from '../config/api';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  userRole: null,
  loading: true,
  error: null,
  vendorProfile: null,
  taxProfile: null,
  vendorRanking: null
};

// Action types
export const USER_ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_VENDOR_PROFILE: 'SET_VENDOR_PROFILE',
  SET_TAX_PROFILE: 'SET_TAX_PROFILE',
  SET_VENDOR_RANKING: 'SET_VENDOR_RANKING'
};

// Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case USER_ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        userRole: action.payload.user.role,
        loading: false,
        error: null
      };
    
    case USER_ACTION_TYPES.LOGOUT:
      localStorage.removeItem('vendorToken');
      return {
        ...initialState,
        loading: false
      };
    
    case USER_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case USER_ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };
    
    case USER_ACTION_TYPES.SET_VENDOR_PROFILE:
      return { ...state, vendorProfile: action.payload };
    
    case USER_ACTION_TYPES.SET_TAX_PROFILE:
      return { ...state, taxProfile: action.payload };
    
    case USER_ACTION_TYPES.SET_VENDOR_RANKING:
      return { ...state, vendorRanking: action.payload };
    
    default:
      return state;
  }
};

// Create context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Check authentication on app load
  useEffect(() => {
    const initAuth = () => {
      dispatch({ type: USER_ACTION_TYPES.SET_LOADING, payload: true });
      
      if (API_CONFIG.isAuthenticated()) {
        const userData = API_CONFIG.getUserData();
        if (userData) {
          dispatch({
            type: USER_ACTION_TYPES.LOGIN_SUCCESS,
            payload: {
              user: {
                email: userData.email,
                role: userData.role
              }
            }
          });
        } else {
          dispatch({ type: USER_ACTION_TYPES.LOGOUT });
        }
      } else {
        dispatch({ type: USER_ACTION_TYPES.SET_LOADING, payload: false });
      }
    };

    initAuth();
  }, []);

  // Actions
  const actions = {
    login: (userData) => {
      dispatch({
        type: USER_ACTION_TYPES.LOGIN_SUCCESS,
        payload: { user: userData }
      });
    },
    
    logout: () => {
      dispatch({ type: USER_ACTION_TYPES.LOGOUT });
    },
    
    setError: (error) => {
      dispatch({
        type: USER_ACTION_TYPES.SET_ERROR,
        payload: error
      });
    },
    
    clearError: () => {
      dispatch({ type: USER_ACTION_TYPES.CLEAR_ERROR });
    },
    
    setVendorProfile: (profile) => {
      dispatch({
        type: USER_ACTION_TYPES.SET_VENDOR_PROFILE,
        payload: profile
      });
    },
    
    setTaxProfile: (profile) => {
      dispatch({
        type: USER_ACTION_TYPES.SET_TAX_PROFILE,
        payload: profile
      });
    },
    
    setVendorRanking: (ranking) => {
      dispatch({
        type: USER_ACTION_TYPES.SET_VENDOR_RANKING,
        payload: ranking
      });
    }
  };

  return (
    <UserContext.Provider value={{ ...state, ...actions }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export default UserContext;
