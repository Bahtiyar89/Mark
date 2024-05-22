import {
  Button,
  Card,
  Modal,
  TextInput,
  Group,
  NativeSelect,
  Textarea,
} from "@mantine/core";

const AddAdressModal = ({
  opened,
  countries,
  handleOpened,
  form,
  onSubmit,
  handleAdresschange,
  t,
}: any) => {
  return (
    <Modal
      opened={opened}
      onClose={() => handleOpened(false)}
      title={t("adding_an_address")}
    >
      <Card style={{ marginTop: 20 }} shadow="sm" p="lg" radius="lg" withBorder>
        <form onSubmit={form.onSubmit((values: any) => onSubmit())}>
          <NativeSelect
            data={countries}
            label={t("choose_country")}
            name="country"
            onChange={(event) => handleAdresschange(event)}
          />
          <TextInput
            type="text"
            label={t("city")}
            name="city"
            {...form.getInputProps("city")}
            withAsterisk
          />
          <TextInput
            label={t("receiver_fio")}
            name="receiver_fio"
            {...form.getInputProps("receiver_fio")}
            withAsterisk
          />
          <TextInput
            label={t("receiver_phone")}
            name="receiver_phone"
            {...form.getInputProps("receiver_number")}
            withAsterisk
          />
          <Textarea
            name="address"
            label={t("adress")}
            {...form.getInputProps("address")}
            withAsterisk
          />

          <Group position="right" mt="md">
            <Button type="submit">{t("save")}</Button>
          </Group>
        </form>
      </Card>
    </Modal>
  );
};

export default AddAdressModal;
