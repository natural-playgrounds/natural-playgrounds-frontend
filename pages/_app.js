import "../styles/globals.css";
import { useEffect } from "react";
import { CartContext, useCartSlide, useCartState } from "../hooks/use-cart-slide.js";
import Layout from "../components/layout";
import { CartProvider, useCart } from "react-use-cart";
import { Toaster } from "react-hot-toast";

function CartLogoutSync() {
  const { emptyCart } = useCart();
  const { updateCartSlide } = useCartSlide();

  useEffect(() => {
    const clearCart = () => {
      emptyCart();
      updateCartSlide(false);
    };

    const handleStorage = (event) => {
      if (event.key === "logout") {
        clearCart();
      }
    };

    window.addEventListener("logout", clearCart);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("logout", clearCart);
      window.removeEventListener("storage", handleStorage);
    };
  }, [emptyCart, updateCartSlide]);

  return null;
}

function MyApp({ Component, pageProps }) {
  const cart = useCartState();
  return (
    <>
      <CartProvider>
        <CartContext.Provider value={cart}>
          <CartLogoutSync />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </CartContext.Provider>
      </CartProvider>
      <Toaster position="top-right" />
    </>
  );
}

export default MyApp;
