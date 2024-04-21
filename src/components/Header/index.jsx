import React from "react";
import { Img, Button } from "./..";

export default function Header({ ...props }) {
  return (
    <header {...props}>
      <div className="flex flex-row justify-center">
        <Button
          color="gray_100"
          size="7xl"
          shape="round"
          leftIcon={<Img src="images/defaultNoData.png" alt="Icon/Arrow-Left" />}
          className="w-full gap-2.5 sm:px-5 font-sfprodisplay font-bold"
        >
          Back
        </Button>
      </div>
      <div className="flex flex-row justify-start w-[11%] gap-5">
        <div className="flex flex-col items-center justify-start h-[48px] w-[48px]">
          <Button
            color="light_blue_200"
            size="4xl"
            shape="round"
            className="font-sfprodisplay font-bold min-w-[48px] sm:min-w-full"
          >
            1
          </Button>
        </div>
        <Img
          src="images/defaultNoData.png"
          alt="avatar_one"
          className="w-[48px] md:h-auto object-cover rounded-[12px]"
        />
      </div>
    </header>
  );
}
