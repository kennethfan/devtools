import Link from "next/link";
import {
  Hash,
  Key,
  Lock,
  Fingerprint,
  ListOrdered,
  Shield,
  FileCode,
  FileJson,
  FileText,
  Table,
  Code,
  Link as LinkIcon,
  Palette,
  TextCursor,
  ArrowLeftRight,
  KeyRound,
  Link2,
  Monitor,
  Server,
  User,
  Type,
  AlignLeft,
  Minimize2,
  Diff,
  Database,
  Search,
  Clock,
  GitBranch,
  Network,
  Globe,
  Calculator,
  Percent,
  BarChart,
  FileDiff,
  Smile,
  QrCode,
  Wifi,
  Image,
} from "lucide-react";
import { Tool, ToolCategory } from "@/config/tools";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Key,
  Hash,
  Lock,
  Fingerprint,
  ListOrdered,
  Shield,
  FileCode,
  FileJson,
  FileText,
  Table,
  Code,
  Link: LinkIcon,
  Palette,
  TextCursor,
  ArrowLeftRight,
  KeyRound,
  Link2,
  Monitor,
  Server,
  User,
  Type,
  AlignLeft,
  Minimize2,
  Diff,
  Database,
  Search,
  Clock,
  GitBranch,
  Network,
  Globe,
  Calculator,
  Percent,
  BarChart,
  FileDiff,
  Smile,
  QrCode,
  Wifi,
  Image,
};

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = iconMap[tool.icon] || FileCode;

  return (
    <Link href={`/tools/${tool.id}`}>
      <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted">
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{tool.name}</h3>
          <p className="text-xs text-muted-foreground truncate">
            {tool.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

interface CategorySectionProps {
  category: ToolCategory;
  name: string;
  icon: string;
  tools: Tool[];
}

export function CategorySection({
  category,
  name,
  icon,
  tools,
}: CategorySectionProps) {
  if (tools.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>{icon}</span>
        <span>{name}</span>
        <span className="text-sm text-muted-foreground">({tools.length})</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
