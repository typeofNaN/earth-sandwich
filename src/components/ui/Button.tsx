import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'ghost'
}

export function Button({ children, className, variant = 'ghost', ...props }: Props) {
  return (
    <button
      className={twMerge(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200 disabled:cursor-not-allowed disabled:opacity-45',
        variant === 'primary'
          ? 'border-cyan-200/60 bg-cyan-100 text-black shadow-[0_0_34px_rgba(103,232,249,0.24)] hover:bg-white'
          : 'border-white/15 bg-white/[0.04] text-white/78 hover:border-white/30 hover:bg-white/[0.08]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
