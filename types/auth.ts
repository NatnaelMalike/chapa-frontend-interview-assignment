interface AuthStore  {
    user: User | null;
    loading: boolean;
    isAppLoading: boolean;
    error: string | null;
  
    // Actions
    setUser: (user: User | null) => void;
    login: (
      email: string,
      password: string,
      rememberMe: boolean
    ) => Promise<User | null>;
    logout: () => Promise<void>;
    fetchMe: () => Promise<User | null>;
  };