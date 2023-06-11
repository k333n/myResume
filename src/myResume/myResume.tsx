

import Projects from './Projects';
import ScrollBarMenu, {ScrollBarElement} from "../layouts/scrollBarMenu/ScrollBarMenu";
import {useRef} from 'react';
import ProfileBanner, {AnimationBannerInformation} from '../animations/AnimationBannerProfile/AnimationBanner';
import './styling.css';
import HtmlTextConverter from './projectFiles/htmlTextConverter';
import DynamicHeading from '../layouts/dynamicText';

function RenderApp() {
    

    /** Description for profile banner */
    let profileBanner_Info : AnimationBannerInformation = 
    {
      title_Right: "</Coder>",
      title_Left : "<Design>",
      desc_Right : "Front end developer who writes clean, elegant and efficient code.",
      desc_Left : "Product designer specialising in UI design and design systems.",
      image_RightURL : "https://i.ibb.co/gMW58Bb/coder-Design.jpg",
      image_LeftURL : "https://i.ibb.co/C2nxhzH/coder-Laptop.jpg"
    }
     

    /** Main menu scrollBar Elements */
    let scrollbar_Elements : ScrollBarElement[]=
    [
        {
            reference : useRef<HTMLDivElement>(null),
            name : "Projects"
        },
        {
            reference : useRef<HTMLDivElement>(null),
            name : "BarChart"
        },
    ];

    return (
        <> 

            <ScrollBarMenu ScrolBarElements={scrollbar_Elements}/>
            <div style = {{marginTop:'150px'}}> </div>


      
            <div id = "ProfileBanner_Container" >  <ProfileBanner AnimationBarInfo={profileBanner_Info}/> </div>
            <div id = "projectContainer" ref ={ scrollbar_Elements[0].reference} style = {{ }}> 
                <Projects/> 
            </div>

            {/* <div style ={{height:'1000px', width:'100%',background:'yellow'}} ref ={ scrollbar_Elements[1].reference} > 
            </div> */}
        </>
    );
}


export default RenderApp;