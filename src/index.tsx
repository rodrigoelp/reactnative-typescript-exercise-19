import * as React from "react";
import { AppRegistry, View, Dimensions, Image, ScaledSize, Animated, Text, Platform, ViewStyle, Easing, StyleSheet } from "react-native";
import { Button, Avatar } from "react-native-elements";
import { AssetSize, Asset, Point } from "./models";
import { AppColors, appFontFamily, assets } from "./visualSettings";

const window = Dimensions.get("window");
const designSize = { width: 1682 , height: 2480 }; // this was the canvas size of the image

interface AssetStyles {
    drawingArea: ViewStyle,
    storyArea: ViewStyle,
    messageArea: ViewStyle,
    finalArea: ViewStyle,
    stars: ViewStyle,
    tinkleStars: ViewStyle,
    cloud: ViewStyle,
    planet: ViewStyle,
    world: ViewStyle,
    prince: ViewStyle
}

interface AppShellState {
    message: string;
}

class AppShell extends React.Component<{}, AppShellState> {
    // properties dealing with the styles
    private assetStyles: AssetStyles;

    private introOpacityValue: Animated.Value;
    private introAreaTranslateValue: Animated.ValueXY;
    private flicker1OpacityValue: Animated.Value;
    private flicker2OpacityValue: Animated.Value;
    private flicker3OpacityValue: Animated.Value;
    private cloudOpacityValue: Animated.Value;
    private planetsOpacityValue: Animated.Value;
    private cloudTranslationValue: Animated.ValueXY;
    private worldTranslationValue: Animated.ValueXY;
    private planetsTranslationValue: Animated.ValueXY;
    private princeTranslationValue: Animated.ValueXY;
    private princeTranslationOpacityValue: Animated.Value;
    private princeHoveringValue: Animated.ValueXY;
    private princeHoveringOpacityValue: Animated.Value;
    private messageOpacityValue: Animated.Value;
    private messageValue: Animated.Value;
    private messageTranslateValue: Animated.ValueXY;
    private finalAreaOpacityValue: Animated.Value;
    private finalAreaTranslateValue: Animated.ValueXY;

    private ongoingAnimation?: Animated.CompositeAnimation;

    constructor(props: any) {
        super(props);
        this.state = { message: assets.messages[0] };

        const h = window.height, w = window.width;
        this.assetStyles = this.initialiseStyles(h, w);
        this.initialiseAssetsPosition(h, w);

        this.introOpacityValue = new Animated.Value(1);
        this.introAreaTranslateValue = new Animated.ValueXY({ x: 0, y: 0 });
        this.flicker1OpacityValue = new Animated.Value(0);
        this.flicker2OpacityValue = new Animated.Value(0);
        this.flicker3OpacityValue = new Animated.Value(0);
        this.cloudTranslationValue = new Animated.ValueXY(assets.cloud.initialPosition);
        this.cloudOpacityValue = new Animated.Value(0);
        this.worldTranslationValue = new Animated.ValueXY(assets.world.initialPosition);
        this.planetsOpacityValue = new Animated.Value(0);
        this.planetsTranslationValue = new Animated.ValueXY(assets.planets.initialPosition);
        this.princeTranslationValue = new Animated.ValueXY(assets.prince.initialPosition);
        this.princeTranslationOpacityValue = new Animated.Value(1);
        this.princeHoveringValue = new Animated.ValueXY(assets.prince.intendedPosition);
        this.princeHoveringOpacityValue = new Animated.Value(0);

        this.messageOpacityValue = new Animated.Value(0);
        this.messageTranslateValue = new Animated.ValueXY({ x: 0, y: 0 });
        this.messageValue = new Animated.Value(0);
        this.messageValue.addListener(({ value }) => {
            if (Number.isInteger(value) && value < assets.messages.length) {
                const message = assets.messages[value];
                this.setState({ ...this.state, message: message });
                this.messageTranslateValue.setValue({ x: 0, y: 0 });
            }
        });

        this.finalAreaOpacityValue = new Animated.Value(0);
        this.finalAreaTranslateValue = new Animated.ValueXY({ x: w, y: 0 });

        this.ongoingAnimation = undefined;
        // Apparently, the code below prevents multiple render invokes.
        this.restart = this.restart.bind(this);
        this.playStory = this.playStory.bind(this);
        this.animateMessage = this.animateMessage.bind(this);
    }

    public render() {
        const { fixedStars, flickeringStars1, flickeringStars2, flickeringStars3, planets, cloud, world, prince, cosmos } = assets;
        const opacityConfig: Animated.InterpolationConfigType = { inputRange: [0, 1], outputRange: [0, 1] };
        const introOpacity = this.introOpacityValue.interpolate(opacityConfig);
        const introTranslate = this.introAreaTranslateValue.getTranslateTransform();
        const planetsOpacity = this.planetsOpacityValue.interpolate(opacityConfig);
        const flicker1Opacity = this.flicker1OpacityValue.interpolate({ inputRange: [0, .5, 1], outputRange: [0, 1, 0] });
        const flicker2Opacity = this.flicker2OpacityValue.interpolate({ inputRange: [0, .2, .7, .9, 1], outputRange: [0, 1, 0, 1, 0] });
        const flicker3Opacity = this.flicker3OpacityValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] });
        const cloudOpacity = this.cloudOpacityValue.interpolate(opacityConfig);
        const cloudTransform = this.cloudTranslationValue.getTranslateTransform();
        const worldTransform = this.worldTranslationValue.getTranslateTransform();
        const planetTransform = this.planetsTranslationValue.getTranslateTransform();
        const landingPrinceTransform = this.princeTranslationValue.getTranslateTransform();
        const landingPrinceOpacity = this.princeTranslationOpacityValue.interpolate(opacityConfig)
        const hoveringPrinceTransform = this.princeHoveringValue.getTranslateTransform();
        const hoveringPrinceOpacity = this.princeHoveringOpacityValue.interpolate(opacityConfig);
        const messageOpacity = this.messageOpacityValue.interpolate(opacityConfig);
        const messateTranslate = this.messageTranslateValue.getTranslateTransform();
        const finalAreaTranslate = this.finalAreaTranslateValue.getTranslateTransform();
        const finalAreaOpacity = this.finalAreaOpacityValue.interpolate({
            inputRange: [0, .15, .3, .45, .60, .75, .90, 1],
            outputRange: [0, 1, 0, 1, 0, 1, 0, 1] // the intension is to make it pulse without having to write that as an animation.
        });

        return (
            <View style={styles.container}>
                <View style={this.assetStyles.storyArea}>
                    <Image source={cosmos.asset} style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, flex: 1, resizeMode: "stretch", opacity: 0.7 }} />
                    <View style={[this.assetStyles.drawingArea, styles.customPosition]}>
                        <Image source={fixedStars.asset} style={[styles.customPosition, this.assetStyles.stars]} />
                        <Animated.Image source={flickeringStars1.asset} style={[styles.customPosition, this.assetStyles.tinkleStars, { opacity: flicker1Opacity }]} />
                        <Animated.Image source={flickeringStars2.asset} style={[styles.customPosition, this.assetStyles.tinkleStars, { opacity: flicker2Opacity }]} />
                        <Animated.Image source={flickeringStars3.asset} style={[styles.customPosition, this.assetStyles.tinkleStars, { opacity: flicker3Opacity }]} />
                        <Animated.Image source={cloud.asset} style={[styles.customPosition, this.assetStyles.cloud, { opacity: cloudOpacity, transform: cloudTransform }]} />
                        <Animated.Image source={planets.asset} style={[styles.customPosition, this.assetStyles.planet, { opacity: planetsOpacity, transform: planetTransform }]} />
                        <Animated.Image source={world.asset} style={[styles.customPosition, this.assetStyles.world, { transform: worldTransform }]} />
                        <Animated.Image source={prince.asset} style={[styles.customPosition, this.assetStyles.prince, { transform: landingPrinceTransform, opacity: landingPrinceOpacity }]} />
                        <Animated.Image source={prince.asset} style={[styles.customPosition, this.assetStyles.prince, { transform: hoveringPrinceTransform, opacity: hoveringPrinceOpacity }]} />
                    </View>
                    <Animated.View style={[this.assetStyles.messageArea, styles.customPosition, { opacity: messageOpacity, transform: messateTranslate }]}>
                        <View style={{
                            flex: 1, backgroundColor: "#7080a0", borderRadius: 8, shadowColor: "#91dae5",
                            shadowRadius: 10, shadowOpacity: 0.5, margin: 22, padding: 8,
                            alignItems: "center", justifyContent: "center",
                        }}>
                            <Text style={{ color: "white", fontSize: 20, fontWeight: "200", textAlign: "center" }}>
                                {this.state.message}
                            </Text>
                        </View>
                    </Animated.View>
                    <Animated.View style={[this.assetStyles.finalArea, styles.customPosition, { opacity: finalAreaOpacity, transform: finalAreaTranslate }]}>
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", padding: 16 }}>
                            <Avatar onPress={this.restart} icon={{ name: "reload", type: "simple-line-icon" }}
                                rounded={true} large={true}
                                overlayContainerStyle={{ backgroundColor: "#8ad2c4", shadowColor: "black", shadowRadius: 8, shadowOpacity: 0.3 }} />
                        </View>
                    </Animated.View>
                </View>
                <Animated.View style={[styles.introArea, { opacity: introOpacity, transform: introTranslate }]}>
                    <View style={styles.introTextView}>
                        <Text style={styles.introTitle}>
                            Would you like to know about{"\n"}Le Petit Prince??
                        </Text>
                    </View>
                    <View style={styles.containerWithCentredItems}>
                        <Button title="Sure, why not" backgroundColor="#8ad2c4" borderRadius={8} iconRight={{ name: "question", type: "font-awesome" }} large={true} onPress={this.playStory} />
                    </View>
                </Animated.View>
            </View>
        );
    }

    private restart() {
        if (this.ongoingAnimation) {
            this.ongoingAnimation.stop();
            this.ongoingAnimation = undefined;
        }

        this.cloudTranslationValue.setValue(assets.cloud.initialPosition);
        this.planetsTranslationValue.setValue(assets.planets.initialPosition);
        this.worldTranslationValue.setValue(assets.world.initialPosition);
        this.princeTranslationValue.setValue(assets.prince.initialPosition);
        this.princeHoveringValue.setValue(assets.prince.intendedPosition);
        this.flicker1OpacityValue.setValue(0);
        this.flicker2OpacityValue.setValue(0);
        this.flicker3OpacityValue.setValue(0);
        this.cloudOpacityValue.setValue(0);
        this.planetsOpacityValue.setValue(0);
        this.princeTranslationOpacityValue.setValue(1);
        this.princeHoveringOpacityValue.setValue(0);

        this.introAreaTranslateValue.setValue({ x: 0, y: 0 });
        this.introOpacityValue.setValue(1);
        this.finalAreaTranslateValue.setValue({ x: window.width, y: 0 });
        this.finalAreaOpacityValue.setValue(0);
    }

    private playStory() {
        // So... What do I have planned for the animation?
        // First, get rid of the initial panel asking the question.
        //   This changes the opacity and moves it out of the way so the user can not click on it any more.
        // Then I want the stars to start flickering, messages start to pour on the screen
        // and the planets and clouds to pop from the side or the bottom.
        // At the very end, I want a panel to pop showing the restart button so the user is not stuck
        // there.

        this.ongoingAnimation =
            Animated.sequence([
                Animated.sequence([
                    // fading out the landing view.
                    Animated.timing(this.introOpacityValue, { toValue: 0, duration: 750, easing: Easing.linear }),
                    // moving it out of the way
                    Animated.timing(this.introAreaTranslateValue, { toValue: { x: window.width, y: 0 } })
                ]),
                // Starting the animations... I want the stars (some) to tinkle on the background
                // as the other animation is playing.
                Animated.parallel([
                    // Playing all the messages
                    Animated.sequence([
                        // the timing of the messages is going to be logically disconnected
                        // but we can do the math of when things are going to be displayed and code that in (or calculate it)
                        this.animateMessage({ messageId: 0, readingTime: 2500, delayBeforeStart: 300 }),
                        this.animateMessage({ messageId: 1, readingTime: 2500, delayBeforeStart: 2000 }),
                        this.animateMessage({ messageId: 2, readingTime: 4000, delayBeforeStart: 1000 }),
                        this.animateMessage({ messageId: 3, readingTime: 3000, delayBeforeStart: 4000 }),
                        this.animateMessage({ messageId: 4, readingTime: 4000, delayBeforeStart: 3000 }),
                        this.animateMessage({ messageId: 5, readingTime: 3500, delayBeforeStart: 2000 }),
                        this.animateMessage({ messageId: 6, readingTime: 3000, delayBeforeStart: 4000 }),
                        this.animateMessage({ messageId: 7, readingTime: 3000, delayBeforeStart: 2000 }),
                        this.animateMessage({ messageId: 8, readingTime: 3500, delayBeforeStart: 2000 }),
                        this.animateMessage({ messageId: 9, readingTime: 3500, delayBeforeStart: 2000 }),
                        this.animateMessage({ messageId: 10, readingTime: 4000, delayBeforeStart: 1000 }),
                        this.animateMessage({ messageId: 11, readingTime: 6000, delayBeforeStart: 3000, longDismiss: true }),
                    ]),
                    // tinkling stars
                    Animated.loop(Animated.timing(this.flicker1OpacityValue, { toValue: 1, duration: 5000, easing: Easing.linear }), { iterations: 2000 }),
                    Animated.loop(Animated.timing(this.flicker2OpacityValue, { toValue: 1, duration: 7000, easing: Easing.linear, delay: 1500 }), { iterations: 2000 }),
                    Animated.loop(Animated.timing(this.flicker3OpacityValue, { toValue: 1, duration: 11000, easing: Easing.linear, delay: 5000 }), { iterations: 1000 }),
                    // rest of the animation
                    Animated.sequence([
                        // Let's show the first message
                        // first, let's get the clouds to pop up.
                        Animated.parallel([
                            Animated.timing(this.cloudOpacityValue, { toValue: 1, duration: 1500, easing: Easing.linear, delay: 8000 }),
                            Animated.timing(this.cloudTranslationValue, { toValue: assets.cloud.intendedPosition, duration: 1500, easing: Easing.circle }),
                            // Next message
                        ]),
                        // the planets from the side would be a good idea as well...
                        Animated.parallel([
                            Animated.timing(this.planetsOpacityValue, { toValue: 1, duration: 1500, easing: Easing.linear, delay: 5500 }),
                            Animated.timing(this.planetsTranslationValue, { toValue: assets.planets.intendedPosition, duration: 2000, easing: Easing.bounce }),
                        ]),
                        // then, we need the planet hosting the rose (his love)
                        Animated.timing(this.worldTranslationValue, { toValue: assets.world.intendedPosition, duration: 4000, easing: Easing.linear, delay: 5000 }),
                        // finally, let's get the prince to drop from the sky onto the planet and hover there, looking to
                        // its beautiful rose.
                        Animated.sequence([
                            Animated.timing(this.princeTranslationValue, { toValue: assets.prince.intendedPosition, duration: 3000, easing: Easing.linear, delay: 7000 }),
                            Animated.parallel([
                                Animated.timing(this.princeTranslationOpacityValue, { toValue: 0, duration: 20, easing: Easing.linear }),
                                Animated.timing(this.princeHoveringOpacityValue, { toValue: 1, duration: 5, easing: Easing.linear }),
                            ]),
                            // for some reason loop does not allow me to set an initial state (nor picks up from the previous transformation)
                            // so I had to introduce another layer, with another prince that is going to be doing the hovering.
                            Animated.parallel([
                                Animated.loop(
                                    Animated.sequence([
                                        Animated.timing(this.princeHoveringValue, { toValue: { ...assets.prince.intendedPosition, y: assets.prince.intendedPosition.y - 10 }, duration: 500 }),
                                        Animated.timing(this.princeHoveringValue, { toValue: assets.prince.intendedPosition, duration: 500 }),
                                    ]),
                                    { iterations: 1000 }
                                ),
                                Animated.sequence([
                                    Animated.timing(this.finalAreaTranslateValue, { toValue: { x: 0, y: 0 }, delay: 18000 }),
                                    Animated.timing(this.finalAreaOpacityValue, { toValue: 1, duration: 2000, delay: 21000 }),
                                ]),
                            ]),
                        ]),
                    ])
                ])
            ]);
        this.ongoingAnimation.start();
    };

    private animateMessage(input: { messageId: number, readingTime: number, delayBeforeStart?: number, longDismiss?: boolean }) {
        const longDismissDuration = (input.longDismiss === undefined || input.longDismiss === false) ? 500 : 3000;
        const initialDelay = (input.delayBeforeStart === undefined) ? 0 : input.delayBeforeStart;
        return Animated.sequence([
            Animated.timing(this.messageValue, { toValue: input.messageId, duration: 10, delay: initialDelay }),
            Animated.parallel([
                Animated.timing(this.messageOpacityValue, { toValue: 1, duration: 500 }),
                Animated.timing(this.messageTranslateValue, { toValue: { x: 0, y: 20 }, duration: 500, easing: Easing.bounce }),
            ]),
            Animated.timing(this.messageOpacityValue, { toValue: 0, delay: input.readingTime, duration: longDismissDuration }),
        ]);
    }

    private initialiseStyles(height: number, width: number): AssetStyles {
        return {
            storyArea: { flex: 1, height, width },
            drawingArea: { flex: 1, height, width, transform: [{ translateY: height - assets.fixedStars.size.height }] },
            messageArea: { flex: 1, height: height / 3, width, backgroundColor: "transparent" },
            finalArea: { flex: 1, height: height, width, backgroundColor: "transparent" },
            stars: { height: assets.fixedStars.size.height, width: assets.fixedStars.size.width },
            tinkleStars: { height: assets.fixedStars.size.height, width: assets.fixedStars.size.width },
            cloud: { height: assets.cloud.size.height, width: assets.cloud.size.width },
            planet: { height: assets.planets.size.height, width: assets.planets.size.width },
            world: { height: assets.world.size.height, width: assets.world.size.width },
            prince: { height: assets.prince.size.height, width: assets.prince.size.width }
        };
    }

    private initialiseAssetsPosition(height: number, width: number) {
        // some of these magic numbers are based on the size of the images and where I want it to be presented.
        // Ideally, I should calculate it from elements on the screen.
        assets.cloud.initialPosition = { x: 0, y: height };
        assets.cloud.intendedPosition = { x: 0, y: assets.fixedStars.size.height - assets.cloud.size.height };
        assets.world.initialPosition = { x: -assets.world.size.width / 2, y: height };
        assets.world.intendedPosition = { x: 0, y: assets.fixedStars.size.height - assets.world.size.height };
        assets.planets.initialPosition = { x: width, y: (height - 180) - assets.planets.size.height };
        assets.planets.intendedPosition = { x: width - assets.planets.size.width, y: (height - 150) - assets.planets.size.height };
        assets.prince.initialPosition = { x: width, y: - assets.prince.size.height };
        assets.prince.intendedPosition = { x: 60, y: 22 };
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: AppColors.Space, },
    containerWithCentredItems: { alignItems: "center" },
    customPosition: { position: "absolute" },
    introArea: { flex: 1, marginBottom: 16, marginHorizontal: 16, backgroundColor: "transparent" },
    introTextView: { flex: 1, alignItems: "center", justifyContent: "center" },
    introTitle: { fontSize: 20, fontFamily: appFontFamily, textAlign: "center", textAlignVertical: "center", color: "white" }
});

AppRegistry.registerComponent("basicAnimations", () => AppShell);