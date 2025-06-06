import React, { ReactNode, useState } from "react";
import { Controller, RegisterOptions, useForm } from "react-hook-form";
import { MdEmail, MdSubject } from "react-icons/md";
import { RiMessage3Fill } from "react-icons/ri";
import { GoPersonFill } from "react-icons/go";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Button } from "./ui/Button";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { postRequest } from "@/lib/postRequest";

interface ContactFormDataTypes {
    name: string;
    email: string;
    comment: string;
    subject: string;
    google_captcha_token: string;
}

type ContactFormField = {
    name: keyof ContactFormDataTypes;
    icon: ReactNode;
    label: string;
    placeholder: string;
    rules?: RegisterOptions<ContactFormDataTypes, keyof ContactFormDataTypes>;
    type: "text" | "textarea";
};

const ContactForm = () => {
    const t = useTranslations();
    const defaultValues: ContactFormDataTypes = {
        name: "",
        email: "",
        comment: "",
        subject: "",
        google_captcha_token: "",
    };

    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<ContactFormDataTypes>({ defaultValues, mode: "onBlur" });

    const handleCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);
    };

    const { isPending, mutate } = useMutation({
        mutationFn: async (data: Record<string, any>) => {
            return postRequest("contact-us", data);
        },
        onSuccess: (data) => {
            toast.success(data.response.title, {
                description: data.response.message,
            })
            reset();
        },
        onError: (data) => {
            console.log(data)
            toast.error(data.message || "An error occurred",)
            // toast.success(data.response.title, {
            //     description: data.response.message,
            // })
            // ShowToast({
            //     type: "error",
            //     placement: "topRight",
            //     message: data?.response?.data?.message,
            //     description: null,
            //     duration: null,
            // });
        },
    });

    const onSubmit = async (data: ContactFormDataTypes) => {
        if (!captchaToken) {
            toast.error(t("please_complete_captcha"))
            return;
        }
        const payload = {
            ...data,
            google_captcha_token: captchaToken,
        };
        mutate(payload);
    };

    const formFields: ContactFormField[] = [
        {
            name: "name",
            icon: <GoPersonFill size={25} className="text-[18px] text-[#64666b]" />,
            label: t("name"),
            placeholder: `${t("enter")}  ${t("name")} `,
            rules: {
                required: t("field_required", { field: t("name") }),
                minLength: {
                    value: 3,
                    message: t("min_length", { field: t("name"), length: 3 }),
                },
            },
            type: "text",
        },
        {
            name: "email",
            icon: <MdEmail size={25} className="text-[18px] text-[#64666b]" />,
            label: t("email"),
            placeholder: `${t("enter")}  ${t("email")} `,
            rules: {
                required: t("field_required", { field: t("email") }),
                pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: `${t("invalid")}  ${t("email")} `,
                },
            },
            type: "text",
        },
        {
            name: "subject",
            icon: <MdSubject size={25} className="text-[18px] text-[#64666b]" />,
            label: t("subject"),
            placeholder: `${t("enter")}  ${t("subject")} `,
            rules: {
                required: t("field_required", { field: t("subject") }),
            },
            type: "text",
        },
        {
            name: "comment",
            icon: <RiMessage3Fill size={25} className="text-[18px] text-[#64666b]" />,
            label: t("message"),
            placeholder: `${t("enter")}  ${t("message")} `,
            rules: {
                required: t("field_required", { field: t("message") }),
                minLength: {
                    value: 10,
                    message: t("min_length", { field: t("message"), length: 10 }),
                },
            },
            type: "textarea",
        },
    ];

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:px-8">
                <div className="space-y-4">
                    {formFields.map((field) => (
                        <div key={field.name}>
                            <div
                                className={`w-full ${errors[field.name]
                                    ? "border-[1px] border-red-500"
                                    : "border-[1px] border-gray-300"
                                    } bg-smoke flex items-start gap-3 px-[10px] py-[5px] rounded-[4px]`}
                            >
                                <div>{field.icon}</div>
                                <div className="grow flex flex-col gap-1">
                                    <label className="font-semibold text-[14px] text-[#64666b]">
                                        {field.label}
                                    </label>
                                    <Controller
                                        name={field.name}
                                        control={control}
                                        rules={field.rules}
                                        render={({ field: controllerField }) =>
                                            field.type === "textarea" ? (
                                                <textarea
                                                    {...controllerField}
                                                    rows={5}
                                                    className="bg-transparent w-full border-none outline-none"
                                                    placeholder={field.placeholder}
                                                />
                                            ) : (
                                                <input
                                                    {...controllerField}
                                                    className="bg-transparent w-full border-none outline-none"
                                                    type={field.type}
                                                    placeholder={field.placeholder}
                                                />
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            {errors[field.name] && (
                                <p className="text-red-500 text-[12px]" role="alert">
                                    *{errors[field.name]?.message}
                                </p>
                            )}
                        </div>
                    ))}

                    <div>
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA ?? ""}
                            onChange={handleCaptchaChange}
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    loading={isPending}
                    disabled={isPending}
                >
                    {t("submit")}
                </Button>
            </form>
        </div>
    );
};

export default ContactForm;
