# Base44/ai-caseclerk/components/cases/CreateCaseModel

import React, { useState } from 'react';
import { Case, User } from "@/entities/all";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";

/**
 * Modal dialog and form for creating a new legal case within CaseClerk AI.
 * Collects full case details, manages tags, validates form, and persists to backend.
 * Resets state after successful submission and notifies parent.
 */
export default function CreateCaseModal({ open, onOpenChange, onCaseCreated }) {
  const [formData, setFormData] = useState({
    case_number: '',
    title: '',
    plaintiff: '',
    defendant: '',
    jurisdiction: '',
    court_address: '',
    judge: '',
    department: '',
    status: 'active',
    case_type: 'civil',
    priority: 'medium',
    tags: [],
    next_hearing: null,
    statute_of_limitations: null,
    summary: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newCase = await Case.create(formData);
      onCaseCreated(newCase);
      // Reset form
      setFormData({
        case_number: '',
        title: '',
        plaintiff: '',
        defendant: '',
        jurisdiction: '',
        court_address: '',
        judge: '',
        department: '',
        status: 'active',
        case_type: 'civil',
        priority: 'medium',
        tags: [],
        next_hearing: null,
        statute_of_limitations: null,
        summary: ''
      });
    } catch (error) {
      console.error("Error creating case:", error);
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Create New Case
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="case_number">Case Number *</Label>
              <Input
                id="case_number"
                value={formData.case_number}
                onChange={(e) => handleInputChange('case_number', e.target.value)}
                placeholder="e.g., 2024-CV-001234"
                required
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="case_type">Case Type</Label>
              <Select value={formData.case_type} onValueChange={(value) => handleInputChange('case_type', value)}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="civil">Civil</SelectItem>
                  <SelectItem value="criminal">Criminal</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="probate">Probate</SelectItem>
                  <SelectItem value="bankruptcy">Bankruptcy</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Case Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Brief description of the case"
              required
              className="bg-white"
            />
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plaintiff">Plaintiff</Label>
              <Input
                id="plaintiff"
                value={formData.plaintiff}
                onChange={(e) => handleInputChange('plaintiff', e.target.value)}
                placeholder="Plaintiff name"
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defendant">Defendant</Label>
              <Input
                id="defendant"
                value={formData.defendant}
                onChange={(e) => handleInputChange('defendant', e.target.value)}
                placeholder="Defendant name"
                className="bg-white"
              />
            </div>
          </div>

          {/* Court Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jurisdiction">Jurisdiction</Label>
              <Input
                id="jurisdiction"
                value={formData.jurisdiction}
                onChange={(e) => handleInputChange('jurisdiction', e.target.value)}
                placeholder="e.g., Superior Court of California"
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="judge">Judge</Label>
              <Input
                id="judge"
                value={formData.judge}
                onChange={(e) => handleInputChange('judge', e.target.value)}
                placeholder="Assigned judge"
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="court_address">Court Address</Label>
            <Input
              id="court_address"
              value={formData.court_address}
              onChange={(e) => handleInputChange('court_address', e.target.value)}
              placeholder="Court location"
              className="bg-white"
            />
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="appealed">Appealed</SelectItem>
                  <SelectItem value="settled">Settled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="Court department"
                className="bg-white"
              />
            </div>
          </div>

          {/* Important Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Next Hearing</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start bg-white">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.next_hearing ? format(new Date(formData.next_hearing), 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.next_hearing ? new Date(formData.next_hearing) : undefined}
                    onSelect={(date) => handleInputChange('next_hearing', date)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Statute of Limitations</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start bg-white">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.statute_of_limitations ? format(new Date(formData.statute_of_limitations), 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.statute_of_limitations ? new Date(formData.statute_of_limitations) : undefined}
                    onSelect={(date) => handleInputChange('statute_of_limitations', date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                className="bg-white"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span key={index} className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-amber-600 hover:text-amber-800">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">Case Summary</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              placeholder="Brief summary of the case..."
              rows={3}
              className="bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.case_number || !formData.title}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              {isSubmitting ? 'Creating...' : 'Create Case'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}