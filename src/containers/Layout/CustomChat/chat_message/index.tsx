import classnames from "classnames";
import "./chat_message.css";
import moment from "moment";
const { REACT_APP_BASE_URL } = process.env;

const ChatMessage = ({
  timestamp,
  message,
  is_support_message,
  file,
  image_url,
}: any) => {
  return (
    <div
      className={classnames("chat-message", {
        "is-same-origin": !is_support_message,
      })}
    >
      <div className="chat-message__item__timestamp">
        {moment(timestamp).format("DD.MM.YYYY")}
      </div>
      <div className="chat-message__item">
        <span className="chat-message__item__text">
          {message}
          {image_url && (
            <img
              height={"200px"}
              alt="preview image"
              src={`${REACT_APP_BASE_URL}.${image_url}`}
            />
          )}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
