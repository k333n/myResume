import React from "react";

/* 
    Takes as input :
        1) children : Child to be rendered 
        2) AnimationAmount : Animation percentage for AnimationAmount ∈ {0, ..., 100}
*/
function RenderCircle (children : React.ReactNode, AnimationAmount : number) : React.ReactElement{

    return (
        <> 
            <div 
                    style = 
                    { {
                        clipPath : `circle(${AnimationAmount}%)`,
                        // clipPath : `circle(10%)`,
                        width : '100%', height : '100%', 
                        backgroundColor : 'black', 
                        position : 'absolute',
                        // display :'flex', 
                        // alignItems : 'center', 
                        // justifyContent : 'center',
                    }}>
                        {children}
                </div> 
        </>
    );

}

export default RenderCircle;