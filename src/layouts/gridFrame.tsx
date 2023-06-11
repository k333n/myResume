import React from "react";
import GridStyle from "./gridStyle.module.css";
import RenderFrame from "./pageFrame";

/* wrap props.child around a grid, centering all props.child */
const renderGrid: React.FC<{ width: string; height: string, children : React.ReactNode }> = (prop) : React.ReactElement=> {
  return (
    <>
      <RenderFrame >
        <div
          className={GridStyle.gridStyle}
          style={{ width: `${prop.width}`, height: `${prop.height}`  }}
        >
           {prop.children}
        </div>
      </RenderFrame>
    </>
  );
};
export default renderGrid;
