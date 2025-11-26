import React, { useEffect, useMemo, useRef, useState } from "react";
import { useField, useFormikContext } from "formik";

import Loading from "../ui/Loading";
import {defaultInputClassName} from "./DefaultInput";
import {Input} from "@heroui/input";

interface InputCodeProps {
    onChange?: (code: string) => void;
    required?: boolean;
    isLoading?: boolean
    signs?: number
    name: string;
}

function InputCode({ required, isLoading = false, onChange, name, signs = 4 }: InputCodeProps) {
    const [vals, setVals] = useState<string[]>(Array(signs).fill(""));
    //@ts-ignore
    const [field, meta, helpers] = useField({ name: name });
    const { errors } = useFormikContext();
    //@ts-ignore
    const firstRef = useRef<HTMLInputElement>(null);
    const error = useMemo(() => {
        //@ts-ignore
        if (errors[name]) return errors[name];

        return null;
    }, [errors, name]);

    const onBtnClick = (e:any) => {
        if (isLoading)
            return;

        const valueReverseIndex = [...vals].reverse().findIndex((v) => v !== "");
        const valueIndex = valueReverseIndex > 0 ? vals.length - 1 - valueReverseIndex : 0;
        if (e.key === "Backspace" && valueIndex > 0) {
            const ind = valueIndex - 1;
            setVals(vals.map((v,i) => {
                if (i === valueIndex) {
                    return ""
                }

                return v
            }));
            const indToFocus = ind <= 0 ? 0 : ind;
            const element = document.getElementById(`${name}_${indToFocus}`);

            setTimeout(() => {
                if (element) {
                    element.focus();
                }
            },5)
        }
    }

    useEffect(() => {
        setVals(Array(signs).fill(""))
    }, [signs])

    useEffect(() => {
        document.removeEventListener('keydown',onBtnClick);
        if (!isLoading)
            document.addEventListener('keydown',onBtnClick);

        return () => {
            document.removeEventListener('keydown', onBtnClick);
        }
    }, [vals,isLoading])

    useEffect(() => {
        if (firstRef.current) {
            firstRef.current.focus();
        }
    }, []);


    const inputCodeCallback = (value: string, index: number) => {
        let v = value.replace(/\D/g, "");
        let ii = index;

        if (v.length >= signs) {
            v = v.substring(v.length - signs, v.length);
            setVals(v.split(""));
            ii = v.length - 1;
        } else {
            v = v.length > 0 ? v[v.length - 1] : "";
            setVals((prev) => prev.map((vv, i) => (i === index ? v : vv)));
            if (v === "") {
                if (ii < 1) {
                    return;
                }
                const element = document.getElementById(`${name}_${ii - 1}`);

                if (element) {
                    element.focus();
                }

                return;
            }
        }
        const element = document.getElementById(`${name}_${ii + 1}`);

        if (element) {
            element.focus();
        }
    };

    useEffect(() => {
        const qty = vals.reduce((acc, v) => {
            if (v !== "") return acc + 1;

            return acc;
        }, 0);

        if (qty === signs) {
            const v = vals.join("");

            helpers.setValue(v);
            onChange?.(v);
        }
    }, [vals]);
    return (
        <>
            <Input
                isClearable
                name={name}
                required={required}
                type={"hidden"}
                value={vals.join("")}
            />
            <div className={"flex flex-col relative"}>
                <Loading loading={isLoading ?? false} className={'absolute inset-0 z-[1] flex items-center justify-center backdrop-blur-sm'} spinnerSize={'xs'}></Loading>
                <div className={`grid gap-3 w-full`} style={{gridTemplateColumns: `repeat(${signs}, minmax(0, 1fr))`}}>
                    {Array(signs)
                        .fill(0)
                        //@ts-ignore
                        .map((v:any, i) => {
                            const rf = i === 0 ? { ref: firstRef } : {};

                            return (
                                <Input
                                    {...rf}
                                    isDisabled={isLoading}
                                    key={`${name}_${i}`}
                                    classNames={{
                                        ...defaultInputClassName,
                                        input: "text-sm !placeholder-gray-third p-0 text-center",
                                    }}
                                    id={`${name}_${i}`}
                                    inputMode={"decimal"}
                                    isClearable={false}
                                    isInvalid={error !== null && i >= vals.join("").length}
                                    labelPlacement="outside"
                                    type={"number"}
                                    value={vals[i]}
                                    onChange={(e:any) => {
                                        if (isLoading) {
                                            e.preventDefault();
                                            return;
                                        }
                                        inputCodeCallback(e.target.value, i);
                                    }}
                                />
                            );
                        })}
                </div>
                {error !== null ? (
                    <div className={"mt-2 text-xs text-danger"}>{error}</div>
                ) : null}
            </div>
        </>
    );
}

export default InputCode;
