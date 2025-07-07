import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 
import './styles/main.scss';
import App from './App.jsx'
import { AuthController } from './context/authContext.jsx';
import { ProductCategoryProvider } from './context/productCategoryContext'
import { ModifierProvider } from './context/modifierContext.jsx';
import { ProductProvider } from './context/productContext.jsx';
import { CartProvider } from './context/cartContext.jsx';
import StripeProvider from './context/stripeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthController>
        <ProductCategoryProvider>
          <ModifierProvider>
            <ProductProvider>
              <CartProvider>
                <StripeProvider>
                  <App />
                </StripeProvider>
              </CartProvider>
            </ProductProvider>
          </ModifierProvider>
        </ProductCategoryProvider>
      </AuthController>
    </BrowserRouter>
  </StrictMode>
)
