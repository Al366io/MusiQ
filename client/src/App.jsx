import { BrowserRouter, Routes, Route } from "react-router-dom";
import Adder from "./pages/Adder";
import Adding from "./pages/Adding";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Owner from "./pages/Owner";
import NoPage from "./pages/NoPage";
import { createContext, useState } from "react";

import './fonts/public-pixel-font/PublicPixel-z84yD.ttf'
import Dashboard from "./pages/Dashboard";
export const BGContext = createContext();

function App() {
  const [BGcolor, setBGColor] = useState('#000')
  return (
    <BGContext.Provider value={{BGcolor, setBGColor}}>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adder/:id" element={<Adder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/owner" element={<Owner />} />
          <Route path="/adding/:id" element={<Adding />} />
          <Route path="/dashboard/:id" element={<Dashboard />} />
          <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
    </BGContext.Provider>
  );
}

export default App;
