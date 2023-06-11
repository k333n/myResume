
import React, { CSSProperties, useLayoutEffect, useRef, useState } from 'react';
import myBrowser from '../../browserHandling/myBrowser';
import { ObjectRef } from '../../Interfaces/RefObjectInterface';
import DynamicHeading from '../../layouts/dynamicText'

interface ColorProperty {
    baseColor : CSSProperties,
    overlayColor : CSSProperties
}

let Color_Themes : {blue : ColorProperty, red : ColorProperty, yellow : ColorProperty, purple : ColorProperty} = {
    blue :  {baseColor : {backgroundColor :'#f1f5f9'}, overlayColor : { backgroundColor : '#ccf1f6'}}, 
    yellow :  {baseColor : {backgroundColor :'#f1f5f9'}, overlayColor : { backgroundColor : '#fde7b9'}}, 
    red :  {baseColor : {backgroundColor :'#f1f5f9'}, overlayColor : { backgroundColor : '#FFCCCB'}}, 
    purple : {baseColor : {backgroundColor :'#f1f5f9'}, overlayColor : { backgroundColor : '#d0b8ea'}}, 
}

/**
 * Render selection component, this is the animation bar with its associated percentage values. We let set_percentage_FontSize be a reference
 * that will be attached to the text (percentage number) returned by 'DynamicHeading' component.
 * @param sectionPercentage : 
 * @param upperText 
 * @param percentageFont_Ref : ObjectRef object that attaches to the percentage number by DynamicHeading component .
 * @returns 
 */
let RenderSection = ( sectionPercentage : number, upperText : String, percentageFont_Ref? :ObjectRef<HTMLParagraphElement> ) : JSX.Element =>
{ 
    let Line : JSX.Element = <div style = {{ justifySelf :'center', backgroundColor : '#7f8893',  height :'100%', width : '1px', zIndex :'1' } } /> ;
    let sectionWidth = 7; // in percentage

    return (
        <>
            <div style = {{ position:'absolute', left : `${sectionPercentage - (sectionWidth/2)}%`, height :'100%', width :`${sectionWidth}%`, display : 'grid', gridTemplateRows : '25% 50% 25%'}}>
                 <div style = { { height : '100%', width :'100%', overflow :'hidden'}}> 
                    {/* <DynamicHeading Text = {upperText} Styling = {{textAlign:'center',color:'#7f8893'}} /> */}
                </div>
                {Line}
                <div style = { { height : '100%', width :'100%', overflow :'hidden', textAlign :'center',color:'#7f8893', position:'relative'}}> 
                    {
                        (percentageFont_Ref != undefined)  &&
                            <div style = { { height : '100%', width :'100%',opacity :'0%', backgroundColor:'red', position:'absolute'}}>
                               <DynamicHeading Text = { `${sectionPercentage}%`} textRef = {percentageFont_Ref} isSimpleContainer = {true}/>
                            </div>
                    }
                    {sectionPercentage}%
                </div>
            </div>
        </>
    );
}



let RenderElipseContainer : React.FC <{percentage:number, color_Theme? : String}> = (props) => 
{
    let Line : JSX.Element = <div style = {{justifySelf :'center', backgroundColor : 'black',  height :'100%', width : '1px' } } /> ;
    let animationBar = React.useRef<HTMLDivElement>(null);
    let Current_Theme :ColorProperty = Color_Themes.red; 
    
    useLayoutEffect(
        () =>{
            if (animationBar.current != null)
            {
                animationBar.current.style.width = `${props.percentage}%`;
            }
        },
    );
    let [percentage_FontSize, set_percentage_FontSize] = useState<number>(30); 
    let percentFont_Ref : ObjectRef<HTMLParagraphElement> = {
        setFunc : ( ref: ObjectRef<HTMLParagraphElement>, toRef: React.RefObject<HTMLParagraphElement>  ) => {
            ref.ref = toRef;
        },
        ref : undefined
    }

    useLayoutEffect(
        () => {
            if (percentFont_Ref.ref != undefined)
            {
                let globalFontSize = myBrowser.RefHandling.getRefFontSize(percentFont_Ref.ref);

                if (globalFontSize != percentage_FontSize){
                    set_percentage_FontSize(globalFontSize);
                    console.log("Global font size set to :" + globalFontSize);
                }
            }
        }
    )
    
    switch (props.color_Theme)
    {
        case "red" :Current_Theme = Color_Themes.red; 
        break;
        case "blue" :Current_Theme = Color_Themes.blue; 
        break;
        case "yellow" :Current_Theme = Color_Themes.yellow; 
        break;
        case "purple" :Current_Theme = Color_Themes.purple; 
        break;
        default : return (<>  <div style = {{display : 'grid', alignItems :'center' ,position:'relative', textAlign :'center', width :'100%', color :'red', height :'100%' }}> Invalid Color_Theme, only : blue,yellow,red,purple supported. </div> </>);
    }
    
    
    
    return (
        <>
            <div style = {{display : 'grid', alignItems :'center' ,position:'relative', width :'100%', height :'100%', fontSize :`${percentage_FontSize}px`}}>
                <div style = { Object.assign( {overflow :'hidden', position:'relative', width :'100%', borderRadius : '2em', height :'30%',zIndex:'5'}, Current_Theme.baseColor)}>  
                    <div ref = {animationBar} style = { Object.assign({ position:'relative', width :'0%', backgroundColor :'black', height :'100%', transition : 'width 2s ease-in-out'}, Current_Theme.overlayColor)}/>  
                </div>
                {RenderSection(5, "1 year")}
                {RenderSection(50,"2 year")}
                {RenderSection(95, "3 year", percentFont_Ref )}
            </div>
        </>
    )
    
}

export default RenderElipseContainer;