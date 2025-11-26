import { lazy } from 'react'

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "PICK ME Pay",
  description: "PICK ME Pay",
  navItems: [
    {
      key: 'login',
      path: '/login',
      isMain: true,
      component: lazy(() => import('../pages/Login/page.tsx')),
      authority: [],
    },
    {
      key: 'authSuccess',
      path: '/',
      isMain: true,
      component: lazy(() => import('../pages/Success/page.tsx')),
      authority: [],
    },
  ],
  navMenuItems: [],
  links: {},
};
