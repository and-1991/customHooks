import { useCallback, useLayoutEffect, useRef } from 'react'

export const useEvent = <T extends (...args: any[]) => any>(fn: T) => {
  const fnRef = useRef(fn)

  useLayoutEffect(() => {
    fnRef.current = fn
  }, [fn])

  return useCallback(
    (...args: Parameters<T>) => {
      return fnRef.current.apply(null, args)
    },
    [fnRef],
  )
}
