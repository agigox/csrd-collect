"use client";

import { Card, Divider, Grid } from "@rte-ds/react";

interface FormCardProps {
  code: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export const FormCard = ({
  code,
  title,
  description,
  onClick,
}: FormCardProps) => {
  return (
    <Grid.Col xxs={12}>
      <Card onClick={onClick} clickable size="full" className="px-3 py-1.75">
        <div className="flex w-full">
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
        </div>
      </Card>
    </Grid.Col>
  );
};
