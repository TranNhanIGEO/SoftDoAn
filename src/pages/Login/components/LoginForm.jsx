import "./LoginForm.css";
import { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "src/redux/request/authRequest";
import Button from "src/components/interfaces/Button/Button";
import {
  FormControl,
  FormLabel,
  FormPassword,
  FormText,
  FormValidate,
} from "src/components/interfaces/Form/Form";
import reducer, { initState } from "src/pages/Login/store/reducer";
import {
  setUsername,
  setPassword,
  setUsernameValidate,
  setPasswordValidate,
} from "src/pages/Login/store/actions";

const LoginForm = () => {
  const [state, dispatched] = useReducer(reducer, initState);
  const { username, password, usernameValidate, passwordValidate } = state;
  const getError = useSelector((state) => state.auth.login?.getError);
  const dispatch = useDispatch();

  useEffect(() => {
    getError?.type === "username" &&
      dispatched(setUsernameValidate(getError?.msg));
    getError?.type === "password" &&
      dispatched(setPasswordValidate(getError?.msg));
  }, [getError]);

  const handleSetUserName = (value) => {
    dispatched(setUsername(value));
    dispatched(setUsernameValidate(""));
  };

  const handleSetPassword = (value) => {
    dispatched(setPassword(value));
    dispatched(setPasswordValidate(""));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username && !password)
      return (
        dispatched(setUsernameValidate("Vui lòng nhập tài khoản")),
        dispatched(setPasswordValidate("Vui lòng nhập mật khẩu"))
      );
    if (!username)
      return dispatched(setUsernameValidate("Vui lòng nhập tài khoản"));
    if (!password)
      return dispatched(setPasswordValidate("Vui lòng nhập mật khẩu"));
    const infoUser = { username, password };
    loginUser(infoUser, dispatch);
  };
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={(e) => handleLogin(e)}>
        <h1 className="login-title">Đăng nhập tài khoản</h1>
        <FormControl>
          <FormLabel htmlFor="username">Tài khoản</FormLabel>
          <FormText
            id="username"
            name="username"
            placeholder="Nhập tên người dùng"
            value={username}
            onChange={(e) => handleSetUserName(e.target.value)}
          />
          {usernameValidate && <FormValidate>{usernameValidate}</FormValidate>}
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Mật khẩu</FormLabel>
          <FormPassword
            id="password"
            name="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => handleSetPassword(e.target.value)}
          />
          {passwordValidate && <FormValidate>{passwordValidate}</FormValidate>}
        </FormControl>
        <Button type="submit" className="login-submit">
          Đăng nhập
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
