"use client"

import type React from "react"
import { type PropsWithChildren, useEffect, useState } from "react"

export default function ClientOnly({ children, fallback }: PropsWithChildren<{
  fallback?: React.ReactElement
}>) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return fallback ?? null
  }

  return <>{children}</>
}
