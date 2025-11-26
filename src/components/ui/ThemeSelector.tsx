import React, { useEffect, useState } from 'react'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown"
import {useSiteAttributeStore} from "../../providers/site-attribute-store-provider";

export const setTheme = (selectedTheme:string | null | undefined) => {
    localStorage.setItem('theme',selectedTheme ?? 'system');
    if (selectedTheme) {
        if (selectedTheme === 'system') {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.remove('light')
                document.body.classList.add('dark')
            } else {
                document.body.classList.remove('dark');
                document.body.classList.add('light')
            }
        } else {
            document.body.classList.remove('light')
            document.body.classList.remove('dark');
            document.body.classList.add(selectedTheme)
        }
    } else {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
    }
}

export const menuItemClassName = 'flex py-2 px-4 rounded-md hover:bg-gray-main hover:text-black-reversed transition-[0.2s] w-full cursor-pointer items-center justify-between'

function ThemeSelector() {
    const {theme,setThemeStore, setColorScheme} = useSiteAttributeStore((store) => store);
    const [selectedKeys, setSelectedKeys] = useState(new Set([theme]));
    const items = [
        {
            value: 'system',
            label: 'System',
        },
        {
            value: 'light',
            label: 'Light'
        },
        {
            value: 'dark',
            label: 'Dark'
        }
    ]

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
        [selectedKeys],
    );

    useEffect(() => {
        setSelectedKeys(new Set([theme]))
    },[theme])

    const onSelectionChange = (v:any) => {
        const key = v.currentKey;
        setSelectedKeys(v);
        setTheme(key);
        setThemeStore(key);
        const colorScheme = key === 'system' ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' : key;
        setColorScheme(colorScheme);
    }

    return (
        <div className={'flex w-full items-center'}>
            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    <div className={menuItemClassName}>
                        <div>Theme:</div>
                        <div>{items.find((item) => item.value === selectedValue)?.label}</div>
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
                            return <DropdownItem key={item.value} textValue={item.label}>
                                <div className="flex gap-2 items-center">
                                    <div className="flex flex-col">
                                        <span className="text-small">{item.label}</span>
                                    </div>
                                </div>
                            </DropdownItem>
                        })
                    }
                </DropdownMenu>
            </Dropdown>
        </div>
    )
}

export default ThemeSelector