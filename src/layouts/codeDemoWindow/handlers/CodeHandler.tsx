import React from "react";
import CodeTabHandler from './CodeTabHandler';
import CodeFocusHandler from './CodeFocusHandler';
import CR from './CodeHandler';
/* ------------------------------------------ Component Description ------------------------------------------
    The main handler class, this class derive CodeFocusHandler, CodeTabHandler as a utility class, hence 
    enables handling such as :  
        1) Focusing codeWindow, 
        2) minimising tab 

    Additionally, this class support the generation of keys --> element mapping, which is crucial for 
    the FocusHandler class, as all CodeWindow instances necessary to change focus. This class, mainly
    the set of all codeWindows 'code_Elements' represent all windows (opened, minimised, closed) .
------------------------------------------------------------------------------------------------------------*/

export class codeHandler {
    TabHandler : CodeTabHandler;
    FocusHandler : CodeFocusHandler;
    
    code_Elements : Map<number, React.RefObject<HTMLDivElement>> = new Map();
    constructor(){
        console.log("Code Handler initialised");
        this.TabHandler = new CodeTabHandler();
        this.FocusHandler = new CodeFocusHandler(this);
    }

    /** 
     * Insert given code_Element into a hash-map structure. This element is used 
     * for handling purposes. We return its associated key.
     * 
     * @returns key associated with element in map on success, else -1 on failure
     * */
    addElement( element : React.RefObject<HTMLDivElement>) : number{
        if (element.current != undefined)
        {
            let hash_Key = this.generateHash(element.current?.innerHTML);
            // we iterate key IFF value --> key mapping already exist
            while (this.code_Elements.has(hash_Key))
            {
                hash_Key++;
            }
            this.code_Elements.set(hash_Key, element);
            console.log("------- Element added  -------");
            console.log(element.current.innerText);
            console.log("------------------------------");
            return hash_Key;
        }
        return -1;
    }

    /**
     * Remove element by the associated 'key' value in the hashMap. 
     * 
     * @param key : intenger - hashkey
     */
    removeElement(key : number)
    {
        if ( this.code_Elements.delete(key) ) {
            console.log("Element with hashkey '" + key +"' removed successfully")
        }else{

            console.log("Element with hashkey '" + key +"' does not exist for removal!")
        }
    }

    /**
     * Generate hash key using the sum of given string 'value'. 
     * @param value : String
     * @returns key : Integer
     */
    private generateHash(  value : String ) {
        var hash = 0;
        if (value.length == 0) return hash;
         
        for (let i = 0; i < value.length; i++) {
            let char = value.charCodeAt(i);
            hash = ((hash << 7) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }

    printElements(){
        console.log("------- PrintingElements  -------");
        this.code_Elements.forEach ((elements) => { console.log(elements.current?.innerText)})
        console.log("------------------------------");
    }

    /** Return a interable colleccction <key, element> of all elements */
    getElements() :IterableIterator<[number, React.RefObject<HTMLDivElement>]> {
       return this.code_Elements.entries();
    }

}

let CodeHandler : codeHandler = new codeHandler();



export default CodeHandler;