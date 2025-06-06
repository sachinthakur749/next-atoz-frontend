import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal } from "antd";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import {
    MdLockOutline,
    MdOutlineMail,
    MdPhone,
    MdVisibility,
    MdVisibilityOff,
} from "react-icons/md";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useStepper } from "../../context/StepperContext";
import { IoIosEyeOff, IoMdEye } from "react-icons/io";
import { TiUser } from "react-icons/ti";
import { IoCloudUploadOutline } from "react-icons/io5";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuthContext } from "@/context/AuthProvider";
import { postRequest } from "@/lib/postRequest";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Button } from "../ui/Button";


interface LoginModalProps {
    open: boolean;
    handleClose: () => void;
}

interface RegisterModalContentProps {
    ProductName: string;
    open: boolean;
    handleSwitch: () => void;
    handleClose: (value: boolean) => void;
}


export const LoginModal = ({ open, handleClose }: LoginModalProps) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const { productInfo } = useAuthContext();

    const handleSwitch = () => {
        setIsRegistering((prev) => !prev);
    };

    return (
        <Modal
            centered
            open={open}
            footer={null}
            onCancel={handleClose}
            closable={false}
            className="w-[400px]"
        >
            <div className="relative w-full h-full overflow-hidden">
                <div
                    className="flex w-[200%] transition-transform duration-500 ease-in-out"
                    style={{
                        transform: isRegistering ? "translateX(-50%)" : "translateX(0%)",
                    }}
                >
                    <div className="w-1/2 flex-shrink-0 p-4">
                        <LoginModalContent
                            ProductName={productInfo?.name}
                            open={open}
                            handleSwitch={handleSwitch}
                            handleClose={handleClose}
                        />
                    </div>

                    <div className="w-1/2 flex-shrink-0 p-4">
                        <RegisterModalContent
                            ProductName={productInfo?.name}
                            open={open}
                            handleSwitch={handleSwitch}
                            handleClose={handleClose}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default LoginModal;

export const LoginModalContent = ({
    open,
    handleClose,
    handleSwitch,
    ProductName,
}: RegisterModalContentProps) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const { setPassengerIdentity } = useAuthContext();
    const { nextStep, prevStep, currentStep, steps } = useStepper();
    const { addItem } = useLocalStorage();
    const [displayPassword, setDisplayPassword] = useState(false);
    const [authErrorMessage, setAuthErrorMessage] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);

    const defaultValues = {
        email: "",
        password: "",
    };

    const {
        handleSubmit,
        control,
        setValue,
        setFocus,
        formState: { errors },
    } = useForm(defaultValues);

    const togglePasswordVisibility = () => {
        setDisplayPassword((prev) => !prev);
    };

    useEffect(() => {
        const storedEmail = localStorage.getItem("rememberMeEmail");
        if (storedEmail) {
            setValue("email", storedEmail);
            setRememberMe(true);
        }
    }, [setValue]);

    useEffect(() => {
        if (open) {
            setFocus("email");
        }
    }, [open, setFocus]);

    const onSubmit = async (data) => {
        setAuthErrorMessage("");
        try {
            setIsPending(true);
            const formData = new FormData();
            formData.append("email", data?.email);
            formData.append("password", data?.password);

            const response = await postRequest("passenger/login", formData);
            setIsPending(false);
            localStorage.setItem("user_type", "passenger");

            if (!response.data.is_provisional) {
                addItem("passenger_user", JSON.stringify(response?.data));
                addItem("passenger_api_token", response?.data?.api_token);
                setPassengerIdentity(response?.data?.identity);
                setUserLocale(response?.data?.identity, i18n.changeLanguage);
                handleClose();
                nextStep();
                if (rememberMe) {
                    localStorage.setItem("rememberMeEmail", data?.email);
                } else {
                    localStorage.removeItem("rememberMeEmail");
                }
            } else {
                setAuthErrorMessage("Invalid credentials");
            }
        } catch (error) {
            setIsPending(false);
            setAuthErrorMessage(error?.response?.data?.message);
        }
    };
    return (
        <>
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-left text-gray-800">
                    {t("login_to_continue")}
                </h2>
                <p className="text-sm text-left text-gray-500">
                    {t("transportation_description", { ProductName })}
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <div>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: t("field_required", { field: t("email") }),
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: `${t("invalid")} ${t("email")}`,
                                },
                            }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="email"
                                    placeholder={t("enter_field", {
                                        field: t("email"),
                                    })}
                                    className="w-full p-3 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange"
                                />
                            )}
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm">
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    <div className="relative">
                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: t("field_required", {
                                    field: t("password"),
                                }),
                            }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type={displayPassword ? "text" : "password"}
                                    placeholder={t("enter_field", {
                                        field: t("password"),
                                    })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange"
                                />
                            )}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-[50%] translate-y-[-50%] text-gray-400 cursor-pointer"
                        >
                            {displayPassword ? (
                                <MdVisibilityOff size={20} />
                            ) : (
                                <MdVisibility size={20} />
                            )}
                        </button>
                        {errors.password && (
                            <span className="text-red-500 text-sm">
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember-me"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label className="ml-2 block text-sm" htmlFor="remember-me">
                                {t("remember_me")}
                            </label>
                        </div>
                        <button
                            type="button"
                            onClick={() => setForgotPasswordModalOpen(true)}
                            className="text-sm text-blue-500 hover:underline"
                        >
                            {t("forgot_your_password")}
                        </button>
                    </div>

                    {authErrorMessage && (
                        <p className="text-red-500 text-sm italic">{authErrorMessage}</p>
                    )}

                    <Button
                        type="submit"
                        loading={isPending}
                        disabled={isPending}
                        className="!h-[71px] !text-[18px]  font-medium"
                    >
                        {t("login")}
                    </Button>
                </form>

                <div className="text-center text-sm text-gray-500">
                    {t("dont_have_an_account")} {"    "}
                    <button
                        onClick={handleSwitch}
                        className="text-black font-medium hover:underline"
                    >
                        {t("register")} {t("now")}
                    </button>
                </div>

                {/* <div className="flex items-center gap-2">
          <hr className="flex-grow border-gray-300" />
          <span className="text-gray-500 text-sm">Or</span>
          <hr className="flex-grow border-gray-300" />
        </div> */}

                {/* <button className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-100">
          <FaApple className="text-xl" />
          Login with Apple
        </button>

        <button className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-100">
          <FcGoogle className="text-xl" />
          Login with Google
        </button> */}
            </div>
            <ForgotPasswordModal
                user_type="passenger"
                open={forgotPasswordModalOpen}
                handleClose={() => setForgotPasswordModalOpen(false)}
            />
        </>
    );
};



export const RegisterModalContent = ({
    handleSwitch,
    ProductName,
    handleClose,
}: RegisterModalContentProps) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const recaptchaRef = useRef(null);
    const queryParams = useQueryParams();
    const { addItem } = useLocalStorage();
    const { setPassengerIdentity } = useAuthContext();
    const [captchaToken, setCaptchaToken] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [authError, setAuthError] = useState("");
    const [displayPassword, setDisplayPassword] = useState(false);
    const [blobURL, setBlobURL] = useState();
    const [file, setFile] = useState();

    const defaultValues = {
        uid: "",
        phone: "",
        name: "",
        email: "",
        image: "",
    };

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm(defaultValues);

    useEffect(() => {
        const storedPhoneNumber = localStorage.getItem("phoneNumber");
        if (storedPhoneNumber) {
            setValue("phone", storedPhoneNumber);
        }
    }, []);

    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setBlobURL(imageUrl);
            setFile(selectedFile);
        }
    }

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
    };

    const togglePasswordVisibility = () => {
        setDisplayPassword((prev) => !prev);
    };

    const onSubmit = async (data) => {
        setAuthError("");
        try {
            if (!captchaToken) return null;

            setIsPending(true);

            const formData = new FormData();
            formData.append("type", "personal");
            formData.append("phone", data.phone);
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("password", data.password);

            if (captchaToken) {
                formData.append("google_captcha_token", captchaToken);
            }

            if (file) {
                formData.append("image", file);
            }

            const response = await postRequest("passenger/register-v2", formData);
            addItem("passenger_user", JSON.stringify(response.data));
            addItem("passenger_api_token", response.data.api_token);
            addItem("user_type", "passenger");
            setPassengerIdentity(response.data.identity);
            setUserLocale(response?.data?.identity, i18n.changeLanguage);
            handleClose(false);
        } catch (error) {
            recaptchaRef.current?.reset();
            setCaptchaToken(null);
            setAuthError(error.response?.data?.message || "An error occurred");
            setIsPending(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-left text-gray-800">
                    {t("register_to_get_started")}
                </h2>
                <BsArrowLeftCircle
                    onClick={handleSwitch}
                    className="text-[#333333] hover:scale-[0.9] transition-transform duration-400 ease-in-out cursor-pointer"
                    size={30}
                />
            </div>
            <p className="text-sm text-left text-gray-500">
                {t("register_tagline", { ProductName })}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                {/* Profile Image Upload */}
                <div className="relative">
                    {blobURL ? (
                        <div className="w-[80px] h-[80px] relative">
                            <div
                                onClick={() => {
                                    setBlobURL("");
                                    setFile(null);
                                }}
                                className="absolute top-0 right-0 w-[25px] h-[25px] bg-gray-200 rounded-full border border-gray-400 flex items-center justify-center cursor-pointer"
                            >
                                ×
                            </div>
                            <img
                                src={blobURL}
                                alt="Uploaded"
                                className="w-full h-full rounded-full border border-primary object-cover"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 cursor-pointer w-full p-3 border border-gray-300 rounded-lg">
                            <IoCloudUploadOutline className="text-xl text-gray-400" />
                            <label htmlFor="upload-image" className="text-sm text-gray-600">
                                {t("upload_profile_image")}
                            </label>
                            <input
                                id="upload-image"
                                type="file"
                                accept=".pdf,image/jpeg,image/png,image/jpg"
                                onChange={handleFileChange}
                                hidden
                            />
                        </div>
                    )}
                </div>

                {[
                    {
                        name: "name",
                        placeholder: "Name",
                        icon: <TiUser size={20} className="text-gray-400" />,
                    },
                    {
                        name: "email",
                        placeholder: "Email Address",
                        icon: <MdOutlineMail size={20} className="text-gray-400" />,
                    },
                    {
                        name: "password",
                        placeholder: "Password",
                        icon: <MdLockOutline size={20} className="text-gray-400" />,
                    },
                ].map(({ name, placeholder, icon }) => (
                    <div key={name} className="relative">
                        <Controller
                            name={name}
                            control={control}
                            rules={{
                                required: `${t("field_required", {
                                    field: t(name),
                                })}`,
                            }}
                            render={({ field }) => (
                                <div className="relative flex items-center border border-gray-300 rounded-lg p-3 group focus-within:ring-2 focus-within:ring-primaryOrange">
                                    {icon}
                                    <input
                                        {...field}
                                        type={
                                            name === "password" && displayPassword
                                                ? "text"
                                                : name === "password"
                                                    ? "password"
                                                    : "text"
                                        }
                                        placeholder={`${t("enter_field", {
                                            field: t(name),
                                        })}`}
                                        className="w-full ml-2 bg-transparent focus:outline-none"
                                    />
                                    {name === "password" && (
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                                        >
                                            {displayPassword ? <IoIosEyeOff /> : <IoMdEye />}
                                        </button>
                                    )}
                                </div>
                            )}
                        />
                        {errors[name] && (
                            <span className="text-red-500 text-sm mt-1">
                                {errors[name].message}
                            </span>
                        )}
                    </div>
                ))}

                {/* Phone Input */}
                <div className="relative booking-phone-number-input">
                    <Controller
                        name="phone"
                        control={control}
                        rules={{
                            required: `${t("field_required", {
                                field: t("phone"),
                            })}`,
                        }}
                        render={({ field }) => (
                            <div className="flex items-center border border-gray-300 rounded-lg p-3 group focus-within:ring-2 focus-within:ring-primaryOrange">
                                {/* <MdPhone className="text-gray-400" /> */}
                                <PhoneInput
                                    {...field}
                                    country="us"
                                    value={field.value}
                                    onChange={(phone) => field.onChange("+" + phone)}
                                    inputClass="w-full ml-2  bg-white border-none focus:outline-none"
                                />
                            </div>
                        )}
                    />
                    {errors.phone && (
                        <span className="text-red-500 text-sm mt-1">
                            {errors.phone.message}
                        </span>
                    )}
                </div>

                <div>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA ?? ""}
                        onChange={handleCaptchaChange}
                    />
                </div>

                {/* Auth Error */}
                {authError && (
                    <p className="text-red-500 text-sm italic text-center">{authError}</p>
                )}

                <Button
                    type="submit"
                    loading={isPending}
                    disabled={isPending || !captchaToken}
                    className="!h-[71px] !text-[18px]  font-medium"
                >
                    {t("register")} {t("now")}
                </Button>
            </form>

            <div className="text-center  text-sm text-gray-500">
                {t("already_have_an_account")}
                <button
                    onClick={handleSwitch}
                    className="text-black ml-1 font-medium hover:underline"
                >
                    {t("login")} {t("now")}
                </button>
            </div>
        </div>
    );
};
