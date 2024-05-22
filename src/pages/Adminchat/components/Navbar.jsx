import avatar from "../../../assets/images/avatar.svg";

const Navbar = () => {
  return (
    <div className="navbar">
      <span className="logo">Admin Chat</span>
      <div className="user">
        <img src={avatar} alt="new" />
        <span>{"Admin Name"}</span>
      </div>
    </div>
  );
};

export default Navbar;
