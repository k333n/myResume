
import PageHandling from "./pageHandling";
import RequestHandling from "./requestHandling";
import RefHandling from "./RefHandling";
import DirHandling from "./dirHandling";
import DomHandling from "./DomHandling";
import EventHandling from "./EventHandling";

/* ------------------------------------------ Class Description ------------------------------------------
    Parent class containing handler subClasss. 
------------------------------------------------------------------------------------------------------------*/

export class browser extends PageHandling{
    RequestHandling : RequestHandling;
    RefHandling : RefHandling;
    DirHandling : DirHandling;
    DomHandling : DomHandling;
    EventHandling : EventHandling;

    constructor()
    {
        super();
        this.RequestHandling = new RequestHandling();
        this.RefHandling = new RefHandling();
        this.DirHandling = new DirHandling();
        this.DomHandling = new DomHandling();
        this.EventHandling = new EventHandling();
    }
}





/**
 *  Statement myBrowser = new browser is executed when the file containing the statement is loaded, 
 *  after all the imports are done. It creates a new instance of the browser class and assigns it 
 *  to the variable myBrowser.
 * 
 *  This pointer is global (Static), and is only executed/ assigned once, when the file is loaded, 
 *  regardless of how many times the file is imported or how many other files import it.
 * 
 *  To reference a new browser, use the browser class to create a new object instance of browser.
 */

const myBrowser = new browser();

export default myBrowser;