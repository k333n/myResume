import { tab } from "@testing-library/user-event/dist/tab";
import { defaultMaxListeners } from "events";
import React, { useState } from "react";
import { JsxElement } from "typescript";
import myBrowser from "../../../browserHandling/myBrowser";
import linkedList from "../../../DataStructures/LinkedList";
import { StateWrapper } from "../../../Interfaces/stateObjectInterface";
import SimpleButtoms from '../../../buttons/simpleButton1/simpleButton1';
import Stack from "../../../DataStructures/Stack";
import { start } from "repl";
import {WindowStateVal} from '../CodeWindow';
/* ------------------------------------------ Component Description ------------------------------------------
    Handles minimised code-window. TabHandler class is intended to be utilised globally for some set of
    associated code-window that has been minimsied. 
    
    By default, the minimised window (tab-element) is position in a statically allocated position,
    This class organises such position s.t. it is dynamically position based on some offset. This is described
    Further at --> (Ref : 4432)  

    Note : This class is intended to be a sub-class of 'codeHandler'. 

    Intake Parameters :
        1. minimisedInterface_State : 
            minimisedInterface_State is a global StateWrapper object that is passed through the constructor during 
            initialisation or via setMiminisedController() method. This object consist of a set_State reference of
            type :
                useState<React.ReactElement>(<></>))
            declared in a component (i.e. MinimisedInterface.tsx ). This component is to-be initialised in the 
            parent component, along-side the  many code-windows;only one instance of minimisedInterface is needed. 
            Upon Change, this component will utilise this state-Ref to evoke a re-render with the updated JSX.Element
            as necessary. 
------------------------------------------------------------------------------------------------------------*/

class Tab_Element{
    key:number
    element : React.RefObject<HTMLDivElement> 
    state : StateWrapper<number> 
    constructor(k : number, e : React.RefObject<HTMLDivElement>, s : StateWrapper<number>  ){
        this.key = k;
        this.element = e;
        this.state = s;
    }
}


class tabHandler{
    private hashed_Elements : Set<number> = new Set(); // Utilised for utility (i.e. O(1) runtime) for determining if key exist.
    private linked_Elements : linkedList<Tab_Element> = new linkedList(); // utilised for queue-like behaviour for tab-element output based on the FIFO principle.
    private start_Position : number = 0; // The starting position of tab-elements
    private MinimisedInterface_State : StateWrapper<React.ReactElement> | undefined = undefined;

    constructor( minimisedInterface_State? : StateWrapper<React.ReactElement> ){
        console.log( "Tab handler initialised!");
        this.MinimisedInterface_State = minimisedInterface_State;
        this.checkError();
    }
    
    setMinimisedController(minimisedInterface_State? : StateWrapper<React.ReactElement> ){
        this.MinimisedInterface_State = minimisedInterface_State;
    }
    private checkError()
    {
        if (this.MinimisedInterface_State === undefined)  console.error("Minimised Controller has not been initialised for tabHandler! \nNo overflow handling mechanism will be available!");
    }

    /**
     * Insert tab_element for handling. The tab-element (React Ref Element) is associated with a 
     * unique key which identifies this element during removal. 
     * 
     * O(1)
     * @param TabElement 
     * @param key : key hashKey associated with the tabElement
     * @param WindowStateWrapper : Wrapper to codeWindow_State (i.e. minimised, open, etc)
     * @returns true on success, else false 
     */
    addTab(TabElement : React.RefObject<HTMLDivElement>, WindowStateWrapper : StateWrapper<number>,  key : number) : boolean  {
        if (TabElement.current == null || key === -1 )
        {
            console.log("TabElement OR key is undefined. Cannot add tab element -->  returning!")
            return false;
        }
        if (this.hashed_Elements.has(key))
        {
            console.log("Key : " + key + " is already associated with some element, cannot insert tabElement");
            return false
        }
        let new_TabElement = new Tab_Element(key, TabElement, WindowStateWrapper);
        this.linked_Elements.addElement(new_TabElement);
        this.hashed_Elements.add(key);
        this.reconfigureTabElements(this.start_Position, 0);
        return true;
    }

    /** 
     * Remove some tab-element from minimisedTab associated with given key.
     * O(n) by getTab().
     * @return T : On success, else False is returned
    */
    removeTab(key : number) : boolean
    {
        if (!this.hashed_Elements.has(key)) 
        {
            console.log("key : " + key + " does not associated with any element in tabHandler / OR something still animating!");
            return false;
        }

        let tab_Index : number = this.getTab(key); 
        if (tab_Index != -1) // This sohuld not be violated if prior condition is asserted!
        {
            let toRem : Tab_Element | null= this.linked_Elements.removeAt(tab_Index);
            this.hashed_Elements.delete(key);
            // if (tab_Index != thisi.linked_Elements.size+1 ) /* If removed item is last item, no re-configuration is needed! */
            this.reconfigureTabElements(this.start_Position, tab_Index-1);
            return true;
        }
        return false;
    }
    

    /**
     * Return true if element associated with given key exist already in handler, else false is returned
     * @param key : key associated with tabelement
     * @return T IF tab exist, else F
     */
    hasTab ( key :number) : boolean{
        return this.hashed_Elements.has(key);
    }

    /** 
     * Return the index of the element associated with given key, -1 is returned if it does not exist. 
     * O(N)
     */
    private getTab(key : number) : number{
        const iterator = this.linked_Elements[Symbol.iterator]();
        let current = iterator.next();
        let count = 1;
        while (!current.done) {
            if (current.curr_Element?.element.key === key) return count;
            current = iterator.next();
            count++;
        }
        return -1;
    }
    printTabElements(){
        console.log("Printing Tab Elements!")
        this.linked_Elements.printValues();
    }    


    /** (Ref : 4432) DESCRIPTION :
     *      Reconfigure / Shift the positioning of all tab-elements based on the FIFO princple, and establishes the lastvisibleTabElement thereafter. 
     *      This method may be utilised across multiple calls, and hence many stack-calls may be utilised, all operating on the set of tab-data 
     *      elements at once, hence we account for concurrency via a locking mechanism using a virtual 'threadNO' which represent the latest caller as 
     *      this ultimately this determine the final state of the tab elements (i.e. positiion / transition state) (NOTE : This isnt fully implemented)
     *  
     *      This method take as parameter the integer 'startinngPos' used to reprsent the starting position of the first tab-element in the x-axis, 
     *      with all subsequent tab-element follow some incremental offset based on this. It also takes in the integer 'evokedElement' used in 
     *      representing the element of change, hence if evokedElement = 0, then ∀ k where 0 < k ≤ |linked_Elements| , linked_elements[k] will incur 
     *      some transitional changes (chain effect), If evokedElement = |Linked_Elements|, then no transition will occur. 
     * 
     *      @param  StartingPos : Integer representation of the Starting position of first tab-element in the x-axis
     *      @param  EvokedElement : Integer of the element (indices) ∈ | linked_elements | representing where the change occur, where 0 represent change for-all tabs. (i.e. Change of StartingPos)
     * 
     *      O(n) 
     * */
    private lastVisibileTabElement : React.RefObject<HTMLDivElement> | undefined; /** Represent the last visibile tab-element estabished @ --> (Ref : 3312) */
    private current_ThreadNo : number = 0;  /** Most recent ThreadNumber utilised for method reconfigureTabElements() to account for interleaving prodecural call */
    
    reconfigureTabElements(startingPos : number, evokedElement : number){
        console.log("\n\n\nRe congifugrint tab");

        /** Iterator Setters */
        const iterator = this.linked_Elements[Symbol.iterator]();
        let curIter = iterator.next();
        /** Local Variables */
        let widthIncrementor = startingPos;                             /** Width offset, that is currentTab.y = sum of previous tab.Width */
        let count = 0;                                                  /** Counter */
        /** Thread & Animaton Setters */
        let local_ThreadNo = ((this.current_ThreadNo+1) % 100);        /** Associate a number to this instance of the stack-frame */
        this.current_ThreadNo = ((this.current_ThreadNo+1) % 100 === local_ThreadNo)  ? (local_ThreadNo) : this.current_ThreadNo;    /** Associate the local stack-Frame number to the global threadNO, we utilise tenary operator for atomicy */              
        if (evokedElement != this.linked_Elements.size) this.is_Animating.insertAnimation = true;   /** set global state animation = true IFF it is not last element which implies no transition/animation exist; Account for start of transition below */;

        /** Iterate tabElements */
        while (!curIter.done) {
             count++;
             if (curIter.curr_Element != null)
             {
                    let Current_Iter_element = curIter.curr_Element.element.element; //current iterator element
                    if (Current_Iter_element.current != null)
                    {
                        let currentElement_Width = Current_Iter_element.current?.clientWidth // offset each element by the previous size, this is the transition value 
                        /** Consider IF animation (i.e. transition) for all tab-elements have concluded  */
                        if ( evokedElement != this.linked_Elements.size && ((local_ThreadNo === this.current_ThreadNo) && (count === this.linked_Elements.size)) ) { // If currentIterator = last tab_element & no new execution of method occured
                            
                            // TransitionEnd Action -> we set animation = false AND remove listeners IFF no new execution of method occured during transition period
                            let TransEnd_Action: EventListener = (event) => {
                                (local_ThreadNo === this.current_ThreadNo) ? (this.is_Animating.insertAnimation = false) : (console.log("Thread overrided"));
                                event.target?.removeEventListener('transitionend', TransEnd_Action);
                            };
                            // Set action listener IFF the current_IterElement = last Tab_Item AND some transition will occur 
                            Current_Iter_element.current?.addEventListener('transitionend', TransEnd_Action); 
                        }
                        /** End Consideration */

                        Current_Iter_element.current.style.transform = `translate(${widthIncrementor}px, 0px)`;      // transition element by some offset
                        

                        widthIncrementor = widthIncrementor + currentElement_Width;
                        /** (Ref : 3312) Set last visible tabElement */
                        if (widthIncrementor < myBrowser.getBrowserWidth()) {
                            this.lastVisibileTabElement = Current_Iter_element;
                        }else if (this.MinimisedInterface_State === undefined){ // Handle tab full
                            console.error("Cannot minimise, tab is full. \nMinimised Controller has not been initialised for tabHandler hence no overflow handling mechanism available!");
                            this.removeRange(count, this.linked_Elements.size);
                        }
                    }
                }
            curIter = iterator.next();
        }
       this.generate_Controls(); 
    };

    /**
     * Remove the range of TabElements[startIndex], ... , TabElements[endIndex] from 
     * this tabHandler class, that is : {linked_Elements, hasned_Elements} and set 
     * the associated codeWindowState from minimised to opened. 
     * @param startIndex
     * @param endIndex 
     */
    private removeRange(startIndex : number , endIndex : number){

        for (let i = startIndex; i <= endIndex; i++) 
        {
            let toRem : Tab_Element | null= this.linked_Elements.removeAt(i);
            if (toRem != null)
            {
                toRem.state.setItem(WindowStateVal.opened);
                this.hashed_Elements.delete(toRem.key);
            }
        }
    };

    /**(Ref : 4321)
     *  Generate control for shifting tab-elements on overflow, that is if : |tabElements| * width > screen.width  
     *  we would generate the arrow to shift backward/ forward based on the current position. 
    */
   
    /** Global animating state representing the state of tab-elements, IF animating = true, then something is in animation state and is not stable (i.t transition) */
    private is_Animating: {SlideAnimation : boolean , insertAnimation :boolean} = {SlideAnimation : false, insertAnimation : false};

    generate_Controls() {
        if (true)
        {
            return <>THIS FUNCTION IS NOT FULLY IMPLEMENTED</>
        }
        // NOTE-TO-SELF : CONTINUE ON IMPLEMENTED BELOW AS IS.
        // console.log("Gereatinng controls")
        // if (this.MinimisedInterface_State === undefined || this.hashed_Elements.size < 1  ) /** Return on minimised_tab empty OR mininisedInterface not-established */
        // {
        //     this.checkError();
        //     return <></>;
        // }
        

        // let slide = (direction : String) => {
        //     console.log( "  is_animatingInsert = " + this.is_Animating.insertAnimation)
        //     if (this.lastVisibileTabElement != undefined && (this.is_Animating.insertAnimation === false) ){
        //         let basePosition = myBrowser.RefHandling.getRefLocationX(this.lastVisibileTabElement);
        //         console.log("Sliding left as animating = " + this.is_Animating);
        //         // console.log("base position is : " + basePosition);
        //         let pos = myBrowser.RefHandling.getTranslateValues(this.lastVisibileTabElement);

        //         if (pos != undefined)
        //         {
        //             let lastPos = (basePosition + pos[0]) + myBrowser.RefHandling.getRefWidth(this.lastVisibileTabElement);
        //             this.start_Position = (direction === 'left') ? -lastPos : lastPos;
        //             this.reconfigureTabElements(this.start_Position, 0);
        //         }
        //     }
        // }

       
        // let firstElement = this.linked_Elements.get(0)?.element;
        
        // if (firstElement?.current != null)
        // {
        //     let firstElement_H = myBrowser.RefHandling.getRefHeight(firstElement);
        //     let firstElement_W = myBrowser.RefHandling.getRefWidth(firstElement);

        //     let firstElemPos = myBrowser.RefHandling.getRefLocationY(firstElement);
        //     console.log("First elem pos = " + firstElemPos)

        //     this.MinimisedInterface_State.setItem(
        //     <>
        //         <div onMouseDown={ () => { slide("left");}} style = {{zIndex : '10', width :`${firstElement_W}px` , height :`${firstElement_H}px`, backgroundColor :'rgba(255,0,0,0.5)', position :'fixed' ,top :`${firstElemPos}px`}}>  </div> 
        //         <div onMouseDown={() => { slide("right");}} style = {{zIndex : '10', width :`${firstElement_W}px` , height :`${firstElement_H}px`, backgroundColor :'rgba(255,0,0,0.5)', position :'fixed' ,top :`${firstElemPos}px`, right :'0px'}}> </div> 
        //     </>);

        // }
    }
     
}
export default tabHandler;