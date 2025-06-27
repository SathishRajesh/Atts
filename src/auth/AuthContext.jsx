import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import axiosInstance, { setupAxiosInterceptors } from "../api/axiosSetup";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate(); 
  const [accessToken, setAccessToken] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;


  const Logout = useCallback(async () => {
    try {
      await axios.post(
        `${apiUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setAccessToken("");
      setUserData(null);
      axiosInstance.defaults.headers.common.Authorization = "";
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${apiUrl}/api/auth/refresh-token`,
        {},
        { withCredentials: true }
      );

      const token = res?.data?.token || "";
      const user = res?.data?.user || null;

      setAccessToken(token);
      setUserData(user);

      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } catch (err) {
      if (err?.response?.status === 401) {
      console.warn("Unauthorized. Redirecting to login...");
      navigate("/login", { replace: true });
    }

    } finally {
      setLoading(false);
    }
  }, []);

  const authRef = useRef({
    accessToken: accessToken,
    setAccessToken: setAccessToken,
    setUserData: setUserData,
    Logout: Logout,
  });

  useEffect(() => {
    authRef.current.accessToken = accessToken;
    authRef.current.setAccessToken = setAccessToken;
    authRef.current.setUserData = setUserData;
    authRef.current.Logout = Logout;
  }, [accessToken, userData, Logout, setAccessToken, setUserData]);

  useEffect(() => {
    setupAxiosInterceptors(authRef);
  }, []);

  useEffect(() => {
    refreshToken();
  }, [refreshToken]);

  const LoginFunc = useCallback(
    async (data) => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${apiUrl}/api/auth/login`,
          data,
          {
            withCredentials: true,
          }
        );

        const token = response?.data?.token || "";
        const user = response?.data?.user || null;
        setAccessToken(token);
        setUserData(user);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
        setLoading(false);

        return !!(token && user);
      } catch (error) {
        Swal.fire("Faild!","Invalid Credentials.", "Failed");
        setAccessToken("");
        setUserData(null);
        axiosInstance.defaults.headers.common.Authorization = "";
        setLoading(false);
        return false;
      }
    },
    [setAccessToken, setUserData, setLoading]
  );

  const isValidUser = !!accessToken && !!userData;

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userData,
        isValidUser,
        Login: LoginFunc,
        Logout,
        refreshToken,
        loading,
      }}
    >
      {!loading ? (
        children
      ) : (
        <div className="p-6 flex items-center justify-center text-xl font-semibold">
          Authenticating...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
