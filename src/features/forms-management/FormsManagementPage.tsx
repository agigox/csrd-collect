"use client";

import Link from "next/link";
import { FormsList } from "./FormsList";
import PageTitle from "@/lib/ui/page-title";
import { Button, IconButton, useBreakpoint } from "@rte-ds/react";

export default function AdminPageContent() {
  const { isBelow } = useBreakpoint();
  const isMobile = isBelow("m");
  return (
    <div className="flex flex-col gap-2 px-8 py-2.5 h-full">
      <div className="flex gap-8 items-center">
        <PageTitle title="Administration des formulaires de déclaration" />
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
      <FormsList />
    </div>
  );
}
