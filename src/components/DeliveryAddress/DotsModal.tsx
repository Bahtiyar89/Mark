import {
  Button,
  Card,
  Modal,
  TextInput,
  Group,
  NativeSelect,
  Textarea,
} from "@mantine/core";
import classes from "./style.module.css";

const DotsModal = ({
  dotsModal,
  handleShowEdit,
  handleShowDelete,
  handleOpened,
  t,
  add,
}: any) => {
  return (
    <Modal
      opened={dotsModal}
      onClose={() => handleOpened(false)}
      title="Редактирование адреса"
    >
      <Card
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
          alignContent: "center",
        }}
        shadow="sm"
        p="lg"
        radius="lg"
        withBorder
      >
        <Button
          onClick={() => handleShowEdit(add)}
          className={classes.edit_btn}
        >
          {t("edit")}
        </Button>
        <Button
          color="red"
          onClick={() => handleShowDelete(add)}
          className={classes.delete_btn}
        >
          {t("delete")}
        </Button>
      </Card>
    </Modal>
  );
};

export default DotsModal;
