
import { relative } from 'path';
import React, {useState, useRef} from 'react';
import ScrollableFrame from '../layouts/scrollableFrame';
import StateObject from '../Interfaces/stateObjectInterface';
import {ClassStateCallBack} from '../Interfaces/stateObjectInterface';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { promises } from 'stream';
import CircleAnimation from '../animations/AnimationScroller/Templates/circle';


/* State generic type for class component! */
export interface stateItems 
{
    scrollableFrameRef : React.RefObject<HTMLInputElement>, 
    scrollState : number;
}

/* 
    Note :
        React.Component is a generic class that takes two type arguments: 
            1) Props and State : Props represents the type of the component's props, and State represents the type of the component's state 
            2) '{}' is passed as the type argument for Props, which indicates that this component does not have any props. 
                The interface IState is passed as the type argument for State, which defines the shape of the state object.
*/
class renderSlider extends React.Component<{ children : React.ReactNode}, stateItems>
{
    holderRef = React.createRef<HTMLInputElement>(); 
    scrollBar = React.createRef<HTMLDivElement> ();
    // callBackFunc : ClassStateCallBack<React.RefObject<HTMLInputElement>>;

    constructor(props :any)
    {
        super(props);
        console.log("Render slider created!");

        this.state = { scrollableFrameRef : React.createRef() , scrollState : 0};
        this.handleClick = this.handleClick.bind(this);
        this.handleDivScroll = this.handleDivScroll.bind(this);
        this.setState = this.setState.bind(this);
        this.setScrollableFrameRef = this.setScrollableFrameRef.bind(this);
        this.calculateScrollValue = this.calculateScrollValue.bind(this);

        // this.callBackFunc = {
        //     setItem : this.setScrollableFrameRef,
        // }

    }


    /* Callback function for ScrollableFrame Ref (in State) */
    setScrollableFrameRef(item : React.RefObject<HTMLInputElement> )
    {
        console.log("setScrollableFrameRef!");
        this.setState(state => ( {scrollableFrameRef : item}));
    }

    handleClick()
    {
        console.log("handling click change");
        if (this.state.scrollableFrameRef.current != null)
        {
            let m = window.getComputedStyle(this.state.scrollableFrameRef.current);
            console.log("thie sizing of result is  " + m.width);
        }
        else if(this.state.scrollableFrameRef.current == null) 
        {
            console.log("thie sizing of result is null");
        }
    }
  
    componentDidUpdate ()
    {
        console.log("component updated!");
      
        if (this.state.scrollableFrameRef.current != null)
        {
            console.log(window.getComputedStyle(this.state.scrollableFrameRef.current).width);
        }

        if (this.state.scrollableFrameRef.current != null )
        {
            this.state.scrollableFrameRef.current.addEventListener('scroll', this.handleDivScroll);
        }
    }

    componentDidMount() 
    {
            console.log("Render slider DidMount!");
        /* ------------------------------- ScrollBar Event Handling -------------------------------  */
            let scrollVal = 0;
            let toScroll = false;

            this.scrollBar.current?.addEventListener('mousemove', (event) => 
            { 
                if (this.scrollBar.current != null)
                {
                    let w = window.getComputedStyle(this.scrollBar.current).width;
                    scrollVal = this.calculateScrollValue(parseInt(w, 10), event.offsetX, this.scroll_Values);
                }
            });

            this.scrollBar.current?.addEventListener('mouseleave', (event) => 
            {
                toScroll =false;
            });

            this.scrollBar.current?.addEventListener('mouseover', (event) => 
            { 
                toScroll =true;
                executeScroll();
            });

            /* scroller asynchronous funct */
            let executeScroll  = async () =>
            {

                if (this.holderRef.current != null)
                    while (1)
                    {
                        await new Promise((resolve) =>  { setTimeout(() => resolve("awaited"), 10) });
                        let newScrollState : number = this.state.scrollState + scrollVal;
                        let maxScrollWidth : number = parseInt( window.getComputedStyle(this.holderRef.current).width);
                        if (newScrollState >= 0 && newScrollState <= (maxScrollWidth - window.innerWidth) ) this.setState(state => { return {scrollState : newScrollState}});
                        else {
                            console.log("we are at staet 0 or at max");
                        }
                        if (toScroll === false){
                            break;
                        } 
                    }
            }     
        /* ------------------------------- ScrollBa Event Handling End ----------------------------  */
    }

  /* 
        Given a scrollbar, we calculate the scroll value based on the location of the mouse in scrollBar as follows :  
            let currentMouseLocScrollBar = the current mouse_location 
            let scrollBar_Width = The width of the scroll_Bar div  
	        let scrollBar_Middle = scrollBar_Width/2
	        let middle_Width = scrollBar_Width - scrollBar_Middle, be the space in-between scrollBar_Middle, .., scrollBar_Width
            let scroll_Values = {x,…, x'} be a set of scroll speed for x ∈ Z. 
	     
	        then, if ( currentMouseLocScrollBar > scrollBar_Middle ) then :
            	 	scrollPercentage = ( (currentMouseLocScrollBar - scrollBar_Middle) / middle_Width);
	        else, ⇒ currentMouseLocScrollBar < scrollBar_Middle, we do :
            	 	scrollPercentage = ( (scrollBar_Middle - currentMouseLocScrollBar) / middle_Width);
      
            Then, we utilise  scrollPercentage to select scrollSpeed ∈ scroll_Values for the speed of scroll. This is calculated
            as : x = scroll_Values[ scrollPercentage ⨉ | scrollValues | ]
        we return x; 
    */
    scroll_Values : number[] = [0.1,0.2,0.3,0.4,0.5,0.7,0.7,0.8,0.9,1.2,1.3,1.4,1.5,2];
    calculateScrollValue(scrollBar_Width : number, currentMouseLocScrollBar: number, scroll_Values : number[] ) : number
    {
        let scrollPercentage;
        let scrollBar_Middle = scrollBar_Width/2;
        let middleWidth = scrollBar_Width - scrollBar_Middle; 

        let x;
        if (currentMouseLocScrollBar > scrollBar_Middle)
        {
            scrollPercentage = (currentMouseLocScrollBar - scrollBar_Middle) / middleWidth;
            x = scroll_Values[Math.floor((scrollPercentage * (scroll_Values.length-1)))];
        }
        else
        {
            scrollPercentage = (scrollBar_Middle - currentMouseLocScrollBar) / middleWidth;
            x = -scroll_Values[Math.floor((scrollPercentage * (scroll_Values.length-1)))];
        }
        return x;
    }
    componentWillUnmount() 
    {
        console.log("Render slider will unmount!");
    }

    handleDivScroll() 
    {
        console.log("we are scrolling!");

    }


    render(){
        return(
            <>  


                <div style = { {backgroundColor : 'grey', width : '100vw', height : '100vh', overflowX :'scroll' , position : 'relative', whiteSpace :'nowrap', overflow :'hidden'}}> 
                    <div ref = {this.scrollBar} style = { { bottom : '0%',backgroundColor : 'rgba(255, 0, 0, 0.5)', width : '100%', height : '10%' , zIndex : '3', position:'absolute'}} />

                    <div ref ={ this.holderRef} style = {{  left :`-${this.state.scrollState}px`, position : 'absolute'}}>

                            <div style = { { backgroundColor : 'blue', width : '50vw', height : '100vh', display : 'inline-block'}}> 
                                        kkk
                            </div>
                            <div onClick={this.handleClick} style = { { backgroundColor : 'orange', width : '50vw', height : '100vh', display : 'inline-block'}}> mmm </div>
                            <div style = { { backgroundColor : 'pink', width : '50vw', height : '100vh', display : 'inline-block'}}> sss </div>
                   
                   
                    </div>

                </div>

            </>
        );
    };
}

export default renderSlider;