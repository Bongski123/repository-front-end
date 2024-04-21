import React from "react";
import PropTypes from "prop-types";

const shapes = {
  square: "rounded-[0px]",
  round: "rounded-[12px]",
};
const variants = {
  fill: {
    white_A700_99: "bg-white-A700_99",
    red_A200: "bg-red-A200 text-white-A700",
    indigo_600: "bg-indigo-600 text-white-A700",
    white_A700: "bg-white-A700 text-gray-900",
    gray_500_33: "bg-gray-500_33 text-gray-500",
    white_A700_66: "bg-white-A700_66",
    light_blue_200_33: "bg-light_blue-200_33",
    light_blue_200: "bg-light_blue-200 text-white-A700",
    gray_100: "bg-gray-100 text-gray-500",
    indigo_A200_33: "bg-indigo-A200_33",
    gray_900: "bg-gray-900 text-white-A700",
    white_A700_33: "bg-white-A700_33 text-white-A700",
    green_400: "bg-green-400 text-white-A700",
    indigo_A200: "bg-indigo-A200 text-white-A700",
  },
  outline: {
    gray_500: "border-gray-500 border-2 border-solid text-gray-900",
    gray_500_99: "border-gray-500_99 border-2 border-solid text-white-A700",
    white_A700_33: "border-white-A700_33 border-2 border-solid",
    gray_500_33: "border-gray-500_33 border-2 border-solid text-gray-900",
    gray_500_66: "border-gray-500_66 border-2 border-solid text-gray-900",
  },
};
const sizes = {
  "2xl": "h-[45px] px-[11px]",
  "5xl": "h-[58px] px-5",
  "6xl": "h-[58px] px-3.5 text-[22px]",
  "8xl": "h-[78px] px-5",
  lg: "h-[38px] px-2.5 text-sm",
  xs: "h-[28px] px-[7px] text-[10px]",
  "4xl": "h-[48px] px-[18px] text-[22px]",
  xl: "h-[38px] px-2.5",
  "3xl": "h-[48px] px-4",
  "7xl": "h-[58px] px-[35px] text-sm",
  md: "h-[30px] px-[7px] text-sm",
  sm: "h-[28px] px-[7px]",
};

const Button = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape = "",
  variant = "fill",
  size = "sm",
  color = "indigo_A200",
  ...restProps
}) => {
  return (
    <button
      className={`${className} flex items-center justify-center text-center cursor-pointer ${(shape && shapes[shape]) || ""} ${(size && sizes[size]) || ""} ${(variant && variants[variant]?.[color]) || ""}`}
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  shape: PropTypes.oneOf(["square", "round"]),
  size: PropTypes.oneOf(["2xl", "5xl", "6xl", "8xl", "lg", "xs", "4xl", "xl", "3xl", "7xl", "md", "sm"]),
  variant: PropTypes.oneOf(["fill", "outline"]),
  color: PropTypes.oneOf([
    "white_A700_99",
    "red_A200",
    "indigo_600",
    "white_A700",
    "gray_500_33",
    "white_A700_66",
    "light_blue_200_33",
    "light_blue_200",
    "gray_100",
    "indigo_A200_33",
    "gray_900",
    "white_A700_33",
    "green_400",
    "indigo_A200",
    "gray_500",
    "gray_500_99",
    "gray_500_66",
  ]),
};

export { Button };
