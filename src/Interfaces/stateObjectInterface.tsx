
/* ------------------------------------------ Interfaces Description ------------------------------------------
    Utilised to encapsulate/pass useState Values between child and parents. We provide 2 interfaces fit for 
    different purpose
        1.  StateObject Interface : (Main)
            Utilised for Function Component react implementation, it can be utilised for
            useState value passing & encapsulation. 
        2. ClassStateCallBack Interface : (Additional)
            Utilised for Class Based React implementation. A single call-back function is
            used to establish parent-child relation and is not limited to React.StateObject. 
 ------------------------------------------------------------------------------------------------------------*/


/* 
    StateObject Description :
        StateObject encapsulates the useState values, mainly useState[x] for x in {0,1}. useState[0] represent some stateItem and useState[1] is the
        pointer to a function which allows the manipulation (changing) of stateItem. 

        Hence, in the StateObject we got the following elements with the following relation to useState :
            1) item = useState[0] (stateItem)
            2) setItem = useState[1] (setItem)
    Usage :
        1)  StateObject is established in the parenting scope s.t. its relation towards some 'useState' values are assigned. The stateObject is passed
            to some child component, and the child component will have full access to the parents useState values (i.e. change its stateValue), hence
            making it possible for child to read the current stateValue, or to bubble values (i.e. changes) back to the parent and forcing a re-render. 

            We Note that changes by 'setItem' are not reflected in the 'item' value, and require some pre-processing through re-render.
*/
export default interface StateObject <p>
{
    item : p;                                        
    setItem : React.Dispatch<React.SetStateAction<p>>   
}

/* 
    ClassStateCallBack  Description :
        Utilised for class-based components. setItem points to a fall-back function taking as parameter some generic item 'p' where
        some instruction can be performed. 

    Usage :  
        This nesting function pointed to by 'setItem' reside in the scope of the parent where logic is derived. 
        This object is typically passed to child (or childs) by props, towards where the 'item' element will reside (i.e. creation of React.useRef). 
        This 'item' element is then passed as parameter to the call-back function pointer 'setItem' which address reside in the scope (memory) 
        of the initial parent, and the parent has full access of this item by 'setItem'. 
        
    Example of setItem function Implementation  :
        setItem(i) = { this.setState(someVar : i)}  
*/
export interface ClassStateCallBack<p>
{
    setItem : (item : p) => void;
}

export interface StateWrapper <p> 
{
    item : p, 
    setItem : React.Dispatch<React.SetStateAction<p>>  
}

/* Equality testing for stateObject */
export function isStateObject(arg: any): arg is StateObject <null> 
{
    return ((arg.item != undefined) && (arg.setItem != undefined)); 
}
