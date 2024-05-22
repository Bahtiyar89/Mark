import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";

const Sidebar = ({ handleUser, sideBarUsers }) => {
  return (
    <div className="sidebar">
      <Navbar />
      <Search />
      <Chats sideBarUsers={sideBarUsers} handleUser={handleUser} />
    </div>
  );
};

export default Sidebar;
