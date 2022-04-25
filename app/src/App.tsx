import Amp from "@components/amp/Amp";
import type { Component } from "solid-js";

const App: Component = () => {
    // TODO: Add a status component, showing the values of the transpose, volume, etc...
    return (
        <div class="flex flex-col justify-center items-center">
            <h1 class="m-16 text-6xl select-none">Poor Man's DSP</h1>
            <Amp />
        </div>
    );
};

export default App;
