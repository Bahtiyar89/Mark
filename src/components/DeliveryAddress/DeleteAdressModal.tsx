import { Button, Card, Modal, Group, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface Props {
  visible: boolean;
  deleteAdress: any;
  handleOpened?: (item: any) => boolean;
  onSubmitDelete?: (item: any) => number;
}

const DeleteAdressModal = ({
  visible,
  deleteAdress,
  handleOpened,
  onSubmitDelete,
}: any) => {
  const [t, i18n] = useTranslation();
  return (
    <Modal
      opened={visible}
      onClose={() => handleOpened(false)}
      title={t("deleting_an_adress")}
      color="red"
    >
      <Card style={{ marginTop: 20 }} shadow="sm" p="lg" radius="lg" withBorder>
        <Text align="center" size={"xl"}>
          {t("city")}: {deleteAdress.city}
        </Text>
        <Text align="center" size={"xl"}>
          {t("adress")} : {deleteAdress.address}
        </Text>
        <Group position="right" mt="md">
          <Button
            onClick={() => onSubmitDelete(deleteAdress.id)}
            color="red"
            type="submit"
          >
            {t("delete")}
          </Button>
        </Group>
      </Card>
    </Modal>
  );
};

export default DeleteAdressModal;
