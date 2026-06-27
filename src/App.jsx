import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { Analytics } from "@vercel/analytics/next";
import Home from "./components/Home.jsx";
import AuthPage from "./Pages/AuthPage.jsx";
import LegalPage from "./Pages/LegalPage.jsx";
import ProductsPage from "./Pages/ProductsPage.jsx";
import Notification from "./components/Notification.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import ProductDetails from "./Pages/ProductDetails.jsx";
import CartPage from "./Pages/CartPage.jsx";
import AboutPage from "./Pages/AboutPage.jsx";
import ContactPage from "./Pages/ContactPage.jsx";
import OrderPage from "./Pages/OrderPage.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import CheckoutPage from "./Pages/CheckoutPage.jsx";

const App = () => {
  return (
    <div className="">
      {/* 🔀 Routes */}
      <BrowserRouter>
        <CartProvider>
          <div className="content">
            <Routes>
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/termscondition" element={<LegalPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route
                path="/cart"
                element={<CartProvider>{<CartPage />}</CartProvider>}
              />
              <Route path="/orders" element={<OrderPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
          </div>
        </CartProvider>
      </BrowserRouter>
      <Analytics />
    </div>
  );
};

export default App;
