"use client";
import { Button, Divider } from "@rte-ds/react";
import Link from "next/link";
import { ReactNode } from "react";

interface PageTitleProps {
  title: string;
  action?: ReactNode;
}

const PageTitle = ({ title, action }: PageTitleProps) => {
  return (
    <div className="flex gap-8 items-center h-16">
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
      <Link href="/admin/parametrage-declaratif">
        <Button
          icon="add"
          label="Ajouter un formulaire"
          size="m"
          variant="primary"
        />
      </Link>
    </div>
  );
};
export default PageTitle;
