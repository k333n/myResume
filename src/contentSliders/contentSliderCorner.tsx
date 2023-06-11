/*

    Let content = { <Title, Description, image>, … } 
    Given some x ∈ Content, we render the x on screen by the function generateDisplay(x) :

    We describe the function generateDisplay as follows :
        1. x is contained within a container <Div> of size vh ⨉ vw, more specifically :
            - If (  | Content | % 2 ) = 0 , then ∀ x ∈ Content,  width(x) = 100%, height(50%) of the containing <Div>
            - If  ( | Content | % 2 ) = 1 , then for x = content[ |content|-1 ] , width(x) = 100%, height(100%) of containing <Div>
        2. The container scrolls in the X-Axis if | Content | > 2
        3. We render a scrollBar on the bottom of the screen representing the percentage scrolled.
*/


import { relative } from 'path';
import React, {useState, useRef} from 'react';
import StateObject from '../Interfaces/stateObjectInterface';
import {ClassStateCallBack} from '../Interfaces/stateObjectInterface';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { promises } from 'stream';


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
    callBackFunc : ClassStateCallBack<React.RefObject<HTMLInputElement>>;
    leftScrollBar = React.createRef<HTMLDivElement> ();
    rightScrollBar = React.createRef<HTMLDivElement> ();

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

        this.callBackFunc = {
            setItem : this.setScrollableFrameRef,
        }

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
        }else  if(this.state.scrollableFrameRef.current == null) {
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

            this.leftScrollBar.current?.addEventListener('mousemove', (event) => 
            { 
                if (this.rightScrollBar.current != null)
                {
                    let w = parseInt(window.getComputedStyle(this.rightScrollBar.current).width, 10);
                    scrollVal = this.calculateScrollValue( w, (w-event.offsetX), this.scroll_Values  );
                }
            });
            this.rightScrollBar.current?.addEventListener('mousemove', (event) => 
            { 
                if (this.rightScrollBar.current != null)
                {
                    let w = window.getComputedStyle(this.rightScrollBar.current).width;
                    scrollVal = this.calculateScrollValue(parseInt(w, 10), event.offsetX, this.scroll_Values);
                }
            });

            this.rightScrollBar.current?.addEventListener('mouseleave', (event) => 
            {
                toScroll =false;
            });

            this.leftScrollBar.current?.addEventListener('mouseleave', (event) => 
            {
                toScroll =false;
            });

            this.rightScrollBar.current?.addEventListener('mouseover', (event) => 
            { 
                toScroll =true;
                executeScroll('right');
            });

            this.leftScrollBar.current?.addEventListener('mouseover', (event) =>
            { 
                toScroll =true;
                executeScroll('left');
            });

            /* scroller asynchronous funct */
            let executeScroll  = async (direction : string) =>
            {
                while (1)
                {
                    await new Promise((resolve) => setTimeout(() => resolve("awaited"), 10));
                    let newScrollState: number = (direction === 'left') ? (this.state.scrollState - scrollVal) : (this.state.scrollState + scrollVal);
                    if (newScrollState >= 0) this.setState(state => { return {scrollState : newScrollState}});
                    else {
                        console.log("we are at staet 0");
                    }
                    if (toScroll === false){
                        break;
                    } 
                }
            }     
        /* ------------------------------- ScrollBar Event Handling End ----------------------------  */

        

    }

    /* 
        calculate the scroll value based on the location of the mouse in scrollBar. 
        We calculate the scrollBar percentage as follows :
	        let scrollBar_Width = The width of the scroll_Bar div  
            let currentMouseLocScrollBar, be the current mouse_location 
            let scroll_Values = {1,…, n} be a set of scroll values
	        let scrollPercentage = (currentMouseLocScrollBar / scrollBar_Width);
	        
            Then, we utilise  scrollPercentage to select x ∈ scroll_Values where we use for the speed of scroll. This is calculated
            as : x = scroll_Values[ scrollPercentage ⨉ | scrollValues | ]
        we return x; 
    */
    scroll_Values : number[] = [0.1,0.2,0.3,0.4,0.5,0.7,0.7,0.8,0.9,1.2,1.3,1.4,1.5,2];
    
    calculateScrollValue(scrollBar_Width : number, currentMouseLocScrollBar: number, scroll_Values : number[] ) : number
    {
        let scrollPercentage = currentMouseLocScrollBar / scrollBar_Width; 
        let x = Math.floor((scrollPercentage * (scroll_Values.length-1)));
        return scroll_Values[x];
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

             {/* where : pointerEvents = 0, then no click/scroll event, where pointerEvent=auto we need to implement an action listener */}
            {/* <div  style= {{position : 'absolute', width :'100vw', height:'100vh', zIndex : '2', overflow :'hidden', pointerEvents:'none',}}>  
                <ScrollableFrame customStyle = {{pointerEvents:'auto'}} useReference = {this.callBackFunc}> 
                    <p style ={{fontSize : '30px'}}> asdsada</p>
                    <br/>
                    <p style ={{fontSize : '30px'}}> asdsada</p>
                    <br/>
                    <p style ={{fontSize : '30px'}}> asdsada</p>
                    <br/>
                    <p style ={{fontSize : '30px'}}> asdsada</p>
                    <br/>
                    <p style ={{fontSize : '30px'}}> asdsada</p>
                    <br/>
                    <p style ={{fontSize : '30px'}}> asdsada</p>
                    <br/>
                    <p style ={{fontSize : '30px'}}> asdsada</p>
                    <br/>
                    <p style ={{fontSize : '30px'}}> asdsada</p>
                    <br/>
                    <p style ={{fontSize : '30px'}}> asdsada</p>
                    <br/>
                    <p style ={{fontSize : '30px'}}> asdsada</p>
                    <br/>
                    <p style ={{fontSize : '30px'}}> asdsada</p>
                    <br/>
                    <p style ={{fontSize : '30px'}}> asdsada</p>
                    <br/>
                    <p style ={{fontSize : '30px'}}> asdsada</p>
                    <br/>
                    <p style ={{fontSize : '30px'}}> asdsada</p>
                    <br/>

                </ScrollableFrame>  
            </div> */}



                <div style = { {backgroundColor : 'grey', width : '100vw', height : '100vh', overflowX :'scroll' , position : 'relative', whiteSpace :'nowrap', overflow :'hidden'}}> 
                    <div ref = {this.rightScrollBar} style = { { right : '0%',backgroundColor : 'rgba(255, 0, 0, 0.5)', width : '10vw', height : '100vh' , zIndex : '3', position:'absolute'}} />
                    <div ref = {this.leftScrollBar} style = { { left : '0%',backgroundColor : 'rgba(255, 0, 0, 0.5)', width : '10vw', height : '100vh' , zIndex : '3', position:'absolute'}} />

                    <div ref ={ this.holderRef} style = {{  left :`-${this.state.scrollState}px`, position : 'absolute', paddingLeft : '10vw', paddingRight : '10vw'}}>

                            <div style = { { backgroundColor : 'blue', width : '40vw', height : '100vh', display : 'inline-block'}}> 
                                        kkk
                            </div>
                            <div onClick={this.handleClick} style = { { backgroundColor : 'orange', width : '40vw', height : '100vh', display : 'inline-block'}}> mmm </div>
                            <div style = { { backgroundColor : 'pink', width : '50vw', height : '100vh', display : 'inline-block'}}> sss </div>
                   
                   
                    </div>

                </div>

            </>
        );
    };
}

export default renderSlider;