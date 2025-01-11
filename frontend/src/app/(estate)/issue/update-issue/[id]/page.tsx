import IssueUpdateForm from "@/components/forms/issue/IssueUpdateForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estate Care | Edit Issue",
  description:
    "Update the details of the issue you've reported, including its status and priority. Ensure your information is accurate to help us address the issue efficiently.",
};

interface ParamsProps {
  params: {
    id: string;
  };
}

export default async function IssueUpdatePage({ params }: ParamsProps) {
  return (
    <div>
      <IssueUpdateForm params={params} />
    </div>
  );
}
