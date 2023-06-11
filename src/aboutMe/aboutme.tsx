import React, {useState, useEffect, useRef }from "react";
import RenderGrid from '../layouts/gridFrame';
import AboutmePanel from './aboutMePanel';
import NavBar from '../layouts/navigationBar';
import ScrollableFrame from '../layouts/scrollableFrame';
import styling from "./aboutMeStyling.module.css";
import BlurOverlay from '../layouts/BlurOverlay';
import {Item} from './aboutMePanel'
import PanelContent from './panelContent';
import { navItems } from "./panelContent";
import StateObject from "../Interfaces/stateObjectInterface";

import Sidetranition from "../animations/TransitionContainer";


const scrollableStyle:React.CSSProperties = {
    width : '100%',
    height : '100%',
    backgroundColor : 'grey'
};

// const getRef : (r:React.RefObject<HTMLInputElement>) => React.RefObject<HTMLInputElement> = (r) =>
// {
//     return r;
// }

const RenderAboutMe: React.FC = (props) =>
{
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [PanelInformationRef, setPanelInformationRef] = useState(useRef<HTMLInputElement>(null));  //utilised to render blurOverlay, mainly, it stores the parent attribute used in  bluroverlay.
    const [selectedPanel, setSelectedPanel] = useState ( navItems[0].key);  // state for rendering the selected panel

    /* Reference to selected panel */
    let aboutMePanelRef : StateObject <number>  ={
        item : selectedPanel,
        setItem : setSelectedPanel,
    }
    /* Reference panelContent Object : Utilised to access DOMObject info (i.e. styling) */
    let PanelContentRef : StateObject <React.RefObject<HTMLInputElement>>  ={
        item : PanelInformationRef,
        setItem : setPanelInformationRef,
    }
    useEffect(() => {   
      const handleResize = () => 
      {
        setScreenWidth(window.innerWidth);
        setScreenHeight(window.innerHeight);
      } 
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (PanelInformationRef.current !=null)
        {
            let containerWidth =  window.getComputedStyle(PanelInformationRef.current);
            console.log("window width = " + screenWidth);
            console.log ( "target with = " + containerWidth.width);
        }
    }); 

    return(
        <>
            <RenderGrid width = { `${screenWidth/1.5}px`} height = {`${screenHeight/1.2}px`}>
                <AboutmePanel selectedRef = {aboutMePanelRef} items = {navItems}/>
                <PanelContent renderKey = {selectedPanel} useRef = {PanelContentRef}/>
            </RenderGrid>            
        </>
    );
};
export default RenderAboutMe;