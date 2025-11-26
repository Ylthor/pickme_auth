

/* eslint-disable @typescript-eslint/no-explicit-any */
import {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import BaseService from "./BaseService";

const getFilteredParams = (params: any) => {
    if (!params) return {};

    return Object.keys(params).reduce((acc, key: string) => {
        return {
            ...acc,
            [key]:
                params[key] === null ||
                (typeof params[key] === "object" &&
                    Object.keys(params[key]).length === 0) ||
                params[key].length === 0 ||
                (typeof params[key] === "string" && params[key].trim() === "")
                    ? null
                    : params[key],
        };
    }, {});
};

export const TOKEN_TYPE = "Bearer ";
export const REQUEST_HEADER_AUTH_KEY = "Authorization";

interface ApiServiceOptions {
    ignoreRedirect?: boolean,
    showMessage?: boolean,
    onResolve?: (response: AxiosResponse) => void,
    idempotentKey?: string
}

const ApiService = {
    fetchData<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>,
        options: ApiServiceOptions
    ) {
        return new Promise<AxiosResponse<Response>>((resolve, reject) => {
            const modifiedParam = {
                ...(["put", "PUT", "post", "POST"].includes(param.method as string)
                    ? {
                        ...param,
                        ...(param.params
                            ? { params: getFilteredParams(param.params) }
                            : {}),
                        ...(param.data ? { data: getFilteredParams(param.data) } : {}),
                    }
                    : param),
                ...options
            };

            BaseService(modifiedParam)
                .then((response: AxiosResponse<Response>) => {
                    //@ts-ignore
                    if (response.data && response.data.success == true) {
                        options?.onResolve?.(response);
                        resolve(response);
                    } else if (response.status === 200) {
                        options?.onResolve?.(response);
                        resolve(response);
                    } else {
                        //@ts-ignore
                        throw new Error(response.data.message ?? "Unknown error");
                    }
                })
                .catch((errors: AxiosError) => {
                    reject(errors);
                });
        });
    },
};

export default ApiService;
