import React from 'react'

export const checkForDuplicates = (list:any[]) =>  {
    const uniqueListIds = list.map((item) => item.id).filter((value, index, array) => array.indexOf(value) === index);
    return uniqueListIds.map((item) => list.find((it) => it.id === item));
}