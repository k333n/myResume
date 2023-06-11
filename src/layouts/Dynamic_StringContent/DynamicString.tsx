

/* ------------------------------------------ Class Description ------------------------------------------
    Class Handler for string content. This class associates the given string with its assigned attribute-
    tags to some css styling, as such, this class takes in a set of characters by generateElement(x), where
    x is the string of characters. It iterates the and associates css attributes based on tags wrapped 
    between the tag-notation '<< sometag />'. GenerateString returns with the correctly formatted content 
    representing the initial string as an array of ReactElement (JSXElement). 
    
    Usage Example :  
        x (paragraph_Content) = <<blue/>This is the blue paragraph <<red, br/> this is the red paragraph 
------------------------------------------------------------------------------------------------------------*/

class DynamicString { 

    constructor()
    {
        console.log("Dynamic String handler created "); 



    }




    public generateElement = (paragraph_Content : String) : React.ReactElement[] => { 
        let configured_Text : React.ReactElement[] = [];
        let current_Property : React.CSSProperties[] = [];
        let defaultStyling : React.CSSProperties = {margin:'0', padding:'0'};
        configured_Text.push( <><p style = { Object.assign ({display:'inline-Block'}, defaultStyling, ...current_Property )}> dd</p></>); // Associate previous property.




        let parent_Elements : React.ReactElement[] = [];
        let child_Elements : React.ReactElement[] = [];
        let child_property : React.CSSProperties[] = [];
        let parent_property : React.CSSProperties[] = [];

        let leftIndex = 0;




        // iterate characters of paragraph_Content
        for (let i =0 ;; i++)
        {
            // check for property 
            if (paragraph_Content[i] === "<" && paragraph_Content[i+1] === "<") { 
                // associate previous child elements
                if (leftIndex != i ) child_Elements.push(<> <span style={ Object.assign({}, ...child_property)}> {paragraph_Content.slice(leftIndex, i)}  </span> </>);
                
                let currentTarget : number ;

                if (paragraph_Content[i+2] === "<") // new parent property & container
                {
                    currentTarget = 3; //set target to parent

                    // Associate previous parent properties (if any)
                    if (child_Elements.length != 0 )    {
                        parent_Elements.push( <p style = { Object.assign ({display:'inline-Block'}, defaultStyling, ...parent_property)}> { child_Elements }</p>  ); 
                        child_Elements = []; // remove prev childs
                    }
                } else currentTarget = 2; // set target to child
                

                for (let k = (i+currentTarget) ; k < paragraph_Content.length; k++)
                {
                        // check for Ending styling tag
                        if (paragraph_Content[k] === "/" && paragraph_Content[k+1] === ">")
                        {
                            if (currentTarget === 3 /* where 3 = parent */) 
                            {
                                parent_property = [];
                                this.getCSSProperty(paragraph_Content.slice(i+3, k), parent_property); 

                            }else{ 
                                child_property = [];
                                this.getCSSProperty(paragraph_Content.slice(i+2, k), child_property); 
                            }
                            i = k+1;
                            leftIndex = k+2;
                            break;
                        }
                }
            }

            if (i === paragraph_Content.length){
                child_Elements.push(<> <span style={ Object.assign({}, ...child_property)}>  {paragraph_Content.slice(leftIndex, paragraph_Content.length)}  </span> </>);
                parent_Elements.push( <p style = { Object.assign ({display:'inline-Block'}, defaultStyling, ...parent_property)}> { child_Elements }</p>  ); 
                break; 
            }
        }
        
        return parent_Elements;
    }

    private getCSSProperty = (Property : String, CSSProperties : React.CSSProperties[] ) : void => {
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
                        case "purple" :   CSSProperties.push({color:'#7B68EE'});
                        break;
                        case "blue" :   CSSProperties.push({color:'blue'});
                        break;
                        case "yellow" :   CSSProperties.push({color:'yellow'});
                        break;
                        case "red" :    CSSProperties.push({color:'red'});
                        break;
                        case "darkblue" :  CSSProperties.push({color:'#191970'});
                        break;
                        case "lightblue" : CSSProperties.push({color:'#87CEFA'});
                        break;
                        case "green" : CSSProperties.push({color:'#32CD32'});
                        break;
                        case "white" : CSSProperties.push({color:'white'});
                        break;
                        case "br" :     CSSProperties.push({display:'block'})
                        break;
                        case "\n" :     CSSProperties.push({display:'block', height :'30px'}); 
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
}




let DynamicStringProcessor = new DynamicString();


export default DynamicStringProcessor;