import { memo, type ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import styles from './HulyLazerCard.module.css'

export interface HulyLazerCardProps {
  title: string
  description: string
  icon: ReactNode
  image?: string // Optional background image
  className?: string
}

function HulyLazerCardComponent({
  title,
  description,
  icon,
  image,
  className,
}: HulyLazerCardProps): ReactNode {
  return (
    <div className={cn(styles.card, 'group', className)}>
      <div
        className={cn(
          styles.cardInner,
          'relative flex h-full flex-col gap-4 rounded-[1.6rem] p-6 text-white transition-[box-shadow,background,transform] duration-300 ease-out lg:p-7',
          'overflow-hidden'
        )}
      >
        {/* Background image if provided */}
        {image && (
          <div className="absolute inset-0 opacity-50 group-hover:opacity-60 transition-opacity duration-300">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              quality={60}
              loading="lazy"
              priority={false}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMzAzMDQiLz48L3N2Zz4="
            />
            <div className="absolute inset-0 bg-gradient-to-b from-void/50 via-void/40 to-void/60" />
          </div>
        )}
        
        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-2xl text-electric-cyan shadow-[0_0_15px_rgba(76,201,240,0.25)] transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(123,44,191,0.45)]">
          {icon}
        </div>
        <div className="relative z-10 space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          <p className="text-sm leading-relaxed text-white/70">{description}</p>
        </div>
      </div>
    </div>
  )
}

export const HulyLazerCard = memo(HulyLazerCardComponent)
HulyLazerCard.displayName = 'HulyLazerCard'

