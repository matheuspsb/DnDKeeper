interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

function Input({ error = false, className = '', ...props }: InputProps) {
  const borderClass = error ? 'border-red-200' : 'border-black-100'
  return (
    <input
      className={`text-white-100 text-sm placeholder:text-white-300/30 focus:outline-none focus:border-red-100 transition-colors border ${borderClass} ${className}`}
      {...props}
    />
  )
}

export default Input
