
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, UserRole } from "@/types/auth";

// Add the updateAccountManagers method to the context interface
export interface AuthContextType {
  user: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  updateAccountManagers: (managers: User[]) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  users: [],
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  hasRole: () => false,
  updateAccountManagers: () => {},
});

// Sample users data
const INITIAL_USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    username: "admin",
    password: "admin123",
    role: "admin",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    username: "janesmith",
    password: "password123",
    role: "manager",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael@example.com",
    username: "michaelj",
    password: "pass123",
    role: "manager",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    username: "sarahw",
    password: "sarah123",
    role: "manager",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@example.com",
    username: "davidb",
    password: "david123",
    role: "manager",
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log("Attempting login with:", { username, password });
    try {
      // Find user by username and password
      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );
      
      if (foundUser) {
        console.log("User found:", foundUser);
        setUser(foundUser);
        setIsAuthenticated(true);
        
        // Store user in localStorage to persist the session
        localStorage.setItem("user", JSON.stringify(foundUser));
        return true;
      }
      
      console.log("Invalid credentials");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role || user?.role === "admin";
  };

  const updateAccountManagers = (managers: User[]) => {
    setUsers(prev => {
      // Filter out all existing managers and admins
      const nonManagers = prev.filter(user => 
        user.role !== "manager" && user.role !== "admin"
      );
      
      // Combine non-managers with the new managers
      return [...nonManagers, ...managers];
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        login,
        logout,
        isAuthenticated,
        hasRole,
        updateAccountManagers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
