import Styling from './styling_Minimise.module.css';
import DynamicHeading from '../../layouts/dynamicText'
import {ObjectRef} from '../../Interfaces/RefObjectInterface'
import { useLayoutEffect, useRef } from 'react';
import myBrowser from '../../browserHandling/myBrowser';
import React from "react"

/* ------------------------------------------ Component Description ------------------------------------------
    Renders a close button with width,height  = aspectRation = y IFF y < x, else x; where y,x is the height, 
    and width (px) of the direct parenting container. 
    
    Passing paraemeters through props: 
        handleAction : Call back function to handle button click (if any)
------------------------------------------------------------------------------------------------------------*/

let RenderButtom : React.FC< {buttonRef? : ObjectRef<HTMLDivElement> , handleAction?: () => void,custom_ContainerStyle? : React.CSSProperties, custom_ItemStyle? : React.CSSProperties }> = (props) => 
{
    let ButtonResizeContainerRef : ObjectRef <HTMLDivElement> =
    {
        setFunc : (ref : ObjectRef<HTMLDivElement>, toRef : React.RefObject<HTMLDivElement> ) =>
        {
            ref.ref = toRef;
        },
        ref : undefined
    }
    let buttonRef = useRef<HTMLDivElement>(null);
    let buttonContainer_Ref = React.useRef<HTMLDivElement>(null);
    let [buttonAspectRatio, set_buttonAspectRatio] = React.useState<number>(0);

    useLayoutEffect(
        () => {
            if (buttonContainer_Ref.current != null && buttonRef.current != null) 
            {
                let bw = myBrowser.RefHandling.getRefWidth(buttonContainer_Ref);
                let bh = myBrowser.RefHandling.getRefHeight(buttonContainer_Ref);
                let bsr = ((bw < bh) ? bw-0.5 : bh-0.5);
                buttonRef.current.style.width = `${bsr}px`;
                buttonRef.current.style.height = `${bsr}px`;
                set_buttonAspectRatio(bsr);
            }
        }
    )

    useLayoutEffect(
        () => {
            if (buttonRef != null && props.buttonRef != undefined) props.buttonRef.setFunc(props.buttonRef, buttonRef);
        }, [buttonRef] 
    );

   const rootSelectors: String = 
        `
            :root 
            {
                --lineSize: ${0.1*buttonAspectRatio}px;
                --ButtonRatio: ${buttonAspectRatio}px;
            }
        `;

    return (
        <>
            <style>{rootSelectors}</style> {/* insert the root selectors */}

            <div id = "Mac_buttonContainer" ref = {buttonContainer_Ref} style ={ Object.assign({width :'100%', height:'100%', position :'relative', overflow :"hidden"}, props.custom_ContainerStyle)}> 
                <div id = "Mac_Minbutton" ref = {buttonRef} style = {Object.assign({}, props.custom_ItemStyle)} onMouseDown={() => { if (props.handleAction != undefined) props.handleAction(); }} className={Styling.minbtn}/> 
            </div>
           
        </>
    )
}


export default RenderButtom;