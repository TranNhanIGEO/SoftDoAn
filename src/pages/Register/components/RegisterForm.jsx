import "./RegisterForm.css";
import { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "src/redux/request/authRequest";
import Button from "src/components/interfaces/Button/Button";
import reducer, { initState } from "src/pages/Register/store/reducer";
import {
  setEmail,
  setConfirmPassword,
  setPassword,
  setUsername,
  setUsernameValidate,
  setPasswordValidate,
  setConfirmPasswordValidate,
  setEmailValidate,
} from "src/pages/Register/store/actions";
import {
  FormControl,
  FormLabel,
  FormPassword,
  FormText,
  FormValidate,
} from "src/components/interfaces/Form/Form";

const RegisterForm = () => {
  const [state, dispatched] = useReducer(reducer, initState);
  const {
    username,
    password,
    confirmPassword,
    email,
    usernameValidate,
    passwordValidate,
    confirmPasswordValidate,
    emailValidate,
  } = state;
  const getError = useSelector((state) => state.auth.register?.getError);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getError?.type === "username" &&
      dispatched(setUsernameValidate(getError?.msg));
    getError?.type === "email" && dispatched(setEmailValidate(getError?.msg));
  }, [getError]);

  const handleSetUserName = (value) => {
    dispatched(setUsername(value));
    dispatched(setUsernameValidate(""));
  };

  const handleSetPassword = (value) => {
    dispatched(setPassword(value));
    dispatched(setPasswordValidate(""));
  };

  const handleSetConfirmPassword = (value) => {
    dispatched(setConfirmPassword(value));
    dispatched(setConfirmPasswordValidate(""));
  };

  const handleSetEmail = (value) => {
    dispatched(setEmail(value));
    dispatched(setEmailValidate(""));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username && !password && !confirmPassword && !email)
      return (
        dispatched(setUsernameValidate("Vui lòng nhập tài khoản")),
        dispatched(setPasswordValidate("Vui lòng nhập mật khẩu")),
        dispatched(
          setConfirmPasswordValidate("Vui lòng nhập mật khẩu xác nhận")
        ),
        dispatched(setEmailValidate("Vui lòng nhập email"))
      );
    if (!username)
      return dispatched(setUsernameValidate("Vui lòng nhập tài khoản"));
    if (!password)
      return dispatched(setPasswordValidate("Vui lòng nhập mật khẩu"));
    if (password !== confirmPassword)
      return dispatched(
        setConfirmPasswordValidate("Mật khẩu xác nhận không khớp")
      );
    if (!email) return dispatched(setEmailValidate("Vui lòng nhập email"));
    const newUser = { username, password, email };
    registerUser(newUser, dispatch, navigate);
  };
  return (
    <div className="register-container">
      <form className="register-form" onSubmit={(e) => handleRegister(e)}>
        <h1 className="register-title">Đăng ký tài khoản</h1>
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
        <FormControl>
          <FormLabel htmlFor="confirmpassword">Xác nhận mật khẩu</FormLabel>
          <FormPassword
            id="confirmpassword"
            name="confirmpassword"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => handleSetConfirmPassword(e.target.value)}
          />
          {confirmPasswordValidate && (
            <FormValidate>{confirmPasswordValidate}</FormValidate>
          )}
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <FormText
            id="email"
            name="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => handleSetEmail(e.target.value)}
          />
          {emailValidate && <FormValidate>{emailValidate}</FormValidate>}
        </FormControl>
        <Button type="submit" className="register-submit">
          Đăng ký
        </Button>
      </form>
      <div className="register-to-login">
        <p>Bạn đã có tài khoản?</p>
        <Link to="/admin/login" className="register-link-login">
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
