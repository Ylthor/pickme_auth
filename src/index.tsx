import * as React from 'react';
import {Provider} from "./provider";
import AuthForm from "./components/auth/AuthForm";
import UserAttrs from "./components/auth/UserAttrs";

export const App = () => {
  return <Provider>
      <AuthForm/>
      <UserAttrs/>
  </Provider>
};
