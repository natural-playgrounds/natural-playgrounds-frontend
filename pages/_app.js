import "../styles/globals.css";
import { CartContext, useCartState } from "../hooks/use-cart-slide.js";
import Layout from "../components/layout";
import { CartProvider } from "react-use-cart";
import { Toaster } from "react-hot-toast";
function MyApp({ Component, pageProps }) {
  const cart = useCartState();
  return (
    <>
      <CartProvider>
        <CartContext.Provider value={cart}>
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
