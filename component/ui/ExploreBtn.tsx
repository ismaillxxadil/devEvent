import Image from "next/image";
import React from "react";

export const ExploreBtn = () => {
  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto">
      <a href="#events">Explore Events</a>
      <Image
        src="/icons/arrow-down.svg"
        alt="down arrow"
        width={26}
        height={26}
      />
    </button>
  );
};
