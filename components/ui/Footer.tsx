'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Typography } from './Typography'
import { DecryptionLink } from './DecryptionLink'
import { MantroLogo } from './MantroLogo'
import { Twitter, Instagram, Linkedin, Github, Mail } from 'lucide-react'

const sitemapLinks = [
    { label: 'Work', href: '/#work' },
    { label: 'Services', href: '/services' },
    { label: 'Manifesto', href: '/#manifesto' },
]

const socialLinks = [
    { label: 'X / Twitter', href: 'https://x.com/mantro', icon: Twitter, accentClassName: 'text-sky-400' },
    { label: 'Instagram', href: 'https://instagram.com/mantro', icon: Instagram, accentClassName: 'text-pink-500' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/mantro', icon: Linkedin, accentClassName: 'text-sky-500' },
    { label: 'GitHub', href: 'https://github.com/mantro', icon: Github, accentClassName: 'text-zinc-200' },
    {
        label: 'Gmail',
        href: 'mailto:tirthraval27@gmail.com',
        icon: Mail,
        accentClassName: 'text-red-400',
    },
] as const

function FooterComponent() {
    return (
        <footer className="bg-void border-t border-white/10 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <MantroLogo size={36} text={false} />
                            <Typography variant="h3" className="text-white tracking-tighter">
                                MANTRO
                            </Typography>
                        </div>
                        <Typography variant="body" className="text-gray-400 max-w-sm">
                            Ethereal Industrialism. We build digital experiences that transcend the ordinary and define the future.
                        </Typography>
                    </div>

                    <div>
                        <Typography variant="h4" className="mb-6 text-sm uppercase tracking-widest text-gray-500">
                            Sitemap
                        </Typography>
                        <ul className="space-y-3">
                            {sitemapLinks.map(({ label, href }) => (
                                <li key={label}>
                                    {href.startsWith('/') ? (
                                        <Link href={href} className="text-gray-300 hover:text-cyan transition-colors">
                                            {label}
                                        </Link>
                                    ) : (
                                        <a href={href} className="text-gray-300 hover:text-cyan transition-colors">
                                            {label}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <Typography variant="h4" className="mb-6 text-sm uppercase tracking-widest text-gray-500">
                            Socials
                        </Typography>
                        <p className="mb-4 text-xs font-mono text-gray-500/80">
                            Hover to decrypt the uplinks.
                        </p>
                        <div className="space-y-3">
                            {socialLinks.map(({ label, href, icon, accentClassName }) => (
                                <DecryptionLink
                                    key={label}
                                    label={label}
                                    href={href}
                                    icon={icon}
                                    accentClassName={accentClassName}
                                    aria-label={`Visit our ${label} profile`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-2 text-center">
                    <Typography variant="body" className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Mantro Agency. All rights reserved.
                    </Typography>
                </div>
            </div>
        </footer>
    )
}

export const Footer = memo(FooterComponent)
Footer.displayName = 'Footer'
