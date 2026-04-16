function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = `
    inline-flex items-center justify-center
    h-[42px] w-[299px] px-6 py-2
    rounded-full font-medium text-sm
    transition-all cursor-pointer
  `

  const variants = {
    primary: `
      text-white
      bg-linear-to-b from-btn-from to-btn-to
      border border-btn-border
      hover:brightness-110 active:brightness-95
    `,
    secondary: `
      bg-transparent
      border border-btn-secondary-border
      text-btn-secondary-text
      hover:bg-btn-secondary-border/10 active:bg-btn-secondary-border/20
    `,
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
