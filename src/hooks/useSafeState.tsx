import { SetStateAction, useCallback, useState } from 'react'
import { useIsMounted } from './useIsMounted'

export const useSafeState = <S,>(initialValue: (() => S) | S) => {
  const [value, setValue] = useState(initialValue)

  const isMounted = useIsMounted()

  const setState = useCallback(
    (newValue: SetStateAction<S>) => {
      if (!isMounted.current) {
        return
      }
      setValue(newValue)
    },
    [isMounted],
  )

  return [value, setState] as const
}
