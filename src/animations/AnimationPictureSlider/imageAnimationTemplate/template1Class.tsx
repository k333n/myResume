import { rejects } from "assert";
import { url } from "inspector";
import React, {useEffect, useState, useRef, Context } from "react";
import { promises } from "stream";
import { Url } from "url";
import myBrowser from '../../../browserHandling/myBrowser'

/* ------------------------------------------------------------------------------------------------------------------------------------------------------
   Template Documentation :
        window.Image : (Ref : 30019)
            new window.Image() creates a new Image object. An Image object is a representation of an HTML <img> element in JavaScript. 
            It can be used to load and display an image in a web page.
            The Image constructor is a property of the window object in a web browser. 
            It is a global object that represents the current web page. When you call new window.Image(), you are creating a new instance of the Image object.

* ------------------------------------------------------------------------------------------------------------------------------------------------------ */

interface stateItems {

}


class renderSlider extends React.Component<{animationPercentage : number}, stateItems>
{
    imageUrls: string[] | null = null;                                        /*= getImageUrls();*/
    animationImages : HTMLImageElement[] | undefined ;          /* = getImages(imageUrls);*/
// const imageContext =  require.context( `./templat1Images`, false, /\.(png|jpe?g)$/);  /* directory to pull the resources! */
// var imageContainerCss : React.CSSProperties =
// { 
//     position : 'absolute', 
//     width : '50%', 
//     height :'50%', 
//     zIndex : '1',  
//     overflow:'hidden', 
//     display : 'grid', 
//     justifyItems : 'center', 
//     alignItems:'center',
//     transition : 'width 2s, height 2s' 
// }
    constructor(props : any) 
    {
        super(props);

        console.log("Slider constructed!");
    }

    getImageState(animationImages : HTMLImageElement[], animationStatePercentage : number) :number
    {
    return Math.round( (animationStatePercentage * (animationImages.length-1)));
    }   

    render(): React.ReactNode {
        return (
        <>
        
        </>);
    }

}

export default renderSlider;
/* return the 'x' index in animationImage[x] calculated by the animationPercentage*/
function getImageState(animationImages : HTMLImageElement[], animationStatePercentage : number) :number
{
    return Math.round( (animationStatePercentage * (animationImages.length-1)));
}

var imageUrls: string[];                                        /*= getImageUrls();*/
var animationImages : HTMLImageElement[] | undefined ;          /* = getImages(imageUrls);*/
declare const require: NodeRequire & { context?: any };         /* interface needed for webkit (i.e : require.context) */
const imageContext =  require.context( `./templat1Images`, false, /\.(png|jpe?g)$/);  /* directory to pull the resources! */
var imageContainerCss : React.CSSProperties =
{ 
    position : 'absolute', 
    width : '50%', 
    height :'50%', 
    zIndex : '1',  
    overflow:'hidden', 
    display : 'grid', 
    justifyItems : 'center', 
    alignItems:'center',
    transition : 'width 2s, height 2s' 
}

let test = 0; 
let RenderAnimation : React.FC <{animationPercentage : number}> = (props) =>  
{

    let [animationState, setAnimationState] = useState<HTMLImageElement>();
    let [reRender, setReRender] = useState<boolean>(false);

    console.log("rendering animation")
  
    function imageMouseEnter()
    {
        imageContainerCss.width = '100%';
        imageContainerCss.height = '100%';
        setReRender(!reRender);
    }
    function imageMouseLeave()
    {
        imageContainerCss.width = '50%';
        imageContainerCss.height = '50%';
        setReRender(!reRender);
    }
    useEffect( () => 
    {
    
        console.log("animationImages length is " + animationImages?.length);
        if (animationImages != undefined)
        {
    
            // console.log( " animation defined with lengths : " + animationImages?.length );
            setAnimationState(animationImages[getImageState(animationImages, props.animationPercentage)]);
            
        }
        else
        {
            // test++;
            // console.log("test is : " + test);

            console.log("animationImages empty, we retireve images ! "); 
            imageUrls =  myBrowser.DirHandling.getLocalFilePath(imageContext);
            let retrieveImage = async () =>
            {
                const gett = await myBrowser.RequestHandling.getImages(imageUrls);
                animationImages = gett;
                setReRender(!reRender);
            }
            retrieveImage();
        }
    });

    


    return (
        <> 
            {/* {animationState} */}
        
            <div style = {{width : '100%', height : '100%', display : 'grid', justifyItems : 'center', alignItems : 'center',}}> 
                <div style = { Object.assign({}, imageContainerCss)}> 
                
                    { (animationImages != undefined) ?  
                        <img onMouseEnter={imageMouseEnter} onMouseLeave= {imageMouseLeave} src ={animationState?.src} 
                        style = 
                        { {
                            objectFit:'contain', 
                            overflow:'hidden', 
                            width:'100%', 
                            height:'100%', 
                        }}/>
                        :
                        <p> failed to load! </p>
                    }
                
                </div>
            </div> 
        </>
    );

} 





// export default RenderAnimation;