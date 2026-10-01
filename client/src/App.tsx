import { Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopifySetupNotice from "@/components/ShopifySetupNotice";
import HomePage from "@/pages/HomePage";
import ProductPage from "@/pages/ProductPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory text-espresso">
      <ShopifySetupNotice />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
