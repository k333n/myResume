import {codeHandler} from "./CodeHandler";
import { RefObject } from "react";

/* ------------------------------------------ Component Description ------------------------------------------
    This class is utilised to change focus of opened code-windows. This class requires a reference to the
    main CodeHandler instance which consist of all code-window instances and its associative mapping 
    (key --> element), this is passed during initialisation by the constructor.

------------------------------------------------------------------------------------------------------------*/


export default class focusHandler{
    Elements : React.RefObject<HTMLDivElement>[] = [];
    CodeHandler : codeHandler; 
    constructor(CodeHandler : codeHandler)
    {
        console.log("focused handler initialised");
        this.CodeHandler = CodeHandler;
    }

    /**
     *  Set focused Element by 'key' mapping value. 
     *  Iterate the collection of all instances of CodeWindow, where given key = mappedKey of collection, then : z_index <-- 5, 
     *  else z_index <-- 2. 
     * 
     *  @param key : integer representation of the key --> element mapping
     */
    setFocus( key : number, zIndex_Value : number)
    {
        let Elements : IterableIterator<[number, React.RefObject<HTMLDivElement>]> = this.CodeHandler.getElements();
        let current_Element: IteratorResult<[number, RefObject<HTMLDivElement>]> | undefined = undefined;
        current_Element = Elements.next();

        while (current_Element.done == false)
        {
            const [hashKey, Element] = current_Element.value;
            if (Element.current != null)
            {
                if (hashKey === key) Element.current.style.zIndex = `${zIndex_Value+1}`;
                else Element.current.style.zIndex = `${zIndex_Value}`;
            }
            current_Element = Elements.next();
        }
    }
    
}

