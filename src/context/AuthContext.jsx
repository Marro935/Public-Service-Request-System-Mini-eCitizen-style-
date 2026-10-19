import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/seedData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ecitizen_current_user_v1');
      return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default Citizen Jane Doe
    } catch (e) {
      return INITIAL_USERS[0];
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ecitizen_current_user_v1', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ecitizen_current_user_v1');
    }
  }, [currentUser]);

  const login = async (email, password) => {
    // Check against demo users or stored users
    const allUsers = INITIAL_USERS;
    const match = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (match) {
      if (password === 'password123' || password === match.password) {
        setCurrentUser(match);
        return { success: true, user: match };
      }
    }
    // Also allow custom citizen login
    if (email && password) {
      const citizenUser = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email.trim(),
        role: 'citizen',
        phone: '+254 700 000 000'
      };
      setCurrentUser(citizenUser);
      return { success: true, user: citizenUser };
    }
    return { success: false, message: 'Invalid credentials. Use demo accounts or password123' };
  };

  const register = async ({ name, email, password, phone, national_id }) => {
    const newUser = {
      id: Date.now(),
      name,
      email: email.trim().toLowerCase(),
      phone: phone || '',
      national_id: national_id || '',
      role: 'citizen',
      avatar: null
    };
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Instant 1-click Demo Role Switcher for Evaluators
  const switchRole = (role) => {
    if (role === 'citizen') {
      setCurrentUser(INITIAL_USERS[0]); // Jane Wanjiku Doe
    } else if (role === 'officer') {
      setCurrentUser(INITIAL_USERS[1]); // Officer Peter Kamau
    } else if (role === 'admin') {
      setCurrentUser(INITIAL_USERS[2]); // Eng. Alice Muthoni
    }
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    role: currentUser?.role || 'guest',
    login,
    register,
    logout,
    switchRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
