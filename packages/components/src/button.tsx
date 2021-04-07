import React from "react";
import cls from "classnames";

export interface ButtonProps {
  className?: string;
  icon?: any;
  iconPosition?: "before" | "after";
  size?: "sm" | "md";
  variant?: "solid" | "ghost" | "text";
  color?: "primary" | "secondary";
  as?: any;
}

export const Button: React.FC<ButtonProps & any> = React.forwardRef(
  (
    {
      children,
      className,
      icon,
      iconPosition = "after",
      size = "md",
      variant = "solid",
      color = "primary",
      as,
      ...props
    },
    ref
  ) => {
    const iconClasses = cls(
      "w-3 h-3 relative bottom-px inline-block fill-current",
      {
        "mr-1": iconPosition === "before",
        "ml-1": iconPosition === "after",
      }
    );

    let content = children;

    if (icon) {
      if (iconPosition === "before") {
        content = (
          <>
            {React.cloneElement(icon, { className: iconClasses })} {children}
          </>
        );
      } else if (iconPosition === "after") {
        content = (
          <>
            {children} {React.cloneElement(icon, { className: iconClasses })}
          </>
        );
      }
    }

    const classes = (() => {
      let c =
        "block md:inline-block font-bold transition duration-300 ease-in-out border-2 cursor-pointer border-2";

      if (variant === "solid") {
        c = cls(
          c,
          "border-transparent shadow-lg hover:shadow-xl text-center rounded",
          { "px-4 py-3": size === "md" },
          { "px-4 py-2": size === "sm" }
        );

        if (color === "primary") {
          c = `${c} bg-primary hover:bg-primary-darker text-white`;
        } else if (color === "secondary") {
          c = `${c} bg-secondary hover:bg-secondary-darker text-black`;
        } else if (color === "primary-lighter") {
          c = `${c} bg-primary-lighter hover:bg-primary-lightest text-black`;
        } else if (color === "primary-lightest") {
          c = `${c} bg-primary-lightest hover:bg-primary-lighter text-primary-darker hover:text-black`;
        }
      } else if (variant === "ghost") {
        c = cls(
          c,
          "rounded text-center",
          { "px-4 py-3": size === "md" },
          { "px-4 py-2": size === "sm" }
        );

        if (color === "primary") {
          c = `${c} border-primary text-primary hover:bg-primary hover:text-white`;
        } else if (color === "secondary") {
          c = `${c} border-secondary text-secondary hover:bg-secondary hover:text-black`;
        } else if (color === "primary-lighter") {
          c = `${c} border-primary-lighter text-primary-lighter hover:bg-primary-lighter hover:text-black`;
        } else if (color === "primary-lightest") {
          c = `${c} border-primary-lightest text-primary-lightest hover:bg-primary-lightest hover:text-black`;
        }
      } else if (variant === "text") {
        c = `${c} border-transparent`;

        if (color === "primary") {
          c = `${c} text-primary hover:text-primary-darker`;
        } else if (color === "secondary") {
          c = `${c} text-secondary hover:text-secondary-darker`;
        } else if (color === "primary-lightest") {
          c = `${c} text-primary-lightest hover:text-primary-lightest`;
        }
      }

      return c;
    })();

    return React.createElement(
      as,
      {
        className: cls(classes, className),
        ref,
        ...props,
      },
      content
    );
  }
);
