import { Colors } from "../../constants/colors";
import { cn } from "../../lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "filled" | "outline" | "ghost";
type ButtonSize = "sm" | "md";
type ButtonColor = "blue" | "orange" | "grey";

const palette: Record<
  ButtonColor,
  {
    main: string;
    textOnFilled: string;
  }
> = {
  blue: {
    main: Colors.Blue[60],
    textOnFilled: Colors.Grey.White,
  },
  orange: {
    main: Colors.Orange[30],
    textOnFilled: Colors.Grey.White,
  },
  grey: {
    main: Colors.Grey[40],
    textOnFilled: Colors.Grey[90],
  },
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 rounded-full px-4 text-sm font-semibold",
  md: "h-11 rounded-full px-5 text-sm font-semibold",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
}

export function Button({
  className,
  variant = "filled",
  size = "md",
  color = "blue",
  icon,
  iconPosition = "left",
  isLoading = false,
  children,
  ...props
}: ButtonProps) {
  const c = palette[color];

  const style =
    variant === "filled"
      ? {
        backgroundColor: c.main,
        color: c.textOnFilled,
        borderColor: c.main,
      }
      : variant === "outline"
        ? {
          backgroundColor: Colors.Grey.White,
          color: c.main,
          borderColor: c.main,
        }
        : {
          backgroundColor: "transparent",
          color: c.main,
          borderColor: "transparent",
        };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 border transition-opacity hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed",
        sizeStyles[size],
        className
      )}
      style={style}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          <span>{children}</span>
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </button>
  );
}