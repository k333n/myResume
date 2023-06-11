
import CloseButtom from '../../buttons/macButtons/MacCloseButton';
import MinButton from '../../buttons/macButtons/MacMinimiseButton';
import DynamingHeading from '../dynamicText';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import StateWrapper from '../../Interfaces/stateObjectInterface';
import myBrowser from '../../browserHandling/myBrowser';
import { off } from 'process';
import {ObjectRef} from '../../Interfaces/RefObjectInterface'
import ScrollableFrame from '../scrollableFrame';
import { JsxElement } from 'typescript';
import CodeInterface from './interFaces/CodeInterface';
import CodeHandler, { codeHandler } from './handlers/CodeHandler';
/* ------------------------------------------ Component Description ------------------------------------------
    This component represent a single code-Window (reference.png) instance. This window takes as parameter the 
    following :
        1) WindowState :
            This is a interface declared within this component describing the currentState, it consist of :
                - windowState : number representatin of the initial state  (i.e. : opened, closed, minimised) of this code-window
                - setWindowState : A call-back Function for further state-changes. 
        2) Title : String representation of the main title of this code-window
        3) FileList[] : An Array of FileList instances
            A single FileList instance consist of :    
                - key : unique identifier (within this fileList Array)
                - FileTitle : String representation of the file Name
                - content : String represention of the content in this file
        4) MinimisedController : StateWrapper<React.ReactElement> 
            Represent the minimisedController, a sepearate component (MinimisedInterface.tsx) utilised for arrow-indication to shift minimised code-windows. 
            MinimisedController is utilised to prevent unnecessary re-render at the parenting-level of the tree, hence we initialise the 
            minimisedController component at the parenting scope, alongside the different instances of code-window. 
            
            We pass this React.useState reference through the 'StateWrapper' object into this component, and thereby allowing codeHandler
            to provoke it for change (re-render); only one instance of it need be passed so that the global codeHandler, hence TabHandler
            class has it as reference, This is conducted at --> (Ref : 9302)..
        popup_ZIndex : z_index value for popup
    Declaration Example :
        let fileList : FileList[] = [
            {
                key : 1,
                FileTitle : "main.java",
                content :  "DDDDDDDDDDescription : Given an array A of integers, we return The array in sorted order (if any exist) . "
            },
            {
                key : 2,
                FileTitle : "test.java",
                content :  "[22][11][5]"
            },
        ];   

        let [WindowState , setWindowState] = React.useState<number>(1);
        let windowStates: WindowState = {
            windowState : 0,
            setWindowState : undefined,
        }
        let CodeMinWrapper : StateWrapper<React.ReactElement> = {
            item : <></>,
            setItem : useState 
        }
        // below represent jsx component (i.e. Return())
        <p onMouseDown={() => { if (windowState_6.setWindowState != undefined) {  windowState_6.setWindowState(1);  } }}> CodeWindow_0 </p>
        <MinimisedInterface MinWrapper={CodeMinWrapper}/>
        <CodeWindow Window_State={windowStates} Title ={"CodeWindow_0"} fileList = {fileList} MinimisedController = {CodeMinWrapper}/>
 
------------------------------------------------------------------------------------------------------------*/

let WindowStateVal : {close:number, opened : number, minimised:number, undef : number} = {
    close : 0,
    opened : 1,
    minimised : 2,
    undef : 3
}
export {WindowStateVal};
export interface FileList {
    key : number,
    FileTitle : String,
    content : String
}

/* Interface used for external reference to setters and getters for window-state values */
export interface WindowState {
    windowState:number,
    setWindowState : ((toSet : number) => void) | undefined;
};

/** Render the code Interface portion of codewindow, that is : id = Code_Container div container within CodeWindow. The content to be
 *  rendered is based on the selected working-file established in --> (Ref : 3321).
 */
let renderCodeInterface = ( fileWrapper : StateWrapper<FileList | undefined>, globalFontSize : number ) :JSX.Element =>
{
        /** On nothing selected by --> (Ref : 3321) */
        if (fileWrapper.item === undefined) 
        {
            return (
                <div style= {{width:'100%', height :'100%', display :'flex', justifyContent :'center', alignItems :'center', color :'white'}}> 
                    <div style = {{width :'65%', height:'10%'}}>  <DynamingHeading Text={"Select some working file!"}/>  </div>
                </div>
            );
        };

        /** else, we render appropriate content */
        return (
            <>
                 <CodeInterface file = {fileWrapper.item } globalFontSize = {globalFontSize} />
            </>
        );
}


/** (Ref : 3321) --> Render the working files tab, that is : id = WorkingFiles_List div container within CodeWindow!  */
let renderWorkingFiles = ( fileWrapper : StateWrapper<FileList | undefined>,  fileLists : FileList[], globalFontSize : number ) :JSX.Element =>
{
        /* Change selected file based on key */
        let selectFunction = (event : React.MouseEvent, selectedFile : FileList) => { 
            if (fileWrapper.item != selectedFile) fileWrapper.setItem(selectedFile);
        };

        return (
            <>
                {
                    fileLists.map( (element) : JSX.Element => {
                        return ( 
                            <div key = {element.key} onClick = {(event) => { selectFunction(event, element); }} style = {{backgroundColor : `${(element === fileWrapper.item) ? 'grey' : ''} `, cursor :'pointer', width:'100%', minHeight :'15px', fontSize :`${globalFontSize}px`, color :'white', marginBottom :"5px"}}> 
                                 {element.FileTitle}
                            </div>
                        );
                    })
                }
            </>
        );
}

/** (Ref : 3310)  --> collapse/ or expand the centerBlockDiv on id = collapseButton click. The previous state is
 *  inverted, i.e : if state = collapsed, we expand.  
 */
let collapseCenterBlock = (centerBlock_Ref : React.RefObject<HTMLDivElement>, re_Render : StateWrapper<number> ) => {

        if (centerBlock_Ref.current != undefined)
        {
            let WorkingFilesContainer : HTMLDivElement = (centerBlock_Ref.current.firstChild as HTMLDivElement);
            let WorkingFiles_Controller : HTMLDivElement = (WorkingFilesContainer.firstChild as HTMLDivElement);
            let Controller_Title : HTMLDivElement = (WorkingFiles_Controller.firstChild as HTMLDivElement)
            let Controller_CollapseButton : HTMLDivElement = (WorkingFiles_Controller.lastChild as HTMLDivElement)
            let WorkingFiles_List : HTMLDivElement = (WorkingFilesContainer.lastChild as HTMLDivElement);
            let centerBlock_State = myBrowser.RefHandling.getRefAttribute(centerBlock_Ref, "data-key"); // we let 1 = expanded, -1 = collapsed 

            if (centerBlock_State === '1') // if it is expanded, we collapse by 
            {
                centerBlock_Ref.current.style.gridTemplateColumns = '5% 77.5% 17.5%'; 
                WorkingFiles_Controller.style.gridTemplateColumns = '0% 100%';
                Controller_Title.style.opacity = "0%"; /* set workingFile title to invisible */
                WorkingFiles_List.style.opacity = "0%"; /* set workingFile list to invisible */ 
                Controller_CollapseButton.innerHTML = ">";  
                myBrowser.RefHandling.setRefAttribute(centerBlock_Ref, "data-key", "-1");
            } else if (centerBlock_State === '-1') // else we expand
            {
                centerBlock_Ref.current.style.gridTemplateColumns = '20% 70% 10%'; 
                WorkingFiles_Controller.style.gridTemplateColumns = '80% 20%';
                Controller_Title.style.opacity = "1";  /* set workingFile title to visible */
                WorkingFiles_List.style.opacity = "1"; /* set workingFile list to visible */    
                Controller_CollapseButton.innerHTML = "<";  
                myBrowser.RefHandling.setRefAttribute(centerBlock_Ref, "data-key", "1");
            }

            let transitionFunct = (event : TransitionEvent) => {
                let event_Trigger = event.target as HTMLDivElement;
                let Event_Target = event.currentTarget as HTMLDivElement;
                    
                if (event_Trigger === Event_Target) {
                    console.log("Event triggered complete!");
                    event_Trigger.removeEventListener ('transitionend', transitionFunct);
                    re_Render.setItem(++re_Render.item);
                }  
            }
            centerBlock_Ref.current.addEventListener('transitionend', transitionFunct); 
        }
};


/**  Initialise or set WindowState to given toSet value if valid, else we set windowState to undefinied */
let setWindowState = (toSet : number,  WindowStateWrapper : StateWrapper<number>) =>
{   
        // console.log("SetWindowState set to :" + toSet);
        if (toSet >=0 && toSet <= 2) {
            if (WindowStateWrapper.item != toSet)  WindowStateWrapper.setItem(toSet);
        }else if (WindowStateWrapper.item != WindowStateVal.undef){
            WindowStateWrapper.setItem(WindowStateVal.undef);
        }
}

let useWindowState = (State:number) : [WindowStateWrapper : StateWrapper<number>] =>
{
        let [get_WindowState, set_WindowState] = useState<number>(State); /** 'setWindowState()' should be used for initialisation */
        let WindowStateWrapper : StateWrapper<number> = {item : get_WindowState, setItem : set_WindowState }
        return [WindowStateWrapper];
}


/**
 *  Rescale code-window (i.e. styling) based on window size;
 */
let dynamic_Rescale = ( set_GlobalFontSize : React.Dispatch<React.SetStateAction<number>> ) => {
        let w_Height = window.innerHeight;
        let w_Width = window.innerWidth;
        let fontSizing = -1;

        if (w_Width> 400 ) fontSizing = 15;
        else fontSizing =10; 
        
        set_GlobalFontSize(fontSizing);
}


let RenderCodeWindow : React.FC <{Window_State : WindowState, Title : String,  fileList : FileList[], MinimisedController? : StateWrapper<React.ReactElement> , popup_ZIndex : number}> = (props) => {

        /** WindowStateWrapper represent State of window;  State changes must be changed via function : 'setWindowState(newState, WindowStateWrapper)' */
        let [WindowStateWrapper] = useWindowState(WindowStateVal.undef);  
        let containerRef = useRef<HTMLDivElement> (null);
        let TopBlock = useRef<HTMLDivElement> (null);
        let WindowRef = useRef<HTMLDivElement> (null);
        let [get_TranslateState, set_TranslateState] = useState<string>("undef"); /** Hold translate-State for re-render initiallised at (Ref : 3390) && utilised At (Ref : 3012) for window drag */
        let [reRender, setReRender] = useState<number>(0); 
        let reRenderWrapper : StateWrapper<number> = {
            item : reRender,
            setItem : setReRender
        }
        let centerBlock_Ref = useRef<HTMLDivElement>(null);
        let [selectedFile, set_SelectedFile] = useState<FileList | undefined> (undefined); /** Represent the currently selectedFile */
        let selectedFileWrapper : StateWrapper<FileList | undefined> = {
            item : selectedFile, 
            setItem : set_SelectedFile
        } 
        let [globalFontSize, set_GlobalFontSize] = useState<number>(15); /** global font size. */
        let window_Key = useRef<number> (-1);  /** unit key associated with this instance of code_window, Established at (Ref : 0032). */


        /** (Ref : 3390) --> initialise initial codeWindow position */
        useLayoutEffect(
            () =>{
                if (get_TranslateState === 'undef')
                {
                    if (containerRef.current != undefined){
                        window_Key.current = CodeHandler.addElement(containerRef); // add and return unique key associated with this instance of code window (Ref : 0032).
                        let w_W = myBrowser.getBrowserWidth()/2; 
                        let w_H = myBrowser.getBrowserHeight()/2;
                        let TW = w_W - myBrowser.RefHandling.getRefWidth(containerRef)/2;
                        let TH = w_H - myBrowser.RefHandling.getRefHeight(containerRef)/2;
                        console.log("Settinging itinial state");
                        set_TranslateState(`translate(${w_W - containerRef.current.clientWidth/2}px, ${w_H - containerRef.current.clientHeight/2}px)`);
                    }
                }
            },
        )

        /** (Ref : 9302) Initialised Tab-Minimised controller (if any) */
        useEffect(() => {  
            if (props.MinimisedController != undefined) CodeHandler.TabHandler.setMinimisedController(props.MinimisedController);
        },[props.MinimisedController])

        /* Layout default handler & setters */
        useLayoutEffect(
            () =>{
                /* Initial render on stateChange by props */
                setWindowState(props.Window_State.windowState, WindowStateWrapper);
                /* Initialise setter method access for parent component */
                props.Window_State.setWindowState = (toSet : number) =>  setWindowState(toSet,  WindowStateWrapper);

                window.addEventListener("resize", () => {
                    // console.log("Resize");
                    dynamic_Rescale(set_GlobalFontSize);
                    setReRender(++reRender);
                });
                dynamic_Rescale(set_GlobalFontSize); 
            },[props.Window_State]
        );

        /* Layout handler for containerRef  */
        useLayoutEffect(
            () => {
                if (containerRef.current != undefined)
                {
                    /* (Ref : 3022) Close Animation by opacity, once animation is finished, (Ref : 3021) is evaluated & executed  */
                    switch(WindowStateWrapper.item)
                    {
                        case WindowStateVal.close :
                            containerRef.current.style.opacity = "0";
                        break;
                        case WindowStateVal.opened :
                            containerRef.current.style.opacity = "1";
                        break;
                    }
                }
                /*
                *  (Ref : 3021) -> Action Handler for transition-end s.t. if 
                *  current windowState = close AND animation evoked at (Ref : 3022) 
                *  is concluded, then we-rerender this component with windowstate = undefined,
                *  as such : this component will returns nothing instead of invisible element. 
                */
                let WindowTransitionEnd = (event : TransitionEvent) => {
                    let event_Trigger = event.target as HTMLDivElement;
                    let Event_Target = event.currentTarget as HTMLDivElement;
                    
                    if (event_Trigger === Event_Target) {
                        if (WindowStateWrapper.item === WindowStateVal.close) setWindowState(WindowStateVal.undef,  WindowStateWrapper);
                    } 
                }

                if (containerRef.current != undefined )  containerRef.current.addEventListener("transitionend", WindowTransitionEnd);
                return () =>  containerRef.current?.removeEventListener("transitionend", WindowTransitionEnd);
            }, 
        )

        /** Handle mousrdrag of codewindow.  Layout effect setters for TopBlockRef & WindowRef. */
        useLayoutEffect(
            () => {
                let mouseClickLocation_X : number; // Initial location(x) of mouse when codeblock is clicked.
                let mouseClickLocation_Y : number; // Initial location(y) of mouse when codeblock is clicked.

                let currentXStart : number;     /** Hold real location (X) of codeWindow, that is X_Pos after translate value applied */ 
                let currentYStart : number;     /** Hold real location (y) of codeWindow, that is Y_Pos after translate value applied */ ;
                let transformState : string = get_TranslateState;   /** Hold moust recent tranform property applied */ ; 
                
                let mouseMoveHandler = (event : MouseEvent) => { 
                    mouseMoveAction(event, currentXStart, currentYStart);
                }

                /** (Ref : 2009) -> MouseMoveAction */   
                let mouseMoveAction = (event : MouseEvent, initialXPos : number, initialYPos:number) => {
                    let offset_X = -(mouseClickLocation_X - event.x);
                    let offset_Y = -(mouseClickLocation_Y - event.y);
                    transformState =  `translate(${currentXStart + offset_X}px,${mouseClickLocation_Y + offset_Y}px)`;
                    if (containerRef.current != undefined) containerRef.current.style.transform = transformState; 
                }

                /** (Ref : 2011) --> Reset offset, mouseState; remove actionListeners, and set TranslateState on menubar leave (mouseup) */
                let mouseUp_Handler = (event : MouseEvent) => {
                    window.removeEventListener("mousemove", mouseMoveHandler );
                    window.removeEventListener("mouseup", mouseUp_Handler);
                    console.log("MouseUp, we set translate State : " + transformState);

                    set_TranslateState(transformState);
                }

                /** (Ref : 2012) --> Set mousemove listener, and additonal setters on menuBar click  */
                let mouseDown_Handler = (event : MouseEvent) => {
                    /* Initial mouse click values */
                    console.log("MouseDown , we listen for moves");
                    mouseClickLocation_X = event.x; 
                    mouseClickLocation_Y = event.y; 
                    /* (Ref : 2010) -> Re-Configure currentXStart on translate */
                    if (containerRef.current != null)
                    {
                        let Translate_Val : number[] | undefined = myBrowser.RefHandling.getTranslateValues(containerRef);
                        if (Translate_Val != undefined) {
                            currentXStart = 0 + Translate_Val[0];
                            currentYStart = 0 + Translate_Val[1];
                        }
                    }else { console.log ("Cannot determine initialitial position! error\n" ); return;};
                    
                    window.addEventListener("mousemove", mouseMoveHandler);
                    window.addEventListener("mouseup", mouseUp_Handler);
                }

                /**  Initial listener, action flow via : (Ref : 2012) --> { (Ref : 2011), (Ref : 2009) }. 
                 *   Clean up of listeners set in (Ref : 2011) in performed in (Ref : 2011), that is, on mouseUp. 
                 * */
                if (TopBlock.current != undefined) TopBlock.current.addEventListener("mousedown",  mouseDown_Handler );
                
                return () => {
                    TopBlock.current?.addEventListener("mousedown",  mouseDown_Handler);
                    window.removeEventListener("mousemove", mouseMoveHandler );
                    window.removeEventListener("mouseup", mouseUp_Handler);

                }
            }
        )


        let close_ButtonContainerRef = useRef<HTMLDivElement>(null);
        let min_ButtonContainerRef = useRef<HTMLDivElement>(null);

        let min_ButtonRef = useMemo(
            () => {
                /** buttonRefWrapper passed to button component to establish min_ButtonRef on first render, that is : a reference to the rendered button.  */
                let buttonRefWrapper : ObjectRef<HTMLDivElement> = {
                    setFunc : (ref : ObjectRef<HTMLDivElement> , toRef :React.RefObject<HTMLDivElement>) => { ref.ref = toRef},
                    ref : undefined
                }

                let buttonRef : ObjectRef<HTMLDivElement> = buttonRefWrapper;
                return buttonRef;
            }, [containerRef]
        )


        /** Reduce the buttonContainers : 1) close_ButtonContainer, 2) min_ButtonContainer; by that of the containing button min_Button s.t. 
         *  no space exist wrapping button in container.  
         * */
        useLayoutEffect(
            () => {
                if (min_ButtonRef.ref != undefined && close_ButtonContainerRef.current != undefined && min_ButtonContainerRef.current != undefined)
                {
                    console.log(min_ButtonRef.ref.current?.style.height);
                    let lh = min_ButtonRef.ref.current?.style.height;
                    let lw = min_ButtonRef.ref.current?.style.width;
                    close_ButtonContainerRef.current.style.width = `${lh}`;
                }
            }
        )

        let min_TabRef = useRef<HTMLDivElement>(null);
        
        /** Tab handler - setters & getters  */
        useLayoutEffect(
            ()=>{
                console.log("checing tab !");
                if ((min_TabRef.current != null) )
                {
                    if (WindowStateWrapper.item === WindowStateVal.minimised){
                        if (CodeHandler.TabHandler.hasTab(window_Key.current) === false){
                            CodeHandler.TabHandler.addTab(min_TabRef, WindowStateWrapper, window_Key.current); 
                        }
                    }
                } else { // min_TabRef is assumed to be established on layoutEffect IFF WindowStateWrapper.item = minimised; else it is not rendered, hence null
                        // as such, we remove element from TabHandler (if not already)
                        if (CodeHandler.TabHandler.hasTab(window_Key.current) === true){
                            CodeHandler.TabHandler.removeTab(window_Key.current);
                        }
                }
            }
        );

        return(
            <> 

            {/* <p style = {{position : 'absolute', zIndex : '10'}} onMouseDown = {() => { CodeHandler.TabHandler.reconfigureTabElements(-100,0);  }} >  test </p> */}

            { (WindowStateWrapper.item == WindowStateVal.minimised)&&
                // <div id = "Minimise_Container" style = {{width: '100vw', height: '100vh', position: 'fixed', top:'0',}}>
                        <div ref = {min_TabRef} onMouseDown={() => { if (CodeHandler.TabHandler.removeTab(window_Key.current)) setWindowState(WindowStateVal.opened, WindowStateWrapper);}}  className ="code_minimiser" 
                        style ={{ zIndex:`${props.popup_ZIndex}`, transition:'transform 2s', width:'90px', height :'30px', backgroundColor :'black', border:'white solid 1px', position: 'fixed', bottom :"1%", marginLeft :'1%', borderRadius :'2em'}}> 
                            <div style ={{width:'100%', height :'100%', boxSizing:'border-box', position:'relative' , padding :'5%'}}> 
                                <div style ={{width:'100%', height :'100%'}}>
                                    <DynamingHeading Text={props.Title} Styling ={{textAlign:'center', color:'white'}}/> 
                                </div> 
                            </div>
                        </div>
                // </div>
            }

            { (WindowStateWrapper.item == WindowStateVal.opened)  && 
                <div id = "CodeContainer" ref = {containerRef} onMouseDown = { () => { if (containerRef.current!= null) { CodeHandler.FocusHandler.setFocus(window_Key.current, props.popup_ZIndex)};  }} 
                style = {{transform : `${get_TranslateState}`, top:'0', left:'0', opacity:"0", transition:'opacity 0.5s', width : '80vw', height :'65vh', 
                padding :'2%', boxSizing:'border-box', position:'fixed',zIndex :`${props.popup_ZIndex}`, display:'grid', justifyItems:'center', alignItems:'center'}}>                 
                    <div id = "CodeWindow"  ref = {WindowRef} 
                        style = {{ position :'absolute', 
                                width : '100%', height :'100%', backgroundColor:'#3b3f42', borderRadius :'1em', border :'solid 1px',
                                display :'grid', gridTemplateRows:'5% 94% 1%', overflow:'hidden' }}> 
                        <div id = "TopBlock" ref = {TopBlock} style ={{cursor:'grab', backgroundColor:'#474c4f', display :'grid', gridTemplateColumns :'10% 80% 10%',  alignItems :'center', padding: '0.5%', paddingLeft :'2', paddingRight:'1%'}} >
                            <div id = "buttons" style = {{  width:'100%', height :'100%',  position:'relative', display:'flex', alignItems:'center', overflow:'hidden'}}> 
                                <div id = "close_BtnContainer" ref = {close_ButtonContainerRef} style = {{ width :'43%', height :'100%', marginRight:'7%', display :'inline-block' , verticalAlign:'top'}}> 
                                    <CloseButtom handleAction={() => { setWindowState(WindowStateVal.close, WindowStateWrapper) }} custom_ContainerStyle = {{display :'grid',  alignItems:'center'}}/>
                                </div>
                                <div id = "min_BtnContainer" ref = {min_ButtonContainerRef} style = {{ width :'43%', height :'100%', display :'inline-block' , verticalAlign:'top'}}> 
                                    <MinButton buttonRef={min_ButtonRef} handleAction={() => {  setWindowState(WindowStateVal.minimised, WindowStateWrapper) }} custom_ContainerStyle = {{  display :'grid',  alignItems:'center' }}  />
                                </div>
                            </div>
                            <div id = "title" style = {{width:'100%', height:'100%', overflow:'hidden', position :'relative'}}>

                                <DynamingHeading Text={`${props.Title}`} isSimpleContainer = {true} Styling = {{textAlign:'center', color:'#ccc8c5'}} />
                            </div>
                        </div>
                        <div id = "CenterBlock" ref = {centerBlock_Ref} data-key = '1' /** --> (Ref : 3310)  */ style ={{display:'grid', transition :'2s', gridTemplateColumns:'20% 70% 10%', position:'relative'}} >
                                <div id ="WorkingFiles_Container" style = {{ height :'100%', width:'100%', position:'relative', padding:'5%', boxSizing :'border-box', overflow:'hidden'}}>
                                    <div id = "WorkingFiles_Controller" style = {{transition :'2s', width :'100%', display:'grid', gridTemplateColumns:'80% 20%'}}> 
                                        <div id = "Controller_Title" style ={{ transition:'opacity 1s', width:'100%', height:'100%', overflow:'hidden', paddingTop:'2%',paddingBottom:'2%', boxSizing :'border-box'}}>
                                            <div style = {{width:'100%', height:'100%',wordBreak :'break-word', color :'grey', fontSize : `${globalFontSize}px`}}>
                                                working Files
                                            </div>
                                        </div>                                   
                                        <div id = "collapseButton" onMouseDown={ () => { collapseCenterBlock(centerBlock_Ref, reRenderWrapper); }} style ={{width:'100%', height:'100%', overflow:'hidden', display :'grid' , color : 'grey', alignItems:'top', justifyItems:'center'}}> 
                                            &lt; 
                                        </div>
                                    </div>
                                    <div id = "WorkingFiles_List" style = {{ overflow:'hidden', transition :'opacity 1s', width :'100%', height :'95%', paddingLeft :'5%',paddingTop:'5%', boxSizing:'border-box'}}> 
                                        <ScrollableFrame>
                                            {renderWorkingFiles(selectedFileWrapper, props.fileList, globalFontSize)}
                                        </ScrollableFrame>
                                    </div>
                                </div>
                                <div id = "Code_Container" style = {{backgroundColor:'#303942', height :'100%', width:'100%', overflow:'hidden'}}> 
                                    <ScrollableFrame>
                                        {renderCodeInterface(selectedFileWrapper, globalFontSize)}
                                    </ScrollableFrame>

                                </div>
                                <div id = "CodeContext_Container" style = {{}}> 
                                </div>
                        </div>
                        <div id = "EndBlock" style ={{}} >
                        </div>
                    </div>
                </div>
            }
            </>
        )
}

export default RenderCodeWindow;