import React from "react";
import { Menu, MenuItem } from "react-contextmenu";
import { Logout } from "lucide-react";

const UserMenu = ({ onLogout }) => {
  const [menuX, menuY] = [0, 0];

  const handleLogout = () => {
    onLogout();
  };

  return (
    <Menu
      onClose={onLogout}
      onItemClick={(item) => {
        if (item.key === "logout") {
          handleLogout();
        }
      }}
    >
      <MenuItem key="profile">Profile</MenuItem>
      <MenuItem key="settings">Settings</MenuItem>
      <MenuItem key="logout" role="separator" />
      <MenuItem key="logout" onClick={handleLogout}>
        Logout
      </MenuItem>
    </Menu>
  );
};

export default UserMenu;