import React, {useState, useEffect, useLayoutEffect, useRef, useCallback, ReactNode} from "react";
import myBrowser from '../../browserHandling/myBrowser';

let animationOffset = 250; /* Represent the animation  +/- offset */

let RenderElipseContainer : React.FC <{children : React.ReactNode, Template : (animationPercentage : number, child : ReactNode)=> React.ReactElement}> = (props) => 
{
    let ElipseContainerReference = useRef<HTMLImageElement>(null);
    let [AnimationPercentage, setAnimationPercentage] = useState(0);
   
    useLayoutEffect(()=>
    {
        function scrollHandler ()
        {
            if (ElipseContainerReference.current)
            {
                setAnimationPercentage(calcAnimationPercentage());
            }
        }
        window.addEventListener('scroll', scrollHandler);

        function calcAnimationPercentage() : number
        {
            let ElipsePosition = myBrowser.RefHandling.getRefLocationStart(ElipseContainerReference);
            let currentAnimationState = animationOffset + (myBrowser.getWindowCenter() - ElipsePosition);
    
            if (currentAnimationState >= 0 && currentAnimationState <=  animationOffset*2)
                return (currentAnimationState/(animationOffset*2)); 
            return (currentAnimationState >= animationOffset*2) ? 1 : 0;
        }
    });

    return (
        <>
            {/* {Elipse} */}

            {/* <div style = { {color :'red', width : '100vw', height : '100vh', overflow :'hidden', position :'fixed', display :'grid', justifyContent :'center', alignItems : 'center'}}> 
                -
            </div> */}

            <div ref = {ElipseContainerReference} style = { { overflow :'hidden', position : 'relative'}}> 
                { props.Template(AnimationPercentage, props.children) }
            </div>

        </>
    )

}

export default RenderElipseContainer;