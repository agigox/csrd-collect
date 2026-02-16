"use client";
import { Button, Divider, IconButton, useBreakpoint } from "@rte-ds/react";
import Link from "next/link";
import { ReactNode } from "react";

interface PageTitleProps {
  title: string;
  action?: ReactNode;
}

const PageTitle = ({ title, action }: PageTitleProps) => {
  const { isBelow } = useBreakpoint();
  const isMobile = isBelow("m");

  return (
    <div className="flex gap-8 items-center">
      <div className="flex flex-col gap-2 w-fit">
        <div className="flex items-center justify-between">
          <div className="heading-m">{title}</div>
          {action}
        </div>
        <Divider
          appearance="default"
          endPoint="round"
          orientation="horizontal"
          thickness="medium"
        />
      </div>
      <Link href="/admin/new">
        {isMobile ? (
          <IconButton
            appearance="outlined"
            aria-label="Ajouter un formulaire"
            name="add-box"
            size="m"
            variant="primary"
          />
        ) : (
          <Button
            icon="add-box"
            iconPosition="right"
            label="Ajouter un formulaire"
            size="m"
            variant="primary"
          />
        )}
      </Link>
    </div>
  );
};
export default PageTitle;
