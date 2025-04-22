"use client"

import dynamic from 'next/dynamic'

// Use dynamic import with SSR disabled for the dashboard to prevent hydration errors
const DashboardPage = dynamic(
    () => import('@/components/pages/dashboard-page'),
    { ssr: false }
)

export default function DashboardClientWrapper() {
    return <DashboardPage />
}
