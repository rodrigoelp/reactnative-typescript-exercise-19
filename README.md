# React Native, Typescript and Animations? Oh my! Are you mad?? Here, we are learning about basic animations as exposed by the react native API

React Native has a built in animation framework that could be sufficient to make your application more interactive and responsive. There is a lot of documentation online about the why, when and how to use animations to improve the usability, perception and reception of a product, so we are not going to be talking about.

What we are going to do is, check how far can we push an animation in react native and possible issues we could encounter.

## What are we building?

A storyteller app, the story to narrate is going to be **Le petit prince** or **the little prince**. If you don't know this story, go and get [the book](https://www.amazon.com/Little-Prince-Antoine-Saint-Exup%C3%A9ry/dp/0156012197/ref=sr_1_1?ie=UTF8&qid=1515632160&sr=8-1&keywords=the+little+prince) and read it.

## The documentation available

React Native has a section dedicated to animations [here](https://facebook.github.io/react-native/docs/animations.html) which gives you a pretty good overview of what you need to do.

Some other docuemention to read, relevant to animations are:

- [Native Driver](https://facebook.github.io/react-native/blog/2017/02/14/using-native-driver-for-animated.html)
- [Performance](https://facebook.github.io/react-native/docs/performance.html)

Here is a summary of it...

### Summary of building an animation (documentation)

1. The component hosting your animation will need to expose a series of `Animated.Value` or `Animated.ValueXY` properties. You could initialise these properties with its initial values straight away or set it later before starting the animation (it depends on what sort of animation you are going to be writtin)
1. The target of the animation needs to be an animated component. React Native offers `Animated.View`, `Animated.Text`, `Animated.Image` and `Animated.ScrollView` which covers most of the scenarios I have spiked. But you could always create your own component by calling `Animated.createAnimatedComponent()`
1. Hook up the property storing the animated value to a modifier of a style
    1. Animating a single value requires the generation of a mapping from the integer value in the animated property to the value displayed. I could've mapped an `Animated.Value()` from `0` to `1` to be certain strings. A common usage (for opacity for instance) is to get the range to generate pulses or oscillations in your output. In the case of the interpolation between a range of values, you need to call `value.interpolate({inputRange, outputRange})`
    1. Animating a value pair (`Animated.ValueXY`) will require the generation of a transform (can be done via `value.getTranslateTransform()`.
1. Declare your animation/s to play. The outer most call will give you back an `Animated.CompositeAnimation` which you could store in a variable/property to control your animation later on.
1. Call `start()` on the animation that has been declared before.

## Building a story

The little prince has a lot of different scene we could do an animation about... I like the story in which he jumps from planet to planet by catching shooting stars and traveling with it.

So, the animation is going to be about space, with a few stars (maybe asteoirs) flickering in the background as the little prince gets on stars and drifts towards the planet with the rose... _or maybe is he returning to the rose after his journey?_

The entire code has been made in the `index.tsx` file to allow all the moving piece to be together.

## Learnings and gotchas

Animations may have some behaviors that are a little unexpected and I honestly don't understand its behaviour but there are ways around it.

For instance:

### Loop function resets to the initial value

If you are declaring a sequence of translations which you want to terminate in a loop, the last transition is not going to be the initial value for the loop, which is a different behaviour to any of the other animations that I have used.

If you have a box at `{ x: 0,y: 0 }`, translate it to `{ x: 10, y: 10 }` and translate it once more to `{ x: 5, y: 20 }` the second animation is going to understand the last position was `{ x:10, y: 10 }` and continue the animation of that sequence from there.

> Code

```ts
const boxTranslateValue = Animated.ValueXY({x:0, y:0});

const fullAnimation = Animated.sequence([
    Animated.timing(boxTranslateValue, { toValue: { x:10, y:10 }, duration: 1000 }),
    Animated.timing(boxTranslateValue, { toValue: { x:20, y:20 }, duration: 1000 }), // <-- this one continues from {10,10} to {20 20}
]);
```

Now, if you replace your second translate animation for a loop (because you want to run in circle around a center point on `{ x: 15, y: 15 }` with a radius of 5) then loop will reset the initial point to `{ x: 0, y: 0 }` as the initial animation point instead of the expected previous known state.

> Code

```ts
const boxTranslateValue = Animated.ValueXY({x:0, y:0});

const fullAnimation = Animated.sequence([
    Animated.timing(boxTranslateValue, { toValue: { x:10, y:10 }, duration: 1000 }),
    Animated.loop(
        Animated.sequence([
            // The sequence is meaning to move the item from 10 to 20 and back constantly,
            // instead the animation is going to jump to {0,0}, translate to {20, 20} then back to {10,10}
            Animated.timing(boxTranslateValue, { toValue: { x:20, y:20 }, duration: 1000 })
            Animated.timing(boxTranslateValue, { toValue: { x:10, y:10 }, duration: 1000 })
        ]),
        { iterations: 50 }
    ),
]);
```

So... it is probably a hack, but I resorted to adding a second layer of the same item at the location I was interested to initiate the loop and transitioning the opacity of the two in a smooth way to prevent any blip in the animation.

### Static image sizes

Honestly, I do not understand why static images can not provide the default dimensions/size of the image. Instead, I had to hard code some of the sizes in order to recalculate location of each of the items to be animated...

Or so I thought...

Turns out there is a static method called [getSize](http://facebook.github.io/react-native/docs/image.html#getsize) which can retrieve the actual size of the image. I leave to the reader the activity of using this method to refactor the code... is interesting given the async nature of the API.

## Checking performance

Now, at the start of this exercise I created a series of resources with a pretty high resolution. Running the application in the simulator seemed pretty smooth, so I continued to add more layers and items to animate.

After a while, decided to test it on a 3 years old device and the animation does not provide any noticeable performance issue. Now... it was a different story when testing on an iPhone 5C (which has the same hardware as an iPhone 5... almost 5 years old)

The translate animation skipped frames constantly, especially on big objects such as the planet and the little prince...

But, why does the size of the resource matters?

Well... you are loading a bigger object and sampling it down and animating it. That requires some computation.

This is a performance issue that can be easily fixed as we can generate more appropriate resources preventing constant down sampling to generate a smaller image.

To understand a lot more about how to debug/understand performance issues I recommend reading:

- Facebook's [docos](https://facebook.github.io/react-native/docs/performance.html) to understand the small react native intrument set.
- Apple's [docos](https://developer.apple.com/library/content/documentation/DeveloperTools/Conceptual/debugging_with_xcode/chapters/special_debugging_workflows.html), a richer intrument set is provided by Apple (in the case you are debugging iOS).
- You might need to read as well Android's [docos](https://developer.android.com/studio/profile/index.html)

**Why do I need to read about native tooling?**

React Native hides some of the complexity of dealing with different systems, but does not hide everything. Sometimes is better to use a richer environment to understand where the problem might be.

## Fixing performance issues

For this animation in particular I had to do two minor changes:

1. Identify the animation with the performance issue and switch it to use the [native driver](https://facebook.github.io/react-native/blog/2017/02/14/using-native-driver-for-animated.html#how-do-i-use-this-in-my-app) when possible. This can improve the performance of your animation significantly if you are changing opacity or any kind of render transformation. It does not quite work on non-layout properties.
1. Help your app do less work. If I am loading images from resources, why was I loading a gigantic image? (because I wanted to run into this problem to learn how to solve it). For this particular case, the recommended fix is to switch to the `@2x` and `@3x` resources. React Native will automatically load the resource that is more appropriate for your pixel density/resolution and give it back to you. This one solves the problem even without using the native driver.
1. Identify if there are properties causing a rerender. Not long ago I read [this post](https://medium.com/@adamjacobb/react-native-performance-arrow-functions-binding-3f09cbd57545) and I can't really understand how `this.function = this.function.bind(this)` works in the javascript world although I understand the new function pointer side effect is generated only once.

I am sure there will be more performance issues I need to solve in the future... so far, under this experiment, those were the issues I've found.

## What does the end result look like?

![The little prince animation](./static/theLittlePrinceApp.gif)

But you know... less pixalated and slower animation as I end up adding a lot less frames to the gif version ;)

Enjoy!
