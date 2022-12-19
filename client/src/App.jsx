import { BrowserRouter, Routes, Route } from "react-router-dom";
import Adder from "./pages/Adder";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Owner from "./pages/Owner";
import NoPage from "./pages/NoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adder/:id" element={<Adder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/owner" element={<Owner />} />
          <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
