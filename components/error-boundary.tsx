'use client'
import { Component, ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('Error Boundary caught:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '50vh',
                    padding: '2rem',
                    textAlign: 'center',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        Something went wrong
                    </h2>
                    <p style={{ color: '#666', marginBottom: '1.5rem', maxWidth: '400px' }}>
                        We encountered an unexpected error. Please refresh the page to try again.
                    </p>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false, error: undefined })
                            window.location.reload()
                        }}
                        style={{
                            padding: '0.75rem 2rem',
                            backgroundColor: '#0891b2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
