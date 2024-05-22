import {
  Button,
  Card,
  Modal,
  TextInput,
  Group,
  Rating,
  FileInput,
} from "@mantine/core";

const AddReviewModal = ({ opened, handleOpened, form, onSubmit, t }: any) => {
  return (
    <Modal
      opened={opened}
      onClose={() => handleOpened(false)}
      title={t("adding_an_order")}
    >
      <Card style={{ marginTop: 20 }} shadow="sm" p="lg" radius="lg" withBorder>
        <form onSubmit={form.onSubmit((values: any) => onSubmit())}>
          <TextInput
            label={t("name")}
            name="name"
            {...form.getInputProps("name")}
          />
          <TextInput
            label={t("text")}
            name="text"
            value={form.values.rating}
            {...form.getInputProps("text")}
          />
          <FileInput
            placeholder="Pick file"
            name="image"
            {...form.getInputProps("image")}
            label={t("image")}
          />

          <Group mt={10}>
            <div>{t("rating")}:</div>
            <Rating
              name="rating"
              value={form.values.rating}
              {...form.getInputProps("rating")}
            />
          </Group>

          <Group position="right" mt="md">
            <Button type="submit">{t("save")}</Button>
          </Group>
        </form>
      </Card>
    </Modal>
  );
};

export default AddReviewModal;
