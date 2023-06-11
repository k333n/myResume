/* ------------------------------------------ Component Description ------------------------------------------
   A simple linkedList implementaton. 

   Note : variable size is a 1:1 mapping of element --> index, that is : 
    where remove(x), for x = size = 1, then we remove the first and only element in this list.
------------------------------------------------------------------------------------------------------------*/



class node <T> {
    element : T;
    next : node<T> | undefined = undefined;
    prev : node<T> | undefined = undefined;

    /**
     * 
     * @param k : key
     * @param n : next
     * @param p : prev 
     */
    constructor( e :T, n? : node<T>, p? : node<T> )
    {
        this.element = e;
        if (n != undefined) this.next = n;
        if (p != undefined) this.prev = p;
    }
}

export default class linkedList <T> {

    head : node<T> | undefined; 
    lastNode : node<T> | undefined; 
    size : number = 0;
    constructor()
    {
        this.head = undefined;
    }

    /**
     * Return the element at given index, else null is returned
     * @param index 
     * @returns T : Element on success, else null
     */
    get (index :number) : T | null {
        if (index > this.size || this.head === undefined)
        {
            console.log("index " + index + " out of range");
            return null;
        }


        let toRet : node<T> = this.head;

        for (let i=1; i <= index;i++)
        {
            let n = toRet.next;
            if (n != undefined) toRet = n;
        }
        return toRet.element;
    }

    addElement( element : T ){
        let newNode = new node(element);

        if (this.head === undefined)
        {
            this.head = newNode;
        }else
        {
            if (this.lastNode != undefined)
            {
                this.lastNode.next = newNode;
                newNode.prev = this.lastNode;
            }
        }
        
        this.lastNode = newNode;
        this.size++;
    }

    /**
     * Remove and return the element at the specified index, else null
     * O(n)
     * @param index 
     * @returns T on successl, else null is returned 
     */
    removeAt(index : number) : T | null
    {
        if (index > this.size || this.head === undefined) {
            // console.log("Cannot remove element " + index + ". Out of bounds!")
            return null;
        }
        
        let to_Remove : node<T> = this.head;
        if (index === 1 ) // to remove is head Element
        {
            if (to_Remove.next != undefined) this.head = to_Remove.next;
            else this.head = undefined;
        }else{ // we remove some child of head
            for (let i = 2;i <= index; i++)  if(to_Remove.next != null) to_Remove = to_Remove.next;

            if (to_Remove.prev != undefined) // This is always assumed to be True IFF index != 1
                if (to_Remove.next != undefined) {
                    to_Remove.prev.next = to_Remove.next;
                    to_Remove.next.prev = to_Remove.prev;
                }else{ // to_Remove = tail, that is it is last Node.
                    to_Remove.prev.next = undefined;
                    this.lastNode = to_Remove.prev; //the prev element is now the lastNode.
                } 
        }

        // console.log("To temove element is " + to_Remove.element + " at index  " + index );
        // console.log("The tail node is " + this.lastNode?.element);
        this.size--;
        return to_Remove.element;
    }


    printValues(){

        if (this.head === undefined) return;
        console.log("Printing LinkedList values :")
        let start = this.head;
      
        do{
            console.log( "  " + start.element);
            if (start.next === undefined) break;
            start = start.next;
        }while (true);
    }


    /**
     * 
     * @returns iterator of linkedList collection
     */
    [Symbol.iterator]() {
        let current = this.head;
        return {
          next() {
            if (current === undefined) {
              return { done: true };
            }

            let curr_Element = current;
            current = current.next;
            return { curr_Element , done: false };
          }
        }
      }
}