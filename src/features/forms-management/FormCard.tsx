"use client";

import { Card, Divider, IconButton, Chip } from "@rte-ds/react";

interface FormCardProps {
  code: string;
  title: string;
  description: string;
  isPublished?: boolean;
  pressed?: boolean;
  onClick?: () => void;
  onPublish?: () => void;
}

export const FormCard = ({
  code,
  title,
  description,
  isPublished = false,
  pressed,
  onClick,
  onPublish,
}: FormCardProps) => {
  return (
    <Card
      onClick={onClick}
      clickable
      pressed={pressed}
      size="full"
      className="px-3 py-1.75"
    >
      <div className="flex w-full items-center">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{code}</p>
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        </div>
        <div className="self-stretch">
          <Divider
            appearance="default"
            endPoint="round"
            orientation="vertical"
            thickness="medium"
          />
        </div>
        <div className="flex-1 pl-2.5">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-2 pl-2">
          {isPublished ? (
            <Chip id="published-chip" label="Publie" color="green" />
          ) : (
            <IconButton
              appearance="outlined"
              aria-label="Publier le formulaire"
              name="publish"
              onClick={(e) => {
                e.stopPropagation();
                onPublish?.();
              }}
              size="s"
              variant="primary"
            />
          )}
        </div>
      </div>
    </Card>
  );
};
