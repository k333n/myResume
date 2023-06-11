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

/* lock mechanism */
let widthLock = -1; 
let previousTextWidth = -1; 

const RenderText: React.FC<{ text: string }> = (props) => 
{
  const textDom = useRef(null); //Text Reference
  const [fontSize, setFontSize] = useState( -1 ); //Initial FontSize containerWidth / (30 * (props.text.length / 4)) 
  let containerRef = useRef(null);

  /* The useLayoutEffect() hook is similar to the useEffect() hook, but it runs synchronously after the DOM has been updated. */
  useLayoutEffect(() => 
  {
    console.log("in useEffect");

    function scaleFont ()
    {
        /* utilised in scaling font-Size so that it matches the given container width */
        if (textDom.current != null && containerRef.current != null) // if textRef is established
        {
          const computedDOMTextStyle = window.getComputedStyle(textDom.current);  // retrieve textDomStyle by textRef
          const currentTextWidth = parseInt(computedDOMTextStyle.width, 10); // parse_Int by textDomStyle
          const currentTextHeight= parseInt(computedDOMTextStyle.height, 10); // parse_Int by textDomStyle
          const currentContainerWidthStyle = window.getComputedStyle (containerRef.current);
          const containerWidth = parseInt(currentContainerWidthStyle.width, 10);
          const containerHeight = parseInt(currentContainerWidthStyle.height, 10);

          console.log("current text Width :  " + currentTextWidth);
          console.log("container width is : " + containerWidth);
          console.log("previous text width is : " + previousTextWidth);

          if (fontSize === -1)
          {
            setFontSize( (containerWidth / (50 * (props.text.length / 3)) ) );
            return;
          }
         /*
            Then, We describe the following (if)-block code as follows :
                let widthLock = key/lock = -1;
                let containerWidth = div container encapsulating text
                let previousTextWidth = be the previous textWidth 'p' ∈ {..,p, p'} where p = currentTextWidth before the re-render.
    
                if (previousTextWidth = currentTextWidth) ⇒ currentTextWidth is not scaling with fontSizeIncrement (infinite-loop), hence we return;
    
                we say if ( ¬(widthLock = containerWidth) AND (currentTextWidth < containerWidth) AND (currentTextHeight < containerHeight) ), then we :
                    increment textWidth by : fontSize++
                else, ⇒ (currentTextWidth ≥ containerWidth), hence we do :
                    if (widthLock = -1), we establish the lock by :
                        widthLock <-- containerWidth
                        decrement textWidth by : fontSize--,  s.t. it fits in containerWidth as (currentTextWidth ≥ containerWidth) is imlplied.  
          */
          if ( (widthLock != containerWidth && currentTextWidth < containerWidth) && previousTextWidth != currentTextWidth && (currentTextHeight < containerHeight)  ) 
          {    
                if (widthLock !== -1) widthLock = -1;
                console.log("we are increasing to : " +(fontSize +1));
                setFontSize( fontSize + 1);
          } 
          else if ( widthLock === -1 ) /* => currentTextWidth > container*/ 
          { 
                widthLock = containerWidth;
                setFontSize(fontSize - 1);
                console.log("compltedWidth established!");
          }
          previousTextWidth = currentTextWidth;
        }
    }
    scaleFont();

    /*  Recalculate by function scaleFont() on resize event trigger. Resize occurs IFF previous-Containerwidth (widthlock) != current-Containerwidth */
    let reCalculate = () => 
    {
       console.log("resizing");
        if (textDom.current != null && containerRef.current != null) //if textRef is established
        {
            console.log ("wlock:" + widthLock);
            console.log ("containerW:" + window.getComputedStyle (containerRef.current).width);
            console.log ("textWidth:" + window.getComputedStyle (textDom.current).width);

            let containerWidth = parseInt(window.getComputedStyle (containerRef.current).width, 10);
            if (widthLock !=containerWidth )
            {
                widthLock = -1;
                previousTextWidth = -1
                setFontSize(-1);
            }
        }
    }
    window.addEventListener('resize', reCalculate);
    return () => window.removeEventListener('resize', reCalculate);
  });


  return (
    <>
        <div style={{ backgroundColor: "yellow", display: "flex", alignItems: "center", justifyContent : 'center', width : '100%', height : '100%'}} >
             {left_CodeArrow}
            <div ref = {containerRef} style={Object.assign(  { width: "70%" , height : '100%'} )} > { /* wrapper (i.e. containerRef) */} 
                <div style={{ backgroundColor: "purple", width: "100%", display: "flex", height: "100%", position: "relative",justifyContent: "center",alignItems: "center",overflow: "hidden", wordBreak: "break-word", }} >
                    <div ref={textDom} style={ Object.assign ({fontSize : `${fontSize}em`, backgroundColor : 'orange'} , CssContent.textStyling)}>
                        {props.text}
                    </div>

                </div>
            </div>
            {right_CodeArrow}
        </div>
    </>
  );
};

export default RenderText;
