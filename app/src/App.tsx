import { ClickableKnob, KnobBase, TurnableKnob } from "@components/knob";
import type { Component } from "solid-js";

const App: Component = () => {
    return (
        <div>
            <h1 class="m-16 text-6xl select-none">Poor Man's DSP</h1>
            <div class="flex justify-center items-center">
                <TurnableKnob
                    name="Transpose"
                    min={-12}
                    max={12}
                    onTurn={(currentValue) =>
                        console.log(`Transpose knob is at ${currentValue}`)
                    }
                />
                <TurnableKnob
                    name="Volume"
                    min={0}
                    max={5}
                    onTurn={(currentValue) =>
                        console.log(`Volume knob is at ${currentValue}`)
                    }
                />
                <ClickableKnob
                    name="Delay"
                    onClick={() => {
                        console.log("lmao");
                    }}
                />
            </div>
        </div>
    );
};

export default App;
