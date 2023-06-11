

/* Utilised to perform browser page maipulations and queries */

class pageFunctions 
{
    /* Return page height in pixel */
    getPageHeight() : number {
        return document.body.scrollHeight;
    }
    /* Return browser view-Width representative of css property -> width : 100%vh */
    getBrowserWidth() : number  {
        return window.innerWidth;
    }

    /* Return browser view-hight representative of css property -> width : 100%vh */
    getBrowserHeight() : number {
        return window.innerHeight;
    }
    /* Get the current location on page by the top of the browser in pixels (Y-axis) */
    getWindowTop() : number {
        return window.pageYOffset;
    }

    /* Get the current location on page by the bottom of the browser in pixels (Y-axis) */
    getWindowBottom() : number {
        return window.pageYOffset + window.innerHeight;
    }

    /* Get the current location on page by the center of the browser in pixels (Y-axis) */
    getWindowCenter() : number {
        return window.pageYOffset + window.innerHeight/2; 
    }
    


    /* Scroll to the x,y pos on page */
    scrollToPage (XPos : number, YPos : number) : void
    {
        window.scrollTo(XPos, YPos);
    }

    lockPageScroll () : void {
        document.body.style.overflow = 'hidden'; 
    }

    unlockPageScroll () : void {
        document.body.style.overflow = 'visible'; 
    }

    hideCursor () : void
    {
        document.body.style.cursor = 'none'; 
    }
    showCursor () : void
    {
        document.body.style.cursor = 'auto'; 
    }

}
export default pageFunctions;