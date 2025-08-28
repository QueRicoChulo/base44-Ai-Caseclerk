/**
 * Dashboard page component for the CaseClerk AI frontend.
 * Displays user overview, key metrics, recent activity, and urgent events.
 * Handles data loading for cases, documents, call logs, and events via entity models.
 * Prompts onboarding for new users who haven't completed their setup.
 */

'use client'

import React, { useState, useEffect } from "react";
import { Case, Document, CallLog, CalendarEvent, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { 
  FileText, 
  Phone, 
  Calendar, 
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Users,
  Scale,
  PlusCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [callLogs, setCallLogs] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Mock data for demo
      const mockUser = {
        id: '1',
        full_name: 'Demo User',
        onboarding_completed: true
      };

      const mockCases = [
        {
          id: '1',
          case_number: '2024-CV-001234',
          title: 'Smith vs. Johnson Contract Dispute',
          status: 'active',
          priority: 'medium'
        },
        {
          id: '2',
          case_number: '2024-CR-005678',
          title: 'State vs. Williams DUI Case',
          status: 'active',
          priority: 'high'
        }
      ];

      const mockDocuments = [
        {
          id: '1',
          original_name: 'contract_agreement.pdf',
          status: 'completed'
        }
      ];

      const mockCallLogs = [
        {
          id: '1',
          to_number: '+15551234567',
          call_status: 'completed',
          duration: 900
        }
      ];

      const mockEvents = [
        {
          id: '1',
          title: 'Contract Dispute Hearing',
          start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          priority: 'high'
        }
      ];

      setUser(mockUser);
      setCases(mockCases);
      setDocuments(mockDocuments);
      setCallLogs(mockCallLogs);
      setUpcomingEvents(mockEvents);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
    setIsLoading(false);
  };

  // Check if user needs onboarding
  if (user && !user.onboarding_completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="max-w-lg w-full shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Welcome to CaseClerk AI</CardTitle>
            <p className="text-slate-600 mt-2">Let's get you set up with everything you need to manage your legal practice.</p>
          </CardHeader>
          <CardContent className="pt-4">
            <Link href={createPageUrl("Onboarding")}>
              <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 rounded-xl shadow-lg">
                Start Setup Process
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeCases = cases.filter(c => c.status === 'active').length;
  const totalDocuments = documents.length;
  const recentCalls = callLogs.length;
  const urgentEvents = upcomingEvents.filter(e => e.priority === 'critical' || e.priority === 'high').length;

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
              {user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-slate-600">Here's what's happening with your cases today.</p>
          </div>
          <div className="flex gap-3">
            <Link href={createPageUrl("Cases") + "?action=create"}>
              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg">
                <PlusCircle className="w-4 h-4 mr-2" />
                New Case
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                <FileText className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCases}</div>
              <p className="text-xs opacity-80">{cases.length} total</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                <FileText className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDocuments}</div>
              <p className="text-xs opacity-80">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Recent Calls</CardTitle>
                <Phone className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentCalls}</div>
              <p className="text-xs opacity-80">Last 7 days</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Urgent Events</CardTitle>
                <AlertCircle className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{urgentEvents}</div>
              <p className="text-xs opacity-80">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Cases</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                    <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                    <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                  </div>
                ) : cases.length > 0 ? (
                  <div className="space-y-4">
                    {cases.map((case_item) => (
                      <div key={case_item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{case_item.title}</h3>
                          <p className="text-sm text-gray-600">{case_item.case_number}</p>
                        </div>
                        <Badge className={case_item.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                          {case_item.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No cases found</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="p-4 border rounded-lg">
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(event.start_time).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No upcoming events</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}