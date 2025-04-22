"use client"

import { useCallback, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function useQueryState(key: string, defaultValue = "") {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentValue = searchParams.get(key) || defaultValue
  const [value, setValue] = useState(currentValue)

  const updateQueryParam = useCallback(
    (newValue: string) => {
      setValue(newValue)
      const params = new URLSearchParams(searchParams.toString())

      if (newValue) {
        params.set(key, newValue)
      } else {
        params.delete(key)
      }

      const queryString = params.toString()
      const url = queryString ? `${pathname}?${queryString}` : pathname

      router.push(url)
    },
    [key, pathname, router, searchParams],
  )

  return [value, updateQueryParam] as const
}
