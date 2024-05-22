import { useState } from "react";
import {
  Button,
  Card,
  Grid,
  Image,
  Modal,
  Pagination,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import moment from "moment";
import { CRating } from "components";
import { IconMessage } from "@tabler/icons";
import style from "./style.module.css";

const { REACT_APP_BASE_URL } = process.env;

const ProductReview = ({
  t,
  commitSubmit,
  commit,
  handleCommitChange,
  product_review,
  handleReview,
  handleChangePage,
  can_review,
}: any) => {
  const [showMore, setShowMore] = useState("");
  const [opened, setOpened] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [errorComment, setErrorComment] = useState("");
  const [reviewId, setReviewId] = useState("");

  const handlePagination = () => {
    if (product_review.count >= 8) {
      return (
        <Pagination
          pb={40}
          total={Math.round(product_review.count / 8)}
          position="center"
          onChange={(val) => handleChangePage(val)}
          styles={(theme) => ({
            item: {
              "&[data-active]": {
                backgroundImage: theme.fn.gradient({
                  from: "red",
                  to: "yellow",
                }),
                background: "transparent",
                borderRadius: "0px",
                borderWidth: "0px",
                color: "black",
              },
              background: "transparent",
              borderRadius: "0px",
              borderWidth: "0px",
              color: "grey",
            },
          })}
        />
      );
    } else return;
  };

  const subreviews = (subreviews: any) => {
    if (subreviews.length >= 1) {
      return subreviews?.map((subreview: any, idx: number) => {
        return (
          <div style={{ padding: 3 }}>
            <p style={{ fontSize: 12 }}>{subreview.name}</p>
            <p style={{ fontSize: 12 }}>{subreview.text}</p>
            <hr />
          </div>
        );
      });
    }
  };

  const handleShowMore = (review: any) => {
    if (review.subreviews.length) {
      if (showMore == review.id) {
        return (
          <div>
            <UnstyledButton
              onClick={() => setShowMore("")}
              style={{
                paddingBottom: 10,
                fontSize: 12,
                color: "#228BE6",
              }}
            >
              {t("answers_less")}
            </UnstyledButton>
          </div>
        );
      } else {
        return (
          <div>
            <UnstyledButton
              onClick={() => setShowMore(review.id)}
              style={{
                paddingBottom: 10,
                fontSize: 12,
                color: "#228BE6",
              }}
            >
              {t("answers_more")}
            </UnstyledButton>
          </div>
        );
      }
    }
  };

  const handleCommitOpened = () => {
    if (commit.name.length > 3 && commit.text.length > 3) {
      commitSubmit(reviewId);
      setOpened(!opened);
    } else {
      if (commit.name.length < 3) {
        setErrorName(t("enter_name"));
      } else if (commit.text.length < 3) {
        setErrorComment(t("enter_text"));
      }
    }
  };

  return (
    <>
      <h3 style={{ paddingTop: 10, paddingBottom: 10 }}>{t("reviews")}</h3>

      <Grid style={{ marginBottom: 20 }}>
        {product_review?.results?.map((review: any, idx: number) => {
          console.log("11:", review);

          return (
            <Grid.Col md={6} lg={6}>
              <Card style={{ padding: 20 }} shadow="sm" radius="md" withBorder>
                <div className={style.comment_first_row}>
                  {review.image === null ? (
                    <h3 className={style.comment_first_row_name_short}>
                      {t("picture")}
                    </h3>
                  ) : (
                    <div style={{ width: 40 }}>
                      <Image
                        radius="md"
                        src={`${REACT_APP_BASE_URL + review.image}`}
                        alt="image"
                      />
                    </div>
                  )}

                  <div style={{ paddingLeft: 10 }}>
                    <p style={{ fontSize: 12 }}>
                      {review?.name}{" "}
                      <span style={{ color: "grey", fontSize: 12 }}>
                        {moment(review?.created_at).format("DD.MM.YYYY")}
                      </span>
                    </p>

                    <CRating value={review.rating} size={"xs"} />
                  </div>
                </div>
                <p style={{ fontSize: 12 }}>{review.text}</p>
                <UnstyledButton
                  onClick={() => {
                    setOpened(!opened);
                    setReviewId(review.id);
                  }}
                  style={{
                    paddingBottom: 10,
                    fontSize: 12,
                    color: "#228BE6",
                  }}
                >
                  {t("answer")}
                </UnstyledButton>
                {handleShowMore(review)}
                {showMore == review.id && subreviews(review.subreviews)}
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>

      {can_review && (
        <Button
          onClick={handleReview}
          mt={20}
          mb={20}
          bg={"#FA0100"}
          variant="filled"
          fullWidth
        >
          {t("leave_feedback")}
        </Button>
      )}
      {handlePagination()}

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Добавть отзыв!"
        overlayOpacity={0.3}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TextInput
            label="Имя и Фамилия"
            name="name"
            onChange={(val) => {
              handleCommitChange(val);
              setErrorName("");
            }}
            value={commit.name}
            error={errorName}
          />

          <TextInput
            label="Комментария"
            name="text"
            rightSection={<IconMessage size={16} />}
            onChange={(val) => {
              handleCommitChange(val);
              setErrorComment("");
            }}
            value={commit.text}
            error={errorComment}
          />

          <Button
            onClick={() => handleCommitOpened()}
            style={{ marginTop: 10, alignSelf: "end" }}
          >
            Отправить
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ProductReview;
