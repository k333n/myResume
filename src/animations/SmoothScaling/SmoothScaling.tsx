/* ------------------------------------------ Class Description ------------------------------------------
    Provide smooth scaling to some ref object.  The SmoothScaller class  extends the 
    smoothScaller handler. SmoothScaller takes by the constructor some react.Ref<T> Element where 'T'
    is the ref-Type, and some action-Function handler to manipulate the Ref-Object. 
    
    The setActionListeners() method should be overridden on declaration to set up the action listeners, 
    and to establish the state variables (i.e. transitionEnd) which can be accessed and used via the 
    action-Function handler. 

    If setActionListeners(), and hence the States are not explicitly defined, then the State variables may
    not be used in the action-Function handler. 

    The function animate() will trigger on smoothScaler.setScaleAmount(scaleAmount), and the action-Function
    Handler given will be evoked IFF all previous iteration of this function call have finished execution, 
    and no two async process are changing the DOMelement in parallel (we define this as the critical section).
    If a previous call is still in execution, this new scaleAmount will be queued for the next iteration after
    the previous call has finished execution and some promised is returned.
        Note : The lastest 'scaleAmount' by function call is queued, as it is the most recent. 
                All previous scaleAmount values are overridden.
------------------------------------------------------------------------------------------------------------*/



/* ------------------------------------------ Declaration Example ------------------------------------------ 
   let scaleAction : ScalingHandler<HTMLParagraphElement> = 
      {
        scaleElement: (scaleAmount : number, domElement : React.RefObject<HTMLParagraphElement>, states) =>
        {
          return TextScalingHandler(scaleAmount, domElement, states); //where TextScaling handler is imported by : import {TextScalingHandler} from "./animations/SmoothScaler/ScalingHandlers";
        }
      };
      let smoothScaler = new class extends SmoothScaler<HTMLParagraphElement>  
      {
        setActionListeners(element : React.RefObject<HTMLParagraphElement>) {
          if (element.current != null)
          {
            console.log("Added action listenenrs");
            element.current.addEventListener("transitionend", () => { console.log("Transition has ended" ); this.States.transitionEndState = true;})
            element.current.addEventListener("transitionstart", () => {console.log("Transition has started" ); this.States.transitionEndState = false;})
          }
        }
      }(textRef, scaleAction); // where textRef is some React.Ref Object. 
------------------------------------------------------------------------------------------------------------*/

export interface ScalingHandler <T>
{
    scaleElement: (scaleAmount : number, domElement : React.RefObject<T> , States : States ) => Promise<number>,
}


export interface States {
    transitionEndState : boolean | undefined
}
class SmoothScalerHandler <T>
{
    private scaleAmount : number = 0;
    private currentScaleAmount : number = 0;
    private domElement : React.RefObject<T>;
    private Scaler : ScalingHandler<T>;
    private Lock : boolean = false;
    States : States = 
    {
        transitionEndState : undefined,

    }

    constructor( element : React.RefObject<T>, action : ScalingHandler<T>) 
    {
        this.Scaler = action;
        this.domElement = element;
    }
    
    setScaleAmount(scale : number)
    {       
         console.log("SmoothScaler scale set to : " + scale);
         if (scale != this.scaleAmount)
         {
            this.scaleAmount = scale;
            this.animate();
         }
    }
    private animate = async () =>
    {
        if (this.Lock == false)
        {
            //critical section 
            this.Lock = true;
            console.log("Entered critical setion for scaleAmount : " + this.scaleAmount)
            while (this.currentScaleAmount != this.scaleAmount)
            {                
                console.log("Critical Section has changed while animating, we re-animate to : " + this.scaleAmount)
                await this.Scaler.scaleElement(this.scaleAmount, this.domElement, this.States).then((amount) => {this.currentScaleAmount = amount});
            }

            this.Lock = false;
            //critical section end
            console.log(" critical setion released ");

        }else {
            console.log("crit sect occupied, we next process scaleAmount " + this.scaleAmount)
        }
    }

}

export default class SmoothScaler<T> extends SmoothScalerHandler <T>
{
    constructor( element : React.RefObject<T>, action : ScalingHandler<T>) {
        super(element,action);
        this.setActionListeners(element);
    }
  
    setActionListeners(element : React.RefObject<T>) 
    {
        throw new Error("Warning : No actionListener set for element\nCannot utilise States.\n@Override SetActionListener needed in class-object declaration");
    }
}