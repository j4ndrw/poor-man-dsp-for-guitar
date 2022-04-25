import type { Device } from "@interfaces/Device";
import { createStore } from "solid-js/store";

interface Store {
    inputDevice: Device | null;
    outputDevice: Device | null;
}

const [store, setStore] = createStore<Store>({
    inputDevice: null,
    outputDevice: null,
});

const setInputDevice = (device: Device) => {
    setStore("inputDevice", () => device);
};
const setOutputDevice = (device: Device) => {
    setStore("outputDevice", () => device);
};
