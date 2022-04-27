# Poor Man's DSP

## Purpose and intentions

Guitar amp simulators and VSTs are expensive. As such, I want to create an open source alternative that allows for:

-   [ ] Key transposition (so raising / decreasing pitches by X semitones or Y octaves)
-   [ ] Distortion
-   [ ] Delay
-   [ ] Reverb
-   [ ] Chorus
-   [ ] Other interesting effects

I also intend to make the app web-based, such that it is as portable as possible. Anyone should be able to access the app and be able to use it.

Ideally, this should be a frontend only application that leverages the client's resources for DSP-related operations. As of this writing (April 25th 2022), I can't think of a way to make the backend handle DSP operations without latency.

## Thoughts

### April 25th 2022

For the moment, this is just an idea. I don't know if this will work as I want it to work.

The app's UI will have to be really performant, such that the client's resources are not wasted on rendering and are available for DSP operations. As such, I think I'll build the frontend with SolidJS. We'll see if it is a good decision or if I'll end up regretting it.

## Stack

-   SolidJS
-   Tailwind
-   Vercel

## Credit

-   Background image (flower pattern) - Photo by Olya Kobruseva: https://www.pexels.com/photo/a-bouquet-of-flowers-with-green-leaves-5039360/
