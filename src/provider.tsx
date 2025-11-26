import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import { AuthStoreProvider } from '@/providers/auth-store-provider.tsx'
import { SiteAttributeStoreProvider } from '@/providers/site-attribute-store-provider.tsx'
import { Toaster } from 'react-hot-toast'
import { OtpConfirmStoreProvider } from '@/providers/otp-confirm-store-provider'

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
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
