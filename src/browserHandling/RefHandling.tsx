import React from "react";


class RefHandling {
    /** 
     *  get the ref end location on page by the parent container (X-axis)
     *  @Returns :
     *       -1 : If ref ¬exist on page DOM. 
     *       x : x ∈ Z; representation of the location on page
    */
    getRefLocationXEnd(ref : React.MutableRefObject<HTMLDivElement | null>) : number 
    {
        return (ref.current == null) ? -1 : this.getRefLocationX(ref) + this.getRefWidth(ref);;
    }
        
    /**  
     * Get the ref start location on page by the parent container (X-axis)
        @Returns :
            -1 : If ref ¬exist on page DOM. 
            x : x ∈ Z; representation of the location on page
    */
    getRefLocationX(ref : React.MutableRefObject<HTMLDivElement | null>) : number 
    {
        return (ref.current == null) ? -1 : ref.current.offsetLeft;
    }

    /**  
     * Get the ref start location on page by the parent container (Y-axis)
        @Returns :
            -1 : If ref ¬exist on page DOM. 
            x : x ∈ Z; representation of the location on page
    */
    getRefLocationY(ref : React.MutableRefObject<HTMLDivElement | null>) : number 
    {
        return (ref.current == null) ? -1 : ref.current.offsetTop;
    }
    /** Return the ref location on page by the parent container (Y-axis)
        @Returns :
            -1 : If ref ¬exist on page DOM. 
            x : x ∈ Z; representation of the location on page
    */
    getRefLocationStart(ref : React.MutableRefObject<HTMLDivElement | HTMLParagraphElement | null>) : number 
    {
        return (ref.current == null) ? -1 : ref.current.offsetTop;
    }

     /** Return the ref-end location on page by the parent container (Y-axis)
        @Returns :
            -1 : If ref ¬exist on page DOM. 
            x : x ∈ Z; representation of the ref-end location on page
    */
    getRefLocationEnd(ref : React.MutableRefObject<HTMLDivElement | null>) : number 
    {
        return (ref.current == null) ? -1 :ref.current.clientWidth ;
    }

    /** Return the ref Width in pixels
        @Returns :
            -1 : If ref ¬exist on page DOM. 
            x : x ∈ Z; representation of the Width by the ref.
    */
    getRefWidth(ref : React.MutableRefObject<HTMLDivElement | null>) : number 
    {
        return (ref.current == null) ? -1 : ref.current.clientWidth;
    }
    /** Return the ref Height in pixels
        @Returns :
            -1 : If ref ¬exist on page DOM. 
            x : x ∈ Z; representation of the Width by the ref.
    */
    getRefHeight<T> (ref : React.MutableRefObject<T>) : number 
    {
        let target : T = ref.current;
        let toRet : any;
        if ( (target instanceof HTMLDivElement) )
        {
            toRet = ref.current as HTMLDivElement;
            return (ref.current == null) ? -1  :toRet.getBoundingClientRect().height;
        }
        return -1;
    }

    /**
     *  given a HTMLParagraph Ref, we return the integer_fontSize (pixel) 
     *  @Return
     *      0,.. : Number representation of fontSize in actual DOM.
     * 
     * */
    getRefFontSize (ref : React.MutableRefObject<HTMLParagraphElement | null> | undefined) : number 
    {
        if (ref == undefined) return -1;

        return (ref.current == null) ? -1 :  parseInt(ref.current.style.fontSize.substring(0, ref.current.style.fontSize.length-2)); 
    }

    /**
     * Given a parent DOMNode and childDOMNode, we return True IFF the childNode does not overlap the PArentNode, and no overflow exists 
     * @return 
     *      true : If childRef is contained in parentRef, and no overflow occur. This is childRef / parentRef = {∅}
     *      false : If childRef is not contained entirely in parentRef, and overflow occurs. This is childRef / parentRef ≠ {∅}. 
     * */
    isRefContained ( parentRef : React.MutableRefObject<HTMLParagraphElement | null>, childRef :  React.MutableRefObject<HTMLParagraphElement | null> ) : boolean
    {
        let parentWidth = this.getRefWidth(parentRef);
        let childPosition = this.getRefLocationXEnd(childRef);

        return (childPosition < parentWidth);
    }


    /**  Given some Ref representation of the DOMNode, return the given values by attribute_name */
    getRefAttribute<T>(ref : React.MutableRefObject<T>, attribute_name : string) : String | null
    {
        // console.log("Type of event is : " + event.type)
        let target : T = ref.current;
        if ( (target instanceof HTMLDivElement) )
        {
            let k = target as HTMLDivElement;
            return (target as HTMLDivElement).getAttribute(attribute_name);
        }else console.log("getRefAttribute unsuccessful, only HTMLDivElemnt is currently supported");
        return null;
    }


    /**  Given some Ref representation of the DOMNode, attribute-name; insert the given values into the domNoed by attribute_name. 
     * @returns 
     *  T : is return on success, else F. 
     */
    setRefAttribute<T>(ref : React.MutableRefObject<T>, attribute_name : string, value : string) : boolean
    {
        let target : T = ref.current;
        if ( (target instanceof HTMLDivElement) )
        {
            let k = target as HTMLDivElement;
            (target as HTMLDivElement).setAttribute(attribute_name, value);
            return true;
        }else console.log("Set ref attribute unsuccessful, only HTMLDivElemnt is currently supported");
        return false;
    }

    /** 
     * @Description : 
     *      Given the ref_object representation of a container, we return the percentage of the mouse in the X-axis relative to this container
     *      s.t. percentage =  (mouseLocationOnPage_X - getRefLocationStart(ref)) / (getRefLocationEnd(ref) - getRefLocationStart(ref)) IFF 
     *      getRefLocationStart(ref) <= mouseLocationOnPage_X <= getRefLocationEnd(ref), else percentage = -1, that is mouse is outside this container. 
     * 
     *      Hence, we say IF mouseLocationOnPage_X = getRefLocationStart(ref) then percentage = 0, and percentage = 100 IFF mouseLocationOnPage_X = getRefLocationEnd(ref)
     * @Return : 
     *      -1 : mouse not in container ref
     *      0.00 ,..,100.00 : (float) percentage representation in X_Axis of container ref
     *      undefined : on Err. 
     */
    getMousePerecentageX<T> ( ref : React.MutableRefObject<T>, mouseLocation_X : number) : number | undefined
    {
        let percentage = undefined;
        if ( (ref.current instanceof HTMLDivElement))
        {
            let RefLocation_Start = this.getRefLocationX( ref as React.MutableRefObject<HTMLDivElement> );
            let RefLocation_End = this.getRefLocationXEnd( ref as React.MutableRefObject<HTMLDivElement> );

            if ( (RefLocation_Start <= mouseLocation_X) && (RefLocation_End >= mouseLocation_X))
            {
                percentage = parseFloat( ((mouseLocation_X - RefLocation_Start) / (RefLocation_End - RefLocation_Start)).toFixed(2 )); /* Parse to 2 decimalPoint via substr by float->String->float conversion */
            }
        } else console.log("Get mouse percentage only support container HTMLDIVELEMENT ATM!");


        return percentage;
    }


  /** 
     * @Description : 
     *      Given the ref_object representation of a container, we return the translate property by translate(x,y) by array |T| = 2, 
     *      s.t. T[0] = Translate_X value, T[1] = Translate_Y value.
     * 
     * @Return : 
     *      Int T[] : representation of Translate_X value, Translate_Y value by T[0], T[1] respectively! 
     *      Undefinied : On No transform attribute
     */
    getTranslateValues <T> (ref :  React.MutableRefObject<T> )
    {
        if ( ref.current != null && (ref.current instanceof HTMLDivElement))
        {
            const computedStyle = window.getComputedStyle(ref.current);
            const transform = computedStyle.getPropertyValue('transform');
            if (transform === "none") return undefined;
            let x : String[] = [];
            let y : String[] = [];
            for (let i =transform.length-2, Y_went = false; i != 0; i--)
            {
                if (transform[i] != " ")
                    if (!Y_went){
                        if (transform[i] === ",") Y_went = !Y_went;
                        else y.push(transform[i]);
                    }else{
                        if (transform[i] === ",") break;
                        x.push(transform[i]);
                    }

            }

            let toRet : number [] = [];
            toRet.push(parseInt( x.reverse().toString().replaceAll(",", "")));
            toRet.push(parseInt( y.reverse().toString().replaceAll(",", "")));

            return toRet;

        } else console.log("err : getTranslateValues only support container HTMLDIVELEMENT ATM! or ref is null");

    }
}


export default RefHandling