export default class Stack<T> {
    element : T[];
    constructor() {
      this.element = [];
    }
  
    /**
     * Push element into stack
     * @param e 
     */
    push(e : T)   {
      this.element.push(e);
    }
  
    /**
     * Remove element based on the LIFO principle, that is : the last element to be pushed.
     * @returns 
     */
    pop() {
      if (this.isEmpty()) {
        return "stack is empty";
      }
      return this.element.shift();
    }
  
    /**
     *  get element based on the LIFO principle, that is : the last element to be pushed
     */
    peek() {
      if (this.isEmpty()) {
        return "stack is empty";
      }
      return this.element[this.element.length-1];
    }
  
    isEmpty() {
      return this.element.length === 0;
    }
  
    size() {
      return this.element.length;
    }
  }