import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: `${apiUrl}/api/`,
  withCredentials: true,
});

export const setupAxiosInterceptors = (auth) => {
  axiosInstance.interceptors.request.use((config) => {
    const token = auth.current?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const res = await axios.post(
            `${apiUrl}/api/auth/refresh-token`,
            {},
            { withCredentials: true }
          );

          const newToken = res?.data?.token;
          auth.current.setAccessToken(newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios({
            ...originalRequest,
            headers: {
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
        } catch (refreshError) {
          auth.current.setAccessToken("");
          auth.current.setUserData(null);
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
