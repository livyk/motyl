import { useMediaQuery } from "react-responsive";

export default function useBreakpoint(query: string) {
  return useMediaQuery({ query: query.replace("@media", "").trim() });
}
