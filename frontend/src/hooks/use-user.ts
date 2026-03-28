import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get("/api/auth/me");
      return data.user;
    },

    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    enabled: !!localStorage.getItem("accessToken"),
  });
};
