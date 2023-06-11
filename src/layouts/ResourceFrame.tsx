import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import AnimationSlider from '../animations/AnimationPictureSlider/animationPictureSlider';
import ScrollableFrame from './scrollableFrame';
import DynamicHeading from './dynamicText';
import myBrowser from '../browserHandling/myBrowser';
import ImageFrame from './imageFrame';

/* ----------------------- Interfaces  -----------------------  */

export interface ContentInterface {
    Key : React.Key,
    Title : String, 
    Description : String,
    animationFolderURL : String
}
interface animationState {
    State : String,
    Completed : boolean,
}

declare const require: NodeRequire & { context?: any };         /* interface needed for webkit (i.e : require.context) */

/* -----------------------------------------------------------  */

/* ------------------ Globally Scoped Vars  ------------------  */
const animationStates: { FocusPanelState : {AnimateUp: String, AnimateDown : String}, SidePanelState : {AnimateUp : string , AnimateDown : String} }=
{
    FocusPanelState :{
        AnimateUp : "AnimatingFocusPanelUp",
        AnimateDown : "AnimatingFocusPanelDown",
    },
    SidePanelState : 
    {
        AnimateUp : "AnimatingSidePanelUp",
        AnimateDown : "AnimatingSidePanelDown"
    }
}
var focusedContent = 0;                 // represent the global focus content
const transitionAnimationSpeed = 1.5;   // Global  transition animaton time in seconds
/* --------------------------------------------------------  */


let RenderFocusedContent = (Content : ContentInterface, FocusedContentRef :React.RefObject<HTMLDivElement>, Styling : React.CSSProperties ) =>
{
    let mainDom = useRef<HTMLDivElement>(null);
    return ( 
        <>  
            <div ref ={FocusedContentRef}  style = { Object.assign(  { top :'0%', width : '100%', height :'100%', backgroundColor: 'red', position:'absolute'}, Styling) }> 
                <div style = { { width : '100%', height :'60%', backgroundColor: 'orange' }}>
                    <AnimationSlider imagePath={require.context( `../animations/AnimationPictureSlider/imageAnimationTemplate/templat1Images`, false, /\.(png|jpe?g)$/)}/>
                </div>
                <ScrollableFrame useStateReference={undefined} customStyle = {{ width : '100%', height :'40%', backgroundColor: 'grey', boxSizing : 'border-box', padding : '5%'}} >
                {
                    <>
                    <div style = { { width : '100%' , height :'35%'}}> 
                         <DynamicHeading Text = {Content.Title} Styling = {{wordWrap :'normal', display :'flex', alignItems : 'center'}}  textRef = {null}/>
                    </div>
                    <p style ={{fontSize :'2vw'}}> { Content.Description } </p>
                    </>
                }
                </ScrollableFrame>
            </div>
        </>
    );
};

let renderSideContent = (Content : ContentInterface,  FocusedContentRef :React.RefObject<HTMLDivElement>, Styling : React.CSSProperties) =>  
{

    let ok=  myBrowser.DirHandling.getLocalFilePath(require.context( `../animations/AnimationPictureSlider/imageAnimationTemplate/templat1Images`, false, /\.(png|jpe?g)$/));
    return (
        <>
            <div ref = {FocusedContentRef} style = {
                Object.assign({ overflow :'hidden',position :'absolute', width : '100%', height : '100%', 
                boxSizing : 'border-box', padding :'2%' ,display :'grid', 
                gridTemplateColumns :'48% 48%', gap : '4%', transition :`top ${transitionAnimationSpeed}s`}, Styling)}> 
                    <div style = { {overflow : 'hidden', width : '100%', height : '100%', backgroundColor : 'red', position :'relative'}} > 
                        <ImageFrame src = {ok[0] } container_styling = {{}}/>
                        {/* <AnimationSlider imagePath={ require.context( `../animations/AnimationPictureSlider/imageAnimationTemplate/templat1Images`, false, /\.(png|jpe?g)$/) }/>  */}
                    </div>
                    <div style = { {overflow :'hidden', width : '100%', height : '100%', backgroundColor : 'orange', display :'inline-block', position :'relative', boxSizing :'border-box', padding :'5%'}} > 
                        {/* <div style = { { width : '100%' , height :'35%'}}>  */}
                         <DynamicHeading Text = {Content.Title} Styling = {{wordWrap :'normal', display:'flex', alignItems :'center'}}  textRef = {null}/>
                    {/* </div> */}

                    </div>  
            </div>
        </>
    );
}

/* ------------------------------------- RenderFocusedPanel Scope START -------------------------------------  */
/* Represent the animation state of the focusedPanel */
let focusedAnimationState : animationState  =
{   
    State : "",             // Current animation state k ∈ animationStates.FocusPanelState; Empty-Str represent no animation, and hence if (State == "") ⇒ Completed = true
    Completed : true,       // true : if animation is completed, else false. 
}
let FocusPanel_Div = 1;     // Represent the focus Div in the focused Panel. 
let RenderFocusedPanel = (Content : ContentInterface[], AnimateFocusPanelRef : {AnimateFocusPanel : (animationState : string) => void }) =>
{
    let contentDivs :React.RefObject<HTMLDivElement>[] =
    [
        useRef<HTMLDivElement >(null),  
        useRef<HTMLDivElement>(null), 
        useRef<HTMLDivElement>(null),
    ];
   
    let [reRender, setReRender] = useState(1);

    function AnimateFocusPanel (animationState : String) 
    {
        if (focusedAnimationState.Completed === false) {
            console.log("Animation is still being performed");
            return;
        }
        console.log("Starting a new animation : ");

        /* Set focus animation state */
        focusedAnimationState.State = animationState;
        focusedAnimationState.Completed = false;

        // AnimateScrollUp(contentDivs.Refs, Content, focusedPanelAnimationState);
        let toc  = (animationState === animationStates.FocusPanelState.AnimateUp) ? (((focusedContent) + 1) % Content.length) : (((Content.length+focusedContent) - 1) % Content.length); ;
        focusedContent = toc; 

        if (focusedAnimationState.State === animationStates.FocusPanelState.AnimateUp)
        {
            FocusPanel_Div = (FocusPanel_Div +1 ) % contentDivs.length;
            (contentDivs[(FocusPanel_Div+1) % contentDivs.length].current as HTMLElement).style.zIndex = "-2"; //align behind child (invisible transition)
            
        }
        else if (focusedAnimationState.State === animationStates.FocusPanelState.AnimateDown)
        {
            FocusPanel_Div= ((contentDivs.length + FocusPanel_Div)-1) % contentDivs.length;
            (contentDivs[(FocusPanel_Div+2) % contentDivs.length].current as HTMLElement).style.zIndex = "-2"; //align behind child (invisible transition)
        }
        (contentDivs[FocusPanel_Div].current as HTMLElement).style.top = "0%";
        (contentDivs[ (FocusPanel_Div+2) % contentDivs.length].current as HTMLElement).style.top = "-100%";
        (contentDivs[ (FocusPanel_Div+1) % contentDivs.length].current as HTMLElement).style.top = "100%";
    }
    AnimateFocusPanelRef.AnimateFocusPanel = AnimateFocusPanel;

    useEffect(()=> 
    {
        if (contentDivs[1].current != null)
        {
            contentDivs[1].current?.addEventListener("transitionend", () => 
            {
                console.log("transition finiished !")
                if (focusedAnimationState.State === animationStates.FocusPanelState.AnimateUp)
                {
                    focusedAnimationState.Completed = true;
                    focusedAnimationState.State = '';
                    (contentDivs[((contentDivs.length + FocusPanel_Div)-2) % contentDivs.length].current as HTMLElement).style.zIndex = "0";
                    setReRender(reRender+=1);
                }else if (focusedAnimationState.State === animationStates.FocusPanelState.AnimateDown)
                {
                    focusedAnimationState.Completed = true;
                    focusedAnimationState.State = '';
                    (contentDivs[((contentDivs.length + FocusPanel_Div)-1) % contentDivs.length].current as HTMLElement).style.zIndex = "0"; //align behind child (invisible transition)
                    setReRender(reRender+=1);
                }
            });
        }
    },[contentDivs]); 

     //Set animation (transition) after initial render.
    useLayoutEffect( ( ) => 
    { 
        for (let i =0; i < contentDivs.length; i++)
            (contentDivs[((contentDivs.length + FocusPanel_Div)-i) % contentDivs.length].current as HTMLElement).style.transition = `top ${transitionAnimationSpeed}s`;
    },[]); 
    // console.log("AnimatingMove");
    // console.log("focusedContent : " + focusedContent);
    // console.log("The focus element is : " + focusedRefElement);

    /* Abstract Content Array to be rendered, this is the original Div_arrangement where transition swaps is not performed  */
    let focusContent : ContentInterface[]= [
       Content[ (((Content.length+focusedContent) - 1) % Content.length)], //First_ContentDiv : to-be located above Second_Content (Or WrapAround).
       Content[focusedContent],                                            //Second_ContentDiv : to-be located above Third_Content (Or WrapAround). This is the focus content on screen
       Content[((focusedContent + 1) % Content.length)]                    //Third_ContentDiv : to-be located above First_Content (/ wrap around).
    ]
    
    /* Represent the newely first of the shifted Div & Ref due to transition swaps. */
    let first_Div, first_Ref ; /* First Div : represent the first rendered 'RenderFocusedContent' in jsx below, not its positon after shift */
    /* We assign the appropriate first_Div/Ref based on prior transition swap */
    switch (FocusPanel_Div) 
    {
        case 0 :
            first_Div = 1;
            first_Ref = FocusPanel_Div;         
            break;
        case 1 : 
            first_Div = 0;
            first_Ref = ((contentDivs.length + FocusPanel_Div)-1) % contentDivs.length;
            break;
        default : // focusRefElement = 2 by assumption!
            first_Div = 2
            first_Ref = ((contentDivs.length + FocusPanel_Div)-2) % contentDivs.length;
    }

    return(
        <>
            <div style = { { width : '100%', height :'100%', position : 'relative', overflow : 'hidden'}} >
                    {RenderFocusedContent (focusContent[ first_Div ], contentDivs[ first_Ref ], {top : "-100%"})}
                    {RenderFocusedContent (focusContent[ (first_Div+1) % focusContent.length ], contentDivs[ ((first_Ref +1) % contentDivs.length) ],{ top : '0%'})}
                    {RenderFocusedContent (focusContent[ (first_Div+2) % focusContent.length ], contentDivs[ ((first_Ref +2) % contentDivs.length) ],{ top : '100%' })}
            </div>
        </>
    );
}
/* ------------------------------------- RenderFocusedPanel Scope END -------------------------------------  */


/* ------------------------------------- RenderSidePanel Scope START -------------------------------------  */
let SidePanelAnimationState : animationState =
{
    State : "",
    Completed : true,
}
let SidePanel_Div = 1;  // represent the first visible Div in the side Panel. Div[SidePanel_Div-1] is hidden, and is the current focused Object in FocusPanel
let RenderSidePanel = ( upAction:()=> void, downAction:()=> void, Content : ContentInterface[], AnimateSidePanelRef :  {animateSidePanel : (animationState : string) => void,} ) =>
{
    let up = useRef<HTMLDivElement>(null);
    let down = useRef<HTMLDivElement>(null);

    let contentDivs :  React.RefObject<HTMLDivElement>[] =
        [
            useRef<HTMLDivElement>(null),  
            useRef<HTMLDivElement>(null), 
            useRef<HTMLDivElement>(null),
            useRef<HTMLDivElement>(null),
            useRef<HTMLDivElement>(null),
        ]

    useLayoutEffect(() =>
    {
        if (up.current != null && down.current != null) {
            up.current.addEventListener('mousedown', upAction);
            down.current.addEventListener('mousedown', downAction);
        }

        if (contentDivs[0]!= null)
        {
            console.log("Action listener set for side panel")
            contentDivs[0].current?.addEventListener("transitionend", () =>
            {
                switch (SidePanelAnimationState.State) 
                {
                    case animationStates.SidePanelState.AnimateUp : 
                        SidePanelAnimationState.Completed = true;
                        SidePanelAnimationState.State = '';
                        (contentDivs[((contentDivs.length+SidePanel_Div)-2) % contentDivs.length].current as HTMLElement).style.zIndex = "0";
                    break;
                    case animationStates.SidePanelState.AnimateDown : 
                        SidePanelAnimationState.Completed = true;
                        SidePanelAnimationState.State = '';
                        (contentDivs[((contentDivs.length+SidePanel_Div)-1) % contentDivs.length].current as HTMLElement).style.zIndex = "0";
                }
            });
        }
    }, []);

    function animateSidePanel(animationState : String)
    {

        if (SidePanelAnimationState.Completed === false) {
            console.log("Animation is still being performed for side panel");
            return;
        }
        console.log("Side animation started for : " + animationState);
        /* Set focus animation state */
        SidePanelAnimationState.State = animationState;
        SidePanelAnimationState.Completed = false;

        
        if (animationState === animationStates.SidePanelState.AnimateUp)
        {
            for(let i =0; i < contentDivs.length-1; i++ )
            {
                let CDiv = contentDivs[(SidePanel_Div+i)%contentDivs.length].current;
                (CDiv as HTMLElement).style.top = `${(-100 + (i * 100))}%`; 
            }
                    /* Trace : 
                            i=0 : (-200 + (i * 100)) = -200
                            i=1 : (-200 + (i * 100)) = -100
                            i=2 : (-200 + (i * 100)) = 0
                            i=3 : (-200 + (i * 100)) = 100
                            i=4 : (-200 + (i * 100)) = 200
                    */                    
                
            SidePanel_Div = (SidePanel_Div +1) % contentDivs.length;
            let firstDiv = contentDivs[((contentDivs.length+SidePanel_Div)-2) % contentDivs.length].current as HTMLElement;
            firstDiv.style.zIndex = '-2';
            firstDiv.style.top = `${(contentDivs.length-2) * 100}%`; // place at the end of the list 

        }
        else if (animationState === animationStates.SidePanelState.AnimateDown)
        {
            for(let i =0; i < contentDivs.length-1; i++ )
            {
                let CDiv = contentDivs[ ((contentDivs.length + SidePanel_Div-1)+i) % contentDivs.length ].current;
                (CDiv as HTMLElement).style.top = `${(i * 100)}%`; 
            }
                  
            SidePanel_Div = (contentDivs.length + SidePanel_Div -1) % contentDivs.length;
            let firstDiv = contentDivs[((contentDivs.length+(SidePanel_Div))-1) % contentDivs.length].current as HTMLElement;
            firstDiv.style.zIndex = '-2';
            firstDiv.style.top = `-100%`; // place  at the beiginning of the list 
        }


    }   
    AnimateSidePanelRef.animateSidePanel = animateSidePanel;

    /* Abstract Content Array to be rendered, this is the original Div_arrangement where transition swaps is not performed  */
    let focusContent : ContentInterface[]=[];
    for (let i =0; i < contentDivs.length;i++) focusContent.push(Content[ ((focusedContent+i) % Content.length) ]);
         
    /*  Represent the newely first of the shifted Div & Ref due to transition swaps. 
           1. First Div : represent the first rendered 'RenderFocusedContent' in jsx below, not its positon after shift. 
    */ 
    let firstRef:number, firstDiv : number;
    switch (SidePanel_Div)
    {
        case 0 : // The first visible div is Div_0 before re-render
            firstDiv = 1;
            firstRef = ((contentDivs.length + SidePanel_Div )-1) % contentDivs.length; 
            break;
        case 1 : // The first visible div is Div_1
            firstDiv = 0;
            firstRef = ((contentDivs.length + SidePanel_Div )-1) % contentDivs.length; 
            break;
        case 2 :
            firstDiv = 4;
            firstRef = ((contentDivs.length + SidePanel_Div )-1) % contentDivs.length; 
            break;
        case 3 :
            firstDiv = 3;
            firstRef = ((contentDivs.length + SidePanel_Div )-1) % contentDivs.length; 
            break; 
        default :
            firstDiv = 2;
            firstRef = ((contentDivs.length + SidePanel_Div )-1) % contentDivs.length; 
            break; 
    }

    /* Re-Compute Divs on change (if any) */
    let RenderDivs = [];
    for (let i =0; i < contentDivs.length; i++)
    {
        let offsetContent = focusContent[ ((firstDiv+i) %  focusContent.length) ];
        RenderDivs.push
        ( 
            <div style = { { width : '100%', height :'33.3%', position : 'absolute'}}> 
                { renderSideContent(offsetContent, contentDivs[i], { top :`${ (-100 + (i *100))}%`, }) }
            </div>
        );
    }

    return (
        <>
            <div style = { { width : '100%', height :'100%', position : 'relative', overflow :'hidden'}}>
                <div ref = {up} style = { {position :'absolute', zIndex:'5', left:'20px'}}>⋀</div>
                <div ref = {down} style = { { position :'absolute', zIndex:'5' , left:'50px'}}>⋁</div>
                {RenderDivs}
            </div>
        </>
    );
};
/* ------------------------------------- RenderSidePanel Scope END -------------------------------------  */



/* -------------------------------------------- MAIN RENDER --------------------------------------------  */

let RenderResourceFrame: React.FC<{children : React.ReactNode, content : ContentInterface[]}> = (props) =>
{
    if (props.content.length < 5) return ( <> ResourceFrame : Requres Content be ≥ 5!</>);
    
    let AnimateFocusPanelRef : {AnimateFocusPanel : (animationState : String) => void } =  {
        AnimateFocusPanel (animationState : String) { return; } 
    }

    let AnimateSidePanelRef : {animateSidePanel : (animationState : String) => void }= {
        animateSidePanel () { },
    }

    function upAction() 
    {
        AnimateFocusPanelRef.AnimateFocusPanel(animationStates.FocusPanelState.AnimateUp);
        AnimateSidePanelRef.animateSidePanel(animationStates.SidePanelState.AnimateUp);
    }


    function downAction() 
    {
        AnimateFocusPanelRef.AnimateFocusPanel(animationStates.FocusPanelState.AnimateDown);
        AnimateSidePanelRef.animateSidePanel(animationStates.SidePanelState.AnimateDown);
    }
    return (
        <>
            <div style = { { boxSizing : 'border-box' , padding :'100px', width : '100vw', height :'100vh', minWidth : '700px', minHeight :'700px',backgroundColor: 'white' ,display : 'grid', gridTemplateColumns : '50% 50%', position:'relative' , gap : '3%'}}>
                { RenderFocusedPanel(props.content, AnimateFocusPanelRef) }
                { RenderSidePanel(upAction, downAction, props.content, AnimateSidePanelRef) }
            </div>
        </>
    );
};

export default RenderResourceFrame;