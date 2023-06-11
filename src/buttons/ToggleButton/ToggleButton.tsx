import React, { useState } from 'react';
import Styling from './styling.module.css';
import DynamicHeading from '../../layouts/dynamicText'
import {ObjectRef} from '../../Interfaces/RefObjectInterface'
import { useLayoutEffect, useRef } from 'react';
import myBrowser from '../../browserHandling/myBrowser';
/* ------------------------------------------ Component Description ------------------------------------------
    Renders a button toggle/switch which inherits 100% x position of the direct parent wrapping container,
    and hence the 2 switch (buttons) will inherit 50% each respectively. 

    The height of this component however is not known ahread of time, as such : the direct parent containers 
    dimensions should not be statically imposed as overflow may occur.  

    The direct parent container is expected to have the dimensions x ∈ N'px * y = y, that is y is unspecified
    and should rescale to contain this component. 

    Passing paraemeters through props: 
        button_1Action,button_1Action : Call back function to handle button click for selected button
        button_1Title, button_2Title : Title used for the two switch
------------------------------------------------------------------------------------------------------------*/

let RenderButtom : React.FC< {button_1Title : string, button_1Action?: () => void, button_2Title : string, button_2Action?: () => void,}> = (props) => 
{
    let containerRef = useRef<HTMLDivElement>(null);
    let button1_Ref = useRef<HTMLSpanElement>(null);
    let button2_Ref = useRef<HTMLInputElement>(null);
    // let dynamicFont_Ref : ObjectRef <HTMLDivElement> =
    // {
    //     setFunc : (ref : ObjectRef<HTMLDivElement>, toRef : React.RefObject<HTMLDivElement> ) =>
    //     {
    //         ref.ref = toRef;
    //     },
    //     ref : undefined
    // }
    let buttonRef = useRef<HTMLDivElement>(null);
    let [globlFontSize, set_GlobalFontSize] = useState <number>();

    // let sizeChangeAction = () => {
    //     if (dynamicFont_Ref.ref?.current != undefined && buttonRef.current != null)
    //     {
    //         set_GlobalFontSize(myBrowser.RefHandling.getRefFontSize(dynamicFont_Ref.ref)); 
    //     }
    // }

    // useLayoutEffect(
    //     () => {
    //         sizeChangeAction();
    //     }
    // )
    let [containerWidth, setContainerWidth] = React.useState<number>(0);
    let [switchState, setSwitchState] = useState<boolean>(false); /* Where false = button_1, true = button_2 selected respectively */
    useLayoutEffect(
        ()=>
        {
            if (containerRef.current != null)
            {
                let cw = myBrowser.RefHandling.getRefWidth(containerRef);
                if (cw != containerWidth) setContainerWidth(cw);
            }
            if ((switchState === false) && props.button_1Action != undefined) props.button_1Action();
            if ((switchState === true) && props.button_2Action != undefined) props.button_2Action();

            // if (button1_Ref.current !=null)
            // {
            //     // if (switchState === false)
            //     // {
            //     //     button1_Ref.current.style.color = "white";
            //     //     button2_Ref.current.style.color = "black";

            //     // } else {
            //     //     button1_Ref.current.style.color = "white";
            //     //     button2_Ref.current.style.color = "black";
            //     // }
            //     console.log("Color set to red");
            //     button1_Ref.current.style.color = "blue";
            //     // button2_Ref.current.style.color = "blue";


            // }
        }
    )
    // const someStyle = {
    //     "--halfSize": `${containerWidth/2}px`,
    // }as React.CSSProperties
    /* We define the :root selector with the button title variable and container Width/2 variable utilised for dynamic rescaling*/
    const rootSelectors: String = 
        `
            :root 
            {
                --button2Title: "${props.button_2Title}";
                --halfSize: ${containerWidth/2}px;
                --selectedColorButton1: ${(!switchState)? 'white' : 'black'};
                --selectedColorButton2: ${(switchState)? 'white' : 'black'};
                --FontSizing: ${globlFontSize}px;
            }
        `;

    let textToScale = (props.button_1Title.length > props.button_2Title.length) ? props.button_1Title : props.button_2Title;

    return (
        <>
            <style>{rootSelectors}</style> {/* insert the root selectors */}

            {/* <div className={Styling.arrowContainer} style ={ Object.assign({width:'100%',height:'100%', position :'relative'}, getDirection())}>  */}
            <div style = {{width:'100%',height:'100%', position:'relative'}}> 
                <div ref = {containerRef} className={Styling.switchbutton}  >
                    <input onMouseDown={() => {setSwitchState(!switchState)}} className={Styling.switchbuttoncheckbox} type = "checkbox"/> 
                    <label className={Styling.switchbuttonlabel} htmlFor = "" >
                        <span ref = {button1_Ref}className={Styling.switchbuttonlabelspan} > 
                            {/* <div id = "ButtonResizeContainer" style={{width:'100%',height:'100%',position:'absolute', visibility:'visible', backgroundColor :'red'}}>
                                <DynamicHeading Text={textToScale} onChangeAction = {sizeChangeAction} textRef = {dynamicFont_Ref} />
                            </div> */}
                             {props.button_1Title}
                        </span>
                    </label>
                </div>
            </div>
        </>
    )
}

export default RenderButtom;