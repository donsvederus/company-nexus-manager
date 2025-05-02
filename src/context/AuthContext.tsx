
// Add the updateAccountManagers method to the context interface
export interface AuthContextType {
  user: User | null;
  users: User[];
  login: (username: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  updateAccountManagers?: (managers: User[]) => void;
}
