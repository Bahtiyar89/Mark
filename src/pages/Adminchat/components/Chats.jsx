import avatar from "../../../assets/images/avatar.svg";

const Chats = ({ handleUser, sideBarUsers }) => {
  return (
    <div className="chats">
      {sideBarUsers?.map((chat, index) => {
        return (
          <div
            className="userChat"
            key={index}
            onClick={() => handleUser(chat)}
          >
            <img src={avatar} alt="new" />
            <div className="userChatInfo">
              <span>{chat?.username}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chats;
