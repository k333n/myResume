
import ContentCarosel, {items} from '../layouts/contentCarousel/contentCarosel';
import CodeWindow, {WindowState, FileList} from '../layouts/codeDemoWindow/CodeWindow';
import HtmlTextConverter from './projectFiles/htmlTextConverter';
import DynamicHeading from '../layouts/dynamicText';
import './styling.css';


let RenderProject : React.FC <{}> = (props) => { 
    let Items : items[] = [
        HtmlTextConverter
    ]

    return (
        <>             
            <div  style = {{width:'100vw', height :'100vh', backgroundColor:'black', position:'relative'}}> 
                <ContentCarosel TitleStyling={ {color:'white'}}  popup_ZIndex={100} Title ={"My Projects"} Description = {"A list of all my working projects"} Items={Items}/>
            </div>
        </>
    );
}


export default RenderProject;