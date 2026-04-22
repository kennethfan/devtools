"use client";

import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const gitCommands: { command: string; description: string; category: string }[] = [
  { command: "git init", description: "Initialize a new Git repository", category: "Setup" },
  { command: "git clone <url>", description: "Clone a repository", category: "Setup" },
  { command: "git config --global user.name \"<name>\"", description: "Set global username", category: "Setup" },
  { command: "git config --global user.email \"<email>\"", description: "Set global email", category: "Setup" },
  { command: "git status", description: "Show working tree status", category: "Status" },
  { command: "git diff", description: "Show unstaged changes", category: "Status" },
  { command: "git diff --staged", description: "Show staged changes", category: "Status" },
  { command: "git log", description: "Show commit history", category: "History" },
  { command: "git log --oneline", description: "Compact commit history", category: "History" },
  { command: "git log -n <count>", description: "Show last N commits", category: "History" },
  { command: "git add <file>", description: "Stage a file", category: "Staging" },
  { command: "git add .", description: "Stage all files", category: "Staging" },
  { command: "git add -p", description: "Stage hunks interactively", category: "Staging" },
  { command: "git commit -m \"<message>\"", description: "Commit with message", category: "Commit" },
  { command: "git commit --amend", description: "Modify last commit", category: "Commit" },
  { command: "git commit --amend --no-edit", description: "Amend without changing message", category: "Commit" },
  { command: "git reset HEAD <file>", description: "Unstage a file", category: "Undo" },
  { command: "git reset --soft HEAD~1", description: "Undo last commit (keep changes)", category: "Undo" },
  { command: "git reset --hard HEAD~1", description: "Discard last commit", category: "Undo" },
  { command: "git checkout <branch>", description: "Switch branches", category: "Branching" },
  { command: "git checkout -b <branch>", description: "Create and switch to new branch", category: "Branching" },
  { command: "git switch <branch>", description: "Switch to branch (new)", category: "Branching" },
  { command: "git switch -c <branch>", description: "Create new branch (new)", category: "Branching" },
  { command: "git branch", description: "List branches", category: "Branching" },
  { command: "git branch -d <branch>", description: "Delete branch", category: "Branching" },
  { command: "git merge <branch>", description: "Merge branch into current", category: "Merge" },
  { command: "git rebase <branch>", description: "Rebase onto branch", category: "Merge" },
  { command: "git fetch", description: "Download remote changes", category: "Remote" },
  { command: "git pull", description: "Fetch and merge", category: "Remote" },
  { command: "git pull --rebase", description: "Fetch and rebase", category: "Remote" },
  { command: "git push", description: "Upload changes", category: "Remote" },
  { command: "git push -u origin <branch>", description: "Push and set upstream", category: "Remote" },
  { command: "git push --force", description: "Force push (dangerous)", category: "Remote" },
  { command: "git stash", description: "Stash changes", category: "Stash" },
  { command: "git stash pop", description: "Apply stashed changes", category: "Stash" },
  { command: "git stash drop", description: "Drop stashed changes", category: "Stash" },
  { command: "git clean -fd", description: "Remove untracked files", category: "Cleanup" },
  { command: "git rm --cached <file>", description: "Remove from staging (keep file)", category: "Cleanup" },
];

const categories = [...new Set(gitCommands.map((c) => c.category))];

export function GitCheatSheetTool() {
  const [search, setSearch] = useState("");

  const filteredCommands = gitCommands.filter(
    (cmd) =>
      cmd.command.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, typeof gitCommands>);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
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
        <h1 className="text-3xl font-bold mb-2">Git Cheat Sheet</h1>
        <p className="text-muted-foreground mb-6">
          Quick reference for common Git commands
        </p>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-6">
          {Object.entries(groupedCommands).map(([category, commands]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-3">{category}</h3>
              <div className="grid gap-2">
                {commands.map((cmd) => (
                  <Card
                    key={cmd.command}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleCopy(cmd.command)}
                  >
                    <CardContent className="py-3 flex items-center justify-between">
                      <code className="font-mono">{cmd.command}</code>
                      <span className="text-sm text-muted-foreground">
                        {cmd.description}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}