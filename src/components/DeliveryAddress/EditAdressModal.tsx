import {
  Button,
  Card,
  Modal,
  TextInput,
  Group,
  NativeSelect,
  Textarea,
} from "@mantine/core";

const EditAdressModal = ({
  opened,
  countries,
  form,
  handleOpened,
  t,
  onSubmit,
  handleAdresschange,
}: any) => {
  return (
    <Modal
      opened={opened}
      onClose={() => handleOpened(false)}
      title="Редактирование адреса"
    >
      <Card style={{ marginTop: 20 }} shadow="sm" p="lg" radius="lg" withBorder>
        <form onSubmit={form.onSubmit((values: any) => onSubmit())}>
          <NativeSelect
            data={countries}
            label="Выберите страну"
            name="country"
            onChange={(event) => handleAdresschange(event)}
            value={form.values.country}
          />
          <TextInput
            label="Город"
            name="city"
            value={form.city}
            {...form.getInputProps("city")}
          />
          <TextInput
            label={t("receiver_fio")}
            name="receiver_fio"
            {...form.getInputProps("receiver_fio")}
          />
          <TextInput
            label={t("receiver_phone")}
            name="receiver_phone"
            {...form.getInputProps("receiver_number")}
          />
          <Textarea
            name="address"
            label="Адрес"
            withAsterisk
            value={form.address}
            {...form.getInputProps("address")}
          />

          <Group position="right" mt="md">
            <Button type="submit">Сохранить</Button>
          </Group>
        </form>
      </Card>
    </Modal>
  );
};

export default EditAdressModal;
