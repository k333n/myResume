
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import DynamicHeading from '../dynamicText';
import {ObjectRef} from '../../Interfaces/RefObjectInterface';
import StateObject,{StateWrapper} from '../../Interfaces/stateObjectInterface';
import myBrowser from '../../browserHandling/myBrowser';
import { JsxElement } from 'typescript';
import BarChartHandler from './barChartHandler';
import barChartHandler from './barChartHandler';
import ScrollableFrame from '../scrollableFrame';
import AnimationBar from '../../animations/AnimationBar/animationBar';
import Styling from './styling.module.css';
import GridFrame from '../gridFrame';
import { channel } from 'diagnostics_channel';
import ImageFrame from '../imageFrame';
import SimpleButton from '../../buttons/simpleButton2/simpleButton2';
import ToggleButton from '../../buttons/ToggleButton/ToggleButton';

/* ------------------------------------------ Component Description ------------------------------------------
    Renders a bar-chart displaying given items and animated-percentage Bar in association with each item. 

    This component works in conjunction with the barChartHander class to store state values, and to 
    coordinate the items to be displayed.  
    Bar-Chart has 3 main sections, this is :
        1) SubjectItems
        2) CategoryItems
        3) Elements 
    where Elements ∈ CategoryItems ∈ CategoryItems, As such : the selected SubjectItem will dictate the type
    of CategoryItems, and hence elements to be displayed on the bar-Chart.
    
    Hence, this component takes as props :
        SubjectItems : SubjectItem[]; The array of SubjectItems each containing its own distinct set of
                       CategoryItem and respective elements to be rendered. 
                       
    Note : Current Component only support |SubjectItems| = 2.  
------------------------------------------------------------------------------------------------------------*/
export interface SubjectItem
{
    Name : String,
    CategoryItems : CategoryItem[];
}
/* CategoryItem ⊆ SubjectItems */
export interface CategoryItem {
    Title : string,
    elements :  { 
        name : String,
        percentage : number
        color_Theme : string
    }[],
}

let FontSizeRef : ObjectRef<HTMLParagraphElement> = {
    setFunc : (ref: ObjectRef<HTMLParagraphElement>, toRef: React.RefObject<HTMLParagraphElement>) => 
                { 
                    ref.ref = toRef;
                },
    ref : undefined,
}

/* Given the paragraph elements {toChange, toCopy} we set toChange.fontSize <-- toCopy.fontSize() */
let copyFontSize = (toChange : React.RefObject<HTMLParagraphElement>, toCopy : React.RefObject<HTMLParagraphElement> ) => {

        let newFontSize = myBrowser.RefHandling.getRefFontSize(toCopy);
        if (toChange.current!=null) {
            toChange.current.style.fontSize = `${newFontSize}px`;
            // console.log("new fontsize change = " + newFontSize);    
        }
}

/* Initialise elements for category item (if not already initialised already) or if changes are made, and a re-render is evoked */
let initialiseCategoryItems = (bch :BarChartHandler, ContentItemStateRef : StateWrapper<JSX.Element[]>, 
    CategoryItemDivRef : React.RefObject<HTMLDivElement> , lastCategoryItem : React.RefObject<HTMLDivElement>) => 
{
    if (bch == undefined) {
        // console.log("Error establishing Category Item! BarChartHandler has not been initialised.")
        return;
    }

    /**
     *  Initialise and add Item states if not established already, this is, if State is not locked we increment the current categoryItem state
     *  by one until the max item is reached and overflow occurs in the actual DOM, hence we then lock the state from further increments on re-render. 
     */
    
    if (bch.isStateLock() === false)
    {
        /* if categoryItem exist & overvlow occurs, we decrement category item by 1, and lock state */
        if ((lastCategoryItem.current != null) && !(myBrowser.RefHandling.isRefContained(CategoryItemDivRef, lastCategoryItem))) 
        {
            bch.decrementCategoryItem();
            bch.setLockState(true);    
        } else {
            /* else, we can add more to add more items to DOM */
            bch.incrementCategoryItem();
        }
    }

    /* Based on the states by 'BarChartHandler', we initialise and render elements accordingly based on the derived state information */
    let categoryItem : CategoryItem[] | undefined = bch.getCategoryItems();     /* Return the CategoryItem state information  */
    let toRet : JSX.Element[] = [];   /* Array of JSX.Elements to re-render with */
    let hasChanged : boolean = true;  /* Determine if current state has changed, if so we re-insert into the final renderState */
    if (categoryItem != undefined)    
    {   
        for (let i = 0; i < categoryItem.length; i++)
        {
            let insertElement : JSX.Element = 
                <>

                        <div 
                            className={Styling.CategoryTitle}
                            onMouseDown={(event) => { CategoryItemActionHandler(event, ContentItemStateRef)}} 
                            data-key={i} key = {i} 
                            style = {{  color : `${bch.getSelectedCategoryItem() === i ? '#333':'#7f8893'}`}}> 
                            {`${categoryItem[i].Title}`}
                        </div> 
                        <div  className={Styling.CategoryTitle} ref = {lastCategoryItem} style = {{display:'inline-block', color :'#7f8893'}}> &nbsp; / &nbsp; </div>
                </>
            toRet.push(insertElement);
        }
        /* If State value for selectedCategoryItem has not been initialise, and the item to be rendered by categoryItem is nonEmpty, we set the state selectedCategoryItem <-- 0 */
        if ((bch.getSelectedCategoryItem() === -1) && categoryItem.length > 0) bch.setSelectedCategoryItem(0); 
    }else{
        /* else If the derived state information by CategoryItem is Empty ⇒ nothing to select, hence we de-initialise the state selectedCategoryItem  */
        bch.setSelectedCategoryItem(-1); 
    }
    /** If change has been made we re-render by the new CategoryItem. Change is assumed true IF the currentRendered CategoryItem.length ≠ CategoryItem.length
     *  , and is a false assumption if ContentItemStateRef has not been cleared prior to some new state change. 
     */
    if (ContentItemStateRef.item.length != toRet.length) ContentItemStateRef.setItem(toRet);
}

/* Initialise elements for selected category item (if not already initialised already) or if changes are made, and a re-render is evoked */
let initialiseCategoryItemElements = (bch : barChartHandler, SubjectItems : SubjectItem[], ContentItemElementRef : StateWrapper<JSX.Element[]> ) => 
{
    let toRet : JSX.Element[] = [];
    if (bch.getSelectedCategoryItem() === -1 ){// no selected category item, hence no item elements display
        if (ContentItemElementRef.item.length != 0)  ContentItemElementRef.setItem([]); 
        return;
    } 
    
    let elements = SubjectItems[bch.getSelectedSubjectItem()].CategoryItems[bch.getSelectedCategoryItem()].elements;
    // console.log("...getSelectedSubjectItem = " + bch.getSelectedSubjectItem());
    // for (let i =0; i < elements.length ; i++) console.log(" . New Item change : " + elements[i].name)
    // console.log("...getSelectedCategoryItem = " + bch.getSelectedCategoryItem());
    // for (let i =0; i < ContentItemElementRef.item.length ; i++) console.log(" . prev Item change : " + ContentItemElementRef.item[i].key);

    let same : boolean = true;
    for (let i=0; i < elements.length ;i++)
    {
        if (ContentItemElementRef.item.length === elements.length) // rendered elements and new elements are the same size, we consider their attributes
        {
            let k = ContentItemElementRef.item[i].key;
            if (k != null)  // key exists by assumption
            {
                k = k.toString(); 
                if ((k.length - elements[i].name.length) < 0)  same = false; // rendered elements and new elements does not matach, as their lengths are different 
                else   // else we consider their individual character values 
                {
                    k = k.substring(0, elements[i].name.length);
                    if (k != elements[i].name) {
                        // console.log("initialiseCategoryItemElements have changed! We proceed to update!");
                        same = false;
                    }
                } 
            }
        } else same = false;
        
        let key = `${elements[i].name}${i}`;
        toRet.push
        ( 
            <div key = {key} className = {Styling.CategoryItemElement} > 
                <div className = {Styling.line} style = {{top:'0%'}} /> 
                    <div className = {Styling.CategoryItemElementTitle} > 
                        {`${elements[i].name}`}
                    </div>               
                <div className = {Styling.CategoryItemElementBar}> 
                    <AnimationBar key = {key} percentage={elements[i].percentage} color_Theme = {elements[i].color_Theme}/> 
                </div>

                { (i === elements.length-1) &&  <div className = {Styling.line} style = {{top:'100%'}}/> } 
            </div>
        );
    }

    if (!same) {
        // console.log("We re-render new category item elements as per change");
        ContentItemElementRef.setItem(toRet);
    } else {
        // console.log("We do not re-render new category item elements as no change!");

    }
}
/* handler for category element indicator, that is, there is more elements to be shown through scrolldiv */
let handleCategoryElementIndicator = ( indicatorDownArrowRef : React.RefObject<HTMLDivElement> ,  CategoryItemContainerRef : StateObject<React.RefObject<HTMLDivElement>> , categoryElementIndicatorRef : React.RefObject<HTMLDivElement> ) =>
{
    if (CategoryItemContainerRef.item.current != undefined && categoryElementIndicatorRef.current != undefined)
    {
        let CategoryItemDom = CategoryItemContainerRef.item.current as HTMLDivElement;
        let k = CategoryItemDom.lastChild as HTMLDivElement;

        if (k != null) {
            let LastChildPos = (k.offsetTop + (k.clientHeight/2));
            let ScrollPosition = (CategoryItemDom.scrollTop + CategoryItemDom.clientHeight);

            if (ScrollPosition < LastChildPos){
                categoryElementIndicatorRef.current.style.opacity = "100%";
            }else{
                categoryElementIndicatorRef.current.style.opacity = "0%";
            }
        }

        if(indicatorDownArrowRef.current != null && FontSizeRef.ref?.current!= null)
        {
            indicatorDownArrowRef.current.style.width = `${FontSizeRef.ref.current.clientHeight*2}px`;
            indicatorDownArrowRef.current.style.height = `${FontSizeRef.ref.current.clientHeight*2}px`;
        }
    }
}


/* Action handler for category items, mainly, mouse events. */
let CategoryItemActionHandler = (event : React.MouseEvent<HTMLDivElement>, categoryItemState : StateWrapper<JSX.Element[]>) =>
{ 
    let eventAttribute =  myBrowser.EventHandling.getMouseEventAttribute<HTMLDivElement>(event, "data-key");
    if (eventAttribute != null && Bch != null)
    {
        let toSet = parseInt(eventAttribute as string);
        Bch.setSelectedCategoryItem(toSet);
        categoryItemState.setItem([]); /* Evoke re-render and hence (Ref : 3130) will be re-evaluated*/
    }
} 

/** Action handler for Subject items, mainly, mouse events. Here, implementation of based on the assumption that there is only 2 subject Items.
 *  Hence, we rely on a numberic value k ∈ {0,1} used to represent the two subject item, that is SubjectItem[k].  
*/
let SubjectItemActionHandler = (subjectItem : number, categoryItemState :  StateWrapper<JSX.Element[]>) =>
{ 
    if (Bch != null)
    {
        if (Bch.setSelectedSubjectItem(subjectItem))  // on subject change success
        {
            Bch.setLockState(false); 
            Bch.setLockState(false) ;       
            categoryItemState.setItem([]); /* Evoke re-render and hence (Ref : 3130) will be re-evaluated*/
        }
    }
    return;
} 

/* Iterate to the next block of category items */
let incrementBlockHandler = (CategoryItemsWrapper : StateWrapper<JSX.Element[]> ) => 
{
    Bch?.setLockState(false);                   /* Release lock for re-render process, mainly calls at (Ref : 3130)  */
    if (Bch?.canIncrement())                    /* Verify if next block exist */
    {
        Bch?.incrementBlock();                  /* Increment to next block */
        CategoryItemsWrapper.setItem([]);       /* Re-Render */
    }
}
let decrementtBlockHandler = (CategoryItemsWrapper : StateWrapper<JSX.Element[]> ) => 
{
    Bch?.setLockState(false);                   /* Release lock for re-render process, mainly calls at (Ref : 3130)  */
    if (Bch?.canDecrement())                    /* Verify if next block exist */
    {
        Bch?.decrementBlock();                  /* Increment to next block */
        CategoryItemsWrapper.setItem([]);       /* Re-Render */
    }
}

/* Handler function for the increment & decrement buttons. This method sets its visibility based on the canIncrement,Decrement() output. 
   and their click handlers are set the the functions {incrementBlockHandler, decrementBlockHandler}. 
*/
let handleBlockButtons = (incrementButton : React.RefObject<HTMLDivElement> , decrementButton : React.RefObject<HTMLDivElement>  ) =>
{
    if ( (incrementButton.current != null) && (decrementButton.current != null))
    {
        if (Bch?.canDecrement())
            decrementButton.current.style.opacity = "1";
        else 
            decrementButton.current.style.opacity = "0";
        if (Bch?.canIncrement())
            incrementButton.current.style.opacity = "1";
        else 
            incrementButton.current.style.opacity = "0";
    }
}

/* Global Bar-Chart Handler */
let Bch : BarChartHandler | undefined = undefined;
let RenderBarChart : React.FC<{SubjectItems : SubjectItem[]}> = (props) : React.ReactElement => 
{    
    /* Initialise BarChart-Handler if not already initialised */
    if (Bch == undefined) Bch = new BarChartHandler(props.SubjectItems, 0);
    // console.log("Rerender");

    let CategoryItemContainer = useRef<HTMLDivElement>(null);
    let lastItem = useRef<HTMLDivElement>(null);
    let [CategoryItems, addCategoryItems] = useState<JSX.Element[]> ([]);
    let [CategoryItemElements, addCategoryItemElements] = useState<JSX.Element[]> ([]);
    let incrementButtom = useRef<HTMLDivElement>(null);
    let decrementButtom = useRef<HTMLDivElement>(null);
    // console.log("Size of CategoryItems = " + CategoryItems.length);

    /* ScrollableFrame Reference */
    let [categoryItemRef, setCategoryItemRef] = useState<React.RefObject<HTMLDivElement>>( useRef<HTMLDivElement> (null));
    const CategoryItemContainerRef:StateObject<React.RefObject<HTMLDivElement>> =  
    {
        item : categoryItemRef,
        setItem : setCategoryItemRef
    }
    let CategoryElementIndicator = useRef<HTMLDivElement>(null);
    let cannotRenderElement : JSX.Element = <div style = {{width:'100%', height:'100%', backgroundColor:'red'}}> Content cannot fit, try scaling browser </div>


    /* State wrapper for category_item */
    let CategoryItemsWrapper : StateWrapper<JSX.Element[]> = {
        item : CategoryItems,
        setItem : addCategoryItems,
    }

    /* State wrapper for category_item elements */
    let CategoryItemElementWrapper : StateWrapper<JSX.Element[]> = {
        item : CategoryItemElements,
        setItem : addCategoryItemElements,
    }
    
    /* Recale FontSize in CategoryItemContainer(Div) dynamically by rescaler component via reference FrontSizeRef*/
    let rescaleFontSize = () =>{
        if( FontSizeRef.ref != undefined && FontSizeRef.ref.current != null && CategoryItemContainer != null)
            copyFontSize(CategoryItemContainer, FontSizeRef.ref);
    }
    let downArrowContainer = useRef<HTMLDivElement>(null);

    /* (Ref : 3130) : These functions are re-evaluated on every re-render, that is, on props.SubjectItem change or window.resize by(Ref : 3131)*/
    useLayoutEffect(
        () => {
            if (Bch != undefined) {
                initialiseCategoryItems(Bch, CategoryItemsWrapper, CategoryItemContainer, lastItem );       /* Initialise category_item (if any)*/
                initialiseCategoryItemElements(Bch, props.SubjectItems,CategoryItemElementWrapper);         /* Initialise category_item elements (if any)*/
                handleCategoryElementIndicator(downArrowContainer, CategoryItemContainerRef, CategoryElementIndicator);         /* Set initial visibility of more-element indicator before scroll, this is overrided by eventListener @ (Ref:3132)  */
                handleBlockButtons(incrementButtom, decrementButtom);                                       /* Handle block increment buttoms for category item*/
                CategoryItemContainerRef.item.current?.scrollTo(0,0);                                       /* Reset category_Item Element scrollable container to start position on re-render  */
            }
        }, 
    );

    /* Initial render effect (for setup!) */
    useLayoutEffect(
        ()=>{
            if( FontSizeRef.ref != undefined && FontSizeRef.ref.current != null && CategoryItemContainer != null)
                copyFontSize(CategoryItemContainer, FontSizeRef.ref);

            let handleCategoryElement = () => {
                handleCategoryElementIndicator(downArrowContainer, CategoryItemContainerRef, CategoryElementIndicator);
            }
            /* Setup listeners */
            if (categoryItemRef.current != undefined) {
                /* (Ref:3132) : scroll handlers for scrollFrame, this is, the more-element indicator */
                categoryItemRef.current.removeEventListener("scroll", handleCategoryElement); 
                categoryItemRef.current.addEventListener("scroll", handleCategoryElement);

                /* (Ref : 3131) : Resize Handlers to re-insert Items s.t. no overflow occurs */
                window.addEventListener("resize", () => 
                { 
                    Bch?.resetAllCategoryItem();         /* Reset Category Item to be re-initialised */
                    Bch?.setSelectedCategoryItem(-1);    /* set selected Category Item un-idenified */
                    Bch?.setLockState(false);            /* Release state lock */
                    addCategoryItems([]);                /* Initialise component Re-Render */
                    addCategoryItemElements([]);
                });
            };
        }, [props.SubjectItems]
    );
    

    return (
        <>
            { 
                /* On render failure  */
                ( CategoryItems.length === 0 && <div className={Styling.errorPrompt}> Error Dynamically scaleing Element! try scaling browser or specilaise mediaQuery styling </div>)
            }
            <div className= {Styling.barChartContainer} style = { (!(CategoryItems.length > 0)) ? {visibility:'hidden'} : {visibility:'visible'}}> 
                <div className={Styling.barChartTitle}  > 
                    <DynamicHeading Text = {"SKILLS"} Styling = {{color : '#7f8893', fontWeight :'600', letterSpacing :'0.5px'}} isSimpleContainer = {true} />
                </div>
                <div id = "CategoryItemContainer" style ={{display:'block', width:'100%',height:'100%', paddingRight :'1%', boxSizing:'border-box', position:'relative'}}> 
                    <div style ={{width :'95%', height :'100%', display :'inline-block', verticalAlign:'top', overflow:'hidden'}}>
                        <div ref = {CategoryItemContainer} className = {Styling.CategoryItemContainer} >
                            <div id = {"TitleRescaling"} style = {{ width : '100%', height : '100%' , position : 'absolute'}}> 
                                <div style ={{width :'100%', height :'100%', overflow:'hidden'}}>
                                    <DynamicHeading Text = {"P"} textRef = {FontSizeRef} onChangeAction = {rescaleFontSize} isSimpleContainer = {true} />
                                </div>
                            </div>
                            { CategoryItems }
                        </div>
                    </div>
                    <div style = {{width:'5%', height:'100%', display:'inline-block'}}>
                        <div ref = {decrementButtom} onMouseDown={() => {decrementtBlockHandler(CategoryItemsWrapper)}} 
                            style = {{position:'relative', display : 'inline-block', cursor:'pointer' , verticalAlign:'top', width : '50%',transition :'opacity 1s', height:'100%', overflow :'hidden'}}> 
                                <div style = { {width:'100%', height:'100%', overflow:'hidden', verticalAlign :'top'}}> 
                                    <DynamicHeading Text = {"←"}  Styling = {{ color:'#333', display :'flex', alignItems :'center', justifyContent :'center'}} isSimpleContainer ={true}  />

                                </div>
                        </div>
                        <div ref = {incrementButtom}  onMouseDown={() => {incrementBlockHandler(CategoryItemsWrapper)}} 
                            style = {{position:'relative', display : 'inline-block', cursor:'pointer' ,transition :'opacity 1s', verticalAlign:'top', width : '50%', height:'100%', overflow:'hidden'}}>
                                <div style = { {width:'100%', height:'100%', overflow:'hidden', verticalAlign :'top'}}> 
                                    <DynamicHeading Text = {"→"}  Styling = {{ color:'#333', display :'flex', alignItems :'center', justifyContent :'center'}} isSimpleContainer ={true} />
                                </div>
                        </div>
                    </div>
                </div>

                <div id = "skillsHeading2Container" style = { {width : '100%', height : '100%',overflow:'hidden', color :'#7f8893'}}> 
                    <DynamicHeading Text = {"Skills to make your project a success!"} isSimpleContainer ={true}  />
                </div>
                <div id = "CategoryItemElementContainer" className = {Styling.CategoryItemElementContainer} style = { {  }}> 
                    {   
                        /* Render icon IFF everything can fit without block incrementation, that is, all content fit on page */
                       ((!Bch.canIncrement()) && (!Bch.canDecrement())) 
                       && 
                       <div className = {Styling.animatingImageContainer}>
                            <div className = {Styling.animatingImage}>
                                <ImageFrame src = {"https://assets.website-files.com/63238e717124a8c9a4c94e41/6323a34d9b96348a6227f789_Launch.webp"} />
                            </div>
                        </div>
                    }
                  
                    <div className={Styling.CategoryItemElementIndicator} ref = {CategoryElementIndicator}> 
                        <div className={Styling.arrowdown}/> 
                        {/* <div ref = {downArrowContainer} > 
                            <DownArrow/>
                        </div>
                            */}
                    </div>
                    <ScrollableFrame useStateReference ={CategoryItemContainerRef} showOverflowNotification = {false}>
                        {CategoryItemElements}
                    </ScrollableFrame>
                </div>
            </div>
            <div id ={"SubjectItemContainer"} style ={{width:'100%', height:'150px'}}>
                <div style ={{width : '30%', boxSizing:'border-box', paddingLeft:'5%'}}> 
                     <ToggleButton button_1Title="CompSci" button_1Action={ () => { SubjectItemActionHandler(0, CategoryItemsWrapper); }} button_2Title="Design" button_2Action={() => { SubjectItemActionHandler(1, CategoryItemsWrapper); }}/>
                </div>
            </div>
        </>
    )
}

export default RenderBarChart;