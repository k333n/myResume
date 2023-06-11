import React, { useEffect, useState } from "react";
import myBrowser from '../browserHandling/myBrowser';
import DynamicHeading from './dynamicText' 


/* ------------------------------------------ Component Description ------------------------------------------
    Renders a simply image container taking 100% x,y of parent. The image is scaled accordingly s.t. no overflow
    occurs. 

    Passing paraemeters through props: 
        src : image locaiton
        styling : Custom styling for container & <Img> element 
        image_position : String ∈  { right , left, bottom, top} utilised in the <img.style.object-position> property. 
        isloaded : Callback function when image is loaded.
------------------------------------------------------------------------------------------------------------*/

let RenderImageFrame : React.FC<{src : string, container_styling? : React.CSSProperties , image_Styling? : React.CSSProperties,  isLoaded? : ()=> void }  > = (props) : React.ReactElement =>
{
    let [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

    useEffect(
        ()=>{
            let getImage = async() => 
            {
                // console.log("Attemping to retrieve image : " + props.src);
                let image_Promise : Promise<HTMLImageElement> = myBrowser.RequestHandling.getImage(props.src);
                image_Promise.then
                ( 
                    (element) => 
                    {
                        // console.log("Image Element retrieved")
                        setImageElement(element);
                        if (props.isLoaded != undefined) props.isLoaded();
                    } 
                )
                .catch
                (
                    (err) => 
                    {
                        // console.log("Error for Element retrival : " + err); 
                        setImageElement(null);
                    }
                )
            }
            getImage();
        }, [props.src]
    )
    
    return (
        <>
        {/* style={Object.assign({}, props.styling)} */}
            <div style = {{width : "100%", height :'100%', position:'relative', display:'flex', justifyContent:'center'}}>
                {(imageElement === null &&  props.isLoaded != undefined) ?  // show default dialog IFF no handler function given
                    <DynamicHeading Text = {"Loading Image..."} Styling = {{}} textRef = {null}/> 
                    :  
                    <div style={Object.assign({}, props.container_styling)}>                         
                         <img src = {props.src} style = 
                        { Object.assign({
                            objectFit:'contain', 
                            overflow:'hidden', 
                            width:'100%', 
                            height:'100%', 
                            ObjectFit:'cover',
                            top:'0px',
                        }, props.image_Styling)}/> 
                    </div>
                }
            </div>
        </>
    )

}

export default RenderImageFrame;