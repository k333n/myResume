import React, {Suspense, useRef, useLayoutEffect, useState, useEffect} from "react";
import ProfileBanner from './animations/AnimationBannerProfile/AnimationBanner';
import DynamicHeading from './layouts/dynamicText'
import CodeWindow, {WindowState, FileList} from './layouts/codeDemoWindow/CodeWindow';
import CodeTabHandler from './layouts/codeDemoWindow/handlers/CodeTabHandler';
import linkedList from "./DataStructures/LinkedList";
import { StateWrapper } from "./Interfaces/stateObjectInterface";
import MinimisedInterface from './layouts/codeDemoWindow/interFaces/MinimisedInterface';
import ToggleButtom from './buttons/ToggleButton/ToggleButton';

function RenderApp() {
    let SomeList : linkedList<String> = new linkedList<String>();

    SomeList.addElement( "first element");

    SomeList.addElement("second element");
    SomeList.addElement("third element");

    SomeList.printValues();

    SomeList.removeAt(2); 
    SomeList.printValues();

    SomeList.addElement("second element"); 
    SomeList.printValues();
    
    SomeList.removeAt(2); 
    SomeList.printValues();

    SomeList.addElement("third element");
    SomeList.printValues();

    let fileList : FileList[] = [
        {
            key : 1,
            FileTitle : "main.java",
            content :  "DDDDDDDDDDescription : Given an array A of integers, we return The array in sorted order (if any exist) . " +
            "Sorting takes O(n2) worse time, but averages At O(nlog2n) time complexityescription : Given an array A of integers, we return The array in sorted order (if any exist) . " +
            "Sorting takes O(n2) worse time, but averages At O(nlog2n) time complexityescription : Given an array A of integers, we return The array in sorted order (if any exist) . " +
            "Sorting takes O(n2) worse time, but averages At O(nlog2n) time complexityescription : Given an array A of integers, we return The array in sorted order (if any exist) . " +
            "Sorting takes O(n2) worse time, but averages At O(nlog2n) time complexityescription : Given an array A of integers, we return The array in sorted order (if any exist) . " +
            "Sorting takes O(n2) worse time, but averages At O(nlog2n) time complexityescription : Given an array A of integers, we return The array in sorted order (if any exist) . " +
            "Sorting takes O(n2) worse time, but averages At O(nlog2n) time complexityescription : Given an array A of integers, we return The array in sorted order (if any exist) . " +
            "Sorting takes O(n2) worse time, but averages At O(nlog2n) time complexityescription : Given an array A of integers, we return The array in sorted order (if any exist) . " +
            "Sorting takes O(n2) worse time, but averages At O(nlog2n) time complexityescription : Given an array A of integers, we return The array in sorted order (if any exist) . " +
            "Sorting takes O(n2) worse time, but averages At O(nlog2n) time complexityescription : Given an array A of integers, we return The array in sorted order (if any exist) . " +
            "Sorting takes O(n2) worse time, but averages At O(nlog2n) time complexity "
        },
        {
            key : 2,
            FileTitle : "test.java",
            content :  "[22][11][5][44][29][1][33][14][20][28][18][3][9][7][4][[77][12][13][11][5][1][3][9][7][4][12][13][28][18][44][29][22][33][[77][14][20] : Stack = {8} . we do A[0],.., A[7] next b.c  | stack | < [11][5][1][3][9][7][4][12]  :  Stack = {8, 7} , we do A[0],.., A[6] next b.c stack[last-1] > stack[last]  [1][3][4][5][9][7][11]  : Stack = {8, 7, 2} , we do A[0],.., A[1] next b.c stack[last-1] > stack[last]  [1][3] :we don’t add to stack b.c. stack[last] - 0 = 2, hence this is guaranteed to be correct#Stack = {8, 7, 2}, we do RHS A[ stack[last]+1 ],.., A[ stack[last-1] -1  ] next b.c stack[last-1] > stack[last] (and it exists)[5][9][7][11]  [5][9][7][11] : Stack = {8, 7, 2, 6 }, we do LHS A[ stack[last-1]+1] , …, A[stack[last]-1]  next b.c stack[last-1] < stack[last] [5][7][9] : Stack = {8, 7, 2, 6, 4 }, we don’t add because 4-2=2, hence it is guaranteed correct. Stack = {8, 7, 2, 6 },:w "
        },
        {
            key : 3,
            FileTitle : "call.java",
            content :  "Description : Given an array A of integers, we return The array in sorted order (if any exist) . " +
            "Sorting takes O(n2) worse time, but averages At O(nlog2n) time complexity "
        },
    ];   



    let [WindowState , setWindowState] = React.useState<number>(1);

    let windowStates: WindowState = {
        windowState : 0,
        setWindowState : undefined,
    }
    let [WindowState_2 , setWindowState_2] = React.useState<number>(1);

    let windowState_2: WindowState = {
        windowState : 0,
        setWindowState : undefined,
    }
    let [WindowState_3 , setWindowState_3] = React.useState<number>(1);

    let windowState_3: WindowState = {
        windowState : 0,
        setWindowState : undefined,
    }
    let [WindowState_4 , setWindowState_4] = React.useState<number>(1);

    let windowState_4: WindowState = {
        windowState : 0,
        setWindowState : undefined,
    }
    let [WindowState_5 , setWindowState_5] = React.useState<number>(1);

    let windowState_5: WindowState = {
        windowState : 0,
        setWindowState : undefined,
    }
    let [WindowState_6 , setWindowState_6] = React.useState<number>(1);

    let windowState_6: WindowState = {
        windowState : 0,
        setWindowState : undefined,
    }


    // let CodeMinWrapper : StateWrapper<React.ReactElement> = {
    //     item : <></>,
    //     setItem : useState 
    // }

    return (
        <>  


            <p onMouseDown={() => { 
                if (windowStates.setWindowState != undefined)
                {
                    windowStates.setWindowState(1); 
                }
                }}>
                Tab _ 1 
            </p>

             <p onMouseDown={() => { 
                if (windowState_2.setWindowState != undefined)
                {
                    windowState_2.setWindowState(1); 
                }
                }}>
               Tab2 
            </p>
            <p onMouseDown={() => { 
                if (windowState_3.setWindowState != undefined)
                {
                    windowState_3.setWindowState(1); 
                }
                }}>
               Tab3 
            </p>
            <p onMouseDown={() => { 
                if (windowState_4.setWindowState != undefined)
                {
                    windowState_4.setWindowState(1); 
                }
                }}>
               Tab4 
            </p>
            <p onMouseDown={() => { 
                if (windowState_5.setWindowState != undefined)
                {
                    windowState_5.setWindowState(1); 
                }
                }}>
               Tab5 
            </p>
     
            <p onMouseDown={() => { 
                if (windowState_6.setWindowState != undefined)
                {
                    windowState_6.setWindowState(1); 
                }
                }}>
               Tab6
            </p>
             
            {/* <MinimisedInterface MinWrapper={CodeMinWrapper}/> */}
            {/* <CodeWindow Window_State={windowStates} Title ={"Tab1"} fileList = {fileList}/>
            <CodeWindow Window_State={windowState_2} Title ={"Tab_2"} fileList = {fileList}/>
            <CodeWindow Window_State={windowState_3} Title ={"Tab_3"} fileList = {fileList}/>
            <CodeWindow Window_State={windowState_4} Title ={"Tab_4"} fileList = {fileList}/>
            <CodeWindow Window_State={windowState_5} Title ={"Tab_5"} fileList = {fileList}/>
            <CodeWindow Window_State={windowState_6} Title ={"Tab_6"} fileList = {fileList}/>
            <div style ={{width:'100vw', height:'300vh', padding :'2%', paddingLeft : '5%', paddingRight :'5%', boxSizing:'border-box', backgroundColor:'grey',}}>
            </div> */}
        </>




    );
}

export default RenderApp;
