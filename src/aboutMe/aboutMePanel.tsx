import SidePanel from "./aboutMeStyling.module.css";
import NavBar from "../layouts/navigationBar";
import { useState, useRef, useEffect} from "react";
import StateObject from "../Interfaces/stateObjectInterface";

interface item {
    key : number;
    icon : String;
    dest : String;
    name : String;
}

//React.Dispatch<React.SetStateAction<number> > 
const RenderPanel: React.FC <{ selectedRef :  StateObject<number> , items : item[]}> = (props) => {
    const [selectedItem, setSelectedItem] = useState( -1 );

    useEffect (
        ()=> {
            if (selectedItem >=0 ){ props.selectedRef.setItem( selectedItem); }
        }
    , [selectedItem]);

    return (
        <>
        <div className={SidePanel.panel}> 
            <div className ={SidePanel.logo}>
                <img src="http://bothub.com.au/wp-content/uploads/2022/11/chs.jpg" alt="logo"/>
            </div>
            <div style = { {backgroundColor:'purple', width : '100%', height:'100%', display:'flex', flexDirection:'column'} }> 
                <NavBar items = {props.items} selectedRef = {setSelectedItem}/>
            </div>
            <div style = { {backgroundColor:'white', width : '100%', height:'100%' } }> </div>
        </div>
        </>
    );
};

export default RenderPanel;
export type Item = item;