
import {FileList} from "../CodeWindow"
import DynamicHeading from "../../dynamicText"
import React, { useLayoutEffect, useRef, useState } from "react"
import myBrowser from "../../../browserHandling/myBrowser";
import { JsxElement } from "typescript";
import {ObjectRef} from '../../../Interfaces/RefObjectInterface';
import DynamicStringHandler from '../../Dynamic_StringContent/DynamicString'; 

/* ------------------------------------------ Component Description ------------------------------------------
    Renders the code-interface used by the codeWindow component, mainly the id = Code_Container NODE.

    Passing paraemeters through props: 
        code : String of code elements 
------------------------------------------------------------------------------------------------------------*/

let textRescaled = false;
let RenderCodeInterface : React.FC < {file : FileList, globalFontSize : number} > = (props) => {
    let CodeInterfaceContainer_Ref = useRef<HTMLDivElement>(null);
    let sideNumbering_Ref = useRef<HTMLDivElement>(null);
    let codeContent_Ref = useRef<HTMLDivElement>(null);
    let [lines, setLines] = useState<number>(1);                       /** (Ref : 2198) --> represent the # lines rendered based on file.content (line size) */
    let [globalFontSize, set_GlobalFontSize] =  useState<number>(props.globalFontSize);  /** Global font size utilised at (Ref : 3321) */
     /** Dynamic-text container,text ref used to detemine smallest-font size at (Ref : 3391)  */
    let dynamicTextContainer_Ref = useRef<HTMLDivElement>(null);       
 
    /** (Ref : 3321) --> Global styling property */
    let numberSideStyling : React.CSSProperties ={
        fontSize : `${globalFontSize}px`
    }

    /** Initialise necessary Action-listeners */
    // useLayoutEffect(
    //     () => {
    //         if (CodeInterfaceContainer_Ref.current != null)
    //         {
    //             CodeInterfaceContainer_Ref.current.addEventListener("resize", () => {console.log("Change occurred!");});
    //         }
    //     }
    // );

    /**  Dynamically re-scale and render necessary content. */
    useLayoutEffect(
        () => {
         

            /** Return the current number of lines that is representative of the contents (#lines in container) in id = codeContentContainer , 
             *  where if on return = 1 ⇒ numberTab and codeContents are aligned, and not the # of-lines needed.*/
            let getNumberoflines = () : number => {
                if (sideNumbering_Ref.current != undefined && codeContent_Ref.current != undefined && dynamicTextContainer_Ref.current != undefined )
                {
                    // let sideHeight =  myBrowser.RefHandling.getRefHeight(sideNumbering_Ref);
                    let codeContentHeight = myBrowser.RefHandling.getRefHeight(codeContent_Ref);
                    // dynamicTextContainer_Ref.current.style.height = `${sideHeight / lines}px`; //(Ref : 3321)
                    let sideHeight = myBrowser.RefHandling.getRefHeight(dynamicTextContainer_Ref);
                    let numberofLines = codeContentHeight / sideHeight;  // where 1 ⇒ aligned, and not the #of-lines. 

                    // console.log ("sideHeight = " + sideHeight);
                    // console.log ("codeContentHeight = " + codeContent_Ref.current.clientHeight);

                    // if (numberofLines > 1) 
                    //     if (sideHeight >= codeContentHeight )numberofLines = Math.round(numberofLines);
                    //     else numberofLines = Math.round(numberofLines);

                        //NOTE : Math.round used for smaller size scaling
                    // numberofLines=  Math.round(numberofLines);
                    return numberofLines;
                }
                return -1;
            }

            /** (Ref : 2197) --> Determine the number of lines needed to display props.content in id = codeContentContainer. 
             *  This 'lines' value is used to render the appropriate visual component at (Ref : 9212). This method provokes a
             *  re-render upon new line value. 
             */
            let InitialiseLineValue = () => {

                let numberOfLines = getNumberoflines(); 
                if (numberOfLines === -1) return;   // cannot get # of lines, we return!

                if (Math.ceil(numberOfLines) != lines)
                {
                    setLines ( Math.round(numberOfLines));
                }
            }

            InitialiseLineValue();
        }
    )
    
    /** (Ref : 9212) --> Render the contents at id = "numberTab" container, this is : to indicator line-by-line value. */
    let elemRef = useRef<HTMLDivElement>(null);
    let numberTab : JSX.Element[] = [];
    for (let i =1; i <= lines; i++) numberTab.push( <div ref = {elemRef} key={i} > {i} </div>)
    

    /** (Ref : 3391) --> Determine the smallest font-size to be use globally by this component, that is
     *  by styling defined at (Ref : 3321). The smallest font-size is determined by the largest line-value
     *  in container : id = numberTab. This is the largest numberic value defined at (Ref : 2198) determined at
     *  (Ref : 2197).  
     * 
     *  This is done so that all text (by global font-size) are the same, and hence Code-content and 
     *  numberTab are perfectly aligned. 
    */
    // useLayoutEffect(
    //     () => {
    //         if (dynamicTextRef.current != null)
    //         {
    //             let smallestSize = myBrowser.RefHandling.getRefFontSize(dynamicTextRef);
    //             console.log("dynamic text size = " + smallestSize);                
    //             console.log("globalFontSize size = " + globalFontSize);


    //             if (globalFontSize != smallestSize){
    //                 set_GlobalFontSize(smallestSize);
    //                 console.log("Global font-size set!");
    //             }else{
    //                 console.log("isnt the same");
    //             }
    //         }
    //     }
    // )
    return(
        <>
            <div ref = {CodeInterfaceContainer_Ref} style = {{width:'100%', height :'100%', padding :'2%',boxSizing:'border-box'}}> 
                <div style = {{width :'100%', height :'100%', display :'grid', gridTemplateColumns:'10% 90%'}}> 
                    <div style = {{ color :'gray', textAlign :'center', position :'relative'}}> 
                        <div ref ={dynamicTextContainer_Ref} style ={{visibility:'hidden', position:'absolute', fontSize : `${globalFontSize}px`}}>  1   </div>
                        <div id = "numberTab" ref = {sideNumbering_Ref} style = { Object.assign({whiteSpace :'nowrap', overflow :'hidden'}, numberSideStyling)}>
                            { numberTab }
                        </div>
                    </div>
                    <div id = "codeContentContainer" style = {{paddingLeft: '1%', boxSizing :'border-box'}}>
                        <div ref = {codeContent_Ref} style ={Object.assign( {}, numberSideStyling)}>
                            <div style = {{width:'100%'}}> 
                                { DynamicStringHandler.generateElement(props.file.content) }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

let getCSSProperty = (Property : String, CSSProperties : React.CSSProperties[] ) : void => {
    let leftIndex = 0; 

    for (let i=0; i < Property.length; i++)
    {
        let current_Char = Property.charAt(i);
        if (current_Char === ',' || i === Property.length-1)
        {
            let current_Property = Property.slice(leftIndex, ((i === Property.length-1)  ? i+1 : i ) ).replaceAll(" ", "").toLowerCase();
            console.log("Checking CSS property : " + current_Property);

            switch(current_Property)
            {
                case "blue" :   CSSProperties.push({color:'blue'});
                break;
                case "red" :    CSSProperties.push({color:'red'})
                break;
                case "br" :     CSSProperties.push({ display:'block'})
                break;
                case "sp_1" :   CSSProperties.push({paddingLeft:'10%'})
                break;
                case "sp_2" :   CSSProperties.push({paddingLeft:'20%'})
                break;
                case "sp_3" :   CSSProperties.push({paddingLeft:'30%'})
                break;
                case "sp_4" :   CSSProperties.push({paddingLeft:'40%'})
                break;
                case "sp_5" :   CSSProperties.push({paddingLeft:'50%'})
                break;
                case "sp_6" :   CSSProperties.push({paddingLeft:'60%'})
                break;
            }
            leftIndex = i+1;
        }
    }

}
export default RenderCodeInterface;