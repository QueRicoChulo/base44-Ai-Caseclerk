# Base44/ai-caseclerk/Pages/cases


import React, { useState, useEffect } from "react";
import { Case, Document, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Clock,
  Scale
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

import CaseCard from "../components/cases/CaseCard";
import CreateCaseModal from "../components/cases/CreateCaseModal";
import CaseFilters from "../components/cases/CaseFilters";

/**
 * Cases listing page for CaseClerk AI.
 * Displays all legal cases with search, filtering, and creation capabilities.
 * Handles case loading, filtering by status/type/priority, and navigation to case details.
 */
export default function CasesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    case_type: 'all',
    priority: 'all'
  });

  useEffect(() => {
    loadCases();
    // Check if we should show create modal
    if (searchParams.get('action') === 'create') {
      setShowCreateModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    filterCases();
  }, [cases, searchTerm, filters]);

  const loadCases = async () => {
    setIsLoading(true);
    try {
      const casesData = await Case.list("-updated_date");
      setCases(casesData);
    } catch (error) {
      console.error("Error loading cases:", error);
    }
    setIsLoading(false);
  };

  const filterCases = () => {
    let filtered = cases;

    // Text search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.case_number?.toLowerCase().includes(term) ||
        c.title?.toLowerCase().includes(term) ||
        c.plaintiff?.toLowerCase().includes(term) ||
        c.defendant?.toLowerCase().includes(term)
      );
    }

    // Filters
    if (filters.status !== 'all') {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters.case_type !== 'all') {
      filtered = filtered.filter(c => c.case_type === filters.case_type);
    }
    if (filters.priority !== 'all') {
      filtered = filtered.filter(c => c.priority === filters.priority);
    }

    setFilteredCases(filtered);
  };

  const handleCaseCreated = (newCase) => {
    setCases(prev => [newCase, ...prev]);
    setShowCreateModal(false);
    // Navigate to the new case
    navigate(createPageUrl("CaseDetail") + "?id=" + newCase.id);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Scale className="w-8 h-8 text-amber-600" />
              Legal Cases
            </h1>
            <p className="text-slate-600 mt-1">Manage and track your legal cases</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search cases by number, title, or parties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
              <CaseFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </CardContent>
        </Card>

        {/* Cases Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-6 bg-slate-200 rounded w-2/3"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-slate-200 rounded w-16"></div>
                      <div className="h-6 bg-slate-200 rounded w-20"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCases.length === 0 ? (
          <Card className="shadow-lg border-0">
            <CardContent className="p-12 text-center">
              <Scale className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {cases.length === 0 ? "No cases yet" : "No cases match your search"}
              </h3>
              <p className="text-slate-600 mb-6">
                {cases.length === 0 
                  ? "Create your first case to get started with case management." 
                  : "Try adjusting your search terms or filters."
                }
              </p>
              {cases.length === 0 && (
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Case
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((case_item) => (
              <CaseCard 
                key={case_item.id} 
                case_item={case_item}
                onCaseUpdated={loadCases}
              />
            ))}
          </div>
        )}

        {/* Create Case Modal */}
        <CreateCaseModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onCaseCreated={handleCaseCreated}
        />
      </div>
    </div>
  );
}