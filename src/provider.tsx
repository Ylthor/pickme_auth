import React from "react";
import { Toaster } from 'react-hot-toast'
import {AuthStoreProvider} from "./providers/auth-store-provider";
import {SiteAttributeStoreProvider} from "./providers/site-attribute-store-provider";
import {OtpConfirmStoreProvider} from "./providers/otp-confirm-store-provider";
import {HeroUIProvider} from "@heroui/system";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <AuthStoreProvider>
          <SiteAttributeStoreProvider>
              <OtpConfirmStoreProvider>
                  <Toaster />
                  {children}
              </OtpConfirmStoreProvider>
          </SiteAttributeStoreProvider>
      </AuthStoreProvider>
    </HeroUIProvider>
  );
}
