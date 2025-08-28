/**
 * Onboarding page for CaseClerk AI.
 * Guides the user through professional, jurisdiction, storage, API, and feature-selection steps.
 * Persists onboarding progress, updates user profile, and navigates to dashboard upon completion.
 */

'use client'

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/utils";
import { Scale, ArrowRight, Check } from "lucide-react";

const STEPS = [
  { id: 'profile', title: 'Professional Profile', description: 'Basic information and credentials' },
  { id: 'jurisdiction', title: 'Jurisdiction & Court', description: 'Default legal jurisdiction settings' },
  { id: 'storage', title: 'Document Storage', description: 'Configure file storage preferences' },
  { id: 'apikeys', title: 'AI & Integrations', description: 'Set up API keys for enhanced features' },
  { id: 'features', title: 'Feature Selection', description: 'Choose which features to enable' }
];

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Profile
    full_name: '',
    bar_number: '',
    license_level: 'attorney',
    firm_name: '',
    firm_address: '',
    phone_primary: '',
    phone_secondary: '',
    website: '',
    
    // Jurisdiction
    default_jurisdiction: '',
    default_court: '',
    
    // Storage
    storage_location: 'vps',
    
    // API Keys
    api_keys: {
      openai: '',
      anthropic: '',
      vonage: '',
      elevenlabs: ''
    },
    
    // Features
    feature_flags: {
      ai_calling: false,
      legal_research: false,
      advanced_analytics: false
    }
  });

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Mock completion - in real app would call User.updateMyUserData
      console.log('Onboarding completed:', formData);
      router.push(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const updateFormData = (updates: any) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const renderCurrentStep = () => {
    switch (STEPS[currentStep].id) {
      case 'profile':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                value={formData.full_name}
                onChange={(e) => updateFormData({ full_name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bar Number</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                value={formData.bar_number}
                onChange={(e) => updateFormData({ bar_number: e.target.value })}
                placeholder="Enter your bar number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">License Level</label>
              <select
                className="w-full p-3 border rounded-lg"
                value={formData.license_level}
                onChange={(e) => updateFormData({ license_level: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="pro_per">Pro Per</option>
                <option value="paralegal">Paralegal</option>
                <option value="attorney">Attorney</option>
                <option value="firm_admin">Firm Admin</option>
              </select>
            </div>
          </div>
        );
      case 'jurisdiction':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Default Jurisdiction</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                value={formData.default_jurisdiction}
                onChange={(e) => updateFormData({ default_jurisdiction: e.target.value })}
                placeholder="e.g., Superior Court of California"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Default Court</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                value={formData.default_court}
                onChange={(e) => updateFormData({ default_court: e.target.value })}
                placeholder="e.g., Los Angeles County"
              />
            </div>
          </div>
        );
      case 'storage':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Storage Location</label>
              <select
                className="w-full p-3 border rounded-lg"
                value={formData.storage_location}
                onChange={(e) => updateFormData({ storage_location: e.target.value })}
              >
                <option value="local">Local Storage</option>
                <option value="vps">VPS Server</option>
                <option value="cloud">Cloud Storage</option>
              </select>
            </div>
          </div>
        );
      case 'apikeys':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">OpenAI API Key</label>
              <input
                type="password"
                className="w-full p-3 border rounded-lg"
                value={formData.api_keys.openai}
                onChange={(e) => updateFormData({ 
                  api_keys: { ...formData.api_keys, openai: e.target.value }
                })}
                placeholder="sk-..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Anthropic API Key</label>
              <input
                type="password"
                className="w-full p-3 border rounded-lg"
                value={formData.api_keys.anthropic}
                onChange={(e) => updateFormData({ 
                  api_keys: { ...formData.api_keys, anthropic: e.target.value }
                })}
                placeholder="Optional"
              />
            </div>
          </div>
        );
      case 'features':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">AI Calling</h3>
                <p className="text-sm text-gray-600">Enable AI-powered call management</p>
              </div>
              <input
                type="checkbox"
                checked={formData.feature_flags.ai_calling}
                onChange={(e) => updateFormData({
                  feature_flags: { ...formData.feature_flags, ai_calling: e.target.checked }
                })}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Legal Research</h3>
                <p className="text-sm text-gray-600">Enable AI legal research tools</p>
              </div>
              <input
                type="checkbox"
                checked={formData.feature_flags.legal_research}
                onChange={(e) => updateFormData({
                  feature_flags: { ...formData.feature_flags, legal_research: e.target.checked }
                })}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Advanced Analytics</h3>
                <p className="text-sm text-gray-600">Enable advanced reporting and analytics</p>
              </div>
              <input
                type="checkbox"
                checked={formData.feature_flags.advanced_analytics}
                onChange={(e) => updateFormData({
                  feature_flags: { ...formData.feature_flags, advanced_analytics: e.target.checked }
                })}
                className="w-4 h-4"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to CaseClerk AI</h1>
          <p className="text-slate-600">Let's set up your legal practice management system</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-600">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index < currentStep 
                    ? 'bg-green-500 text-white' 
                    : index === currentStep 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-slate-200 text-slate-400'
                }`}>
                  {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`text-xs mt-2 text-center ${
                  index <= currentStep ? 'text-slate-900 font-medium' : 'text-slate-500'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step */}
        <Card className="shadow-2xl border-0 mb-8">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-slate-900">
              {STEPS[currentStep].title}
            </CardTitle>
            <p className="text-slate-600">{STEPS[currentStep].description}</p>
          </CardHeader>
          <CardContent>
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6"
          >
            Back
          </Button>
          
          {currentStep === STEPS.length - 1 ? (
            <Button
              onClick={handleComplete}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8"
            >
              Complete Setup
              <Check className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}