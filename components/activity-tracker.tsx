'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function ActivityTracker() {
    const pathname = usePathname()
    const startTime = useRef<number>(Date.now())
    const lastPage = useRef<string>('')

    const getDeviceInfo = () => {
        try {
            const ua = navigator.userAgent
            if (/Mobile|Android|iPhone/i.test(ua)) return 'Mobile'
            if (/Tablet|iPad/i.test(ua)) return 'Tablet'
            return 'Desktop'
        } catch { return 'Unknown' }
    }

    const getBrowserInfo = () => {
        try {
            const ua = navigator.userAgent
            if (ua.includes('Firefox')) return 'Firefox'
            if (ua.includes('Edg')) return 'Edge'
            if (ua.includes('Chrome')) return 'Chrome'
            if (ua.includes('Safari')) return 'Safari'
            return 'Other'
        } catch { return 'Unknown' }
    }

    const logActivity = (page: string, timeSpent: number) => {
        try {
            const userStr = localStorage.getItem('netmaxin_user')
            if (!userStr) return
            const user = JSON.parse(userStr)
            if (!user?.id) return

            const payload = {
                action: 'log_activity',
                user_id: user.id,
                page: page,
                action_type: 'page_view',
                time_spent: Math.round(timeSpent / 1000),
                device: getDeviceInfo(),
                browser: getBrowserInfo(),
                referrer: document.referrer || ''
            }

            const AUTH_API_URL = process.env.NEXT_PUBLIC_PHP_BACKEND_URL ? `${process.env.NEXT_PUBLIC_PHP_BACKEND_URL.replace(/\/$/, '')}/auth.php` : 'https://api.netmaxin.com/auth.php';
            // Use fetch with catch - never crashes
            fetch(AUTH_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }).catch(() => { /* silent */ })
        } catch {
            // Silent fail — activity tracking should never crash the app
        }
    }

    useEffect(() => {
        // Log time spent on previous page
        if (lastPage.current && lastPage.current !== pathname) {
            const timeSpent = Date.now() - startTime.current
            logActivity(lastPage.current, timeSpent)
        }

        // Reset for new page
        lastPage.current = pathname
        startTime.current = Date.now()

        // Log on page unload
        const handleBeforeUnload = () => {
            try {
                const timeSpent = Date.now() - startTime.current
                const userStr = localStorage.getItem('netmaxin_user')
                if (!userStr) return
                const user = JSON.parse(userStr)
                if (!user?.id) return

                const payload = JSON.stringify({
                    action: 'log_activity',
                    user_id: user.id,
                    page: pathname,
                    action_type: 'page_view',
                    time_spent: Math.round(timeSpent / 1000),
                    device: getDeviceInfo(),
                    browser: getBrowserInfo(),
                    referrer: ''
                })

                // Use sendBeacon with full URL to avoid Safari issues
                try {
                    const fullUrl = window.location.origin + '/api/auth'
                    navigator.sendBeacon(fullUrl, new Blob([payload], { type: 'application/json' }))
                } catch {
                    // Fallback: just skip logging on unload
                }
            } catch {
                // Never crash
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [pathname])

    return null
}
