import React, {useCallback, useContext, useEffect, useLayoutEffect, useRef} from "react";
import { text } from "stream/consumers";
import myBrowser from '../browserHandling/myBrowser';
import {ObjectRef} from '../Interfaces/RefObjectInterface';
/* ------------------------------------------ Component Description ------------------------------------------
    Renders a dynamic text segnment given by props as input. This component is guarenteed the size of the 
    wraping (parent) container, that is x*y; addition styling is also passed through as props.  

    The rendered text will re-size accordingly based on the wrapping container (changes), and will always 
    take the maximum scale whilst maintaining the following property :
        1) The given text fits on a single line 
        2) No overflow (x/y), and text sits within the containing parent (Div) 

    The Component take as arguments through props  : 
        Text : String 
        Styling : React.CSSProperties 
        onChangeAction : onChange callback action handler
        isSimpleContainer : boolean, s.t. isSimpleContainer = true IFF its direct parent container and styling given by props
                            is not a flex-box nor grid-box, else isSimpleContainer = false.  This is set to false by default. 
    Note : The following conditions must be met for components proper functionality 
        1) Padding in direct parent container is not yet supported by this compoment, we use additional div-wrapping as solution.           
        2) Direct parentNode container must inherit the overflow = hidden property to ensure proper container scalling values 
           conducted in --> (Ref : 2107)
        3) isSimpleContainer is deprecited, and is no longer needed.
------------------------------------------------------------------------------------------------------------*/
/**
 * Algorithm : Given the containerRef and textRef, we assign the greatest textRef.fontSize  
 * s.t. containerHeight(textRef) < containerHeight(conrainerRef) remains true.
 *  
 *      Set textRef.fontSize = containerHeight(containerRef)px; 
 *      let direction = decrement IFF containerHeight(containerRef) > containerHeight(textRef), else increment;
 * 
 *      while (true)
 *          if (direction = increment) then
 *              if (containerHeight(containerRef) < containerHeight(textRef)) we
 *                  direction = decrement;
 *              else we :
 *                  Set textRef.fontSize = (currentFontSize(textRef)+1)px; 
 *          else, direction = decrement, we do :
 *              if (containerHeight(containerRef) ≥ containerHeight(textRef)) we
 *                  break;
 *              else we :
 *                  Set textRef.fontSize = (currentFontSize(textRef)-1)px; 
 * @param textRef 
 * @param containerRef 
 */
function scaleHeight(textRef :React.RefObject<HTMLParagraphElement>  , containerRef : React.MutableRefObject<HTMLDivElement | null> ) 
{
    if (textRef.current?.textContent != null && containerRef.current != null && containerRef.current.parentElement != null) 
    {
        let Container_Height = containerRef.current.parentElement.clientHeight; 
        let fontSize = Container_Height;
        textRef.current.style.fontSize = `${fontSize}px`; 
        let direction : String = (Container_Height > textRef.current.offsetHeight) ? "decrement" : "increment";  

        while(1)
        {
            // console.log("Rescaling height")
            if (direction === "increment")
                if (Container_Height < textRef.current.offsetHeight)  direction = "decrement";
                else textRef.current.style.fontSize = `${++fontSize}px`; 
            else 
                if (Container_Height >= textRef.current.offsetHeight) break;
                else textRef.current.style.fontSize = `${--fontSize}px`;  
        }
    }
}
/**
 * Algorithm : Given the containerRef and textRef, we assign the greatest textRef.fontSize s.t. (this fontSize < original 
 * fontSize passed in) AND ( containerWidth(textRef) < containerWidth(conrainerRef) ). This method is ran after scaleHeight()
 * 
 *      Let DecrementOffset = containerWidth(containerRef) / Text_Length;  
 * 
 *      If (containerWidth(containerRef) ≥ containerWidth(textRef)), we
 *          return; 
 *      Else, we do :
 *          while ( containerWidth(containerRef) < containerWidth(textRef) )
 *              Set textRef.fontSize = (currentFontSize(textRef) - DecrementOffset )px;     
 *           
 *          Set textRef.fontSize = (currentFontSize(textRef) + DecrementOffset )px;     
 *          while ( containerWidth(containerRef) < containerWidth(textRef) )
 *              Set textRef.fontSize = (currentFontSize(textRef) - 1 )px;     
 *  
 * @param textRef 
 * @param containerRef 
 * @returns 
 */
function scaleWidth(textRef :React.RefObject<HTMLParagraphElement>, containerRef : React.MutableRefObject<HTMLDivElement | null> ){   

    if (textRef.current?.textContent != null && containerRef.current != null && containerRef.current.parentElement != null)
    {
        let Text_Length = textRef.current.textContent.length;
        let Container_Width = containerRef.current.parentElement.clientWidth;
        let DecrementOffset = Container_Width / Text_Length;     // unscale fontSize s.t. Text_Height < containerHeight
        let currentFontSize = myBrowser.RefHandling.getRefFontSize(textRef);
        
        /** Scaling fits, we return */
        if (Container_Width >= textRef.current.offsetWidth) return;
        
        
        while (Container_Width < textRef.current.offsetWidth) {
            currentFontSize = currentFontSize - DecrementOffset;
            textRef.current.style.fontSize = `${currentFontSize}px`;
        }

        currentFontSize = currentFontSize + DecrementOffset; 
        textRef.current.style.fontSize = `${currentFontSize}px`;  
        while (Container_Width < textRef.current.offsetWidth)  textRef.current.style.fontSize = `${--currentFontSize}px`; 
        
    }
    return (0);
}

/**
 * Algorithm : Given the size of the container by 'container' , we set scale textRef to fit at maximum size in container. 
 * 
 * @param textRef 
 * @param containerRef 
 */
function scaleText(textRef :React.RefObject<HTMLParagraphElement>  , containerRef : React.MutableRefObject<HTMLDivElement | null>)
{
    scaleHeight ( textRef, containerRef );
    scaleWidth  ( textRef, containerRef );
}

/* 
   (Ref : 2107) --> Scale container relative to the parent container. One must ensure overflow = hidden in parentElement, else parentElement wrapping will 
   Prevent proper container scaling values!
*/
function scaleContainer ( containerRef : React.MutableRefObject<HTMLDivElement | null>)
{
    if ((containerRef.current != null) && (containerRef.current.parentNode != null))
    {
        let parentNode = containerRef.current.parentNode as HTMLDivElement;
        
        containerRef.current.style.width = `${parentNode.clientWidth}px`;
        containerRef.current.style.height = `${parentNode.clientHeight}px`;
    }
}

/* 
    Render-Heading scaled to maximum 'width * height' relatively to the parent continer. 
    TextRef used to reference the created text node element.
    changeActionListener : call-back funct evoked on text re-scale. 
*/
let RenderText : React.FC<{Text : String, Styling? : React.CSSProperties, textRef? : ObjectRef<HTMLParagraphElement> | null, onChangeAction? : () => void, isSimpleContainer? : boolean}  > = (props) : React.ReactElement => 
{
    let containerRef = useRef<HTMLDivElement | null>(null);
    let textRef = useRef<HTMLParagraphElement>(null);

    useLayoutEffect( 
       () => {
            if (containerRef.current != null && textRef.current != null) // Ensure ref is established which is implied by useLayoutEffect!
            {
                scaleContainer(containerRef);
                scaleText(textRef, containerRef)                         // Scale Text (if any)
            }
            props.textRef?.setFunc(props.textRef, textRef);
       }
    )

    useEffect (
        () => {
            let timeout_ID: NodeJS.Timeout | null = null;

            let resize = (event? : Event) => {
                // console.log("Resizing");
                // Conside Re-scaling on page resizing
                scaleContainer(containerRef);
                scaleText(textRef, containerRef)                         // Scale Text (if any)
                if (props.onChangeAction != undefined) props.onChangeAction();
            }
            
            resize();

            const resize_Handler = () => {
                if (timeout_ID) {
                    clearTimeout(timeout_ID); // cancel previous setTimeout Call if it has not been executed.
                }
                
                timeout_ID = setTimeout(resize, 0.1); // initialise setTImeout call
            };
            
            window.addEventListener ('resize', resize_Handler);
            return () => {
                window.removeEventListener('resize', resize_Handler); 
            }
        }
    , [props.onChangeAction]);

    /** 
     *  Default wrapping container s.t. the text-element is processed according to the normal flow of the container, and no additional property
     *  (i.e. align-center) is asserted. This is true IFF props.isSimpleContainer = true; 
     */
    let textWrappingContainer : JSX.Element = 
        (
            <p ref = {textRef} style = {{display:'inline',  verticalAlign :'top', padding :'0px', margin : '0px', fontSize : '0px'}}>{props.Text}</p>
        );


    return ( 
        <>
            <div id ="cs" ref = {containerRef} style = { Object.assign( {overflow:'hidden'}, props.Styling) }> 
                {textWrappingContainer}
            </div>
        </>
    )
}
/*
    Usage Example :
        <div ref = { parentRef} style = { {width : '50vw', height : '50vh', backgroundColor : 'red', display : 'flex', justifyContent :'center', position : 'relative'}}> 
            <DynamicText Text = { "asfasf"} Styling = {{ display :'flex', alignItems :'center', justifyContent :'center'}}/>
       </div>purple
*/

export default RenderText;