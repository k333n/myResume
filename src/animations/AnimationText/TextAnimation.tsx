import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { text } from "stream/consumers";
import DynamicHeading from '../../layouts/dynamicText'
var CssContent: { textStyling : React.CSSProperties} = {
  textStyling : {
    overflow: "hidden",
    position: "absolute",
    color : 'white'
  }
};

/*(); is used to create a JavaScript function that returns a value. In this case, the function is returning an SVG element. */
let left_CodeArrow: React.ReactElement = (
    <svg  width= '15%' height= '15%' viewBox="0 0 58 81" fill="none" xmlns="http://www.w3.org/2000/svg" >
      <path  d="M48.5557 8.83325L4.00011 40.3934L48.5557 71.9536"  stroke="#2B2E30"  strokeWidth="12.3765" strokeLinecap="square" strokeLinejoin="bevel" />
    </svg> 
);
let right_CodeArrow: React.ReactElement = (
    <svg width="15%" height="15%" viewBox="0 0 58 81" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.00013 8.83333L53.5557 40.3935L9.00012 71.9537" stroke="#2B2E30" strokeWidth="12.3765" strokeLinecap="square" strokeLinejoin="bevel"/></svg>
);

const RenderText: React.FC<{ text: string }> = (props) => 
{
  const textDom = useRef(null); //Text Reference
  const [fontSize, setFontSize] = useState( -1 ); //Initial FontSize containerWidth / (30 * (props.text.length / 4)) 
  let containerRef = useRef(null);

  return (
    <>
        <div style={{ backgroundColor: "yellow", display: "flex", alignItems: "center", justifyContent : 'center', width : '100%', height : '100%'}} >
             {left_CodeArrow}
            <div  style={Object.assign(  { width: "70%" , height : '100%'} )} > { /* wrapper (i.e. containerRef) */} 
                <DynamicHeading Text = {props.text} Styling = {{ display :'flex', alignItems :'center', justifyContent :'center'}} textRef = {null}/>
            </div>
            {right_CodeArrow}
        </div>
    </>
  );
};

export default RenderText;
