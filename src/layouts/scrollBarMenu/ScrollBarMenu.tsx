import { title } from "process";
import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { idText, JsxElement } from "typescript";
import myBrowser from "../../browserHandling/myBrowser"
import DynamicHeading from "../dynamicText"
import {ObjectRef} from '../../Interfaces/RefObjectInterface';
import './scrollBarStyling.css';
/* ------------------------------------------ Component Description ------------------------------------------
    Renders a scrollBarMenu fixed at the top of the browser window used to showcase the users current location 
    on the page by means of the pre-defined visual indicator (bar), and the main contents of the page. 
    
    This ScrollBar inherits 100vw of the browser window, with height statically allocated by var 
    'scrollBarHeight' in this component. 

    The component takes as props the ScrollBarElement = { id : React.RefObject<HTMLDivElement> , name : string} 
    Object, where name = The title to be displayed in the scrollBarMenu AND id = useRef() pointer to some 
    pre-establish HTMLDivElement_Reference within the parenting scope.  The actual DOM_ID of this element 
    is also expected to be intialised for full functionality of this component (i.e. mouseEvent).

    Note (Important) :     
        1. The elements recieved by props, mainly ScrollBarElement.id is presumed to be rendered on the DOM 
        when evaluated by this compoonent, hence the parent component should re-render upon the mounting 
        of elements to the DOM.

        2. The element targeted by the scrollbar elements must have a valid 'id' tag and must contain some element
        for mouse-click to operate correctly.
        

    Arguments by props :
        ScrollBarElement : 
            id : React.RefObject<HTMLDivElement> , reference by react.useRef to the section container/start 
                 of section.
            name : String, name attribute to be displayed on scrollBar
        
    Declaration Examples : 
        TMLDivElement Declaration Example :
            <div 
                id = {"overview"} 
                ref = {scrollbarelements[0].id} 
                style = { {width : '100vw', height : '100vh', backgroundColor :'white', position :'relative'} 
            }> 
        ScrollBarElement Declaration Example :
             let scrollbarelements : ScrollBarElement[]= [
                {
                    id : useRef<HTMLDivElement>(null),
                    name : "overview"
                },
            ]
------------------------------------------------------------------------------------------------------------*/


export interface ScrollBarElement
{
    reference : React.RefObject<HTMLDivElement>,
    name : string
}
let ScrollBarElementOffset = 0; // = 1 / (props.elements.length-1) be the global element offset value.
let ScrollBarZIndex = 50;
let scrollBarHeight = '70'; /* Full Height of the scrollBar (px) */ 
let prevElement : HTMLParagraphElement | undefined = undefined;
let currentElement : HTMLParagraphElement | undefined = undefined;
let activeElementColor = "white";
let inActiveElementColor = "grey";

let Get_IndicatorValue = (elements : ScrollBarElement[] , elementRef : React.MutableRefObject<HTMLParagraphElement>[]) : number =>
{
    if (elements[0].reference.current != null)
    {
        let pageHeight : number = myBrowser.getPageHeight();
        let Scroll_State : number = myBrowser.getWindowCenter();
        
        if (Scroll_State < 0 || myBrowser.getWindowTop() === 0) return 0;
        

        for (let i =0; i <= (elements.length-2); i++)
        {
            let ElementPagePos : number = myBrowser.RefHandling.getRefLocationStart(elements[i].reference); 
            let NextElementPagePos : number = myBrowser.RefHandling.getRefLocationStart(elements[i+1].reference);

            if ( (Scroll_State >= ElementPagePos) && (Scroll_State < NextElementPagePos))
            {
                let separateScroll_State = Scroll_State - ElementPagePos; 
                let separateElement_End = NextElementPagePos - ElementPagePos;
                let separateScrollPercentage = separateScroll_State / separateElement_End;
                let indicator = (i * ScrollBarElementOffset ) + ( ScrollBarElementOffset * separateScrollPercentage );
                currentElement = elementRef[i].current;
                return indicator;
            }
        }
    }

    currentElement = elementRef[elementRef.length-1].current;
    return 1;
}

let elementClickEvent = (event : React.MouseEvent<HTMLDivElement>, ScrolBarElements : ScrollBarElement[] ) =>
{
    myBrowser.scrollToPage(0, myBrowser.RefHandling.getRefLocationStart(ScrolBarElements[parseInt(event.currentTarget.id)].reference));
}

let indicator:number = 0;
let RenderScrollBar : React.FC<{ ScrolBarElements : ScrollBarElement[] }> = (props) => 
{
    let animationBar = useRef<HTMLDivElement | null> (null);
    let elementTextRef : React.MutableRefObject<HTMLParagraphElement>[] = [];
    let offsetDivRef = useRef<HTMLDivElement> (null);
    let scrollBarRef = useRef<HTMLDivElement> (null);
    ScrollBarElementOffset = 1 / (props.ScrolBarElements.length-1); //intiial scrollbar offset

    // Rescale scrollBar element font-size s.t. x.font-size() = x'.fontSize() ∀ x ∈ props.ScrolBarElements.
    let matchFontSize = useMemo (
        () => {
            let InFunct = () =>
            {
                if ( (elementTextRef.length > 0 != null) )
                {
                    let SmallestFontSize = myBrowser.RefHandling.getRefFontSize(elementTextRef[0]);
                    for (let i =1; i < props.ScrolBarElements.length; i++)
                    {
                        let currentFontSize = myBrowser.RefHandling.getRefFontSize(elementTextRef[i]);
                        if ( currentFontSize < SmallestFontSize){
                            SmallestFontSize = currentFontSize;
                        }
                        let k = elementTextRef[i].current?.style.fontSize;
                    }
                    elementTextRef.forEach( (element) => { element.current.style.fontSize =`${SmallestFontSize}px`})
            
                    // JS Direct dom change version
                    // let ScrollBarTitleElement : any = titleRef.current.getElementsByClassName("ScrollBarTitles");
                    // for (let i = 0; i < ScrollBarTitleElement.length; i++)
                    // {
                    //         let k : any =  ScrollBarTitleElement[i].getElementsByTagName("*");
                    //     for (let b =0; b < k.length; b++)
                    //         k[b].style.fontSize = `${SmallestFontSize}px`;
                    // }
                }    
            }        
            return InFunct;
        }, [elementTextRef,props.ScrolBarElements, ] 
    );

    // Generate elements placed on scrollBar
    let GenerateRenderElements = useMemo( 
        () => {
            let InFunct = (ScrolBarElements : ScrollBarElement[] , elementRef :  React.MutableRefObject<HTMLParagraphElement | null>[] ) : JSX.Element[] => 
            {
                let toRet : JSX.Element[] = [];
                let ElementReferences : ObjectRef<HTMLParagraphElement> = 
                {
                    setFunc : (ref: ObjectRef<HTMLParagraphElement>, toRef: React.RefObject<HTMLParagraphElement>) : void => 
                                { 
                                    ref.ref = toRef;              
                                    elementRef.push(toRef);      
                                },
                    ref : useRef(null)
                }
        
                for (let i =0, lastElement = ScrolBarElements.length-1; i < lastElement; i++)
                {
                    toRet.push ( 
                        <>
                            <div style = {{display : 'flex', flexDirection :"column", width:'100%', height :'100%', position:'relative'}}> 
                                    <div className="ScrollBarTitles" style = {{ transform : "translate(-50%, 0px)", cursor :'pointer', position :'relative', height :'100%', width : '30%', zIndex :`${ScrollBarZIndex}`}}>  
                                        <a href = {`#${ScrolBarElements[i].reference.current?.id}`} style = { {width :'100%', height :'100%'}} > 
                                            <div style = {{width :'100%', height :'100%'}}>
                                                <DynamicHeading Text={`${ScrolBarElements[i].name}`} Styling = {{fontWeight :'bold',display :'flex', alignItems :'center', justifyContent :'center'}} textRef = {ElementReferences} />                                    
                                            </div> 
                                        </a>
                                    </div>  
                                    {   
                                        (i == (lastElement-1))  &&
                                        <div style = {{ display :'flex', width :'100%', height : '100%', position:'absolute', justifyContent :'flex-end'}}>  
                                            <div className="ScrollBarTitles" style ={ {transform : "translate(50%, 0px)",  width :'30%', height :'100%'}} >  
                                                <a href = {`#${ ScrolBarElements[i+1].reference.current?.id}`} style = {{}} >
                                                    <div style = {{width :'100%', height :'100%'}}>
                                                        <DynamicHeading Text={`${ScrolBarElements[i+1].name}`} Styling = {{fontWeight :'bold',display :'flex', alignItems :'center', justifyContent :'center'}} textRef = {ElementReferences} onChangeAction = {matchFontSize} />
                                                    </div>
                                                </a>
                                            </div> 
                                        </div> 
                                    }  
                            </div>
                        </>);
                }
                return toRet;
            }
            return InFunct;
        }, [matchFontSize]
    );

    // Animatate the scrollBar baesd on the indicator value
    let animateScrollBar = () =>
    {
        if (animationBar.current != null )
        {
            if (props.ScrolBarElements.length > 0) {
                if (props.ScrolBarElements[0].reference.current === null) return; /* We return on parentElement render on DOM = false.  */
                indicator = Get_IndicatorValue(props.ScrolBarElements, elementTextRef);
            } else {
                // indicator = myBrowser.getWindowCenter() / myBrowser.getPageHeight();
                return; /* We return on parentElement render on DOM = false.  */
            }
            animationBar.current.style.width = `${indicator*100}%`

            if (currentElement != undefined)
            {
                if (currentElement != prevElement)
                {
                    currentElement.style.color =  (indicator === 0) ? inActiveElementColor : activeElementColor;
                    if (prevElement != null) prevElement.style.color = inActiveElementColor;
                    prevElement = currentElement;
                }
            }
        }
    }
    let scaleScrollBar = () =>{
        if (scrollBarRef.current != null){
            
            let translateDistance = myBrowser.DomHandling.getCSSProperty('.ScrollBarTitles', 'transform')?.split(',')[4]; 
            let current_ScrollBarLoc = myBrowser.RefHandling.getRefLocationX(scrollBarRef);
            let i =0;
            let currentWidth : number = parseInt(scrollBarRef.current.style.width.replace("%",""));

            if (translateDistance != undefined)
                while (current_ScrollBarLoc < (-parseInt(translateDistance) ) && i++ < 100 )
                {
                    scrollBarRef.current.style.width = `${currentWidth - i}%`
                    current_ScrollBarLoc = myBrowser.RefHandling.getRefLocationX(scrollBarRef);
                }
        }
    }
    useLayoutEffect( 
        () => { 
            //resize font
            if (props.ScrolBarElements.length > 0)  matchFontSize();
            //scale animationBar 
            // console.log("ID 0 = " + props.ScrolBarElements[0].id.current?.id);
            scaleScrollBar();
            animateScrollBar();
        });

    useLayoutEffect(
        () =>{
            document.addEventListener("scroll", animateScrollBar);
            return () => document.removeEventListener("scroll", animateScrollBar);
        },[]
    )

    return(
        <>   

            {/* <div  style = { { top : '300px', display :'flex', alignItems :'center', justifyContent :'center',  position :'fixed', width : '100vw', height :'50px', backgroundColor :'white', zIndex :`${ScrollBarZIndex}`}}>  */}
                {/* <div style = { {  backgroundColor :'pink', width : '100%', height :'100%', display :'grid'}}>  */}
                        {/* <div style = { {width:'100%', height :'100%', position:'relative', backgroundColor:'red', overflow :'hidden', display :'grid'} }> */}
                                 {/* <DynamicHeading Text={"sometex"} Styling = {{fontWeight :'bold',display :'flex', alignItems :'center', justifyContent :'center'}} />                         */}
                        {/* </div> */}
                     {/* { GenerateRenderElements(props.ScrolBarElements, elementTextRef) } */}
                {/* </div> */}
            {/* </div> */}

            <div  style = { { display :'flex', alignItems :'center', justifyContent :'center',  position :'fixed', top:'0', width : '100vw', height :`${scrollBarHeight}px`, zIndex :`${ScrollBarZIndex}`, backgroundColor :'#111'}}> 
                <div ref = {scrollBarRef}  style = { {display :'grid', justifyItems :'center', alignItems :'center', height : '100%', width : '100%', position :'relative'}}>                    
                    <div style = { {width : '100%', height :'45%'}}> 
                        <div style = { {width : '100%', height :'100%', display :'grid', gridTemplateColumns :`repeat(${props.ScrolBarElements.length-1}, ${(ScrollBarElementOffset)*100}%)`, position :'relative' }}> 
                            { GenerateRenderElements(props.ScrolBarElements, elementTextRef) }
                        </div> 
                    </div> 
                    <div style = { { borderRadius :'2em', width : '100%', height :'5px', backgroundColor :'white', position :'absolute', bottom: '1%'}}>
                        <div ref = {animationBar} style = {{ transition :'width 0.1s',  height : '100%', position :'relative', backgroundColor : 'black'}}/>
                    </div> 
                 </div>
             </div>
        </>
    )
}

export default RenderScrollBar;