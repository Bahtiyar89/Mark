import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import "./hooks/i18n";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { MantineProvider } from "@mantine/core";

import AuthState from "./context/auth/AuthState";
import TransactionState from "./context/transaction/TransactionState";
import ProductState from "./context/products/ProductState";
import LanguageState from "context/language/LanguageState";
import ChatState from "context/chats/ChatState";
import "react-spring-bottom-sheet/dist/style.css";
import H4State from "context/h4/H4State";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <ToastProvider autoDismiss={true} autoDismissTimeout={3000}>
      <MantineProvider
        theme={{
          breakpoints: {
            xs: 375,
            sm: 578,
            md: 851,
            lg: 1200,
            xl: 1400,
          },
        }}
      >
        <AuthState>
          <ProductState>
            <TransactionState>
              <LanguageState>
                <ChatState>
                  <H4State>
                    <App />
                  </H4State>
                </ChatState>
              </LanguageState>
            </TransactionState>
          </ProductState>
        </AuthState>
      </MantineProvider>
    </ToastProvider>
  </BrowserRouter>
);

reportWebVitals();
