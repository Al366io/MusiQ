import { BrowserRouter, Routes, Route } from "react-router-dom";
import Adder from "./pages/Adder";
import Adding from "./pages/Adding";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Owner from "./pages/Owner";
import NoPage from "./pages/NoPage";

import './fonts/public-pixel-font/PublicPixel-z84yD.ttf'
import Dashboard from "./pages/Dashboard";

function App() {
  return (
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
  );
}

export default App;
