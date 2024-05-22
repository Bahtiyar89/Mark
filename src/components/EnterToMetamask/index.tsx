import { Card, Text, UnstyledButton } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface Props {
  metamaskUninstalled?: boolean;
  connectMetamask?: () => void;
}

const EnterToMetamask = ({ metamaskUninstalled, connectMetamask }: Props) => {
  const [t, i18n] = useTranslation();

  return (
    <Card shadow="sm" p="lg" radius="lg" withBorder>
      {metamaskUninstalled ? (
        <UnstyledButton>
          <Text color="red" size="xl">
            {t("please_install_metamask")}
          </Text>
        </UnstyledButton>
      ) : (
        <UnstyledButton onClick={connectMetamask}>
          <Text color="red" size="xl">
            {t("please_login_to_metamask")}
          </Text>
        </UnstyledButton>
      )}
    </Card>
  );
};

export default EnterToMetamask;
