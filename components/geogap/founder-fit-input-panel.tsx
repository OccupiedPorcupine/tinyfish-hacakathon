"use client";

import { MVP_CATEGORIES, TARGET_MARKETS } from "@/lib/geogap/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export interface FounderFitInput {
  resume: string;
  linkedInUrl: string;
  background: string;
  industries: string;
  languages: string;
  interests: string;
  startupType: string;
}

const defaultInput: FounderFitInput = {
  resume: "Product lead, 6 yrs B2B SaaS, two 0→1 launches in analytics.",
  linkedInUrl: "https://www.linkedin.com/in/example",
  background: "Ex-implementation consultant; sold to banks and manufacturers.",
  industries: "Fintech ops, manufacturing SaaS",
  languages: "English, Bahasa Indonesia (working)",
  interests: "SMB digitization, regulated workflows",
  startupType: "B2B SaaS — vertical wedge",
};

export function FounderFitInputPanel({
  onAnalyze,
}: {
  onAnalyze: (v: FounderFitInput) => void;
}) {
  const [v, setV] = useState<FounderFitInput>(defaultInput);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ff-resume">Resume summary</Label>
        <Textarea
          id="ff-resume"
          rows={3}
          value={v.resume}
          onChange={(e) => setV({ ...v, resume: e.target.value })}
          className="font-mono text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ff-li">LinkedIn URL</Label>
        <Input
          id="ff-li"
          value={v.linkedInUrl}
          onChange={(e) => setV({ ...v, linkedInUrl: e.target.value })}
          className="font-mono text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ff-bg">Background & experience</Label>
        <Textarea id="ff-bg" rows={2} value={v.background} onChange={(e) => setV({ ...v, background: e.target.value })} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ff-ind">Industries worked in</Label>
          <Input id="ff-ind" value={v.industries} onChange={(e) => setV({ ...v, industries: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ff-lang">Languages spoken</Label>
          <Input id="ff-lang" value={v.languages} onChange={(e) => setV({ ...v, languages: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="ff-int">Interests</Label>
        <Input id="ff-int" value={v.interests} onChange={(e) => setV({ ...v, interests: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Preferred startup type</Label>
        <Select value={v.startupType} onValueChange={(startupType) => setV({ ...v, startupType })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="B2B SaaS — vertical wedge">B2B SaaS — vertical wedge</SelectItem>
            <SelectItem value="Marketplace / network">Marketplace / network</SelectItem>
            <SelectItem value="API infrastructure">API infrastructure</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border border-dashed border-border bg-muted/30 p-3 text-xs text-muted-foreground">
        Reference markets for fit scoring: {TARGET_MARKETS.join(", ")}. Categories: {MVP_CATEGORIES.join(", ")}.
      </div>
      <Button type="button" onClick={() => onAnalyze(v)}>
        Compute founder fit (demo heuristic)
      </Button>
    </div>
  );
}
