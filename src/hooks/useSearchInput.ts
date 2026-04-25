import { useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useSearchInput() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const [inputValue, setInputValue] = useState(query)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setInputValue(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearchParams(val ? { q: val } : {}, { replace: true })
    }, 300)
  }

  return { query, inputValue, handleChange }
}
