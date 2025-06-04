import Link from "next/link";
import LoadingSpinner from "./LoadingSpinner";

interface ButtonProps {
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
}

export const Button = ({
    type = "button",
    disabled,
    loading,
    onClick,
    children,
    className = "",
}: ButtonProps) => {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`h-[52px]  flex justify-center gap-2 items-center text-[18px] py-[8px] text-white rounded-[8px] transition-all 
          ${loading || disabled
                    ? "bg-primary opacity-50"
                    : "bg-primary hover:opacity-80"
                } 
          ${className}`}
        >
            {loading ? <LoadingSpinner /> : children}
        </button>
    );
};

interface LinkProps {
    href: string;
    target?: string;
    children: React.ReactNode;
    className?: string;
}

export const NavigateLinks = ({
    href,
    children,
    target = "_self",
    className = "",
}: LinkProps) => {
    return (
        <Link
            href={href}
            target={target}
            className={` w-max text-primary flex justify-center gap-2 items-center text-[18px] py-[8px]  rounded-[8px] transition-all 
          ${className}`}
        >
            {children}
        </Link>
    );
};


