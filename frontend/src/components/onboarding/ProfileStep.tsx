# Base44/ai-caseclerk/components/onboarding/profilestep

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { User, Building, Phone, Globe } from "lucide-react";

/**
 * Profile step component for the onboarding flow.
 * Collects professional information including name, bar number, license level,
 * firm details, contact information, and website for legal practice setup.
 */
export default function ProfileStep({ data, updateData }) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <User className="w-5 h-5" />
            <p className="font-medium">Professional Information</p>
          </div>
          <p className="text-sm text-amber-700 mt-1">
            This information will be used for case documents and professional correspondence.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            value={data.full_name}
            onChange={(e) => updateData({ full_name: e.target.value })}
            placeholder="John Smith"
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bar_number">State Bar Number</Label>
          <Input
            id="bar_number"
            value={data.bar_number}
            onChange={(e) => updateData({ bar_number: e.target.value })}
            placeholder="123456"
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="license_level">License Level *</Label>
          <Select value={data.license_level} onValueChange={(value) => updateData({ license_level: value })}>
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Law Student</SelectItem>
              <SelectItem value="pro_per">Pro Per</SelectItem>
              <SelectItem value="paralegal">Paralegal</SelectItem>
              <SelectItem value="attorney">Attorney</SelectItem>
              <SelectItem value="firm_admin">Firm Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="firm_name">Firm/Organization Name</Label>
          <Input
            id="firm_name"
            value={data.firm_name}
            onChange={(e) => updateData({ firm_name: e.target.value })}
            placeholder="Smith & Associates"
            className="bg-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="firm_address" className="flex items-center gap-2">
          <Building className="w-4 h-4" />
          Business Address
        </Label>
        <Input
          id="firm_address"
          value={data.firm_address}
          onChange={(e) => updateData({ firm_address: e.target.value })}
          placeholder="123 Main St, City, State 12345"
          className="bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone_primary" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Primary Phone *
          </Label>
          <Input
            id="phone_primary"
            value={data.phone_primary}
            onChange={(e) => updateData({ phone_primary: e.target.value })}
            placeholder="(555) 123-4567"
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_secondary">Secondary Phone</Label>
          <Input
            id="phone_secondary"
            value={data.phone_secondary}
            onChange={(e) => updateData({ phone_secondary: e.target.value })}
            placeholder="(555) 123-4568"
            className="bg-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website" className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Website
        </Label>
        <Input
          id="website"
          value={data.website}
          onChange={(e) => updateData({ website: e.target.value })}
          placeholder="https://www.yourfirm.com"
          className="bg-white"
        />
      </div>
    </div>
  );
}