"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const permissions = [
  { label: "Owner", user: "owner", read: true, write: true, execute: true },
  { label: "Group", user: "group", read: true, write: false, execute: true },
  { label: "Other", user: "other", read: true, write: false, execute: true },
];

const numericValues = {
  read: 4,
  write: 2,
  execute: 1,
};

export function ChmodCalculatorTool() {
  const [perms, setPerms] = useState({
    owner: { read: true, write: true, execute: true },
    group: { read: true, write: false, execute: true },
    other: { read: true, write: false, execute: true },
  });
  const [octal, setOctal] = useState("755");
  const [symbolic, setSymbolic] = useState("rwxr-xr-x");
  const [copied, setCopied] = useState("");

  const calculate = () => {
    let octStr = "";
    let symStr = "";
    
    for (const { user } of permissions) {
      const p = perms[user as keyof typeof perms];
      const val = (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
      octStr += val;
      
      symStr += (p.read ? "r" : "-") + (p.write ? "w" : "-") + (p.execute ? "x" : "-");
    }
    
    setOctal(octStr);
    setSymbolic(symStr);
  };

  const handlePermChange = (user: keyof typeof perms, type: keyof typeof perms.owner, value: boolean) => {
    setPerms((prev) => ({
      ...prev,
      [user]: { ...prev[user], [type]: value },
    }));
  };

  const handleOctalChange = (value: string) => {
    const cleaned = value.replace(/[^0-7]/g, "").slice(-3);
    setOctal(cleaned);
    
    if (cleaned.length === 3) {
      const newPerms = {
        owner: { read: false, write: false, execute: false },
        group: { read: false, write: false, execute: false },
        other: { read: false, write: false, execute: false },
      };
      
      for (let i = 0; i < 3; i++) {
        const val = parseInt(cleaned[i]);
        const user = ["owner", "group", "other"][i] as keyof typeof newPerms;
        newPerms[user].read = Boolean(val & 4);
        newPerms[user].write = Boolean(val & 2);
        newPerms[user].execute = Boolean(val & 1);
      }
      
      setPerms(newPerms);
      setSymbolic(
        Object.values(newPerms)
          .map((p) => (p.read ? "r" : "-") + (p.write ? "w" : "-") + (p.execute ? "x" : "-"))
          .join("")
      );
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

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
        <h1 className="text-3xl font-bold mb-2">Chmod Calculator</h1>
        <p className="text-muted-foreground mb-6">
          Calculate file permissions in octal or symbolic format
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Permission Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {permissions.slice(0, 3).map(({ label, user }) => (
                <div key={user} className="flex items-center gap-4">
                  <span className="w-20 text-sm font-medium">{label}</span>
                  <div className="flex gap-2">
                    {(["read", "write", "execute"] as const).map((type) => (
                      <Button
                        key={type}
                        variant={perms[user as keyof typeof perms][type] ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          handlePermChange(user as keyof typeof perms, type, !perms[user as keyof typeof perms][type]);
                          setTimeout(calculate, 0);
                        }}
                      >
                        {type.charAt(0).toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Octal Format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={octal}
              onChange={(e) => handleOctalChange(e.target.value)}
              placeholder="755"
              className="font-mono text-xl text-center"
              maxLength={3}
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleOctalChange("644")}>
                644
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleOctalChange("755")}>
                755
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleOctalChange("777")}>
                777
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleOctalChange("600")}>
                600
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleOctalChange("400")}>
                400
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="flex items-center justify-between p-3 bg-muted rounded cursor-pointer"
              onClick={() => handleCopy(octal, "octal")}
            >
              <span className="text-sm">Octal</span>
              <div className="flex items-center gap-2">
                <code className="font-mono text-lg">{octal}</code>
                {copied === "octal" && <Check className="h-4 w-4" />}
              </div>
            </div>
            <div
              className="flex items-center justify-between p-3 bg-muted rounded cursor-pointer"
              onClick={() => handleCopy(symbolic, "symbolic")}
            >
              <span className="text-sm">Symbolic</span>
              <div className="flex items-center gap-2">
                <code className="font-mono text-lg">{symbolic}</code>
                {copied === "symbolic" && <Check className="h-4 w-4" />}
              </div>
            </div>
            <pre className="text-xs text-muted-foreground">
  r = read (4)    w = write (2)    x = execute (1)
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}