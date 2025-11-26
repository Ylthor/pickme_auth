import React, { useEffect, useState } from 'react'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown"
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import {useSiteAttributeStore} from "../../providers/site-attribute-store-provider";
import ApiService from "../../service/ApiService";
import {menuItemClassName} from "./ThemeSelector";

function CompanySelector() {
    const {company_info, setCompanyInfo} = useSiteAttributeStore((store) => store);
    const [selectedKeys, setSelectedKeys] = useState(new Set(company_info?.id ? [company_info.id] : []));
    const {t} = useTranslation();
    const [items, setItems] = useState<any[]>([])

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
        [selectedKeys],
    );

    const getData = () => {
        const promise = ApiService.fetchData({
            url: "/v2.1/company/",
            method: "get",
        },{});

        promise.then((res) => {
            const it = res.data.data;
            setItems(it.map((elem:any) => ({
                value: elem.id,
                label: `${elem.title} (${elem.location})`,
            })))
        })
    }

    useEffect(() => {
        getData();
    }, [])

    useEffect(() => {
        setSelectedKeys(new Set(company_info?.id ? [company_info.id] : []))
    },[items,company_info])

    const onSelectionChange = (v:any) => {
        const key = v.currentKey;
        setSelectedKeys(v);
        const promise2 = ApiService.fetchData({
            url: `/v2.1/company/${key}/change-company`,
            method: "patch",
        },{});
        promise2.then((res) => {
            toast.success(t('companyDataIsUpdated'));
            setCompanyInfo(res.data.data)
        })
    }

    // const onAddClick = (e) => {
    //     e.preventDefault();
    // }

    return (
        <div className={'flex w-full items-center gap-2'}>
            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    <div className={menuItemClassName}>
                        <div>Company:</div>
                        <div className={'ml-4 text-right'}>{items?.find((item) => item.value === selectedValue)?.label}</div>
                    </div>
                </DropdownTrigger>
                <DropdownMenu disallowEmptySelection
                              aria-label="Single selection example"
                              selectedKeys={selectedKeys}
                              selectionMode="single"
                              variant="flat"
                              onSelectionChange={onSelectionChange}>
                    {
                        items?.map((item) => {
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
            {/*<div className={'-ml-3 p-2 cursor-pointer text-[22px]'} onClick={onAddClick}>*/}
            {/*    <AddIcon />*/}
            {/*</div>*/}
        </div>
    )
}

export default CompanySelector