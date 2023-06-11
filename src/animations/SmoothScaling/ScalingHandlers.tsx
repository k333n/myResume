/* ------------------------------------------ Function Description ------------------------------------------
    Declaration default handler functions used for the Smooth Scaller class s.t. in :
        export interface ScalingHandler <T>
        {
            scaleElement: (scaleAmount : number, domElement : React.RefObject<T> , States : States ) => Promise<number>,
        }
    scaleElement = x ∈ getExport( this.component ); 
------------------------------------------------------------------------------------------------------------*/


import {States} from "./SmoothScaling";

export let DivScalingHandler = async (scaleAmount : number, domElement : React.RefObject<HTMLDivElement>, States : States) : Promise<number>=> {
    return await new Promise((resolve) =>  
    {
      if (domElement.current != null)
      {

          domElement.current.style.transition = "width 1s";
          domElement.current.style.width = `${scaleAmount-100}px`;

          let m = async () => 
          {

            for (let k = 0; k < 1000; k++)
            {
                if (States.transitionEndState == true || States.transitionEndState == undefined)
                {
                    console.log("States.transitionEndState =" + States.transitionEndState);
                    break;
                }
                await new Promise((resolve) =>  { 
                        setTimeout(() => resolve(5), 0.1) 
                });
           }

            return resolve(scaleAmount);
          }
          return m();
        
      }
    });
}


export let TextScalingHandler = async (scaleAmount : number, domElement : React.RefObject<HTMLDivElement>, States : States) : Promise<number>=> {
    return await new Promise((resolve) =>  
    {
        
      if (domElement.current != null)
      {
          domElement.current.style.transition = "font-size 0.5s";
          domElement.current.style.fontSize = `${scaleAmount}px`;

          let m = async () => 
          {

            for (let k = 0; k < 1000; k++)
            {
                if (States.transitionEndState == true || States.transitionEndState == undefined)
                {
                    console.log("States.transitionEndState =" + States.transitionEndState);
                    break;
                }
                await new Promise((resolve) =>  { 
                        setTimeout(() => resolve(5), 0.1) 
                });
           }

            return resolve(scaleAmount);
          }
          return m();
        
      }
    });
}