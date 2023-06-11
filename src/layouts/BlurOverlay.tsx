import React, {useState, useEffect, CSSProperties} from 'react';
import styling from './gridStyle.module.css';
import StateObject from '../Interfaces/stateObjectInterface';

let test = 1;
/* Render a blur-overlay div set to the width and place to the end relative to the parent container. */
/* Takes as argument  : 1) HTMLDOMElement of the parent container 2) custom CSS property 3) orientation {"bottom", "top"} */
let RenderOverlay : React.FC <{parentContainer : StateObject <React.RefObject<HTMLInputElement>> , customStyling : React.CSSProperties, orientation : string}>  = (props) =>
{
    // let [parentContainer, setParentContainer] = useState({});
    // useEffect(
    //     () => {
    //         if (props.parentContainer.current != null)
    //         {
    //             setParentContainer( window.getComputedStyle(props.parentContainer.current) );
    //             // console.log("scFR width = " + parentContainer);
    //             console.log( "ww" );
    //         }
    //     }
    // , [props.parentContainer]);
    // console.log("here");


    const [t, sett] = useState(props.parentContainer);

    if (props.parentContainer != null)
    {
        if(props.parentContainer != t)
        {
            sett(props.parentContainer);
            console.log("parent set for blur overlay!");
        };
    };
    
    const [parentW, setParentW] = useState('0px');

    useEffect(() =>
    {
        if (t.item.current != null )
        {
            let w   =  window.getComputedStyle(t.item.current);
            console.log("deval : "+ w.width );
            setParentW(w.width);
        }
    });
    
    let orientationStyling : React.CSSProperties = new Object();

    if (props.orientation === "top" ) //else ⇒ bottom by default!. 
    {
        orientationStyling = 
        {
            backgroundImage : "linear-gradient(180deg, #1c1e1f 10%, rgba(28, 30, 31, 0))"
        }; 
    }

    return (
        <> 
        {/* // (containerWidth == null) ? '0px' : containerWidth.width  */}
            <div className={styling.BlurOverlayBottom} style = {  Object.assign( { width : parentW }, props.customStyling, orientationStyling) }/>
        </>

        //EXTRA-Practice
        /* { 
                ( props.orientation === 'bottom') ?  
                (<div className={styling.BlurOverlayBottom} style = {  Object.assign( {  width : (containerWidth == null) ? '0px' : containerWidth.width  }, props.customStyling) }>  </div> )
                : 
                (<div className={styling.BlurOverlayTop} style = { Object.assign( { width : (containerWidth == null) ? '0px' : containerWidth.width  }, props.customStyling) }>  </div> )
             }       
        */
        // <div className={styling.BlurOverlay} style = { Object.assign( { width : (containerWidth == null) ? '0px' : containerWidth.width  }, props.customStyling) }>  </div> 
        // <div style = {{backgroundColor:'pink', width : '100%', height : '70px', bottom : 0, position : 'absolute', zIndex : '10'}}>
        //     <div className={styling.BlurOverlay} style = { { width : '100%', bottom:0 , left:0, backgroundColor :'red', overflow :'hidden' }}>  </div> 
        // </div>
        // <div style={{width:'150px', height:'60px', backgroundColor:'red', position : 'relative'}}>
                //  {/* <div className={styling.BlurOverlay} style = { { width : (parentWidth == null) ? '0px' : parentWidth.width, bottom:'-100px'  }}>  </div> */}
                //  {/* <div className={styling.BlurOverlay} style = { {width:'100%', height : '10px',bottom:'0'}}>  </div>

        // </div> */}
    )

}

export default RenderOverlay; 


