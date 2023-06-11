import { render } from "@testing-library/react";
import React from "react";
import GridStyle from "./gridStyle.module.css";
/* ------------------------------------------ Component Description ------------------------------------------
    Renders a simply div encapuslating the passing child (through props).

    The following property holds true for this component :
      1) The wrapping div always inherit property width = 100vw. 
      2) All child elements are centered in the middle of the div 
      3) Height scales dynamially based on the size of the child elements
------------------------------------------------------------------------------------------------------------*/

let renderFrame: React.FC<{ children: React.ReactNode }> = (prop) => {
  return (
    <>
        <div className={GridStyle.pageFrameWrapper}>
              {prop.children}
        </div>
    </>
  );
};

export default renderFrame;
