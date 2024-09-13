"use client";

import {NextUIProvider} from '@nextui-org/react'

export function NextUI({children}) {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  )
}