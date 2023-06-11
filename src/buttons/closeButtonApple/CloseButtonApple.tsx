import { useLayoutEffect } from "react";
import React from "react";


let Render : React.FC <{ handleAction?: () => void }> = (props) => {


    let [buttonSize, set_ButtonSize] = React.useState<number>(50);
    let container_Ref = React.useRef<HTMLDivElement>(null);

    useLayoutEffect(
        () => {
            if (container_Ref.current != undefined)
            {
                set_ButtonSize ( (container_Ref.current.clientHeight > container_Ref.current.clientWidth) ?  container_Ref.current.clientWidth : container_Ref.current.clientHeight);
            }

        }
    ); 

    useLayoutEffect( 
        () => {
            

            let r = (event : Event) => { 
                set_ButtonSize(buttonSize++);
                console.log("Resizing");
            }
            window.addEventListener("resize", r );

            return () => { 
                window.removeEventListener("resize", r);
            }
        }, []
    )

    let handmeMouseOver = (event : React.MouseEvent, type : String) => {
        let element = (event.target as HTMLDivElement);
        switch(type)
        {
            case "on"   :   element.style.fill = "rgba(255, 255, 255, 1)";
            break;
            case "out"  :   element.style.fill = "rgba(255, 255, 255, 0.8)";
            break;
            case "down" :   if (props.handleAction != undefined) props.handleAction();
            break;
        }
    }
    

    return (
        <>
            <div  ref = {container_Ref} style = {{width :'100%', height:'100%', display :'flex', justifyContent :'left', alignItems:'top'}}>
                <div  onMouseDown={ (event :React.MouseEvent) => { handmeMouseOver(event, "down")}} onMouseOut={(event :React.MouseEvent) => {handmeMouseOver(event, "out") } }  onMouseOver={(event :React.MouseEvent) => {handmeMouseOver(event, "on") }  }  style={ { display:'flex', justifyContent:'center', backgroundColor:'#333336', borderRadius:'50%', overflow :'hidden',  height:`${buttonSize}px`, width :`${buttonSize}px`, padding:'10%' , boxSizing:'border-box'}} >
                    <svg fill ="rgba(255, 255, 255, 0.8)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.12,10l4.07-4.06a1.5,1.5,0,1,0-2.11-2.12L10,7.88,5.94,3.81A1.5,1.5,0,1,0,3.82,5.93L7.88,10,3.81,14.06a1.5,1.5,0,0,0,0,2.12,1.51,1.51,0,0,0,2.13,0L10,12.12l4.06,4.07a1.45,1.45,0,0,0,1.06.44,1.5,1.5,0,0,0,1.06-2.56Z"></path></svg>
                </div> 
            </div>
        </>    
    );

}


export default Render;