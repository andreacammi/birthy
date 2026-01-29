import React, { useState, useEffect } from "react";
import Birthy from "./birthy/Birthy";
import AnnaSpecializzazione from "./anna/AnnaSpecializzazione";

function getIsAnna() {
  if (typeof window === "undefined") return false;
  return window.location.hash.includes("anna-specializzazione");
}

function App() {
  const [isAnna, setIsAnna] = useState(getIsAnna);

  useEffect(() => {
    // Check immediately in case hash was set before mount
    setIsAnna(getIsAnna());
    
    const onHashChange = () => setIsAnna(getIsAnna());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return isAnna ? <AnnaSpecializzazione /> : <Birthy />;
}

export default App;
