import React, { useEffect, useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Cookies from "js-cookie";
import { Alert } from "../../../utils/Alert";
import { Auth } from "../../../utils/Controllers/Auth";

const Login = () => {
  const [login, setlogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [time, setTime] = useState("");

  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // REAL TIME CLOCK
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      setTime(`${h}:${m}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const { data } = await Auth.Login({ login, password });

      const user = data?.user;
      const tokens = data?.tokens;

      if (!user || !tokens) {
        Alert("Xatolik yuz berdi!", "error");
        return;
      }

      const { id, role, school_id } = user;
      const { access_token, refresh_token } = tokens;

      Cookies.set("uid", id);
      Cookies.set("school_id", school_id);
      Cookies.set("role", role);
      Cookies.set("token", access_token);
      Cookies.set("type", data?.user?.school?.type);
      Cookies.set("refresh_token", refresh_token);

      Alert("Muvaffaqiyatli!", "success");

      if (role === "superadmin") navigate("/superadmin/dashboard");
      else if (role === "owner") navigate("/owner/center");
      else if (role === "administrator") navigate("/admin/dashboard");
      else if (role === "teacher") navigate("/teacher/dashboard");
      else navigate("/dashboard");

    } catch (error) {
      Alert(error?.response?.data?.message || "Xatolik yuz berdi!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="
      min-h-screen 
      flex 
      flex-col 
      md:flex-row 
      items-center 
      justify-center 
      md:justify-start 
      md:items-stretch
    ">

      {/* LEFT SIDE — DESKTOP ONLY */}
      <div className="Login-bg hidden md:flex w-1/2 p-[30px] flex-col justify-between bg-gradient-to-br from-black to-indigo-700 text-white">
        <div>
          <h1 className="text-[40px] md:text-[60px] font-bold">{time}</h1>
        </div>

        <div className="p-[15px] md:p-[20px] rounded-[20px] md:rounded-[30px] bg-white/10 backdrop-blur-md shadow-lg">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Zamonaviy boshqaruv tizimi</h2>
          <p className="text-gray-100 text-sm md:text-base">
            Bizning platforma orqali jarayonlarni oson boshqaring.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE — CENTERED ON MOBILE */}
      <div className="
        w-full 
        md:w-1/2 
        flex 
        items-center 
        justify-center 
        p-6 md:p-10 
        bg-white
      ">
        <div className="
          w-full 
          max-w-md 
          bg-white 
          rounded-2xl md:rounded-3xl 
          shadow-xl md:shadow-2xl 
          p-6 md:p-10 
          border border-gray-100
        ">

          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Kirish</h1>
            <p className="mt-1 md:mt-2 text-gray-500 text-xs md:text-sm">
              Tizimga kirish uchun ma'lumotlaringizni kiriting
            </p>
          </div>

          <div className="space-y-6">
            <Input
              label="Login"
              type="text"
              value={login}
              onChange={(e) => setlogin(e.target.value)}
              placeholder="Loginni kiriting"
              crossOrigin={undefined}
            />

            <div className="relative">
              <Input
                label="Parol"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Parolni kiriting"
                crossOrigin={undefined}
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showPassword ? (
                  <VisibilityOffIcon className="h-5 w-5" />
                ) : (
                  <VisibilityIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <Button
              onClick={handleLogin}
              disabled={loading}
              ripple={true}
              className="w-full py-2 md:py-3"
            >
              {loading ? "Yuklanmoqda..." : "Kirish"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
