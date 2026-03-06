import { NextRequest, NextResponse } from 'next/server'

// The PHP backend URL - try multiple approaches
const PHP_URLS = [
    ...(process.env.NEXT_PUBLIC_PHP_BACKEND_URL ? [
        `${process.env.NEXT_PUBLIC_PHP_BACKEND_URL.replace(/\/$/, '')}/install_api.php`,
        `${process.env.NEXT_PUBLIC_PHP_BACKEND_URL.replace(/\/$/, '')}/php-backend/install_api.php`
    ] : []),
    'https://api.netmaxin.com/php-backend/install_api.php',
    'https://backend.netmaxin.com/php-backend/install_api.php',
    'https://api.netmaxin.com/install_api.php',
    'https://backend.netmaxin.com/install_api.php',
    'http://127.0.0.1:80/php-backend/install_api.php',
    'http://localhost:80/php-backend/install_api.php',
    'http://127.0.0.1/php-backend/install_api.php',
    'http://127.0.0.1:80/backend/install_api.php',
    'http://localhost:80/backend/install_api.php',
    'http://127.0.0.1/backend/install_api.php',
]

async function tryPhpUrls(body: string, headers: Record<string, string>): Promise<Response | null> {
    for (const url of PHP_URLS) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: body,
                // @ts-ignore - Node.js specific
                signal: AbortSignal.timeout(10000),
            })
            // If the server returns a 404, the PHP endpoint is not at this URL
            if (response.status === 404) {
                continue
            }
            return response
        } catch {
            continue
        }
    }
    return null
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.text()
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'

        // Try to proxy to PHP backend
        const phpResponse = await tryPhpUrls(body, {
            'X-Forwarded-For': ip,
            'X-Real-IP': ip,
        })

        if (phpResponse) {
            const data = await phpResponse.text()
            return new NextResponse(data, {
                status: phpResponse.status,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            })
        }

        // If HTTP proxy failed, try direct PHP execution
        try {
            const { execSync } = await import('child_process')
            const path = await import('path')
            const fs = await import('fs')

            // Search for install_api.php in common locations
            const searchPaths = [
                path.join(process.cwd(), 'php-backend', 'install_api.php'),
                path.join(process.cwd(), 'backend', 'install_api.php'),
                path.join(process.cwd(), 'install_api.php'),
                path.join(process.cwd(), '..', 'backend', 'install_api.php'),
                '/home/u903487771/public_html/php-backend/install_api.php',
                '/home/u903487771/public_html/backend/install_api.php',
                '/home/u903487771/public_html/install_api.php',
            ]

            let phpPath = ''
            for (const p of searchPaths) {
                if (fs.existsSync(p)) {
                    phpPath = p
                    break
                }
            }

            if (phpPath) {
                const env = {
                    ...process.env,
                    REQUEST_METHOD: 'POST',
                    CONTENT_TYPE: 'application/json',
                    CONTENT_LENGTH: Buffer.byteLength(body).toString(),
                    REMOTE_ADDR: ip,
                    HTTP_HOST: request.headers.get('host') || 'netmaxin.com',
                    SCRIPT_FILENAME: phpPath,
                    REDIRECT_STATUS: '200',
                } as NodeJS.ProcessEnv

                const result = execSync(`php-cgi "${phpPath}" 2>/dev/null || php "${phpPath}" 2>/dev/null`, {
                    input: body,
                    env,
                    timeout: 15000,
                    maxBuffer: 10 * 1024 * 1024,
                })

                let output = result.toString()
                // php-cgi adds HTTP headers before the JSON — strip them
                const headerEnd = output.indexOf('\r\n\r\n')
                if (headerEnd > 0) {
                    output = output.substring(headerEnd + 4)
                }
                const jsonStart = output.indexOf('{')
                if (jsonStart >= 0) {
                    output = output.substring(jsonStart)
                }

                return new NextResponse(output, {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                })
            }
        } catch (execError: any) {
            console.error('PHP exec failed:', execError.message)
        }

        return NextResponse.json(
            { status: 'error', message: 'Backend unavailable. Please contact support.' },
            { status: 503 }
        )
    } catch (error: any) {
        console.error('API route error:', error)
        return NextResponse.json(
            { status: 'error', message: 'Server error. Please try again.' },
            { status: 500 }
        )
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
        },
    })
}
