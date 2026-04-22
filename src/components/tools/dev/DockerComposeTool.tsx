"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function DockerComposeTool() {
  const [input, setInput] = useState(`docker run -d -p 8080:80 -v /data nginx:latest
docker run -d -e DB_HOST=localhost -p 5432:5432 postgres
docker run -d --link redis redis:latest`);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convertToCompose = (dockerCommands: string): string => {
    const lines = dockerCommands.split("\n").filter(Boolean);
    const services: Record<string, any> = {};
    let imageCount = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("docker run")) continue;

      // Parse basic docker run command
      const parts = trimmed.split(" ");
      const service: any = { image: "unknown:latest", ports: [], volumes: [], environment: {} };
      let currentImage = "";

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const nextPart = parts[i + 1];

        if (part === "docker" || part === "run" || part === "-d" || part === "-it") continue;

        if (part === "-p" && nextPart) {
          const [hostPort, containerPort] = nextPart.split(":");
          service.ports.push({ host: hostPort, container: containerPort });
          i++;
        } else if (part === "-v" && nextPart) {
          service.volumes.push({ host: nextPart, container: nextPart });
          i++;
        } else if (part === "-e" && nextPart) {
          const [key, value] = nextPart.split("=");
          service.environment[key] = value;
          i++;
        } else if (part === "--name" && nextPart) {
          service.container_name = nextPart;
          i++;
        } else if (part === "--link" && nextPart) {
          service.depends_on = [nextPart];
          i++;
        } else if (part.startsWith("-")) {
          // Skip other flags
        } else if (part.includes(":")) {
          currentImage = part;
        }
      }

      if (!currentImage) {
        currentImage = `image-${++imageCount}:latest`;
      }
      service.image = currentImage;

      services[currentImage.replace(/[:/]/g, "_") || `service_${Object.keys(services).length + 1}`] = service;
    }

    if (Object.keys(services).length === 0) {
      throw new Error("No valid docker run commands found");
    }

    // Generate YAML
    let yaml = "version: '3.8'\nservices:\n";
    for (const [name, service] of Object.entries(services)) {
      yaml += `  ${name}:\n`;
      yaml += `    image: ${service.image}\n`;
      if (service.container_name) {
        yaml += `    container_name: ${service.container_name}\n`;
      }
      if (service.ports?.length) {
        for (const p of service.ports) {
          yaml += `    ports:\n      - "${p.host}:${p.container}"\n`;
        }
      }
      if (service.volumes?.length) {
        for (const v of service.volumes) {
          yaml += `    volumes:\n      - "${v.host}:${v.container}"\n`;
        }
      }
      if (service.environment && Object.keys(service.environment).length) {
        yaml += `    environment:\n`;
        for (const [key, value] of Object.entries(service.environment)) {
          yaml += `      ${key}: ${value}\n`;
        }
      }
      if (service.depends_on?.length) {
        yaml += `    depends_on:\n`;
        for (const dep of service.depends_on) {
          yaml += `      - ${dep}\n`;
        }
      }
    }

    return yaml;
  };

  const handleConvert = () => {
    try {
      const result = convertToCompose(input);
      setOutput(result);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
      setOutput("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Docker to Compose Converter</h1>
        <p className="text-muted-foreground mb-6">
          Convert docker run commands to docker-compose.yml
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Docker Run Commands</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter docker run commands..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[250px] font-mono text-sm"
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button onClick={handleConvert} className="w-full">
                Convert to Compose
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">docker-compose.yml</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                placeholder="docker-compose.yml will appear here..."
                className="min-h-[250px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}