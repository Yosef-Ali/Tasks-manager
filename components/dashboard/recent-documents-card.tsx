import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileCheck } from "lucide-react";

interface Document {
    _id: string;
    name: string;
    type: string;
    status: string;
    uploadedAt?: string;
}

export function RecentDocumentsCard({ documents }: { documents: Document[] }) {
    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                    <FileCheck className="h-5 w-5 mr-2 text-primary" />
                    Recent Documents
                </CardTitle>
                <CardDescription>Latest document activity</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Document</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {documents?.slice(0, 5).map((doc) => (
                            <TableRow key={doc._id}>
                                <TableCell className="font-medium truncate max-w-[200px]">{doc.name}</TableCell>
                                <TableCell className="capitalize">{doc.type.replace('-', ' ')}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        doc.status === 'verified' ? 'default' :
                                            doc.status === 'uploaded' ? 'secondary' : 'outline'
                                    }>
                                        {doc.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {doc.uploadedAt ? format(new Date(doc.uploadedAt), 'MMM d, yyyy') : 'Not uploaded'}
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!documents || documents.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                                    No documents available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
