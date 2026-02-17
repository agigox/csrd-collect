"use client";
import { Divider } from "@rte-ds/react";

interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <div className="flex flex-col gap-2 w-fit py-3">
      <div className="flex items-center justify-between">
        <div className="heading-m">{title}</div>
      </div>
      <Divider
        appearance="default"
        endPoint="round"
        orientation="horizontal"
        thickness="medium"
      />
    </div>
  );
};
export default PageTitle;
