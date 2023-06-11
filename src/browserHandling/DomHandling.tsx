

/* ------------------------------------------ Class Description ------------------------------------------
    DOM related function, this is not react specific. 
------------------------------------------------------------------------------------------------------------*/


export default class DomHandling 
{
    /* Retrieve the css property by some given selector (i.e. : .id, #class), and the css property to retrieve */
    getCSSProperty(selector : string, css_property : string) : string | null
    {
        let Node = document.querySelector(selector);

        if (Node != null)
        {
            return window.getComputedStyle(Node).getPropertyValue(css_property);
        }
        return null;
    }
}
