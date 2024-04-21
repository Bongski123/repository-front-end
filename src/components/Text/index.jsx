import React from "react";

const sizes = {
  xs: "text-[10px] font-medium leading-3",
  s: "text-xs font-normal leading-[15px]",
  md: "text-sm font-medium leading-[17px]",
};

const Text = ({ children, className = "", as, size = "md", ...restProps }) => {
  const Component = as || "p";

  return (
    <Component className={`text-gray-500 font-inter ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Text };
