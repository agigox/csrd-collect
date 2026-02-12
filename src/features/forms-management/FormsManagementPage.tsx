"use client";

import { Grid } from "@rte-ds/react";
import { FormsList } from "./FormsList";
import PageTitle from "@/lib/ui/page-title";

export default function AdminPageContent() {
  return (
    <Grid className="px-8 py-2.5 gap-2 h-full grid-rows-[64px_auto]">
      <Grid.Col xxs={12}>
        <PageTitle title="Administration des formulaires de déclaration" />
      </Grid.Col>
      <Grid.Col xxs={12}>
        <FormsList />
      </Grid.Col>
    </Grid>
  );
}
