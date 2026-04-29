import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

// Dummy hook to satisfy requirements - actual validation is client-side
export function useScansHistory() {
  return useQuery({
    queryKey: [api.scans.list.path],
    queryFn: async () => {
      // In a real app, this would fetch scan history from the backend
      return [];
    },
  });
}
