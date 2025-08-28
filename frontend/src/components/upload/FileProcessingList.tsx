# Base44/ai-caseclerk/components/cases/Upload/FileProcessingList

import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, AlertTriangle, Loader, X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const getStatusInfo = (status) => {
  switch (status) {
    case 'pending':
      return { text: 'Pending', icon: Loader, color: 'text-slate-500', iconClass: 'animate-spin' };
    case 'uploading':
      return { text: 'Uploading...', icon: Loader, color: 'text-blue-500', iconClass: 'animate-spin' };
    case 'processing':
      return { text: 'AI Processing...', icon: Loader, color: 'text-purple-500', iconClass: 'animate-spin' };
    case 'review':
      return { text: 'Ready for Review', icon: CheckCircle, color: 'text-green-500', iconClass: '' };
    case 'completed':
      return { text: 'Completed', icon: CheckCircle, color: 'text-green-600', iconClass: '' };
    case 'failed':
      return { text: 'Failed', icon: AlertTriangle, color: 'text-red-500', iconClass: '' };
    default:
      return { text: 'Queued', icon: Loader, color: 'text-slate-500', iconClass: '' };
  }
};

/**
 * File processing list component for document upload workflow.
 * Displays upload progress, AI processing status, and completion states
 * for multiple files with real-time status updates and removal capability.
 */
export default function FileProcessingList({ files, removeFile }) {
  return (
    <div className="space-y-4">
      {files.map(item => {
        const { text, icon: Icon, color, iconClass } = getStatusInfo(item.status);
        return (
          <div key={item.id} className="p-4 border rounded-lg flex items-center gap-4 bg-white">
            <FileText className="w-6 h-6 text-slate-500" />
            <div className="flex-1">
              <p className="font-medium text-slate-800">{item.file.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Icon className={`w-4 h-4 ${color} ${iconClass}`} />
                <span className={`text-sm ${color}`}>{text}</span>
                {item.status === 'completed' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Plus className="w-3 h-3 mr-1" />
                    Auto-added to case
                  </Badge>
                )}
              </div>
              <Progress value={item.progress} className="h-1 mt-2" />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => removeFile(item.id)}
              disabled={item.status === 'processing' || item.status === 'uploading'}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}