import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useUserResources = () => {
  return useQuery({
    queryKey: ["userResources"],
    queryFn: async () => {
      const { data } = await api.get("/api/resources/getUserResources");
      return data.resources;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!localStorage.getItem("accessToken"),
  });
};
