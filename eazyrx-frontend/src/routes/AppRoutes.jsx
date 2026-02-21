import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WebLogin from "../pages/auth/WebLogin";
import PosLogin from "../pages/auth/PosLogin";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login/web" replace />} />
        <Route path="/login/web" element={<WebLogin />} />
        <Route path="/login/pos" element={<PosLogin />} />
        <Route path="*" element={<div className="p-8">404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
