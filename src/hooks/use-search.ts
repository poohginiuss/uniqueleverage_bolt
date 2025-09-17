"use client";

import { useContext } from "react";
import { SearchContext } from "@/contexts/search-context";

export const useSearch = () => useContext(SearchContext);
