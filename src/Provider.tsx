import React from "react";
import { Toaster } from 'react-hot-toast'
import {AuthStoreProvider} from "./auth-store-provider";
import {SiteAttributeStoreProvider} from "./site-attribute-store-provider";
import {OtpConfirmStoreProvider} from "./otp-confirm-store-provider";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
      <AuthStoreProvider>
          <SiteAttributeStoreProvider>
              <OtpConfirmStoreProvider>
                  <Toaster />
                  {children}
              </OtpConfirmStoreProvider>
          </SiteAttributeStoreProvider>
      </AuthStoreProvider>
  );
}
