import React from "react";
import PropTypes from "prop-types";

const shapes = {
  round: "rounded-lg",
  square: "rounded-[0px]",
};
const variants = {
  outline: {
    gray_500_33: "border-gray-500_33 border-2 border-solid text-gray-500",
    gray_500: "border-gray-500 border border-solid text-gray-500",
  },
  fill: {
    gray_800: "bg-gray-800",
    gray_900: "bg-gray-900 text-white-A700",
    gray_100: "bg-gray-100 text-gray-500",
    white_A700: "bg-white-A700 text-gray-500",
  },
};
const sizes = {
  md: "h-[36px] pl-[9px] pr-[35px] text-sm",
  xs: "h-[26px] px-[3px] text-sm",
  sm: "h-[32px] pl-[9px] pr-[35px] text-sm",
  xl: "h-[58px] pl-5 pr-[35px] text-sm",
  lg: "h-[48px] px-3.5 text-sm",
};

const Input = React.forwardRef(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      type = "text",
      children,
      label = "",
      prefix,
      suffix,
      onChange,
      shape = "",
      variant = "fill",
      size = "lg",
      color = "white_A700",
      ...restProps
    },
    ref,
  ) => {
    const handleChange = (e) => {
      if (onChange) onChange(e?.target?.value);
    };

    return (
      <>
        <div
          className={`${className} flex items-center justify-center text-gray-500 text-sm font-medium ${shapes[shape] || ""} ${variants[variant]?.[color] || variants[variant] || ""} ${sizes[size] || ""}`}
        >
          {!!label && label}
          {!!prefix && prefix}
          <input ref={ref} type={type} name={name} onChange={handleChange} placeholder={placeholder} {...restProps} />
          {!!suffix && suffix}
        </div>
      </>
    );
  },
);

Input.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  shape: PropTypes.oneOf(["round", "square"]),
  size: PropTypes.oneOf(["md", "xs", "sm", "xl", "lg"]),
  variant: PropTypes.oneOf(["outline", "fill"]),
  color: PropTypes.oneOf(["gray_500_33", "gray_500", "gray_800", "gray_900", "gray_100", "white_A700"]),
};

export { Input };
