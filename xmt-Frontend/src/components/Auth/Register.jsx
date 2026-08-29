import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { registerNewUser } from "../../services/auth/authService";
import { Triangle } from "react-loader-spinner";
const Register = (props) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isValidInput, setIsValidInput] = useState({
    isValidEmail: true,
    isValidDisplayName: true,
    isValidPassword: true,
  });

  const [isSubmit, setIsSubmit] = useState(false);

  const handleRegister = async () => {
    setIsSubmit(true);
    try {
      if (!isValid()) {
        return;
      }

      let check = isValid();

      if (check) {
        let res = await registerNewUser(email, password, displayName);
        console.log(">>>check res: ", res);
        if (res.EC === 0) {
          toast.success(res.EM);
          navigate("/login");
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

  const isValid = () => {
    const validation = {
      isValidEmail: true,
      isValidDisplayName: true,
      isValidPassword: true,
    };

    let check = true;
    let error = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const displayNameRegex =
      /^(?=.{3,24}$)(?=.*[\p{L}\p{N}])[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*(?: [\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*)*$/u;
    if (!email || !email.match(emailRegex)) {
      validation.isValidEmail = false;
      error = "Email is invalid";
      check = false;
    }

    if (!displayName || !displayName.match(displayNameRegex)) {
      validation.isValidDisplayName = false;
      if (check)
        error = "Display name is invalid, must be at least 3 to 16 characters";
      check = false;
    }

    if (!password || password.length < 6) {
      validation.isValidPassword = false;
      if (check) error = "Password must be at least 6 characters";
      check = false;
    } else if (password !== rePassword) {
      validation.isValidPassword = false;
      if (check) error = "Password do not match";
      check = false;
    }

    setIsValidInput(validation);

    if (!check && error) {
      toast.error(error);
    }

    return check;
  };

  const handleEnter = (event) => {
    if (event.charCode === 13 && event.code === "Enter") {
      handleRegister();
    }
  };

  return (
    <div className="flex justify-center h-[calc(100vh-4rem)] pb-35 pt-10 px-90">
      <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 border border-white flex justify-center rounded-xl bg-white/10">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl xl:text-3xl font-extrabold">Register</h1>
          <div className="w-full flex-1 mt-8">
            <div className="mx-auto max-w-xs">
              {/* Email */}
              <label className=" font-medium" htmlFor="email">
                Email:
              </label>
              <input
                className={`${isValidInput.isValidEmail ? "border-gray-200 " : "border-red-300 focus:border-red-500"}text-black w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border placeholder-gray-500 text-sm focus:outline-none  focus:bg-white mb-2`}
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* displayName */}
              <label className=" font-medium mt-5" htmlFor="displayName">
                Display name:
              </label>
              <input
                className={`${isValidInput.isValidDisplayName ? "border-gray-200 " : "border-red-300 focus:border-red-500"} text-black w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border placeholder-gray-500 text-sm focus:outline-none  focus:bg-white mb-2`}
                type="text"
                placeholder="Display name"
                id="displayName"
                name="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />

              {/* Password */}
              <label className=" font-medium mt-5" htmlFor="password">
                Password:
              </label>
              <input
                className={`${isValidInput.isValidPassword ? "border-gray-200 " : "border-red-300 focus:border-red-500"}text-black w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none  focus:bg-white mb-2`}
                type="password"
                placeholder="Password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Re-Password */}
              <label className=" font-medium mt-5" htmlFor="re-password">
                Re-Password:
              </label>
              <input
                className={`${isValidInput.isValidPassword ? "border-gray-200 " : "border-red-300 focus:border-red-500"}text-black w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none  focus:bg-white mb-2`}
                type="password"
                placeholder="Re-Password"
                id="re-password"
                name="re-password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                onKeyPress={(e) => handleEnter(e)}
              />

              {!isSubmit ? (
                <>
                  <button
                    onClick={() => handleRegister()}
                    className="cursor-pointer mt-5 tracking-wide font-semibold bg-black text-gray-100 w-full 
                  py-4 rounded-lg hover:bg-white hover:text-black hover:shadow-2xl/30 hover:shadow-white transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <svg
                      className="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span className="ml-3">Register</span>
                  </button>
                </>
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
                Already have an account?
                <Link
                  to="/login"
                  className="text-stroke-4 text-stroke-white font-bold text-black bg-white rounded-xl px-1 hover:underline cursor-pointer 
                  hover:bg-black hover:text-white hover:shadow-2xl/30 hover:shadow-red-900 hover:border"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
