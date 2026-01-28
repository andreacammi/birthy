import React from "react";
import Birthy from "./birthy/Birthy";
import AnnaSpecializzazione from "./anna/AnnaSpecializzazione";

function App() {
  // lightweight routing without adding deps (works on GitHub Pages)
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  const isAnna = hash.includes("anna-specializzazione");

  return isAnna ? <AnnaSpecializzazione /> : <Birthy />;
}

export default App;
