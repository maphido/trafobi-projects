import { setRequestLocale } from "next-intl/server";
import { RegisterForm } from "@/components/auth/RegisterForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <RegisterForm />
    </div>
  );
}
