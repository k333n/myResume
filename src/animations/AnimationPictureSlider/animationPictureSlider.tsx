
import { relative } from 'path';
import React, {useState, useRef, ReactNode} from 'react';
import ScrollableFrame from '../../layouts/scrollableFrame';
import StateObject, {ClassStateCallBack} from '../../Interfaces/stateObjectInterface';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { promises } from 'stream';
import CircleAnimation from '../AnimationScroller/Templates/circle';
import ImageAnimation from './imageAnimationTemplate/template1';
import myBrowser from '../../browserHandling/myBrowser'
/* ------------------------------------------ Component Description ------------------------------------------
    AnimationPictureSlider is a class-based component rendering some frame-by-frame animation given some 
    dirPath containing the array of images, its specific animation output is subject to the choosen 
    animation_Template, and AnimationPictureSlider will always inherit 100% width & height of the parent 
    container.
    
    AnimationPictureSlider acts as the caller (provoker), providing the animation_Template component as input by 
    props the animation percentage : {0, ..., 100}, where each value correspond to some different image state. 

    The following are the parameters to be passed through props : 
        1. imagePath : NodeRequire & { context?: any } 
                The image_path to the array of images to be animated by the 'react.require.context' object. 
                This path is relative to the calling component. 
    Usage Example : 
         <AnimationSlider imagePath={ require.context( `../animations/AnimationPictureSlider/imageAnimationTemplate/templat1Images`, false, /\.(png|jpe?g)$/) }/> 

------------------------------------------------------------------------------------------------------------*/

/* State generic type for class component! */
export interface stateItems 
{
    scrollAmount : number;  /* (Ref: 102) */
    animationPerentage : number,
    scrollBarCursorLocation : number, /* Represent the current mouseLocation in scrollBar */
    scrollBarCursorOpacity : number,
}
/* 
    Note :
        React.Component is a generic class that takes two type arguments: 
            1) Props and State : Props represents the type of the component's props, and State represents the type of the component's state 
            2) '{}' is passed as the type argument for Props, which indicates that this component does not have any props. 
                The interface IState is passed as the type argument for State, which defines the shape of the state object.
*/
class renderSlider extends React.Component<{ imagePath: NodeRequire & { context?: any }}, stateItems>
{
    scrollBar = React.createRef<HTMLDivElement> ();
    scroll_Values : number[] = [0.1,0.2,0.3,0.4,0.5,0.7,0.7,0.8,0.9,1.2,1.3,1.4,1.5,2]; // scroll increment values (i.e. scrollAmount + x in scroll_Values). 
    maxScrollAmount = 300;   // max scrollAmount by scroll_Values s.t. if scrollAmount (Ref: 102) = maxScrollAmount, then animationState = 100%
    scrollUpdateSpeed = 10;  // in miliseconds
    scrollBarWidth = 0;      // reprsent the scrollBar width when rendered to DOM
    
    
    constructor( props : { imagePath: NodeRequire & { context?: any }})
    {
        super(props);
        this.state = {scrollAmount : 0, animationPerentage : 0, scrollBarCursorLocation : 0, scrollBarCursorOpacity : 0};
        this.handleDivScroll = this.handleDivScroll.bind(this);
        this.setState = this.setState.bind(this);
        this.calculateScrollValue = this.calculateScrollValue.bind(this);
        this.calcScrollCursorOpacity = this.calcScrollCursorOpacity.bind(this);
        this.renderScrollBarCursorCss = this.renderScrollBarCursorCss.bind(this);
        this.renderScrollBarCursorCss = this.renderScrollBarCursorCss.bind(this);
    }


    componentDidUpdate ()
    {
        if (this.scrollBar.current != null)
        {
            this.scrollBarWidth = parseInt(window.getComputedStyle(this.scrollBar.current).width,10);
        }
    }

    componentDidMount() 
    {
            // console.log("Render slider DidMount!");
            /* ------------------------------- ScrollBar Event Handling -------------------------------  */
            let scrollVal = 0;
            let toScroll = false;

            this.scrollBar.current?.addEventListener('mousemove', (event) => 
            { 
                if (this.scrollBar.current != null)
                {
                    scrollVal = this.calculateScrollValue(this.scrollBarWidth, event.offsetX, this.scroll_Values);
                    this.renderScrollBarCursorCss(scrollVal);  // redefine cursor css change with mouseMove
                    this.setState(state => { return {scrollBarCursorLocation : event.offsetX, scrollBarCursorOpacity : this.calcScrollCursorOpacity(this.scrollBarWidth, event.offsetX)}});                
                }
            });

            this.scrollBar.current?.addEventListener('mouseleave', (event) => 
            {
                toScroll = false;
                myBrowser.showCursor();
                this.setState(state => { return {scrollBarCursorOpacity : 0}});

            });

            this.scrollBar.current?.addEventListener('mouseover', (event) => 
            { 
                toScroll = true;
                myBrowser.hideCursor();
                executeScroll();
            });

            /* scroller asynchronous funct */
            let executeScroll  = async () =>
            {
                    while (1)
                    {
                        await new Promise((resolve) =>  { setTimeout(() => resolve("awaited"), this.scrollUpdateSpeed) });
                        let newScrollState : number = this.state.scrollAmount + scrollVal;
                        let maxScrollWidth : number = this.maxScrollAmount;
                        // console.log("newScrollState : " + newScrollState);
                        // console.log("maxScrollWidth : " + maxScrollWidth);
                        // console.log("scrollSpeed : " + scrollVal);
                        if (newScrollState >= 0 && newScrollState <= maxScrollWidth ){
                            this.setState(state => { return {scrollAmount : newScrollState, animationPerentage : newScrollState / maxScrollWidth  }});
                        } 
                        if (toScroll === false){
                            break;
                        } 
                    }
            }   
        /* ------------------------------- ScrollBa Event Handling End ----------------------------  */
    }

    /*
        Given the scrollBar_Width, currentMouseLocScrollBar, we return the percentage of the mouseLocation in respect to its location in the scrollBar
        s.t. if mouseLocation = scrollBar_Width ⋁ 0 , then percentage = 100% 
    */
    calcScrollCursorOpacity(scrollBar_Width : number, currentMouseLocScrollBar: number)  : number
    {
        let animationPercentage;
        let scrollBar_Middle = scrollBar_Width/2;
        let middleWidth = scrollBar_Width - scrollBar_Middle; 
    
        if (currentMouseLocScrollBar > scrollBar_Middle) animationPercentage = (currentMouseLocScrollBar - scrollBar_Middle) / middleWidth;
        else animationPercentage = (scrollBar_Middle - currentMouseLocScrollBar) / middleWidth;
    
        return Math.round(animationPercentage*100);
    }


    /* 
        Given a scrollbar, we calculate the animationStateValue (props) based on the location of the mouse in scrollBar as follows :  
            let currentMouseLocScrollBar = the current mouse_location 
            let scrollBar_Width = The width of the scroll_Bar div  
	        let scrollBar_Middle = scrollBar_Width/2
	        let middle_Width = scrollBar_Width - scrollBar_Middle, be the space in-between scrollBar_Middle, .., scrollBar_Width
            let scroll_Values = {x,…, x'} be a set of scroll speed for x ∈ Z. 
	     
	        then, if ( currentMouseLocScrollBar > scrollBar_Middle ) then :
            	 	animationPercentage = ( (currentMouseLocScrollBar - scrollBar_Middle) / middle_Width);
	        else, ⇒ currentMouseLocScrollBar < scrollBar_Middle, we do :
            	 	animationPercentage = ( (scrollBar_Middle - currentMouseLocScrollBar) / middle_Width);
      
            Then, we utilise  animationPercentage to select scrollSpeed ∈ scroll_Values for the speed of scroll. This is calculated
            as : x = scroll_Values[ animationPercentage ⨉ | scrollValues | ]
        we return x; 
    */
    calculateScrollValue(scrollBar_Width : number, currentMouseLocScrollBar: number, scroll_Values : number[] ) : number
    {
        let animationPercentage;
        let scrollBar_Middle = scrollBar_Width/2;
        let middleWidth = scrollBar_Width - scrollBar_Middle; 

        let x;
        if (currentMouseLocScrollBar > scrollBar_Middle)
        {
            animationPercentage = (currentMouseLocScrollBar - scrollBar_Middle) / middleWidth;
            x = scroll_Values[Math.floor((animationPercentage * (scroll_Values.length-1)))];
        }
        else
        {
            animationPercentage = (scrollBar_Middle - currentMouseLocScrollBar) / middleWidth;
            x = -scroll_Values[Math.floor((animationPercentage * (scroll_Values.length-1)))];
        }
        return x;
    }

    scrollBarCursorCss:React.CSSProperties = {
        position : 'absolute',
        left : '50%',
        height : '9px',
        // width :`100px`,
        backgroundColor :'black',
        transition : 'opacity 0.5s',
        display : 'grid',
        justifyItems : 'none',
        // justifyContent : 'center'
    }

    /* Render the scrollBar cursor / animation accordinly to scrollVal */
    renderScrollBarCursorCss(scrollVal : number)
    {
        if (scrollVal < 0 ) /* scrollBar is at bottomHalf of the scrollBar */
        {
            this.scrollBarCursorCss.width = `${ this.scrollBarWidth/2 - this.state.scrollBarCursorLocation }px`;
            this.scrollBarCursorCss.left  = `calc(50% - ${this.scrollBarCursorCss.width})`;
            this.scrollBarCursorCss.justifyItems = 'start';
        }else { /* scrollBar is at upperHalf of the scrollBar */
            this.scrollBarCursorCss.left = "50%";
            this.scrollBarCursorCss.width = `${this.state.scrollBarCursorLocation - this.scrollBarWidth/2}px`;
            this.scrollBarCursorCss.justifyItems = 'end';
        }
    }

    componentWillUnmount() 
    {
        console.log("Render slider will unmount!@!#!@#!#@!#!@#!@#!@#!@");
    }

    handleDivScroll() 
    {
        console.log("we are scrolling!");

    }
    
    render(){
        return(
            <>  
                <div style = { {width : '100%', height : '100%',position : 'relative', overflow :'hidden'}}> 
                <ImageAnimation animationPercentage = {this.state.animationPerentage} imagePath = {this.props.imagePath}/>
                    <div  style = { { bottom : '0%', width : '100%', height : '10%' , zIndex : '3', position:'absolute', display :'grid', alignItems:'center'}}>
                        {/* <div scrollBar cursor style = { { opacity : `${this.state.scrollBarCursorOpacity}%`,width : '55px', height : '55px', backgroundColor :'blue', zIndex :'1', position : 'absolute',  left : `${this.state.scrollBarCursorLocation}px`}}> </div> */}
                        <div  /* ScrollBar Cursor */style = { Object.assign({opacity : `${this.state.scrollBarCursorOpacity}%`}, this.scrollBarCursorCss)}> 
                                {/* <div style = { {backgroundColor : 'black', width : '30px', height: '30px', position : 'relative', top : '-10.5px' /* <-- (this.height/2 - (parentheight/2)) /}}/>  */}
                        </div>
                        <div  /* ScrollBar */ref = {this.scrollBar} style = { { bottom : '0%',backgroundColor : 'rgba(255, 0, 0, 0.0)', width : '100%', height : '100%' , position:'absolute',zIndex:'2'}}/>
                    </div>
                </div>
            </>
        );
    };
}

export default renderSlider;