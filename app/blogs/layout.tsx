import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blog | NETMAXIN',
    description: 'Insights, tips, and trends on digital transformation, technology, and business growth from NETMAXIN.',
}

export default function BlogsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
