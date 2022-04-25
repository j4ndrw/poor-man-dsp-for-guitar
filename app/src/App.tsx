import { ClickableKnob, KnobBase, TurnableKnob } from "@components/knob";
import type { Component } from "solid-js";

const App: Component = () => {
    return (
        <div>
            <h1 class="m-16 text-6xl select-none">Poor Man's DSP</h1>
            <TurnableKnob
                name="Transpose"
                min={-12}
                max={12}
                onTurn={(currentValue) =>
                    console.log(`Knob is at ${currentValue}`)
                }
            />
            <ClickableKnob
                name="Delay"
                onClick={() => {
                    console.log("lmao");
                }}
            />
        </div>
    );
};

export default App;
