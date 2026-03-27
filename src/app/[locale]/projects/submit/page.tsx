import { setRequestLocale } from "next-intl/server";
import { ProjectForm } from "@/components/projects/ProjectForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SubmitPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProjectForm />;
}
