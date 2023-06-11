import { Url } from "url";
import React, { CSSProperties } from "react";
import navStyle from './gridStyle.module.css';
import { isTemplateSpan } from "typescript";

var Style: { linkCss: CSSProperties } = 
{
     linkCss: {
        wordBreak: 'break-all',
        fontSize: '1vw',
        overflow: 'hidden'
     } 
};

/* Scale item size */
const calcItemSize = ( size:number) : number =>
{
    return (( 100/size)/2);
};


/* Renders a side-navigation bar which fills the parent container*/
/* 
    Function component RenderNav takes as arguments an object item consisting of :   
        1. Keys = Unique keys for rendered items
        2. icon = Url to the icon 
        3. dest = re-Direction url
        4. selectedRef = useState pointer for inferance with selected item where The key is used to indicate the selectede item 
*/
const RenderNav: React.FC<{  items :  {key : number, icon: String; dest: String } [], selectedRef :  React.Dispatch<React.SetStateAction<number>>  }> = (props) :React.ReactElement=> {
    return (
        <>
        <div className={navStyle.navBarWrapper}>
            { 
                props.items.map ( (item : { key : number, icon : String, dest:String}) => { 
                    return (
                        <div key = { item.key } onClick ={(event)=> { props.selectedRef(item.key) }} className={navStyle.navItems} style ={{height: `${calcItemSize(props.items.length)}%`}}> 
                            <img src={ `${item.icon}` } width="90%" height="90%"/>
                        </div>
                    )
                })
            }
        </div>
        </>
    );
};

export default RenderNav;
