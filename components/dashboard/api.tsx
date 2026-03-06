const API_URL = '/php-backend/auth.php';

export async function api(body: Record<string, any>) {
    const action = body.action;

    try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 15000) // 15s timeout

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(body),
            signal: controller.signal,
        })

        clearTimeout(timeout)

        // Handle non-OK HTTP responses
        if (!res.ok) {
            console.error(`API HTTP error ${res.status} for action: ${action}`)
            return { status: 'error', message: `Server error (${res.status}). Please try again later.` }
        }

        // Safely parse JSON — Hostinger may return HTML error pages
        const text = await res.text()
        try {
            return JSON.parse(text)
        } catch {
            console.error(`API returned non-JSON for action "${action}":`, text.substring(0, 200))
            return { status: 'error', message: 'Server returned an unexpected response. Please try again.' }
        }
    } catch (e: any) {
        if (e.name === 'AbortError') {
            console.error("API timeout for action:", action)
            return { status: 'error', message: 'Request timed out. Please check your connection.' }
        }
        console.error("API error for action", action, e)
        return { status: 'error', message: 'Connection failed. Please check your internet connection.' }
    }
}

export function formatDate(d: string) {
    if (!d) return 'Unknown'
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d))
}

export const statusColors: Record<string, string> = {
    pending_review: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    pending_employee_review: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    employee_approved: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
    reviewed: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
    manager_approved: 'bg-green-500/20 text-green-600 dark:text-green-400',
    approved: 'bg-green-500/20 text-green-600 dark:text-green-400',
    published: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    rejected: 'bg-red-500/20 text-red-600 dark:text-red-400',
    submitted: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    in_progress: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
    under_review: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
    completed: 'bg-green-500/20 text-green-600 dark:text-green-400',
    passed: 'bg-green-500/20 text-green-600 dark:text-green-400',
    failed: 'bg-red-500/20 text-red-600 dark:text-red-400',
    pending: 'bg-gray-500/20 text-gray-600 dark:text-gray-400',
}

export function StatusBadge({ status }: { status: string }) {
    const color = statusColors[status] || 'bg-gray-500/20 text-gray-500'
    const label = status ? status.replace(/_/g, ' ') : ''
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${color}`}>{label}</span>
    )
}
