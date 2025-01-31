import { useQuery } from '@tanstack/react-query';

const mockUser = {
  id: 1,
  username: "demo_user",
  email: "demo@example.com",
  fullName: "Demo User"
};

export function useUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => mockUser,
    staleTime: Infinity
  });

  return {
    user,
    isLoading,
    error: null,
    login: async () => ({ ok: true }),
    logout: async () => ({ ok: true }),
    register: async () => ({ ok: true })
  };
}