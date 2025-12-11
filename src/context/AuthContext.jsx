import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNotification } from './NotificationContext';

// User and authentication state interfaces
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT: 'LOGOUT',
  RESTORE_SESSION: 'RESTORE_SESSION',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING'
};

// Auth reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading
      };
    
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const notification = useNotification();

  // Restore session on app load
  useEffect(() => {
    const restoreSession = () => {
      try {
        const userData = localStorage.getItem('melearn_user');
        const sessionData = localStorage.getItem('melearn_session');
        
        if (userData && sessionData) {
          const user = JSON.parse(userData);
          const session = JSON.parse(sessionData);
          
          // Check if session is still valid (24 hours)
          const sessionAge = Date.now() - session.timestamp;
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (sessionAge < maxAge) {
            dispatch({
              type: AUTH_ACTIONS.RESTORE_SESSION,
              payload: { user }
            });
            return;
          } else {
            // Session expired, clear storage
            localStorage.removeItem('melearn_user');
            localStorage.removeItem('melearn_session');
          }
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        localStorage.removeItem('melearn_user');
        localStorage.removeItem('melearn_session');
      }
      
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: { isLoading: false } });
    };

    restoreSession();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      // Simulate API call - in real app, this would be an actual API request
      const users = JSON.parse(localStorage.getItem('melearn_users') || '[]');
      const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Update last login
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem('melearn_users', JSON.stringify(updatedUsers));
      
      // Store session data
      const sessionData = {
        timestamp: Date.now(),
        userId: user.id
      };
      
      localStorage.setItem('melearn_user', JSON.stringify(updatedUser));
      localStorage.setItem('melearn_session', JSON.stringify(sessionData));
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: updatedUser }
      });
      
      if (notification) {
        notification.showSuccess(
          'Welcome back!',
          `Successfully logged in as ${updatedUser.fullName}`
        );
      }
      
      return { success: true, user: updatedUser };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: error.message }
      });
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });
    
    try {
      const users = JSON.parse(localStorage.getItem('melearn_users') || '[]');
      
      // Check if email already exists
      if (users.find(u => u.email === userData.email)) {
        throw new Error('Email already registered');
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      // Save user
      users.push(newUser);
      localStorage.setItem('melearn_users', JSON.stringify(users));
      
      // Store session data
      const sessionData = {
        timestamp: Date.now(),
        userId: newUser.id
      };
      
      localStorage.setItem('melearn_user', JSON.stringify(newUser));
      localStorage.setItem('melearn_session', JSON.stringify(sessionData));
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: { user: newUser }
      });
      
      if (notification) {
        notification.showSuccess(
          'Account created!',
          `Welcome to MeLearn, ${newUser.fullName}! Your account has been successfully created.`
        );
      }
      
      return { success: true, user: newUser };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: { error: error.message }
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('melearn_user');
    localStorage.removeItem('melearn_session');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    
    if (notification) {
      notification.showInfo(
        'Logged out',
        'You have been successfully logged out. See you next time!'
      );
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;