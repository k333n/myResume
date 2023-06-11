import styling from './animationStyling.module.css';
import React, {useRef, useEffect, useState} from 'react';
import ScollableFrame from '../../layouts/scrollableFrame';
import StateObject from '../../Interfaces/stateObjectInterface';
import MyBrowser from '../../browserHandling/myBrowser';
import CircleAnimation from './Templates/circle';


/* 
    Render circle Animation over the passing props.child components. Animation will begin when pageYOffset reach container.
    ScrollAnimation takes as argument :
        1) Children : Nested children to be rendered
        2) Template : A functional component taking as input some children (by argument 1) and the AnimationAmount (animation percentage).
*/
let ScrollAnimation : React.FC <{children : React.ReactNode, Template : (children : React.ReactNode, AnimationAmount : number) => React.ReactElement} >= ( props ) => 
{
    // let animationDivRef = useRef<HTMLDivElement | null>(null); 
    let [ScrollableFrameRef, SetScrollableFrameRef] = useState(useRef<HTMLInputElement>(null));  /* Scrollable Container Ref */
    let [animationAmount, setAnimationAmount] = useState(0);                                    /* Represent the animation amount in percentages */
    let [renderState, setRenderState] = useState (false);                                       /* true : Render animation, false : no animation */
    let containerRef = useRef<HTMLDivElement | null>(null);                                     /* wrapper for all components (ie : children) */
    let scrollableFrameSizeBox = useRef<HTMLDivElement | null>(null);                           /* child of ScrollableFrame, s.t. its size = amount to scroll */

    /* Scrollable Container Wrapper */ 
    let scrollableFrameState : StateObject<React.RefObject<HTMLInputElement> > = 
    {
        item : ScrollableFrameRef,
        setItem : SetScrollableFrameRef
    }

    /* information utilised to render animation */
    let renderInformation : 
    { 
        animationAmount : () => number,          /* integer representation of the pixel scrolled (i.e. animation amount) */
        maxAnimationAmount :() =>number,         /* integer representation of the max pixel scroll amount s.t. animationAmount / maxAnimation = animationState */
        animationLocationStart : ()=> number     /* integer representation of the location by the Y-axis on the page where animation container begin */
        animationLocationEnd : () => number,     /* integer representation of the location by the Y-axis on the page where animation container end */
        isWithinFrameTop : () => boolean,        /* bool value s.t. true is returned IFF top of browserWindow ∩ (animationLocationStart, .. , animationLocationEnd) */
        isWithinFrameBottom : () => boolean      /* bool value s.t. true is returned IFF bottom of browserWindow ∩ (animationLocationStart, .. , animationLocationEnd) */
    } 
    =  
    {
        animationAmount : () => { return (ScrollableFrameRef.current == null) ? -1 : ScrollableFrameRef.current.scrollTop},
        maxAnimationAmount : () => { return (ScrollableFrameRef.current == null) ? -1 : parseInt( window.getComputedStyle(ScrollableFrameRef.current).height,10);},
        animationLocationStart : () => { return MyBrowser.RefHandling.getRefLocationStart(containerRef) },
        animationLocationEnd : () => { return MyBrowser.RefHandling.getRefLocationEnd(containerRef)},
        isWithinFrameTop : () => { return (MyBrowser.getWindowTop() >= (renderInformation.animationLocationStart())) && (MyBrowser.getWindowTop() <= renderInformation.animationLocationEnd())},
        isWithinFrameBottom : () => {return (MyBrowser.getWindowBottom() <= renderInformation.animationLocationEnd()) && (MyBrowser.getWindowBottom() >= renderInformation.animationLocationStart()) }
    };

    useEffect ( () => { 
        function handleWindowScroll() 
        {
            // console.log("top of browser is at :" + MyBrowser.getWindowTop());
            // console.log("bottom of browser is at :" + MyBrowser.getWindowBottom());
            // console.log("div starts at at :" + MyBrowser.getRefLocationStart(containerRef));
            // console.log("div ends at :" + MyBrowser.getRefLocationEnd(containerRef));


            // console.log("animationAmount! " + renderInformation.animationAmount())
            // console.log("maxAnimationAmount! " + renderInformation.maxAnimationAmount())
            // console.log("withinFrameTop! " +  renderInformation.isWithinFrameTop())
            // console.log("winthinFrameBottom! " + renderInformation.isWithinFrameBottom())
            // console.log("windowBottom! " + MyBrowser.getWindowBottom())
            // console.log("windowTop! " + MyBrowser.getWindowTop());
            // console.log("animationLocationStart! " + renderInformation.animationLocationStart())
            // console.log("animationLocationEnd! " + renderInformation.animationLocationEnd())

            if (ScrollableFrameRef.current != null)
            {
                if (renderState === false)
                {
                    if ( renderInformation.isWithinFrameTop() && (renderInformation.animationAmount() === 0) ) //animation start
                    {
                        console.log("Animation start ")
                        ScrollableFrameRef.current.scrollTo(0,1);
                    }
                    else if (renderInformation.isWithinFrameBottom() && ((renderInformation.animationAmount() === renderInformation.maxAnimationAmount()))) // animation finished, user scroll back
                    {
                        console.log("animatin finish, user Scroll backk ")
                        ScrollableFrameRef.current.scrollTo(0,renderInformation.maxAnimationAmount()-1);
                    }
                    else return;
                    
                    MyBrowser.scrollToPage(0, renderInformation.animationLocationStart());
                    MyBrowser.lockPageScroll();
                    if (renderState === false ) setRenderState(true);
                }
            }
        }
        function handleDivScroll()
        {
            if (ScrollableFrameRef.current != null)
            {
                //we consider render state change here
                if (renderState === true) 
                {                    
                    /*----------- Perform animation -----------*/
                    let ScalePercentage = ((renderInformation.animationAmount()/renderInformation.maxAnimationAmount())*100) ;
                    setAnimationAmount(ScalePercentage);   
                    /* ---------------------------------------- */

                    /*------ Perform state change (if any) -----*/
                    if ( (renderInformation.animationAmount() === renderInformation.maxAnimationAmount())) // animation concluded
                    {
                        console.log("animatin concluded! ") 
                        MyBrowser.scrollToPage(0, renderInformation.animationLocationStart()+1);
                    }
                    else if (((renderInformation.animationAmount() === 0)) ) //user Scroll back during animation, we do 
                    {
                        console.log("user Scroll back during animation : " + renderInformation.animationAmount() )
                        ScrollableFrameRef.current.scrollTo(0,0);
                        MyBrowser.scrollToPage(0, renderInformation.animationLocationStart()-1);
                    }
                    else return; //No state change, return; 

                    MyBrowser.unlockPageScroll();
                    if (renderState === true ) setRenderState(false);
                } 
                else if ( !( (renderInformation.animationAmount() === 0) || (renderInformation.animationAmount() === renderInformation.maxAnimationAmount()) ) )
                {
                    /* 
                        prevent unwanted scroll behavior which evaluates div-scroll by eventListener when animationState = false. 
                        This is because animation-blocking div is not rendered yet to the DOM and another scrollEvent is triggered, 
                        hence, 0 < animationAmount < maxAnimationAmount and render initialisation will never be executed.
                    */
                    if (renderInformation.animationAmount() < renderInformation.maxAnimationAmount()/2)
                        ScrollableFrameRef.current.scrollTo(0,0);
                    else 
                        ScrollableFrameRef.current.scrollTo(0,renderInformation.maxAnimationAmount());
                }
            }
        }
        window.addEventListener('scroll', handleWindowScroll);
        ScrollableFrameRef.current?.addEventListener('scroll', handleDivScroll);

        return () => 
        { 
            ScrollableFrameRef.current?.removeEventListener('scroll', handleDivScroll);
            window.removeEventListener('scroll', handleWindowScroll);
        }
    }); 

    return (
    <>
        <div ref = {containerRef} style ={{width : '100vw', height : '100vh', position :'relative', overflow : 'hidden'}}>
            {props.Template(props.children, animationAmount)}
            { !(renderState) &&  <div style ={{width : '100vw', height : '100vh', position :'relative'}}/> } {/*animation-blocking div*/}
            <ScollableFrame customStyle={{}} useStateReference = {scrollableFrameState}>
                <div ref = {scrollableFrameSizeBox} style ={{width : '50%', height : '200vh'}}/>
            </ScollableFrame>
        </div>
    </>);

};



export default ScrollAnimation;