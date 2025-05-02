
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/auth";
import { toast } from "sonner";

// Sample users data
const initialUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@clientnexus.com",
    username: "admin",
    password: "admin123",
    role: "admin"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@clientnexus.com",
    username: "janesmith",
    password: "password123",
    role: "manager"
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.johnson@clientnexus.com",
    username: "michaelj",
    password: "password123",
    role: "manager"
  },
  {
    id: "4",
    name: "Bruce Wayne",
    email: "bruce.wayne@clientnexus.com",
    username: "brucewayne",
    password: "password123",
    role: "manager"
  }
];

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem("users");
    // If no users in localStorage or they're incomplete (missing password), use initialUsers
    if (!savedUsers) {
      localStorage.setItem("users", JSON.stringify(initialUsers));
      return initialUsers;
    }
    
    try {
      const parsedUsers = JSON.parse(savedUsers);
      // Check if users have password field - if not, use initialUsers
      if (parsedUsers.length > 0 && !parsedUsers[0].password) {
        localStorage.setItem("users", JSON.stringify(initialUsers));
        return initialUsers;
      }
      return parsedUsers;
    } catch (e) {
      localStorage.setItem("users", JSON.stringify(initialUsers));
      return initialUsers;
    }
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

  const login = async (username: string, password: string): Promise<boolean> => {
    // Add null checks to handle undefined values
    if (!username || !password) {
      toast.error("Username and password are required");
      return false;
    }
    
    // Logging for debugging
    console.log("Login attempt:", { username, password });
    console.log("Available users:", users);
    
    // Find user with case-insensitive username match and exact password match
    const foundUser = users.find(u => 
      u.username && 
      u.username.toLowerCase() === username.toLowerCase() && 
      u.password === password
    );
    
    console.log("Found user:", foundUser);
    
    if (foundUser) {
      setUser(foundUser);
      toast.success(`Welcome back, ${foundUser.name}!`);
      return true;
    }
    
    toast.error("Invalid username or password");
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
