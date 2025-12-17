import { Colors } from "../../constants/colors";
import { cn } from "../../lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "filled" | "outline";
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
  sm: "h-9 rounded-full px-4 text-xs font-semibold",
  md: "h-11 rounded-full px-5 text-sm font-semibold",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export function Button({
  className,
  variant = "filled",
  size = "md",
  color = "blue",
  icon,
  iconPosition = "left",
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
      : {
          backgroundColor: Colors.Grey.White,
          color: c.main,
          borderColor: c.main,
        };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 border transition-opacity hover:opacity-90",
        sizeStyles[size],
        className
      )}
      style={style}
      {...props}
    >
      {icon && iconPosition === "left" && icon}
      <span>{children}</span>
      {icon && iconPosition === "right" && icon}
    </button>
  );
}