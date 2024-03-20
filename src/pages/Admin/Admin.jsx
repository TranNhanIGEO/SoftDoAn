import "./Admin.css";
import { TabRole } from "./components";
import { logOut } from "src/redux/request/authRequest";
import useAxiosJWT from "src/hooks/useAxiosJWT";
import { useDispatch } from "react-redux";

const Admin = () => {
  const axiosJWT = useAxiosJWT();
  const dispatch = useDispatch();

  const handleLogout = () => {
    logOut(axiosJWT, dispatch);
  };

  return (
    <div className="homepage">
      <div className="homepage-container">
        <TabRole />
        <button onClick={handleLogout} className="homepage-logout">
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Admin;
