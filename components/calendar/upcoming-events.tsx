import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UpcomingEvents() {
    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="p-3 bg-blue-900/30 border border-blue-800 rounded-md">
                    <p className="font-medium">Staff Meeting</p>
                    <p className="text-sm text-gray-400">Today, 10:00 AM - Conference Room A</p>
                </div>
                <div className="p-3 bg-green-900/30 border border-green-800 rounded-md">
                    <p className="font-medium">Patient Checkup</p>
                    <p className="text-sm text-gray-400">Tomorrow, 2:30 PM - Room 305</p>
                </div>
                <div className="p-3 bg-amber-900/30 border border-amber-800 rounded-md">
                    <p className="font-medium">Department Review</p>
                    <p className="text-sm text-gray-400">Jan 15, 9:00 AM - Administrative Office</p>
                </div>
            </CardContent>
        </Card>
    )
}
