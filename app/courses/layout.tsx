import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Courses | NETMAXIN',
    description: 'Learn and grow with NETMAXIN Academy. Access world-class training programs designed for you.',
}

export default function CoursesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
