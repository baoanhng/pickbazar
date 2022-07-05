import LoginForm from "@components/auth/login-form";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { ROUTES } from "@utils/routes";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getAuthCredentials, isAuthenticated } from "@utils/auth-utils";
import { useRouter } from "next/router";
import AuthPageLayout from "@components/layouts/auth-layout";

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ["common", "form"])),
  },
});

export default function LoginPage() {
  const router = useRouter();
  const { token, permissions } = getAuthCredentials();
  if (isAuthenticated({ token, permissions })) {
    router.replace(ROUTES.DASHBOARD);
  }
  const { t } = useTranslation("common");

  return (
    <AuthPageLayout>
      <h3 className="text-center text-base italic text-body mb-6 mt-4">
        {t("admin-login-title")}
      </h3>
      <LoginForm />
    </AuthPageLayout>
  );
}
