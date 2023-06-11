import React, {useRef, useEffect, useState, useLayoutEffect} from "react";
import frameCss from './gridStyle.module.css'
import StateObject from "../Interfaces/stateObjectInterface";
import {ObjectRef} from "../Interfaces/RefObjectInterface";
import {ClassStateCallBack, isStateObject} from "../Interfaces/stateObjectInterface";
import BlurOverlay from "./BlurOverlay";
import IndicationButtom from '../buttons/AnimateddownArrow/downArrow'
/* ------------------------------------------ Component Description ------------------------------------------
    Render a scrollable_Container encapsulating the passing child. The Scrollable_Container takes 100% (x,y) of the parent container. Overflow by 
    elements of the parent container are display as scrollable. 

    The following property holds true : 
        1) scrollable_Container takes 100% (x,y) of the parent container (Div)
        2) Overflow in the X-Axis are scrollable, hence the size of children does not effect the containers (parent, scrollable) 
        3) Overflow in the Y-Axis are wrapped to the next line, hence the size of children does not effect the containers (parent, scrollable) 

    This Component takes the following through props :
        1) useReference : A callback func assinging scrollable container to some parent useRef variable.
        2) useStateReference : A reference object by the 'StateObject || ClassStateCallBack' interface. Utilised to establish a reference to the scrollable_Container 
            created through this component, as such, the parenting scope has full-access to the properties of the scrollable_Container. 

            We brifely outline the two interfaces as follows : (Read Full-Interface Description for additional information )
                - StateObject Interface : Utilised for Function Component react implementation. A useState.setState function pointer is utilised to establish the ref
                - ClassStateCallBack Interface: Utilised for Class Based React implementation. A  callback function is utilised taking in the
                    scrollable_Container Ref as parameter which establishes the relation.  
        3) CustomStyle : Custom css property for the wrapper
        4) Child : Child elements
        5) showOverflowNotification : True --> Show arrow indicator where element overflow. Indicator will break the boundaries of the wrapping componenet, that is, it 
            is located at bottom = 0 - (100% of arrow-Indicator size)

    Note : The following conditions must be met for components proper functionality 
        1) Direct parentNode container must inherit the overflow = hidden, position = relative, property to ensure proper container scalling values.
------------------------------------------------------------------------------------------------------------*/


const RenderScrollable:React.FC <{useReference? : ObjectRef<HTMLDivElement> , useStateReference? : StateObject <React.RefObject<HTMLDivElement>> | ClassStateCallBack<React.RefObject<HTMLInputElement>>  
    , customStyle? : React.CSSProperties, children : React.ReactNode , showOverflowNotification? : boolean}> = (props): React.ReactElement => 
{
    let elementRef = useRef<HTMLInputElement>(null);

    useLayoutEffect( () =>
    {
        // console.log("scrollable Updated : ");
        if (props.useStateReference != undefined)
            if (isStateObject(props.useStateReference) == true)
            {
                // console.log("This is a state object");
                (props.useStateReference as StateObject <React.RefObject<HTMLInputElement>>).setItem(elementRef);
            }else{
                // console.log("This is a callBack Object");
                (props.useStateReference as ClassStateCallBack <React.RefObject<HTMLInputElement>>).setItem(elementRef);
             }
        /* Establish reference to scrollable container */
        if (props.useReference != undefined)
        {
            console.log("SEtting funct");
            props.useReference.setFunc(props.useReference, elementRef);
        }
    }, []);

    useLayoutEffect(

        () => {
            let checkOverflow = () => {
                if (elementRef.current != undefined)
                {
            
                        const element = elementRef.current;
                        const scrollTop = element.scrollTop;
                        const overflowHeight = (element.scrollHeight - element.clientHeight) - scrollTop;
                        if (overflowHeight > 2)
                        {
                            if (overflowState != true) {
                                set_overflowState(true);
                            }
                        }else{
                            console.log("At setting to false: " + overflowState);
                            if (overflowState != false){
                                console.log("Setting to false:")
                                set_overflowState(false);
                            } 
                        }
                }
            }
            if (elementRef.current != undefined) elementRef.current.addEventListener("scroll", checkOverflow);
            checkOverflow();
            
            return() => {
                if (elementRef.current)
                {
                    elementRef.current.removeEventListener("scroll", checkOverflow);
                } 
            }
        }
    )
    let [overflowState, set_overflowState] = React.useState<boolean> (false);

     return (
                // Object.assign({ }, props.customStyle)}>
        <>
            {
                     (overflowState && props.showOverflowNotification === true) 
                     &&
                     <div style = {{width :'100%', height :'100%', position:'absolute'}}>
                         <div style = {{ width :'100%', height :'20%', opacity : '0.9', position :'absolute', bottom :'0', transform :'translate(0, 150%)'}}>
                             <IndicationButtom/>
                         </div>
                     </div>
            }
            <div ref = {elementRef} className = {frameCss.scrollableFrame} style = {Object.assign({ }, props.customStyle)}>
                {/* <BlurOverlay parentContainer = {props.useReference} customStyling = {{bottom:'0', right :'0',backgroundColor:'red'}} orientation = "bottom" />
                <BlurOverlay parentContainer = {props.useReference} customStyling = {{top:'0', right :'0', backgroundColor:'red'}} orientation = "top" /> */}
                {props.children}
                {/* <div className = { frameCss.scrollFrameTransition }  style = { Object.assign({ }, props.customStyle) } >
                    {props.children}
                </div> */}
            </div>
        </>
    );
};
  


export default RenderScrollable; 