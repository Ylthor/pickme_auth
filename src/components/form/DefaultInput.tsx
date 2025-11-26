import React, {JSX, useEffect, useMemo, useState} from "react";
import { useField, useFormikContext } from "formik";
import {Input, InputProps} from "@heroui/input";

export interface SearchInputProps extends Omit<InputProps, "onChange"> {
    onChange?: (val: string) => void;
    name: string;
    title?: string;
    required?: boolean;
    placeholder?: string;
    prefix?: JSX.Element;
    suffix?: JSX.Element;
    tooltip?: string;
    accepts?: 'number' | 'string'
}

export const defaultInputClassName = {
    inputWrapper:
        "rounded-[10px] px-5 py-[15px] text-l h-auto min-h-0 border-none bg-gray-main w-full " +
        "hover:shadow-none hover:!bg-gray-main focus-within:!bg-gray-main dark:!hover:bg-gray-main focus:bg-gray-main group-data-[focus=true]:bg-gray-main " +
        "dark:group-data-[focus=true]:bg-gray-main flex h-full items-center",
    innerWrapper: '!text-black-reversed',
    input: "text-large !text-black-reversed !placeholder-gray-secondary !pl-0",
};

function DefaultInput(props: SearchInputProps) {
    const {
        value: passedValue,
        placeholder,
        required,
        title,
        name,
        isClearable = true,
        prefix = null,
        tooltip,
        type,
        suffix = null,
        accepts,
        onChange,
    } = props;

    const [value, setValue] = useState<string | null>(passedValue as string);
    //@ts-ignore
    const [field, meta, helpers] = useField({ name: name });
    const { errors } = useFormikContext();

    useEffect(() => {
        setValue(passedValue as string);
    }, [passedValue]);

    const setInputValues = (val: string) => {
        let v = val.slice(0, 99);
        if (accepts === 'number') {
            v = v.replace(/\D/g, '');
        }
        onChange?.(v);

        helpers.setValue(v);
    };

    const error = useMemo(() => {
        //@ts-ignore
        if (errors[name]) return errors[name];

        return null;
    }, [errors, name]);

    const startContent = prefix ? <div className={'mr-3'}>{prefix}</div> : null
    const endContent = suffix ? <div className={'ml-3'}>{suffix}</div> : null
    return (
        <div className={"w-full flex flex-col gap-2"}>
            {title ? (
                <span className={"text-sm ml-5"}>
          {title}
                    {required ? " *" : ""}
        </span>
            ) : null}
            <Input
                classNames={defaultInputClassName}
                errorMessage={error as string}
                isClearable={isClearable}
                isInvalid={error !== null}
                startContent={startContent}
                endContent={endContent}
                labelPlacement="outside"
                name={name}
                type={type}
                placeholder={placeholder}
                value={value as string}
                onChange={(e:any) => {
                    setInputValues(e.target.value);
                }}
            />
            {
                tooltip ?
                    <div className={'text-xs ml-4'}>{tooltip}</div> : null
            }
        </div>
    );
}

export default DefaultInput;
