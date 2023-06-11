import { truncateSync } from "node:fs";
import { resolve } from "node:path/win32";
import React, {ReactNode, useRef, useEffect, useState} from "react";


let ElipseSVG: string = `data:image/svg+xml;base64, ${btoa(
    '<svg width="100%" height="100%" viewBox="0 0 1920 200" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M1920 0C1495 200 446 200 0 0V200H1920V0Z" fill="black"/>' +
    '</svg>'
  )}`;

  var ElipseStyling : React.CSSProperties = {
    willChange: 'transform',
    // transform: `translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)`,
    transformStyle: 'preserve-3d',
    width : '100vw',
    position : 'relative',
    transition : 'transform 0.1s'
}



let animationStart = 1; /* Represent elipse start animation value : scale3d(1, 1, 1)  */
let animationEnd = 2.5; /* Represent elipse End animation value : scale3d(2.5, 1, 1)  */
let animationThreadId = Date.now();
let currentAnimationState = parseFloat( (((animationEnd - animationStart)/2)+1).toFixed(2));
function RenderElipseContainer  (animationPercentage : number, child : ReactNode) : React.ReactElement
{
    let ElipseReference = useRef<HTMLImageElement>(null);
    let newAnimationState = parseFloat (((animationPercentage * (animationEnd - animationStart)) +animationStart).toFixed(2)); // round off to 1 decimal place by string conversion (index), then parseToInt

    useEffect(() => 
    {
        /* 
            animatingProcessed is utilised to provide smooth transition, s.t. when this component is re-rendered from a mouseScroll by the parenting function
            we dont immediately assign currentAnimationState = animationState, but increment the transition gracefully by a factor of '0.01'.

            We utilise animationThreadId = Date.now() here so that the previous async funct is terminated and handled over when component is updated
            and useEffect is called upon-again through useEffect cleanup process, hence, no two thread are manipulating (animating) in paraellel. 

            Note : There is a chance of currentThread interleaving and executing through at most one iteration in paraellel with another running-thread. 
        */
        let animatingProcess = async (currentThreadId : number) =>
        {
            if (ElipseReference.current != null)
            {
                while(1) /* We loop here! */
                {
                    if (animationThreadId != currentThreadId) return; /* End process (new process takeOver) */

                    if (currentAnimationState < newAnimationState)
                    {
                        currentAnimationState = parseFloat((currentAnimationState + 0.01).toFixed(2));
                        ElipseReference.current.style.transform = `translate3d(0px, 0px, 0px) scale3d(${currentAnimationState}, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)`;
                    }
                    else if (currentAnimationState > newAnimationState)
                    {
                        currentAnimationState = parseFloat((currentAnimationState - 0.01).toFixed(2));
                        ElipseReference.current.style.transform = `translate3d(0px, 0px, 0px) scale3d(${currentAnimationState}, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)`;
                    }
                    else return ;    /* Processing complete  */

                    // console.log("Animation State = " + currentAnimationState);

                }
            }
        }
        animatingProcess(animationThreadId);
        return () => { animationThreadId = Date.now() }
      });



    return (
        <> 
            <div style = { { width : '100vw', color : 'white', padding :'0px', margin :'0px', display :'flex', flexDirection :'column'}}>
                <img ref = {ElipseReference} src = {ElipseSVG} 
                        style =
                        { 
                            Object.assign( { transform: `translate3d(0px, 0px, 0px) scale3d(${currentAnimationState}, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)`},  ElipseStyling)
                        }/>
                <div style = { { backgroundColor : 'black', width : '100vw'}}> 
                    {child}
                </div>
            </div> 
        </>
    );
}

export default RenderElipseContainer; 