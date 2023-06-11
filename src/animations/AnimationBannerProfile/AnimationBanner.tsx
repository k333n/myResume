
import React, { useLayoutEffect, useRef, useState } from 'react';
import myBrowser from '../../browserHandling/myBrowser';
import MyBrowser from '../../browserHandling/myBrowser';
import StateWrapper from '../../Interfaces/stateObjectInterface';
import ImageFrame from '../../layouts/imageFrame';
import DynamicHeading from '../../layouts/dynamicText';
import ScrollableFrame from '../../layouts/scrollableFrame';
import './Styling.css';


/* ------------------------------------------ Component Description ------------------------------------------
    Renders the animation banner inheriting 100% of the x,y, dimensions of the direct parent container, and hence
    dynamic scaling is subject to the parent container scaling bejaviour. 

    This component consist of 2 side (left, right) which is focused by the mouse location relative to the component
    container, and focus (visual reflection) is coordinated with the cropping of the two image_URL and side 
    content provided by props based on the focused state (side). 

    This component takes as input by props :
        AnimationBannerInformation = Object of : { title_Left : String, title_Right : String, desc_Left : String, desc_Right : String, image_LeftUrl :String, image_RightUrl : String }
------------------------------------------------------------------------------------------------------------*/

 let Directions : {right : string, left : string, none : undefined} = {
    right : "right",
    left : "left",
    none : undefined
}
export interface AnimationBannerInformation {
    title_Left : String,
    title_Right : String,
    desc_Left : String,
    desc_Right : String,
    image_LeftURL : String,
    image_RightURL : String,
}

/** Shift centerImage.ref by percentageToShift ∈ {0.00, .., 1.00}  amount in the direction given by directionState. */
let ShiftCenterImage = (CenterImageRef : React.RefObject<HTMLDivElement>, containerRef : React.RefObject<HTMLDivElement>, directionState : StateWrapper<string|undefined> , percentageToShift : number) =>
{
    if (CenterImageRef.current != null)
    {
        let CenterImageWidth = myBrowser.RefHandling.getRefWidth(CenterImageRef);
        let ContainerWidth = myBrowser.RefHandling.getRefWidth(containerRef);
        let gapWidth = (ContainerWidth - CenterImageWidth); // this is the amount of emptySpace in Container (x-axis) with CenterImage centered.
        let amountToShift = ((1 - percentageToShift) * (gapWidth/2));

        switch(directionState.item)
        {
            case Directions.left : 
                CenterImageRef.current.style.left = `${(ContainerWidth - (CenterImageWidth/2)) - amountToShift }px`;
                break;
            default : // case Direction.right OR Direction.none
                CenterImageRef.current.style.left = `${  ((CenterImageWidth/2) + amountToShift ) }px`;
                return;        
        }
    }
}  

/* Initialise the directContainer div to be that of the full Width,Height of its ancestor container 'CenterImage'  */
let initialiseImageContainerSize = (  ImageContainerRefs : {  DirecterContainerRef : React.RefObject<HTMLDivElement>, UpperContainerRef :React.RefObject<HTMLDivElement> }[], CenterImageRef :  React.RefObject<HTMLDivElement> ) =>
{
     /* Initial direct container Size */
     for (let i =0; i < ImageContainerRefs.length; i++)
     if ( (ImageContainerRefs[i].DirecterContainerRef.current != null))
     {
         let direct_Node = (ImageContainerRefs[i].DirecterContainerRef.current as HTMLDivElement); 
         direct_Node.style.width = `${myBrowser.RefHandling.getRefWidth(CenterImageRef)}px`
         direct_Node.style.height = `${myBrowser.RefHandling.getRefHeight(CenterImageRef)}px`    
     }
}

let RenderAnimationBanner : React.FC <{AnimationBarInfo : AnimationBannerInformation}> = (props) =>
{
    let [windowDimensions, setWindowDimensions] = useState<number>(1);
    let containerRef = React.useRef<HTMLDivElement>(null);
    let CenterImageRef = React.useRef<HTMLDivElement>(null);
    let [direction , setDirection] = useState<string | undefined> (Directions.none); // s.t. directon ∈ {left, right, undefined} , 
    let directionStateWrapper : StateWrapper<string | undefined> = {
        item : direction,
        setItem : setDirection
    };

    let [shiftPercentage, setShiftPercentage] = useState <number> (0);

    useLayoutEffect(
        () => { 
            /** Set MouseListener function for component container, container.ref must be defined on call!  */
            let Current_setContainerListener = (event : MouseEvent) : void =>  {
                let percentageX = myBrowser.RefHandling.getMousePerecentageX(containerRef, event.x);
                
                if (percentageX != undefined)
                {
                    if (percentageX < 0.50 && direction != Directions.left) {
                        setDirection(Directions.left);
                    } else if (percentageX >= 0.50 && direction != Directions.right) {
                        setDirection(Directions.right);
                    }else if (percentageX != shiftPercentage)
                    {
                        percentageX = (direction === Directions.left)  ? (1 - (percentageX / 0.5)) : ( 1-((1 - percentageX) / 0.5) );
                        setShiftPercentage(percentageX);
                    } 
                }
            };

            /** Reset image to center on mouse_component exit */
            let mouseExit_Handler = (event : MouseEvent) => { 
                setDirection(Directions.none);
                setShiftPercentage(0);
            }

            if (containerRef.current != null)
            {
                /* (Ref :3129) : Removal and setup of actionListeners */
                containerRef.current.addEventListener("mousemove", Current_setContainerListener);
                containerRef.current.addEventListener("mouseout", mouseExit_Handler);

            }
            return () => {
                window.removeEventListener('mousemove', Current_setContainerListener);
                window.removeEventListener('mouseout', Current_setContainerListener);
            }
        },
        
    [[], direction, containerRef]);
    
    useLayoutEffect( 
        ()=>
        {

            ShiftCenterImage(CenterImageRef, containerRef, directionStateWrapper, shiftPercentage);
        }
    )
    useLayoutEffect(
        () => {
            if (containerRef.current != null)
            {
                window.addEventListener("resize", (event) => { 
                    initialiseImageContainerSize(ImageContainerRefs, CenterImageRef);           /* Re-Initialise imageContainer sizing on resize */
                    setWindowDimensions(window.innerWidth * window.innerHeight);                /* Re-Render on window size change for change update */
                });
                initialiseImageContainerSize(ImageContainerRefs, CenterImageRef);               /* Initial imageContainer sizing */
            }
        }
        
    ,[]);

    let ImageContainerRefs : {  DirecterContainerRef : React.RefObject<HTMLDivElement>, UpperContainerRef :React.RefObject<HTMLDivElement> }[] = [
        { // Image 1 containers
            DirecterContainerRef : React.useRef<HTMLDivElement>(null),
            UpperContainerRef : React.useRef<HTMLDivElement> (null)
        },
        { // Image 2 containers
            DirecterContainerRef : React.useRef<HTMLDivElement> (null),
            UpperContainerRef : React.useRef<HTMLDivElement> (null)
        },
    ];

    return (
        <>
            <div style = {{width :'100%', height :'100%', position:'relative'}}>
                <div ref = {containerRef}  id = "containerRef">
                    {/* Coder Component */}
                    <div id = "coder_Container">
                        <div className='HeadingContainer' style = {{left:'0%', bottom:'50%', opacity :`${ ((direction === Directions.left || direction === Directions.none) ? 100 : 0) } `}}>
                            <DynamicHeading Text={`${props.AnimationBarInfo.title_Left}`} Styling= {{fontWeight :'700',display:'grid', alignContent:'end', textAlign:'center'}}/> 
                            <div style = {{width:'100%', height :'100%'}}>
                                <ScrollableFrame showOverflowNotification ={true}>
                                    <p className = "description">
                                        {
                                            props.AnimationBarInfo.desc_Left
                                        }
                                    </p>
                                </ScrollableFrame>
                            </div>
                        </div>
                    </div>

                    {/* Designer Component */}
                    <div style ={{zIndex:'10',position:'absolute', width :'50%', height:'100%', padding :'5%', boxSizing:'border-box', right:'0%'}}> 
                        <div className='HeadingContainer'  style = {{bottom:'50%', right :'0%', transition :'opacity 1.5s', opacity :`${ ((direction === Directions.right || direction === Directions.none) ? 100 : 0) } `}}>
                            <DynamicHeading Text={`${props.AnimationBarInfo.title_Right}`} Styling= {{fontWeight :'700', display:'grid', alignContent:'end', textAlign:'center'}} />
                            <div style = {{width:'100%', height :'100%'}}> 
                                <ScrollableFrame showOverflowNotification ={true}> 
                                    <p className= "description"> { props.AnimationBarInfo.desc_Right } </p>
                                </ScrollableFrame>
                            </div>
                        </div>
                    </div>
                    {/* CenterImage Component */}
                    <div ref = {CenterImageRef} style = { {transition :'left 2s', width : "75%", height : "100%", left :'50%', position:'absolute', transform:'translate(-50%, 0)'}}> 
                        <div ref = {ImageContainerRefs[0].UpperContainerRef} style={{position :'absolute', bottom :'0%', 
                            width:`${(direction === Directions.right) ? (50+ (shiftPercentage *50)) : 50}%`, zIndex : `${ (direction === Directions.right ? 1 : 0)}`, height:'100%', overflow :'hidden',}}> 
                            <div ref = {ImageContainerRefs[0].DirecterContainerRef} style={{ width:'0%', height:'0%'}}> 
                                <ImageFrame src= {`${props.AnimationBarInfo.image_LeftURL}`} container_styling={{  position:'absolute', bottom : '0px', width:'100%', height :'100%'}} image_Styling ={{objectPosition:'bottom'}} />
                            </div>
                        </div>

                        <div ref = {ImageContainerRefs[1].UpperContainerRef} style={{position :'absolute', right:'0px', bottom :'0%', 
                            width:`${(direction === Directions.left) ? (50+ (shiftPercentage *50)) : 50}%`, zIndex : `${direction === Directions.left ? 1 : 0}` , height:'100%', overflow :'hidden',}}> 
                            <div ref = {ImageContainerRefs[1].DirecterContainerRef} style={{position :'absolute', right:'0px', width:'0%', height:'0%'}}> 
                                <ImageFrame src= {`${props.AnimationBarInfo.image_RightURL}`}  container_styling={{  position:'absolute', bottom : '0px', width:'100%', height :'100%'}} image_Styling ={{objectPosition:'bottom'}} />
                            </div>
                        </div>
                    </div>
                    {/* CenterImage Component End */}
                </div>
            </div> 
        </>
    );
}
export default RenderAnimationBanner;