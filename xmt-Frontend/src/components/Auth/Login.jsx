import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { handleLogin } from "../../services/auth/authService";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/userContext";
import { Triangle } from "react-loader-spinner";
const Login = (props) => {
  const navigate = useNavigate();

  const { loginContext } = useContext(UserContext);

  const [valueLogin, setValueLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isValidInput, setIsValidInput] = useState({
    isValidValueLogin: true,
    isValidPassword: true,
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const isValid = () => {
    let check = true;
    let error = "";
    const validation = {
      isValidValueLogin: true,
      isValidPassword: true,
    };

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!valueLogin || !password) {
      validation.isValidPassword = false;
      validation.isValidValueLogin = false;
      check = false;
      error = "Please fill in all the fields";
    }

    if (!valueLogin || !valueLogin.match(emailRegex)) {
      validation.isValidValueLogin = false;
      check = false;
      error = "Your Email is invalid";
    }

    if (!password || password.length < 6) {
      validation.isValidPassword = false;
      check = false;
      error = "Your Password is invalid";
    }

    setIsValidInput(validation);

    if (!check && error) {
      toast.error(error);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setIsSubmit(true);
    try {
      if (!isValid) {
        return;
      }

      let check = isValid();

      if (check) {
        let res = await handleLogin(valueLogin, password);
        if (res.EC === 0) {
          let data = {
            isAuthenticated: true,
            token: res.DT.access_token,
            account: {
              id: res.DT.id,
              email: res.DT.email,
              displayName: res.DT.displayName,
              avatar: res.DT.avatar,
              groupWithRoles: res.DT.groupWithRoles,
            },
          };

          localStorage.setItem("jwt", res.DT.access_token);
          loginContext(data);

          toast.success(res.EM);
          navigate("/");
        } else {
          toast.error(res.EM);
        }
      }
    } catch (e) {
      console.log(">>>>>>>>>check error: ", e);
    } finally {
      setTimeout(() => {
        setIsSubmit(false);
      }, 3000);
    }
  };

  const handleEnter = (event) => {
    if (event.charCode === 13 && event.code === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex justify-center h-[calc(100vh-4rem)] pb-35 pt-10 px-90">
      <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 border border-white flex justify-center rounded-xl bg-white/10">
        <div className="mt-12 flex flex-col items-center">
          <h1 className="text-2xl xl:text-3xl font-extrabold">Login</h1>
          <div className="w-full flex-1 mt-8">
            <div className="mx-auto max-w-xs">
              <label className=" font-medium " htmlFor="valueLogin">
                Email:
              </label>
              <input
                className={`${isValidInput.isValidValueLogin ? "border-gray-200 " : "border-red-300 focus:border-red-500"} text-black w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border placeholder-gray-500 text-sm focus:outline-none  focus:bg-white mb-2`}
                type="text"
                placeholder="Email"
                name="valueLogin"
                value={valueLogin}
                onChange={(e) => setValueLogin(e.target.value)}
                onKeyPress={(e) => handleEnter(e)}
              />

              <div className="mt-5">
                <label className=" font-medium" htmlFor="password">
                  Password:
                </label>
                <input
                  className={`${isValidInput.isValidPassword ? "border-gray-200 " : "border-red-300 focus:border-red-500"} text-black w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border placeholder-gray-500 text-sm focus:outline-none  focus:bg-white mb-2`}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => handleEnter(e)}
                />
              </div>

              {!isSubmit ? (
                <button
                  onClick={() => handleSubmit()}
                  className="cursor-pointer mt-5 tracking-wide font-semibold bg-black text-gray-100 w-full 
                  py-4 rounded-lg hover:bg-white hover:text-black hover:shadow-2xl/30 hover:shadow-white transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <svg
                    className="w-6 h-6 -ml-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">Login</span>
                </button>
              ) : (
                <div className="flex flex-col justify-center items-center  gap-2">
                  <Triangle
                    visible={true}
                    color="#ffffff"
                    ariaLabel="triangle-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                  <span>Waiting -_-</span>
                </div>
              )}
              <p className="mt-6 text-xs  text-center flex gap-1 justify-center">
                Don't have an account?
                <Link
                  to="/register"
                  className="text-stroke-4 text-stroke-white font-bold text-black bg-white rounded-xl px-1 hover:underline cursor-pointer 
                  hover:bg-black hover:text-white hover:shadow-2xl/30 hover:shadow-red-900 hover:border"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
