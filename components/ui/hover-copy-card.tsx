"use client";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface HoverCopyCardProps {
  /** The full text to display in the hover card and copy to clipboard */
  text: string;
  /** Title shown above the content in the hover card */
  title?: string;
  /** Max width class for the truncated trigger text */
  triggerClassName?: string;
  /** Width class for the hover card content */
  contentClassName?: string;
}

export function HoverCopyCard({
  text,
  title = "Details",
  triggerClassName = "max-w-[200px]",
  contentClassName = "w-80",
}: HoverCopyCardProps) {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <span className={`truncate block cursor-pointer ${triggerClassName}`}>
          {text}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className={contentClassName}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-1">
            <h4 className="font-semibold text-sm">{title}</h4>
            <div className="max-h-[200px] overflow-y-auto pr-2">
              <p className="whitespace-pre-wrap break-words text-muted-foreground text-sm">
                {text}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="-mt-3 -mr-3 h-8 w-8 shrink-0"
            asChild
          >
            <CopyButton text={text} />
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
