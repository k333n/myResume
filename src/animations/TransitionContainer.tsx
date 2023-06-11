import React from 'react';
import stylings from './animationStyling.module.css';

/* Render a transition frame taking the size of the parent container. */
let RenderTransitionFrame: React.FC <{children : React.ReactNode, customStying : React.CSSProperties}> = (props) =>
{
    return (
        <> 
            <div style = {{ width : '100%', height : '100%', overflow:'hidden' }}>
                <div className= {stylings.leftTransition} style = {Object.assign ({}, props.customStying)}>
                    { props.children }
                </div>
            </div>
        </>
    );
};

export default RenderTransitionFrame;