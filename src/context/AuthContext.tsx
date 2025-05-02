
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/auth";
import { toast } from "sonner";

// Sample users data
const initialUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@clientnexus.com",
    role: "admin"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@clientnexus.com",
    role: "manager"
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.johnson@clientnexus.com",
    role: "manager"
  },
  {
    id: "4",
    name: "Bruce Wayne",
    email: "bruce.wayne@clientnexus.com",
    role: "manager"
  }
];

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // For simplicity, we're not checking passwords in this demo
    // In a real app, you'd want to hash passwords and compare them properly
    
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      setUser(foundUser);
      toast.success(`Welcome back, ${foundUser.name}!`);
      return true;
    }
    
    toast.error("Invalid email or password");
    return false;
  };

  const logout = () => {
    setUser(null);
    toast.success("Logged out successfully");
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    
    if (role === 'admin') {
      return user.role === 'admin';
    }
    
    // managers can access manager features, and admins can access everything
    return user.role === 'admin' || user.role === role;
  };

  const value = {
    user,
    users,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
