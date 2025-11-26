import React from 'react';
import {Provider} from "./Provider";
import AuthFormInners from "./components/auth/AuthFormInners";

export function AuthForm() {
    return (
        <Provider>
            <AuthFormInners/>
        </Provider>
    );
}