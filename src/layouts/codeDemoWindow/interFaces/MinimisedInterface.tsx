


import React, { useEffect, useState } from 'react';
import {StateWrapper} from '../../../Interfaces/stateObjectInterface';

/* ------------------------------------------ Component Description ------------------------------------------
    This componenet is utilised by some parent to handle minimisedWidows.

    Component takes as props a stateWrapper object, where the set_State value for rendered JSX of this
    component is scoped-back to the parent, then passed to the CodeHandler class to be utilised.

    As such, CodeHandler will call set_State to force re-render of this component  without unnecessarily
    evoking the rendering of the parent component. 
------------------------------------------------------------------------------------------------------------*/

let RenderMinimised : React.FC<{MinWrapper : StateWrapper<React.ReactElement>}> = (props) => {
    let [RenderState, set_RenderState] = useState<React.ReactElement>(<></>);
    useEffect
    (
        () => {
            props.MinWrapper.item = RenderState;
            props.MinWrapper.setItem = set_RenderState;
        }
    )
    return (
        RenderState
    )
}

export default RenderMinimised;