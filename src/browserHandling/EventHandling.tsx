import { type } from "@testing-library/user-event/dist/type";

/* ------------------------------------------ Class Description ------------------------------------------
    Event Handler . 
------------------------------------------------------------------------------------------------------------*/

export default class EventHandling 
{
    /* Given some mouseEvent, return the given attribute values */
    getMouseEventAttribute<T>(event: React.MouseEvent<T>, attribute : string) : String | null
    {
        // console.log("Type of event is : " + event.type)
        let target : T = event.currentTarget;
        if ( (target instanceof HTMLDivElement) )
        {
            let k = target as HTMLDivElement;
            return (target as HTMLDivElement).getAttribute(attribute);
        }
        return null;
    }
    

}
