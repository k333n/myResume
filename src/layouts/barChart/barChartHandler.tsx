

import { throws } from "assert";
import {SubjectItem, CategoryItem} from "./barChart";


export default class barChartHandler {  
    private SubjectItems : SubjectItem[];
    /* Keep track of the states of items */
    private StateLocked = false;
    private States : 
    { 
        selectedSubjectItem : number,   /* Represent the currenltly User selected subject item */
        selectedCategoryItem : number, /* Represent the current user selected category item */
        CategoryItemState   : { firstCategoryItem : number[], currentCategoryItem : number }[]   /* Represent the range of rendered elements by CategoryItem[selectedSubjectItem] */
    } = {
        selectedSubjectItem : -1,
        CategoryItemState : [],
        selectedCategoryItem : -1,
    } 
 
    constructor(subjectitems : SubjectItem[], selectedSubjectItem : number )
    {
        this.SubjectItems = subjectitems; //initialise default subject item,
        // console.log("Bar chart handler Initialising!");
        this.States.selectedSubjectItem = selectedSubjectItem;

        for (let k = 0; k < subjectitems.length; k++)
        {
            //Initialise categoryItem default states.
            this.States.CategoryItemState.push( {firstCategoryItem: [], currentCategoryItem: -1 }) ;
            this.States.CategoryItemState[k].firstCategoryItem.push(0);
        }

    }
    /* de-Initialise all categoryItemState by State.categoryItem[x], where ∀ x ∈ {0, ..., |SubjectItems|-1} */
    resetAllCategoryItem()
    {
        for(let i=0; i < this.SubjectItems.length; i++) this.resetCategoryItem(i);
    }

    /* de-Initialise categoryItemState given by State.categoryItem[SubjectItem] */
    resetCategoryItem(subjectItem:number)
    {
        //lock, curSatete
        if (!this.isValidSubjectItem(subjectItem)){
            // console.log("Cannot resetCategoryItem by subjectItem : " + subjectItem + " as it doesnt exist!")
            return;
        } 

        let cItemState = this.States.CategoryItemState[subjectItem];
        cItemState.firstCategoryItem = [];
        cItemState.firstCategoryItem.push(0);
        cItemState.currentCategoryItem = -1;
    }


    setSelectedCategoryItem( selectedCategoryItem : number) {
        // console.log("Selected category item set to : " + selectedCategoryItem)
        this.States.selectedCategoryItem = selectedCategoryItem;
    }

    /* Return an int of the current selected category item. -1 is returned if no item is selected  */
    getSelectedCategoryItem()
    {
        if (this.States.selectedCategoryItem === -1) 
        {
            // console.log("There is no selected category item, maybe it is empty!");
        }
        // console.log("The selectecd category item is : " + this.States.selectedCategoryItem);
        return this.States.selectedCategoryItem;
    }
  
    /* Reset category state of given sobjectItem */
    resetCategoryItemStates(subjectItem : number)
    {
        if (!this.isValidSubjectItem(subjectItem))
        {
            // console.log("Cannot select invalid subjectItem for category item reset. " + subjectItem + " is out of range!")
            return;
        }
        let CurrentCategoryState = this.States.CategoryItemState[this.States.selectedSubjectItem];
        
        CurrentCategoryState.currentCategoryItem = -1;                        //reset currentCategoryItem states
        this.setLockState(false);
        for (let i =0; i < CurrentCategoryState.firstCategoryItem.length ; i++) CurrentCategoryState.firstCategoryItem[i] = 0;      //reset firstCategoryItem states
        // console.log("category item reset for subject item : " + subjectItem); 
    }
    /* Prevent changing of states */
    setLockState(lockState : boolean)
    {
        console.log("LockState set to : " + lockState);
        this.StateLocked = lockState;
    }
    isStateLock()
    {
        return this.StateLocked;
    }
    /* Return True IFF SubjectItem < props.SubItem */
    isValidSubjectItem( SubjectItem : number) : boolean
    {
        return ( SubjectItem < this.SubjectItems.length && SubjectItem >=0);
    }
    /* Return True IFF props.SubjectItems[SubjectItem].CategoryItem[CategoryItem] != undefined */
    isValidCategoryItem( SubjectItem : number , CategoryItem : number ) : boolean
    {
       if(this.isValidSubjectItem(SubjectItem))
       {
            if (CategoryItem < this.SubjectItems[SubjectItem].CategoryItems.length && CategoryItem >=0 ) 
            {
                // console.log("Category item for SubjectItems["+SubjectItem+"].CategoryItems["+CategoryItem+"] exist!");
                return true;
            }
       }
    //    console.log("Category item for SubjectItems[" +  SubjectItem +  "].CategoryItems[" +  CategoryItem + "] does not exist!");
       return false;
    }

    /* Return the previously rendered Elements by State.SubjectItem if any exist, else undefined is returned */
    getCategoryItems() : CategoryItem[] | undefined
    {
        // console.log("Retrieveing Category Items for SubjectItem[" + this.States.selectedSubjectItem+"].categoryItem");
        // It is assumed x = State.selectedSubjectItem in props.SubjectItem[x] exists IFF x != -1; 
        if (this.States.selectedSubjectItem === -1){
            // console.log("|subjectItem| = 0. Cannot Rertrieve catogery item!");
            return undefined; // given SubjectItem ∩ |props.SubjectItem|
        }            

        let CategoryState = this.States.CategoryItemState[this.States.selectedSubjectItem];
        let CategoryItemStart = CategoryState.firstCategoryItem[CategoryState.firstCategoryItem.length-1];

        let CategoryItemEnd = this.States.CategoryItemState[this.States.selectedSubjectItem].currentCategoryItem;
        if ( (CategoryItemEnd - CategoryItemStart) < 0) // => not Initialised O
        {
            // console.log("The state for the range of rendered category has not been initalised/or Nothing is to be rendered");
            return undefined; 
        }
        let toRet : CategoryItem [] = []; // Category items to return 
        for (let i : number = CategoryItemStart; i <= CategoryItemEnd; i++)
        {
            toRet.push(this.SubjectItems[this.States.selectedSubjectItem].CategoryItems[i]);
        }
        return  (toRet.length === 0) ? undefined : toRet;
    }

    /* Increment state value of category_item and return its associated categoryItem  */
    incrementCategoryItem() 
    {
        if (this.StateLocked){
            // console.log("State locked, cannot increment CategoryItem")
            return;
        }
        let CurrentCategoryState = this.States.CategoryItemState[this.States.selectedSubjectItem];
        let nextCategoryItem = CurrentCategoryState.currentCategoryItem + 1;
        if (this.isValidCategoryItem(this.States.selectedSubjectItem, nextCategoryItem)) 
        {
            // console.log("IncrementedCategory item from : " + CurrentCategoryState.currentCategoryItem + " --> " + (CurrentCategoryState.currentCategoryItem+1)); 
            CurrentCategoryState.currentCategoryItem++;
        }
    }
    /* Decrement state value of category_item and return its associated categoryItem  */
    decrementCategoryItem()
    {
        if (this.StateLocked){
            // console.log("State locked, cannot decrement CategoryItem")
            return;
        }
        let CurrentCategoryState = this.States.CategoryItemState[this.States.selectedSubjectItem];
        let prevCategoryItem = CurrentCategoryState.currentCategoryItem -1;
        if (prevCategoryItem >= CurrentCategoryState.firstCategoryItem[CurrentCategoryState.firstCategoryItem.length-1]-1) // It is assumed that currentCategoryItem is correct, and hence, all prefixes exist, hence we decrement it till -1.  s.t. -1 ⇒ no element rendered
        {
            // console.log("DecrementCategory item from : " + CurrentCategoryState.currentCategoryItem + " --> " + (CurrentCategoryState.currentCategoryItem-1)); 
            CurrentCategoryState.currentCategoryItem--;
        }
        this.States.selectedCategoryItem =0; /* Set the selected category item to the first item */
    }
    /* Initialise to the new block of category elements s.t. firstCategoryItem = currentCategoryItem+1 */
    incrementBlock() : boolean
    {

        if (this.StateLocked){
            // console.log("State locked, cannot increment CategoryItem block")
            return false;
        }
        let CurrentCategoryState = this.States.CategoryItemState[this.States.selectedSubjectItem];
        if (!this.canIncrement()) return false;

        CurrentCategoryState.firstCategoryItem.push((CurrentCategoryState.currentCategoryItem+1));
        CurrentCategoryState.currentCategoryItem = CurrentCategoryState.currentCategoryItem+1;
        this.States.selectedCategoryItem =0; /* Set the selected category item to the first item */
        return true;
    }
    /* Determine if block can be incremented, that is, incrementBlock() = true */
    canIncrement() : boolean
    {
        let CurrentCategoryState = this.States.CategoryItemState[this.States.selectedSubjectItem];
        /* currentCategory un-initialised / no item exists in DOM view */
        if (CurrentCategoryState.currentCategoryItem - CurrentCategoryState.firstCategoryItem[CurrentCategoryState.firstCategoryItem.length-1] < 0 )
        {
            // console.log("Cannot increment negative range.");
            return false;
        }

        /* If next block > StateItems.CategoryItems, then we have reached the end, and there is no more items to show. */
        if ( (CurrentCategoryState.currentCategoryItem+1) > this.SubjectItems[this.States.selectedSubjectItem].CategoryItems.length-1) {
            // console.log("We have reched end of block, there are no more items!")
            return false;
        }
        return true;
    }
    /* Determine if block can be decremented, that is, decrementBlock() = true */
    canDecrement() : boolean
    {
        let CurrentCategoryState = this.States.CategoryItemState[this.States.selectedSubjectItem];
        if (! (CurrentCategoryState.firstCategoryItem.length > 1)) return false; /* False IFF state has not been incremented prior. */
        return true;
    }
    /* Initialise to the new block of category elements s.t. currentCategoryItem = firstCategoryItem ⋀ firstCategoryItem = previousState by queue   */
    decrementBlock() : boolean 
    {
        if (this.StateLocked){
            // console.log("State locked, cannot decrement CategoryItem block")
            return false;
        }
        let CurrentCategoryState = this.States.CategoryItemState[this.States.selectedSubjectItem];
        if (this.canDecrement())
        {
            // console.log("Decrementing firstCategoryItem from " + CurrentCategoryState.firstCategoryItem[CurrentCategoryState.firstCategoryItem.length-1] );
            let o = CurrentCategoryState.firstCategoryItem.pop();
            if (o != undefined) CurrentCategoryState.currentCategoryItem = o-1;    
            console.log("     To " +CurrentCategoryState.firstCategoryItem[CurrentCategoryState.firstCategoryItem.length-1] );
            return true;
        }
        // console.log("Cannot decrement, we are already at base!");
        return false;
    }
    
    getSelectedSubjectItem() : number
    {
        return this.States.selectedSubjectItem;
    }

    /** Change the selected_subjectItem number . Return True on success, else False */
    setSelectedSubjectItem(selectedSubjectItem : number) : boolean
    {
        // console.log("Selecting SubjectItem :" )
        if (this.isValidSubjectItem(selectedSubjectItem) && selectedSubjectItem != this.States.selectedSubjectItem) 
        {
            this.States.selectedSubjectItem = selectedSubjectItem;
            this.setSelectedCategoryItem(0);
            // console.log("Selecting SubjectItem changed to " + selectedSubjectItem )
            return true;

        }
        // console.log("Cannot select given subjectItem:  " + selectedSubjectItem + " most likely does not exist OR it is already currently selected" )
        return false;
    }

    printElementTree()
    {
        // console.log("Printing element tree!");
        console.log(this.SubjectItems.length);

        for(let i = 0; i < this.SubjectItems.length; i++)
        {
            // console.log("Subject Item : " + this.SubjectItems[i].Name);
            for (let k : number = 0; k < this.SubjectItems[i].CategoryItems.length; k++)
            {
                // console.log("   CategoryItems : " + this.SubjectItems[i].CategoryItems[k].Title);
                for (let l : number = 0; l < this.SubjectItems[i].CategoryItems[k].elements.length; l++)
                {
                    console.log("     SubjectItems : " + this.SubjectItems[i].CategoryItems[k].elements[l].name + " at % " +
                    this.SubjectItems[i].CategoryItems[k].elements[l].percentage);
                }
            }
        }
    }
} 
