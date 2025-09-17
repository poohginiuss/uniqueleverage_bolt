"use client";

import React, { createContext } from "react";

// Create a context for search functionality
export const SearchContext = createContext<{
    searchValue: string;
    setSearchValue: (value: string) => void;
}>({
    searchValue: "",
    setSearchValue: () => {},
});
