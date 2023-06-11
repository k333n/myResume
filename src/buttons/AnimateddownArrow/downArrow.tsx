import Styling from './styling.module.css';
import React, { useLayoutEffect } from 'react';
import myBrowser from '../../browserHandling/myBrowser';
/* ------------------------------------------ Component Description ------------------------------------------
    Renders a animated down arrow button which inheriting at most 100% width,height of the direct parent wrapping 
    container. 

    Passing paraemeters through props: 
        handleAction : Call back function to handle button click
------------------------------------------------------------------------------------------------------------*/

let RenderDownArrow : React.FC <{handleAction?: () => void}>= (props ) => {

    let containerRef = React.useRef<HTMLDivElement>(null);

    let [arrowSize, set_ArrowSize] = React.useState<number>(5);

    useLayoutEffect(

        () => { 
            if (containerRef.current != undefined)
            {

                let container_Width = myBrowser.RefHandling.getRefWidth(containerRef);
                let container_Height = myBrowser.RefHandling.getRefHeight(containerRef);

                // console.log( " Contaner h = " + container_Height + "  container W = "  + container_Width );

                let max = (container_Width > container_Height) ? container_Height : container_Width;
              
                if (arrowSize != max) set_ArrowSize(max);
            }


        }
    )



    return (
        <>
        <div ref = {containerRef} style = {{width :'100%', height:'100%', display :'flex', justifyContent :'center',  alignItems :'center',}}>
            <div style={{width:`${arrowSize}px`, height :`${arrowSize}px`,display :'flex', justifyContent :'center'}}>
                <div className={Styling.arrowdown}/>
            </div>
        </div>
        </>
    );
}


export default RenderDownArrow;
