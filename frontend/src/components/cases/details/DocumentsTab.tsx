# Base44/ai-caseclerk/components/cases/details/DocumentsTab

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, FileText, Download, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const docTypeColors = {
  motion: "bg-blue-100 text-blue-800",
  order: "bg-green-100 text-green-800",
  complaint: "bg-red-100 text-red-800",
  discovery: "bg-yellow-100 text-yellow-800",
  correspondence: "bg-purple-100 text-purple-800",
  other: "bg-slate-100 text-slate-800"
};

/**
 * Documents tab component for case detail view.
 * Displays case-related documents in a table format with type badges,
 * upload functionality, and document actions (view, download).
 */
export default function DocumentsTab({ documents, caseId, refreshData }) {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Case Documents</CardTitle>
        <Link to={createPageUrl("Upload")}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800">No Documents Found</h3>
            <p className="text-slate-500 mt-2 mb-4">Upload the first document for this case.</p>
            <Link to={createPageUrl("Upload")}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map(doc => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.original_name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={docTypeColors[doc.document_type] || docTypeColors.other}>
                      {doc.document_type?.replace(/_/g, ' ') || 'Other'}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(doc.created_date), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="flex gap-2">
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                    </a>
                    <Button variant="outline" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}