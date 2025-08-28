# Base44/ai-caseclerk/components/cases/casecard


import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Eye, 
  Clock, 
  AlertTriangle, 
  Calendar,
  MapPin,
  Users
} from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  closed: "bg-gray-100 text-gray-800 border-gray-200",
  appealed: "bg-purple-100 text-purple-800 border-purple-200",
  settled: "bg-blue-100 text-blue-800 border-blue-200"
};

const priorityColors = {
  low: "bg-slate-100 text-slate-700 border-slate-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  high: "bg-orange-100 text-orange-800 border-orange-200", 
  urgent: "bg-red-100 text-red-800 border-red-200"
};

const caseTypeColors = {
  civil: "bg-blue-100 text-blue-800",
  criminal: "bg-red-100 text-red-800",
  family: "bg-pink-100 text-pink-800",
  probate: "bg-purple-100 text-purple-800",
  bankruptcy: "bg-orange-100 text-orange-800",
  administrative: "bg-green-100 text-green-800"
};

/**
 * Card component for displaying summary and key details of a legal case.
 * Shows status, parties, jurisdiction, hearing date, badges, and last updated info.
 * Used throughout the CaseClerk AI frontend wherever case overview is needed.
 */
export default function CaseCard({ case_item, onCaseUpdated }) {
  return (
    <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">
              Case #{case_item.case_number}
            </p>
            <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">
              {case_item.title}
            </h3>
          </div>
          <Link to={createPageUrl("CaseDetail") + "?id=" + case_item.id}>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Parties */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="font-medium">Parties</span>
          </div>
          <p className="text-sm text-slate-600 pl-6">
            {case_item.plaintiff} vs {case_item.defendant}
          </p>
        </div>

        {/* Location */}
        {case_item.jurisdiction && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{case_item.jurisdiction}</span>
          </div>
        )}

        {/* Next Hearing */}
        {case_item.next_hearing && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Next: {format(new Date(case_item.next_hearing), 'MMM d, yyyy')}</span>
          </div>
        )}

        {/* Status and Priority Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className={statusColors[case_item.status]} variant="secondary">
            {case_item.status.charAt(0).toUpperCase() + case_item.status.slice(1)}
          </Badge>
          
          {case_item.case_type && (
            <Badge className={caseTypeColors[case_item.case_type]} variant="secondary">
              {case_item.case_type.charAt(0).toUpperCase() + case_item.case_type.slice(1)}
            </Badge>
          )}
          
          <Badge className={priorityColors[case_item.priority]} variant="secondary">
            {case_item.priority === 'urgent' && <AlertTriangle className="w-3 h-3 mr-1" />}
            {case_item.priority.charAt(0).toUpperCase() + case_item.priority.slice(1)}
          </Badge>
        </div>

        {/* Tags */}
        {case_item.tags && case_item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {case_item.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
            {case_item.tags.length > 3 && (
              <span className="text-slate-500 text-xs">+{case_item.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Last Updated */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Updated {format(new Date(case_item.updated_date), 'MMM d')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}