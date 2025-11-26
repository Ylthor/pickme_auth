import React from 'react';
import {Provider} from "./Provider";
import UserAttrInners from "./components/auth/UserAttrInners";

export function UserAttrs() {
    return (
        <Provider>
            <UserAttrInners/>
        </Provider>
    )
}