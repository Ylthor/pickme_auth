import React, { useEffect, useState } from 'react'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown"
import {useSiteAttributeStore} from "../../providers/site-attribute-store-provider";
export const AllowedLanguages = ['en','ru','th','id']
import {menuItemClassName} from "./ThemeSelector";
import {Languages} from "../../assets/languages";
import {Avatar} from "@heroui/avatar";

function LanguageSelector() {
    const [selectedKeys, setSelectedKeys] = useState(new Set(["en"]));
    const {lang, setLang} = useSiteAttributeStore((state) => state);
    const items = Languages.filter((lng) => AllowedLanguages.includes(lng.iso))
    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
        [selectedKeys],
    );

    useEffect(() => {
        setSelectedKeys(new Set([lang]));
    }, [lang])

    const onSelectionChange = (v:any) => {
        const key = v.currentKey;
        setSelectedKeys(v);
        setLang(key);
    }

    return (
        <div className={'flex w-full items-center'}>
            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    <div className={menuItemClassName}>
                        <div>Language:</div>
                        <Avatar
                            isBordered={true}
                            as="button"
                            className="transition-transform h-5 w-5 lg:w-6 lg:h-6"
                            src={items.find((item) => item.iso === selectedValue)?.flag}
                        />
                    </div>
                </DropdownTrigger>
                <DropdownMenu disallowEmptySelection
                              aria-label="Single selection example"
                              selectedKeys={selectedKeys}
                              selectionMode="single"
                              variant="flat"
                              onSelectionChange={onSelectionChange}>
                    {
                        items.map((item) => {
                            return <DropdownItem key={item.iso} textValue={item.name}>
                                <div className="flex gap-2 items-center">
                                    <Avatar alt={item.name} className="flex-shrink-0" size="sm" src={item.flag} />
                                    <div className="flex flex-col">
                                        <span className="text-small">{item.name}</span>
                                    </div>
                                </div>
                            </DropdownItem>
                        })
                    }
                </DropdownMenu>
            </Dropdown>
            {/*<Select onChange={onChange}  items={items} className={'flex-shrink-0 max-w-xs'}*/}
            {/*        classNames={{popoverContent: 'w-[160px]', trigger: 'px-1.5 lg:px-4'}}*/}
            {/*        renderValue={(items) => {*/}
            {/*            return (*/}
            {/*                <div className="flex flex-wrap gap-2">*/}
            {/*                    {items.map((item) => {*/}
            {/*                        return <Avatar key={item.key} alt={item.data.name} className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" src={item.data.flag} />*/}
            {/*                    })}*/}
            {/*                </div>*/}
            {/*            );*/}
            {/*        }}*/}
            {/*>*/}
            {/*    {*/}
            {/*        (item) => <SelectItem key={item.iso} textValue={item.name}>*/}
            {/*            <div className="flex gap-2 items-center">*/}
            {/*                <Avatar alt={item.name} className="flex-shrink-0" size="sm" src={item.flag} />*/}
            {/*                <div className="flex flex-col">*/}
            {/*                    <span className="text-small">{item.name}</span>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </SelectItem>*/}
            {/*    }*/}
            {/*</Select>*/}
        </div>
    )
}

export default LanguageSelector