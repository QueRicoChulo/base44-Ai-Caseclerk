"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import apiClient, { auth } from "@/utils/api"

type LicenseLevel = "student" | "pro_per" | "paralegal" | "attorney" | "firm_admin"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [licenseLevel, setLicenseLevel] = useState<LicenseLevel>("attorney")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const body = {
        email,
        password,
        full_name: fullName,
        license_level: licenseLevel,
      }
      const resp = await apiClient.post("/api/auth/register", body)
      // API shape: { success, data: { user, access_token, refresh_token, expires_in } }
      const { user, access_token, refresh_token } = resp.data.data
      auth.setToken(access_token, refresh_token)
      if (typeof window !== "undefined") {
        localStorage.setItem("user_profile", JSON.stringify(user))
      }
      router.push("/onboarding")
    } catch (err: any) {
      setError(err?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your CaseClerk AI account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="license_level">License level</Label>
              <select
                id="license_level"
                className="w-full border rounded-md h-10 px-3 bg-white"
                value={licenseLevel}
                onChange={(e) => setLicenseLevel(e.target.value as LicenseLevel)}
              >
                <option value="student">Student</option>
                <option value="pro_per">Pro Per</option>
                <option value="paralegal">Paralegal</option>
                <option value="attorney">Attorney</option>
                <option value="firm_admin">Firm Admin</option>
              </select>
            </div>

            {error && (
              <div className="text-sm text-red-600" role="alert">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-sm text-slate-600 mt-4">
            Already have an account? <Link className="text-amber-600 hover:underline" href="/login">Sign in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

