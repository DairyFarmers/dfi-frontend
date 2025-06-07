import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { queryClient } from "@/lib/queryClient";
import { api } from "@/services/api";

export function UserSearch({ query, onSelectUser }) {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", "search", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      try {
        const { data } = await api.get(`/api/v1/chats/search_users/`, {
          params: { q: query }
        });
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Search error:', error.response?.data || error.message);
        toast.error('Failed to search users');
        return [];
      }
    },
    enabled: query.length >= 2,
    staleTime: 30000,
    retry: 1,
  });

  if (query.length < 2) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Type at least 2 characters to search
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Searching...
      </div>
    );
  }

  if (!users?.length) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No users found
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-1">
      {users?.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelectUser(user)}
          className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-muted"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>
              {user.first_name?.[0] || user.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-medium">
              {user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.email}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground/70">{user.role_name}</p>
          </div>
        </button>
      ))}
    </div>
  );
}