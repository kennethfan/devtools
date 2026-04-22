"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface PasswordRequirements {
  label: string;
  check: (password: string) => boolean;
}

const requirements: PasswordRequirements[] = [
  { label: "At least 8 characters", check: (p) => p.length >= 8 },
  { label: "At least 12 characters", check: (p) => p.length >= 12 },
  { label: "Contains uppercase letter", check: (p) => /[A-Z]/.test(p) },
  { label: "Contains lowercase letter", check: (p) => /[a-z]/.test(p) },
  { label: "Contains number", check: (p) => /[0-9]/.test(p) },
  { label: "Contains special character", check: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  { label: "No common patterns", check: (p) => !/(123|abc|qwerty|password|admin)/i.test(p) },
];

const calculateStrength = (password: string): { score: number; label: string; color: string } => {
  if (!password) return { score: 0, label: "Empty", color: "bg-gray-200" };

  let score = 0;

  // Length checks
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character type checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  // Variety bonus
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.7) score += 1;

  // Penalty for common patterns
  if (/(123|abc|qwerty|password|admin)/i.test(password)) score -= 2;

  // Normalize score to 0-100
  const normalizedScore = Math.max(0, Math.min(100, Math.round((score / 8) * 100)));

  if (normalizedScore < 30) return { score: normalizedScore, label: "Very Weak", color: "bg-red-500" };
  if (normalizedScore < 50) return { score: normalizedScore, label: "Weak", color: "bg-orange-500" };
  if (normalizedScore < 70) return { score: normalizedScore, label: "Fair", color: "bg-yellow-500" };
  if (normalizedScore < 90) return { score: normalizedScore, label: "Strong", color: "bg-green-500" };
  return { score: normalizedScore, label: "Very Strong", color: "bg-emerald-500" };
};

const estimateCrackTime = (score: number): string => {
  if (score < 30) return "Instant";
  if (score < 50) return "Seconds to minutes";
  if (score < 70) return "Hours to days";
  if (score < 90) return "Months to years";
  return "Centuries";
};

export function PasswordStrengthTool() {
  const [password, setPassword] = useState("");

  const strength = useMemo(() => calculateStrength(password), [password]);
  const metRequirements = useMemo(
    () => requirements.map((req) => ({ ...req, met: req.check(password) })),
    [password]
  );

  const metCount = metRequirements.filter((r) => r.met).length;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Password Strength Analyzer</h1>
        <p className="text-muted-foreground mb-6">
          Check password strength and security
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Enter Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password to analyze..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Your password is processed locally and never sent anywhere.
            </p>
          </CardContent>
        </Card>

        {password && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Strength Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{strength.label}</span>
                  <span className="text-muted-foreground">{strength.score}%</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-sm text-muted-foreground">Estimated Crack Time</div>
                    <div className="font-medium">{estimateCrackTime(strength.score)}</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-sm text-muted-foreground">Requirements Met</div>
                    <div className="font-medium">{metCount} / {requirements.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requirements Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metRequirements.map((req, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-2 rounded ${
                        req.met ? "bg-green-500/10 text-green-600" : "bg-muted"
                      }`}
                    >
                      {req.met ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm">{req.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
