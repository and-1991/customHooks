import { SetStateAction, useState } from 'react'
import { useEvent } from './useEvent'

const getSearchParam = (search: string, param: string) => {
  const searchParams = new URLSearchParams(search)
  return searchParams.get(param)
}

const setSearchParam = (search: string, param: string, value: string) => {
  const searchParams = new URLSearchParams(search)
  searchParams.set(param, value)
  return searchParams.toString()
}

const defaultDeserialize = <Value,>(v: string | null) => v as unknown as Value
const defaultSerialize = String

interface UseSearchParamsStateOptions<Value> {
  name: string
  serialize?: (value: Value) => string
  deserialize?: (value: string | null) => Value
}

export const useSearchParamsState = <Value,>({
  name,
  serialize = defaultSerialize,
  deserialize = defaultDeserialize,
}: UseSearchParamsStateOptions<Value>) => {
  const [value, setValue] = useState(() => {
    return deserialize(getSearchParam(window.location.search, name))
  })

  const updateValue = useEvent((newValue: SetStateAction<Value>) => {
    const search = window.location.search
    const actionNewValue =
      // @ts-ignore
      typeof newValue === 'function' ? newValue(value) : newValue
    setValue(actionNewValue)
    const newSearch = setSearchParam(search, name, serialize(actionNewValue))
    history.pushState(null, '', `?${newSearch}`)
  })

  return [value, updateValue] as const
}
