

/* ------------------------------------------ Interface Description ------------------------------------------
    Utilised to encapsulate/pass useRef Values between child and parents.
    
    ObjectRef Description / Usage :
        ObjectRef consist of a call-back function 'setFunct' implemented by the parent. 'SetFunct' takes as 
        arguments :
            1) ref : the memory address of itself  (passed through props)
            2) toRef : React.RefObject (The RefObject of reference)
        The function 'setFunc' is expected to performs ObjectRef.ref = toRef in the child Class, hence, 
        those with ObjectRef address can directly access 'ref' established within some nested children. 
 ------------------------------------------------------------------------------------------------------------*/

export type ObjectRef <p> = 
{
    setFunc: ( ref : ObjectRef<p>, toRef : React.RefObject<p> ) => void,
    ref: React.RefObject<p> | undefined,
};

export function setFunc (ref : ObjectRef<any>, toRef : React.RefObject<any>) 
{
    ref.ref = toRef;
}

