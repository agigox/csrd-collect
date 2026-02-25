"use client";

import { Card, Divider, Button, Chip } from "@rte-ds/react";

type FormCardStatus = "draft" | "published" | "validated" | "deleted";

const statusConfig: Record<
  FormCardStatus,
  { label: string; backgroundColor: string; icon?: string }
> = {
  draft: {
    label: "Draft",
    backgroundColor: "var(--decorative-jaune-ocre)",
    icon: "sticky-note",
  },
  published: {
    label: "Publié",
    backgroundColor: "var(--decorative-bleu-rte)",
    icon: "sticky-note-valide",
  },
  validated: {
    label: "Validé",
    backgroundColor: "var(--decorative-vert-digital)",
    icon: "check-circle",
  },
  deleted: {
    label: "Supprimé",
    backgroundColor: "var(--decorative-rose-digital)",
    icon: "delete",
  },
};

interface FormCardProps {
  code: string;
  title: string;
  description: string;
  status?: FormCardStatus;
  pressed?: boolean;
  onClick?: () => void;
  onPublish?: () => void;
}

export const FormCard = ({
  code,
  title,
  description,
  status = "draft",
  pressed,
  onClick,
  onPublish,
}: FormCardProps) => {
  const chipConfig = statusConfig[status];
  return (
    <Card
      onClick={onClick}
      clickable
      pressed={pressed}
      size="full"
      className="px-3 py-1.75"
    >
      <div className="flex w-full items-center">
        {/* Left: Title + Code */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold leading-6 text-[#201f1f] tracking-tight truncate">
            {title}
          </h3>
          <p className="text-sm font-semibold text-[#696969] tracking-tight leading-7">
            {code}
          </p>
        </div>

        <div className="self-stretch">
          <Divider
            appearance="default"
            endPoint="round"
            orientation="vertical"
            thickness="medium"
          />
        </div>

        {/* Middle: Description */}
        <div className="flex-1 min-w-0 pl-2.5">
          <p className="text-sm font-normal text-[#11161a] leading-4.5 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="self-stretch">
          <Divider
            appearance="default"
            endPoint="round"
            orientation="vertical"
            thickness="medium"
          />
        </div>

        {/* Right: Status + Publish action */}
        <div className="flex flex-col items-end justify-center gap-1.5 pl-2.5 w-21 shrink-0">
          <Chip
            id={`status-${code}`}
            label={chipConfig.label}
            icon={chipConfig.icon}
            clickable={false}
            size="s"
            style={{
              background: chipConfig.backgroundColor,
              color: "var(--content-primary)",
              width: "100%",
            }}
          />
          {status === "draft" && (
            <Button
              label="Publier"
              variant="primary"
              size="s"
              onClick={(e) => {
                e.stopPropagation();
                onPublish?.();
              }}
              style={{ width: "100%" }}
            />
          )}
        </div>
      </div>
    </Card>
  );
};
