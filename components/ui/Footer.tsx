'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Typography } from './Typography'
import { DecryptionLink } from './DecryptionLink'
import { MantroLogo } from './MantroLogo'
import { Instagram, Linkedin, Mail, MessageCircle, Github } from 'lucide-react'

const sitemapLinks = [
    { label: 'Work', href: '/#work' },
    { label: 'Services', href: '/services' },
    { label: 'Manifesto', href: '/#manifesto' },
]

const socialLinks = [
    { label: 'Instagram', href: 'https://www.instagram.com/tirthraval27/', icon: Instagram, accentClassName: 'text-pink-500' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/tirth-raval-bbbba3210/', icon: Linkedin, accentClassName: 'text-sky-500' },
    { label: 'GitHub', href: 'https://github.com/Tir25', icon: Github, accentClassName: 'text-zinc-200' },
    { label: 'Gmail', href: 'mailto:tirthraval27@gmail.com', icon: Mail, accentClassName: 'text-red-400' },
    { label: 'WhatsApp', href: 'https://wa.me/8735092881', icon: MessageCircle, accentClassName: 'text-green-500' },
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
                            Freelance Full-Stack Web Developer. I build high-performance digital experiences that transcend the ordinary.
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
                        <Typography variant="caption" className="mb-4 text-gray-400">
                            Connect with me online
                        </Typography>
                        <div className="space-y-3">
                            {socialLinks.map(({ label, href, icon, accentClassName }) => (
                                <DecryptionLink
                                    key={label}
                                    label={label}
                                    href={href}
                                    icon={icon}
                                    accentClassName={accentClassName}
                                    aria-label={`Visit my ${label} profile`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-2 text-center">
                    <Typography variant="body" className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Tirth Raval. All rights reserved.
                    </Typography>
                </div>
            </div>
        </footer>
    )
}

export const Footer = memo(FooterComponent)
Footer.displayName = 'Footer'
