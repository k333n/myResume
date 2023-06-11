import React, {useState} from 'react';
import ScrollableFrame from '../layouts/scrollableFrame';
import {Item} from './aboutMePanel';
import BlurOverlay from '../layouts/BlurOverlay';
import StateObject from '../Interfaces/stateObjectInterface';
import TransitionFrame from '../animations/TransitionContainer';


let scrollingFrameStyling : React.CSSProperties = {
    backgroundColor : '#1c1e1f',
    padding :'5%'
};

function renderResume(parentContainer : StateObject <React.RefObject<HTMLInputElement>>) : React.ReactElement
{
    return (
        <>
              <TransitionFrame key = {1} customStying = {{}}>
                <BlurOverlay parentContainer = {parentContainer} customStyling = {{bottom:'0', right :'0px'}} orientation = "bottom" />
                <BlurOverlay parentContainer = {parentContainer} customStyling = {{top:'0', right :'0'}} orientation = "top" />
                <ScrollableFrame useStateReference = {parentContainer} customStyle={ scrollingFrameStyling }>
                    <p> THIS IS MY renderResume </p>
                    <br/>
                    <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/>
                </ScrollableFrame>              
            </TransitionFrame>
        </>
    );
}

function renderOverview (parentContainer : StateObject <React.RefObject<HTMLInputElement>>) : React.ReactElement
{
    return (
        <>
            <TransitionFrame key = {2} customStying={ {} }>
                <BlurOverlay parentContainer = {parentContainer} customStyling = {{bottom:'0', right :'0px'}} orientation = "bottom" />
                <BlurOverlay parentContainer = {parentContainer} customStyling = {{top:'0', right :'0'}} orientation = "top" />
                <ScrollableFrame  useStateReference = {parentContainer} customStyle = {scrollingFrameStyling}>
                    <p> THIS IS renderOverview </p>
                    <br/>
                    <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/>
                </ScrollableFrame>              
            </TransitionFrame>
        </>
    );
}

function renderProject (parentContainer : StateObject <React.RefObject<HTMLInputElement>>) : React.ReactElement
{
    return (
        <>
            <TransitionFrame key = {3} customStying={ {} }>
                <BlurOverlay parentContainer = {parentContainer} customStyling = {{bottom:'0', right :'0px'}} orientation = "bottom" />
                <BlurOverlay parentContainer = {parentContainer} customStyling = {{top:'0', right :'0'}} orientation = "top" />
                <ScrollableFrame useStateReference = {parentContainer} customStyle={ scrollingFrameStyling}>
                    <p> THIS IS renderProject </p>
                    <br/>
                    <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/> <p> sadfasdf </p>
                    <br/>
                </ScrollableFrame>              
            </TransitionFrame>
           

        </>
    );
}

const navItems : Item[] = [ 
    {
        key : 1,
        icon : "https://assets.website-files.com/6292458ea6c91805d3cb2506/62972bd605b3a233e43abfdf_Icon-user-1.svg",
        dest : "www.google.com",
        name : "overview",
    }, 
    {
        key : 2,
        icon : "https://assets.website-files.com/6292458ea6c91805d3cb2506/62972bd605b3a233e43abfdf_Icon-user-1.svg",
        dest : "www.google.com1",
        name : "projects",
    }, 
     {
        key : 3,
        icon : "https://assets.website-files.com/6292458ea6c91805d3cb2506/62972bd605b3a233e43abfdf_Icon-user-1.svg",
        dest : "www.google.com1",
        name : "resume"
    },
]

/* Render content based on renderKey value, it takes two parameters by props : .
    1)  RenderKey =  Associative key with navItems.key.  
    2)  UseRef = set the current DOMobject Reference by the rendering methods (i.e. : renderOverview, renderResume,.. ), allowing the access of properties (i.e. width) 
                 in parent scope. 
*/
const RenderInformation: React.FC < { renderKey : number, useRef : StateObject <React.RefObject<HTMLInputElement>> }> = (props) => 
{
    let toRend:JSX.Element  = <></>;

    switch (navItems.find((s) => s.key === props.renderKey)?.name)
    {
        case 'overview' :
            toRend = <> {renderOverview(props.useRef)}</>
            break;
        case 'resume' :
            toRend = <> {renderResume(props.useRef)}</>
            break;
        case 'projects' :
            toRend = <> {renderProject(props.useRef)}</>
            break;
        default :
            toRend = <> {"invaid render!"}</>
            break;
    }

    return (
        <>
            {toRend}
        </>
    );
}

export default RenderInformation;
export {navItems}; 