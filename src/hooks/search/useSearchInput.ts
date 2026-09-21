import { useDeferredValue, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useSearchInput() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [inputValue, setInputValue] = useState(() => searchParams.get('q') ?? '')
  const query = useDeferredValue(inputValue)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setInputValue(val)
    setSearchParams(val ? { q: val } : {}, { replace: true })
  }

  return { query, inputValue, handleChange }
}
