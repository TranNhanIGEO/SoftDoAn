import { useDispatch, useSelector } from "react-redux";
import { getUser } from "src/redux/reducer/authSlice";
import { axiosJWT } from "src/utils/axiosConfig";
import { useEffect } from "react";
import { refreshToken } from "src/redux/request/authRequest";

const useAxiosJWT = () => {
  const currentUser = useSelector(getUser)
  const dispatch = useDispatch()
  useEffect(() => {
    const request = axiosJWT.interceptors.request.use(
      async (req) => {
        req.headers["Authorization"] = `Bearer ${currentUser?.accessToken}`;
        return req;
      },
      (err) => {
        return Promise.reject(err);
      }
    );
    const response = axiosJWT.interceptors.response.use(
      (res) => {
        return res
      }, 
      async (err) => {
        const prevReq = err.config;
        if (err.response?.status === 403 && !prevReq.sent) {
          prevReq.sent = true;
          await refreshToken({ currentUser, dispatch });
          return axiosJWT(prevReq);
        }
        return Promise.reject(err);
      })
    return () => {
      axiosJWT.interceptors.request.eject(request)
      axiosJWT.interceptors.response.eject(response)
    }
  }, [currentUser, dispatch])
  return axiosJWT;
};

export default useAxiosJWT;