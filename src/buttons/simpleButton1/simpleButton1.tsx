import BarChartStyling from './styling.module.css';
import DynamicHeading from '../../layouts/dynamicText'
import {ObjectRef} from '../../Interfaces/RefObjectInterface'
import { useLayoutEffect, useRef } from 'react';
import myBrowser from '../../browserHandling/myBrowser';
/* ------------------------------------------ Component Description ------------------------------------------
    Renders a animated button which inherits 100% x,y, position of the direct parent wrapping container. 
    This is achieved by a reference to the dimensions of the 'DynamicHeading' components container which
    is dynamically scaled to fit the container, hence the button also fit in container. 

    Passing paraemeters through props: 
        handleAction : Call back function to handle button click
------------------------------------------------------------------------------------------------------------*/

let RenderButtom : React.FC< {handleAction?: () => void, direction : string}> = (props) => 
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

    let sizeChangeAction = () => {
        if (ButtonResizeContainerRef.ref?.current != undefined && buttonRef.current != null)
            buttonRef.current.style.width = `${ButtonResizeContainerRef.ref.current.clientHeight/2}px`;
    }
    let getDirection=(): React.CSSProperties =>
    {
        switch(props.direction)
        {
            case "down": return { transform : `rotate(90deg)`};
            case "up": return { transform : `rotate(-90deg)`};
            case "right": return { transform : `rotate(0deg)`};
            case "left": return { transform : `rotate(-180deg)` }; 
        }
        return { transform : `rotate(0deg)`};
    }
    
    useLayoutEffect(
        () => {
            sizeChangeAction();
        }
    )
    return (
        <>
            <div className={BarChartStyling.arrowContainer} style ={ Object.assign({width:'100%',height:'100%', position :'relative'}, getDirection())}> 
                <div id = "ButtonResizeContainer" style={{width:'100%',height:'100%',position:'absolute', visibility:'hidden'}}>
                    <DynamicHeading Text={"T"} onChangeAction = {sizeChangeAction} textRef = {ButtonResizeContainerRef} />
                </div>
                <div ref = {buttonRef} onMouseDown={props.handleAction} className = {BarChartStyling.arrow} >
                    <div className={BarChartStyling.arrowtop}/>
                    <div className={BarChartStyling.arrowbottom}/>
                </div> 
            </div>
        </>
    )
}


export default RenderButtom;