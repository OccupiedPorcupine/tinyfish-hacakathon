"use client";

import { BUSINESS_MODELS, MVP_CATEGORIES } from "@/lib/geogap/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ScanComposer({ compact }: { compact?: boolean }) {
  const router = useRouter();
  const [idea, setIdea] = useState(
    compact
      ? "Vertical AI copilot for SME compliance logs"
      : "AI workflow assistant for regulated SME operations with audit trails",
  );
  const [category, setCategory] = useState<string>(MVP_CATEGORIES[2]);
  const [businessModel, setBusinessModel] = useState<string>(BUSINESS_MODELS[0]);
  const [companyUrl, setCompanyUrl] = useState("https://");

  const submit = () => {
    const q = new URLSearchParams({
      idea,
      category,
      businessModel,
      companyUrl,
    });
    router.push(`/run-scan?${q.toString()}`);
  };

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {!compact && (
        <p className="text-sm text-muted-foreground">
          Jump into Gap Radar with a pre-filled wedge—edit before you run.
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="qc-idea">Startup idea</Label>
        <Textarea
          id="qc-idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={compact ? 2 : 3}
          className="resize-none font-mono text-sm"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MVP_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Business model</Label>
          <Select value={businessModel} onValueChange={setBusinessModel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_MODELS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="qc-url">Company URL (optional)</Label>
        <Input
          id="qc-url"
          value={companyUrl}
          onChange={(e) => setCompanyUrl(e.target.value)}
          className="font-mono text-sm"
        />
      </div>
      <Button type="button" onClick={submit} className="w-full sm:w-auto">
        Open in Run Scan
      </Button>
    </div>
  );
}
