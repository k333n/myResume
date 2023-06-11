
import styling from './styling.module.css';
import React, { CSSProperties, ReactElement, ReactText, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { reduceEachTrailingCommentRange } from 'typescript';
import DynamicText from "../dynamicText";
import {StateWrapper} from '../../Interfaces/stateObjectInterface';
import AppleCloseButtom from '../../buttons/closeButtonApple/CloseButtonApple'
import myBrowser from '../../browserHandling/myBrowser';
import ScrollableFrame from '../scrollableFrame';
import {ObjectRef} from '../../Interfaces/RefObjectInterface';
import ImageFrame from '../imageFrame';
import CodeWindow, {WindowState, FileList} from '../codeDemoWindow/CodeWindow';
import { act } from 'react-dom/test-utils';
import DynamicStringHandler from '../Dynamic_StringContent/DynamicString'; 
/* ------------------------------------------ Component Description ------------------------------------------
    Renders a content carosel component inheriting the full width,height of the parenting component. Content 
    is rendered dynamically based on these values.

    The contents of the elements given will utilise the 'Dynamic_StringContent' class to format / structure a
    string of text into its HTMLElement (with styling applied), this is applied to the content description 
    (i.e. props.Description).

    The content_Carosel has two important properties that must be satisfied, this is :
        1)  Parent component must have min-height of 1000px, else overflow will occur. 
        2)  Parent component must have well-defined width, height. 

    The Component take as arguments through props  : 
        Text : String 
        Styling : React.CSSProperties 
        onChangeAction : onChange callback action handler
        isSimpleContainer : boolean, s.t. isSimpleContainer = true IFF its direct parent container and styling given by props
                            is not a flex-box nor grid-box, else isSimpleContainer = false.  This is set to false by default. 
       popup_ZIndex : z_index specified for popup.  
    Note : The following conditions must be met for components proper functionality 
        1) Padding in direct parent container is not yet supported by this compoment, we use additional div-wrapping as solution.           
        2) Direct parentNode container must inherit the overflow = hidden property to ensure proper container scalling values 
           conducted in --> (Ref : 2107)
        3) isSimpleContainer must be specified IFF parent container OR styling given is : 
                A) A flex box
                B) Grid Box
------------------------------------------------------------------------------------------------------------*/
/**
 *  Given the contentRef and val, set content.width = val%, content.height = val%. 
 */
let set_ContentContainerSize = ( Content_Ref : React.RefObject<HTMLDivElement>, Width :number, Height : number) : void =>{

    if (Content_Ref.current != null)
    {
        Content_Ref.current.style.width = `${Width}px`;
        Content_Ref.current.style.height = `${Height}px`;
    }
}

/** 
 * Iterate to a new row by settingState to new row value
 * @direction : 1) "forward", 2) "backward"; to specify which direcition to iterate. 
 */
let iterateRow = (event :React.MouseEvent, direction : String, currentRow : StateWrapper<number>, total_ElementSize : number, ElementSize : number,  Horizontal_ElementSize : number, contentWrapper_Ref : React.RefObject<HTMLDivElement> ) => {
    if (contentWrapper_Ref.current != undefined) 
    {
            // let contentSize = contentContainer_Ref.current.clientHeight;
            
            let totalnumber_Rows = Math.ceil(total_ElementSize / Horizontal_ElementSize); 
            let prev_RowSize = currentRow.item;
            let activeRowsize = Math.floor(contentWrapper_Ref.current.clientHeight / ElementSize); // currently active rows 
            let rowsOverflown = ((totalnumber_Rows - prev_RowSize) - activeRowsize) ;
            // console.log("totalnumber_Rows" + totalnumber_Rows);
            // console.log("prev_RowSize" + prev_RowSize);
            // console.log("container_RowSize" + container_RowSize);

            if (direction === "forward")
            {
                if (rowsOverflown > 0 )
                {
                    console.log( rowsOverflown + " row is overflown");
                    currentRow.setItem(currentRow.item + activeRowsize);
                }
            }else if (direction === "backward"){
                let decrement_Val = currentRow.item - activeRowsize;
                if (decrement_Val < 0) decrement_Val = 0;
                currentRow.setItem(decrement_Val);
            }

    }
}
/** position elements after currentRow change (or on rescale) */
let positionElements = (contentContainer_Ref :React.RefObject<HTMLDivElement>, contentSize: number, currentRowWrapper: StateWrapper<number>, Horizontal_ElementSize: number ) => {
    if (contentContainer_Ref.current!= undefined)
    {
        let toS = contentSize * currentRowWrapper.item;
        contentContainer_Ref.current.style.transform = `translate(0,-${toS+0.4}px)`;
    }
}


/** Handle Carosel element Click  */
let itemHandler = (event :React.MouseEvent | undefined, action : String,  Horizontal_ElementSize :number,  Items : items[], window_States : WindowState[], overlay_Wrapper : StateWrapper<{ item : items, visible : boolean, windowState?: WindowState | undefined } | undefined>) => {
   switch(action){
        case "close" : 
            overlay_Wrapper.setItem(undefined); 
        break;
        case "open" :
            if (event != undefined){
                let item : HTMLDivElement = event.currentTarget as HTMLDivElement;
                let itemNumber : number  = parseInt( ( (item.dataset.key != null) ? item.dataset.key : "-1"));
                let state : WindowState | undefined;

                if (itemNumber != -1) {
                    state = window_States[itemNumber];
                }
                console.log("window " + itemNumber + " has been opened");
                overlay_Wrapper.setItem({item : Items[itemNumber],  visible : true, windowState :state}); 
            }
        break;
   }
}

export interface items {
    Subject : String;
    Description : String;
    img_Url : String;
    file_List : FileList[];
}


let Horizontal_ElementSize:number;

let Render : React.FC<{ Items : items[], Title : String, Description :String, popup_ZIndex : number, TitleStyling? : React.CSSProperties}> = (props) => { 
   
    
    let spacing : number = 1; // gap percentage between elements
    let total_elementSize = props.Items.length;
    let content_BoxSizing :number = (100/Horizontal_ElementSize) ;
    let contentContainer_Ref  = React.useRef<HTMLDivElement>(null);
    let container_Ref = React.useRef<HTMLDivElement> (null);
    let contentWrapper_Ref = React.useRef<HTMLDivElement>(null);
    let [currentRow, set_currentRow] = React.useState<number>(0); 
    let currentRowWrapper :StateWrapper<number> = {
        item : currentRow,
        setItem : set_currentRow       
    }
    let [contentSize, set_contentSize] = useState<number>(0);
    let [contentContainer_Sizing, set_contentContainerSizing] = useState<{w : number, h : number}>( {w:0, h :0});




    /** Listeners setup */
    useLayoutEffect( 
        ()=>{
            let timeout_ID: NodeJS.Timeout | null = null;
 
            const re_scale = () =>
            {
                let rescalePercentage = 0.5;
                // Rescale values
                 if (window.innerWidth < 1000)
                {
                    Horizontal_ElementSize = 2;
                    rescalePercentage = 1;
                }else{ 
                    Horizontal_ElementSize = 3;
                    rescalePercentage = 0.5;
                }

                /** Dynamically rescale container & element */
                if (container_Ref.current != undefined){
                    let container_Width = container_Ref.current.clientWidth;
                    let verticalFit = Math.floor(container_Ref.current.clientHeight / contentSize); // the amount that will fit 

                    let new_ContainerState = {w: rescalePercentage * container_Width, h: contentSize * verticalFit};
                    let new_ElementSize = (new_ContainerState.w / Horizontal_ElementSize)-0.5;

                    if (new_ContainerState.w != contentContainer_Sizing.w || new_ContainerState.h != contentContainer_Sizing.h) {
                        set_contentContainerSizing(new_ContainerState);
                    }

                    if (new_ElementSize != contentSize) set_contentSize(new_ElementSize);
                 }
            };
            
            const rescale_Handler = () => {
                if (timeout_ID) {
                  clearTimeout(timeout_ID); // cancel previous setTimeout Call if it has not been executed.
                }
                
                timeout_ID = setTimeout(re_scale, 0.1 ); // initialise setTImeout call
            };
            
            rescale_Handler();
            window.addEventListener("resize", rescale_Handler);
            return () => {
                window.removeEventListener("resize", rescale_Handler);
                if (timeout_ID) clearTimeout(timeout_ID); // previous setTimeout Call
                
                
            }
        },[contentSize, contentContainer_Sizing]
    )


    /** Reposition elements on re-render */
    useLayoutEffect(
        () =>{
            positionElements(contentWrapper_Ref, contentSize, currentRowWrapper, Horizontal_ElementSize);
        }
    );


    let viewMore_Handler = (event :React.MouseEvent, direction : String ) => {
        iterateRow( event, direction, currentRowWrapper, total_elementSize, contentSize, Horizontal_ElementSize, contentContainer_Ref);
    }


    let [overlayState, set_OverlayState] = useState<{item : items, visible : boolean, windowState?: WindowState}> ();
    let overlayState_Wrapper : StateWrapper<{ item : items, visible : boolean, windowState?: WindowState } | undefined> = {
        item : overlayState,
        setItem : set_OverlayState,
    } 

    let [globalFontSize, set_GlobalFontSize] = useState<number> (10); // global FontSize. 

    let Dynamic_globalFontRef:ObjectRef<HTMLParagraphElement> ={
        setFunc(ref, toRef) {
            if (toRef.current != undefined) {
                ref.ref = toRef;
            }
        },
        ref : undefined
    }

    let dynamicFontChange_Handler = () => {
        if (Dynamic_globalFontRef.ref != undefined){
                set_GlobalFontSize(myBrowser.RefHandling.getRefFontSize(Dynamic_globalFontRef.ref));
        }
    }


    /** CodeWindow initialisation & States, that is : the CodeDemo component */
    let CodeWindow_Elements : { windowStates:WindowState[], windowElement : React.ReactElement[] } = React.useMemo( () => { 
        let states :{ windowStates:WindowState[], windowElement : React.ReactElement[] }  = {
            windowStates : [],
            windowElement : []
        };

        for (let i=0; i < props.Items.length; i++)
        {
        
            states.windowStates.push( {windowState :0, setWindowState : undefined});     // Initialise all codeWindow to closed. 
            states.windowElement.push( <> <CodeWindow popup_ZIndex={(props.popup_ZIndex +1)} Window_State = {states.windowStates[i]} Title = {props.Items[i].Subject} fileList = {props.Items[i].file_List} /></> );
        }

        return states;
    }, props.Items);


    return(
        <>
            { /** Render WindowElements */ CodeWindow_Elements.windowElement }

            {/* <CodeWindow Window_State={windowStates} Title ={"Tab1"} fileList = {fileList}/> */}
            {   
                (overlayState!= undefined && overlayState.visible) &&
                <div style = {{zIndex:`${props.popup_ZIndex}`, width :'100vw', height:'100vh', position:'fixed', top:'0'}}>
                    <div className= {styling.overlay_Container} >
                        <div className= {styling.close_OverlayButtonContainer}>
                            <AppleCloseButtom handleAction={ () =>{ console.log("Close btn clicked!"); itemHandler(undefined, "close",  Horizontal_ElementSize, props.Items, CodeWindow_Elements.windowStates, overlayState_Wrapper)}}/>
                        </div>
                        <div style = {{width:'100%', height :'100%',padding :'2%', boxSizing:'border-box', position:'relative'}}> 
                            <div className= {styling.overlay_ContentContainer}>
                                    <div className= { styling.overlayImageContainer } > 
                                        <div style = {{  display:'flex', width :'100%', height :'100%', gap :'2%', flexDirection:'column', alignItems:'normal', justifyContent:'center' }}>
                                           <div style = {{width:'100%', height:'90%', position:'relative'}}>
                                                <div className = {styling.viewProjectWrapper} onMouseDown={ () => { console.log("Attemping to open window"); if (overlayState != null) if (overlayState.windowState?.setWindowState != undefined) {console.log("Opening codewindow") ; overlayState.windowState.setWindowState(1)}  }}  
                                                style = {{fontSize : `${globalFontSize*2}px`}}>  
                                                    <p style ={{ padding:'0', margin:'0', display:'inline' }}> VIEW PROJECT CODE</p>
                                                </div>
                                                <ImageFrame src = {`${overlayState.item.img_Url}`}/>
                                            </div> 

                                        </div>
                                    </div>
                                    <div style = {{ overflow:'hidden', padding :'6%', boxSizing:'border-box', color :'white', position:'relative', width:'100%', height :'100%', fontSize :`${globalFontSize*2}px`}}> 
                                        <ScrollableFrame showOverflowNotification={true} > 
                                            <div style = {{fontSize:`${globalFontSize*5}px` , marginBottom:'5px', color:'inherit', fontWeight:'700' }}> 
                                                {overlayState.item.Subject} 
                                            </div>
                                            <div style = {{fontSize:`${globalFontSize*2}px`, color:'inherit'}}> 
                                                { DynamicStringHandler.generateElement(overlayState.item.Description)}  
                                            </div>
                                        </ScrollableFrame>
                                    </div>
                                 
                            </div>
                        </div>
                    </div>
                </div>
            }
            
                <div style = {{width:'100%', height :'100%', display:'flex', justifyContent :'center'}}>

                    <div style = {{maxWidth:'3000px' , minHeight:'1000px', width :'100%', height :'100%'}}> 
                        <div style = {{display:'flex', flexDirection:'column',  position :'relative',  maxHeight:'20%', width:'100%', alignItems:'center', paddingBottom:'1%', boxSizing:'border-box'}}> 
                            <div className = {styling.mainTitle + ' ' + styling.textOverflow} style = { Object.assign( {WebkitLineClamp :'2', maxHeight:'49%', marginBottom:'1%', display:'flex', flexDirection:'column', justifyContent:'flex-end', alignItems:'center'}, props.TitleStyling) }>
                                    {props.Title}
                            </div>
                            <div  className= {styling.mainDescription + ' ' + styling.textOverflow}  style = { Object.assign ({WebkitLineClamp :'2', maxHeight :'50%'}, props.TitleStyling)}>
                                    {props.Description} 
                            </div>
                            <div className={styling.divider} style = {{position:'absolute', bottom:'0px'}}>
                                    
                            </div>
                        </div>
                        <div style = {{width:'100%', height :'80%', padding :'1%', boxSizing:'border-box', position:'relative'}}>
                                <div style ={{zIndex:'1', width:'100%', overflow :'hidden', position:'absolute', top:`${contentContainer_Sizing.h}px`, transform :'translate(0,100%)'}}>
                                        <div className = {styling.viewMore_Container}>
                                                {
                                                    ((currentRowWrapper.item + Math.floor(contentContainer_Sizing.h / contentSize)) * Horizontal_ElementSize < total_elementSize) &&
                                                    <div className={styling.button_boxcontainer} onMouseDown = { (event:React.MouseEvent) => {viewMore_Handler(event, "forward")} }   > 
                                                        view more 
                                                    </div>  
                                                }
                                                {
                                                    currentRowWrapper.item >0 &&
                                                    <div className={styling.button_boxcontainer} onMouseDown ={ (event:React.MouseEvent) => {viewMore_Handler(event,"backward")} } > 
                                                        view Less 
                                                    </div>  

                                                }
                                        </div>
                                </div>
                                <div ref = {container_Ref} className = {styling.container} > 
                                        <div ref = {contentContainer_Ref} style ={{ position:'relative', overflow :'hidden', height : `${contentContainer_Sizing.h}px`, width : `${contentContainer_Sizing.w}px`, transition :'transform 1s'}} >
                                        <div ref ={contentWrapper_Ref} className = {styling.contentContainer}>
                                                {
                                                    (() => {
                                                        const listItems = [];
                                                        for (let i = 0; i < props.Items.length; i++) {
                                                            listItems.push(
                                                                <div className={styling.contentItems} key ={i} style = {{  width:`${contentSize}px`, height :`${contentSize}px`, paddingLeft:`${spacing/2}%`, paddingRight:`${spacing/2}%`, paddingTop:`${spacing}%`}}> 
                                                                    <div className= {styling.elementContainer} style ={{ backgroundImage : `url(${props.Items[i].img_Url}`}} onMouseDown={ (event : React.MouseEvent) => { itemHandler (event,"open",  Horizontal_ElementSize, props.Items, CodeWindow_Elements.windowStates, overlayState_Wrapper)} } data-key ={i}  > 
                                                                        {/* <div className={styling.Element_Title} style = {{padding:'2%', boxSizing:'border-box'}}>
                                                                            {Items[i].Subject}
                                                                        </div> */}  
                                                                        <div className = { styling.ElementInformationContainer }>
                                                                            <div style = {{position:'relative', display:'grid',  width:'100%', height :'100%', gridTemplateRows :'15% 60% 15%', gap :'5%', fontSize :`${globalFontSize}px`} }> 
                                                                                <div className= {styling.Element_Title} >
                                                                                    {
                                                                                        // Dynamic FontSize Generator //
                                                                                        i==0 &&
                                                                                        <div style = {{width:'100%', height:'100%', position:'absolute' , color :'red', visibility:'hidden'}}>
                                                                                            <DynamicText Text={"A"} textRef = {Dynamic_globalFontRef}  onChangeAction = {dynamicFontChange_Handler}/>
                                                                                        </div>
                                                                                    }
                                                                                    {props.Items[i].Subject} 
                                                                                </div>
                                            
                                                                                <div className= {styling.Element_Description} style = {{position:'relative', width :'100%', height :'100%', whiteSpace:'normal'}}>
                                                                                    <ScrollableFrame showOverflowNotification = {true}> 
                                                                                        <div className= {styling.Element_Description}>
                                                                                            {DynamicStringHandler.generateElement(props.Items[i].Description)} 
                                                                                        </div>
                                                                                    </ScrollableFrame>                                                                    
                                                                                </div>
                                                                                <div className={styling.Element_LearnMore}>
                                                                                    Learn More
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        return listItems;
                                                    })()
                                                }
                                        </div>
                                        
                                        </div>
                                        
                                </div >

                    </div>
                </div>
            </div>
        </>
    );
}



export default Render;