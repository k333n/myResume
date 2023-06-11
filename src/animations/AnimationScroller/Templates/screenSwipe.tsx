


function RenderSwipe (children : React.ReactNode, AnimationAmount : number) : React.ReactElement{

    return (
        <> 
            <div 
                    style = 
                    { {
                        clipPath : `polygon(${100-AnimationAmount}% ${100-AnimationAmount}%, ${100-AnimationAmount}% 100%, 100% 100%)`,
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

export default RenderSwipe;