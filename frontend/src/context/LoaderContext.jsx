import React, { createContext, useState, useContext } from "react";
import TravelLoader from "../components/Loading";

const LoaderContext = createContext();

export function LoaderProvider({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ setLoading }}>
      {loading && <TravelLoader />}
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
}
