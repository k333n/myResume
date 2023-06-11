import React from "react";

function RenderOval (children : React.ReactNode, AnimationAmount : number) : React.ReactElement{

    return (
        <> 
            <div 
                    style = 
                    { {
                        clipPath : `ellipse(${AnimationAmount}% ${AnimationAmount}% at 50% 50%)`,
                        // clipPath : `circle(10%)`,
                        width : '100%', height : '100%', 
                        backgroundColor : 'rgba(0, 0, 0, 1)', 
                        position : 'absolute',
                        // display :'flex', 
                        // alignItems : 'center', 
                        // justifyContent : 'center',
                        color : 'white'
                    }}>
                        {children}
                </div> 
        </>
    );

}

export default RenderOval;