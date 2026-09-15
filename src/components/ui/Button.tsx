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
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-sm border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200 disabled:cursor-not-allowed disabled:opacity-35',
        variant === 'primary'
          ? 'border-cyan-100/70 bg-cyan-50 text-[#061014] shadow-[0_0_24px_rgba(125,211,252,0.16)] hover:bg-white'
          : 'border-white/10 bg-white/[0.025] text-white/62 hover:border-white/25 hover:bg-white/[0.06] hover:text-white',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
