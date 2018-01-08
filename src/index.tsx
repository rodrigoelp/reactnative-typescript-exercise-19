import * as React from "react";
import { AppRegistry, View, Dimensions, Image, ScaledSize, Animated, Text, Platform, ViewStyle, Easing, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { AssetSize, Asset, Point } from "./models";
import { AppColors, appFontFamily, assets } from "./visualSettings";

const window = Dimensions.get("window");
const designSize = { width: 1682 , height: 2480 }; // this was the canvas size of the image

interface AssetStyles {
    canvas: ViewStyle, stars: ViewStyle, tinkleStars: ViewStyle, cloud: ViewStyle, planet: ViewStyle, world: ViewStyle, prince: ViewStyle
}

class AppShell extends React.Component {
    // properties dealing with the styles
    private assetStyles: AssetStyles;

    private introOpacityValue: Animated.Value;
    private flickerOpacityValue: Animated.Value;
    private cloudOpacityValue: Animated.Value;
    private planetsOpacityValue: Animated.Value;
    private cloudTranslationValue: Animated.ValueXY;
    private worldTranslationValue: Animated.ValueXY;
    private planetsTranslationValue: Animated.ValueXY;
    private princeTranslationValue: Animated.ValueXY;
    private princeTranslationOpacityValue: Animated.Value;
    private princeHoveringValue: Animated.ValueXY;
    private princeHoveringOpacityValue: Animated.Value;

    constructor(props: any) {
        super(props);

        const h = window.height, w = window.width;
        this.assetStyles = this.initialiseStyles(h, w);
        this.initialiseAssetsPosition(h, w);

        this.introOpacityValue = new Animated.Value(1);
        this.flickerOpacityValue = new Animated.Value(1);
        this.cloudTranslationValue = new Animated.ValueXY(assets.cloud.initialPosition);
        this.cloudOpacityValue = new Animated.Value(0);
        this.worldTranslationValue = new Animated.ValueXY(assets.world.initialPosition);
        this.planetsOpacityValue = new Animated.Value(0);
        this.planetsTranslationValue = new Animated.ValueXY(assets.planets.initialPosition);
        this.princeTranslationValue = new Animated.ValueXY(assets.prince.initialPosition);
        this.princeTranslationOpacityValue = new Animated.Value(1);
        this.princeHoveringValue = new Animated.ValueXY(assets.prince.intendedPosition);
        this.princeHoveringOpacityValue = new Animated.Value(0);
    }

    public render() {
        const { stars, flickeringStars, starsOld, planets, cloud, world, prince } = assets;
        const opacityConfig: Animated.InterpolationConfigType = { inputRange: [0, 1], outputRange: [0, 1] };
        const planetsOpacity = this.planetsOpacityValue.interpolate(opacityConfig);
        const introOpacity = this.introOpacityValue.interpolate(opacityConfig);
        const flickerOpacity = this.flickerOpacityValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] });
        const cloudOpacity = this.cloudOpacityValue.interpolate(opacityConfig);
        const cloudTransform = this.cloudTranslationValue.getTranslateTransform();
        const worldTransform = this.worldTranslationValue.getTranslateTransform();
        const planetTransform = this.planetsTranslationValue.getTranslateTransform();
        const landingPrinceTransform = this.princeTranslationValue.getTranslateTransform();
        const landingPrinceOpacity = this.princeTranslationOpacityValue.interpolate(opacityConfig)
        const hoveringPrinceTransform = this.princeHoveringValue.getTranslateTransform();
        const hoveringPrinceOpacity = this.princeHoveringOpacityValue.interpolate(opacityConfig);

        return (
            <View style={styles.container}>
                <View style={this.assetStyles.canvas}>
                    <Image source={stars.asset} style={[styles.customPosition, this.assetStyles.stars]} />
                    <Animated.Image source={flickeringStars.asset} style={[styles.customPosition, this.assetStyles.tinkleStars, { opacity: flickerOpacity }]} />
                    <Animated.Image source={cloud.asset} style={[styles.customPosition, this.assetStyles.cloud, { opacity: cloudOpacity, transform: cloudTransform }]} />
                    <Animated.Image source={planets.asset} style={[styles.customPosition, this.assetStyles.planet, { opacity: planetsOpacity, transform: planetTransform }]} />
                    <Animated.Image source={world.asset} style={[styles.customPosition, this.assetStyles.world, { transform: worldTransform }]} />
                    <Animated.Image source={prince.asset} style={[styles.customPosition, this.assetStyles.prince, { transform: landingPrinceTransform, opacity: landingPrinceOpacity }]} />
                    <Animated.Image source={prince.asset} style={[styles.customPosition, this.assetStyles.prince, { transform: hoveringPrinceTransform, opacity: hoveringPrinceOpacity }]} />
                </View>
                <Animated.View style={[styles.introArea, { opacity: introOpacity }]}>
                    <View style={styles.introTextView}>
                        <Text style={styles.introTitle}>
                            Do you know{"\n"}who is{"\n"}Le Petit Prince??
                        </Text>
                    </View>
                    <View style={styles.containerWithCentredItems}>
                        <Button title="Sure, why not" backgroundColor="#8ad2c4" borderRadius={8} iconRight={{ name: "question", type: "font-awesome" }} large={true} onPress={this.showMeTheCharacter} />
                    </View>
                </Animated.View>
            </View>
        );
    }

    showMeTheCharacter = () => {
        this.introOpacityValue.setValue(1);
        this.cloudOpacityValue.setValue(0);
        this.planetsOpacityValue.setValue(0);
        this.flickerOpacityValue.setValue(0);

        Animated.sequence([
            // fading out the landing view.
            Animated.timing(this.introOpacityValue, { toValue: 0, duration: 750, easing: Easing.linear }),
            // Starting the animations... I want the stars (some) to tinkle on the background
            // as the other animation is playing.
            Animated.parallel([
                // tinkling stars
                Animated.loop(Animated.timing(this.flickerOpacityValue, { easing: Easing.linear, duration: 5000, toValue: 0 }), { iterations: 2000 }),
                // rest of the animation
                Animated.sequence([
                    // first, let's get the clouds to pop up.
                    Animated.parallel([
                        Animated.timing(this.cloudOpacityValue, { toValue: 1, duration: 1500, easing: Easing.linear }),
                        Animated.timing(this.cloudTranslationValue, { toValue: assets.cloud.intendedPosition, duration: 1500, easing: Easing.circle })
                    ]),
                    // the planets from the side would be a good idea as well...
                    Animated.parallel([
                        Animated.timing(this.planetsOpacityValue, { toValue: 1, duration: 1500, easing: Easing.linear }),
                        Animated.timing(this.planetsTranslationValue, { toValue: assets.planets.intendedPosition, duration: 2000, easing: Easing.bounce }),
                    ]),
                    // then, we need the planet hosting the rose (his love)
                    Animated.timing(this.worldTranslationValue, { toValue: assets.world.intendedPosition, duration: 4000, easing: Easing.linear }),
                    // finally, let's get the prince to drop from the sky onto the planet and hover there, looking to
                    // its beautiful rose.
                    Animated.sequence([
                        Animated.timing(this.princeTranslationValue, { toValue: assets.prince.intendedPosition, duration: 3000, easing: Easing.linear }),
                        Animated.parallel([
                            Animated.timing(this.princeTranslationOpacityValue, { toValue: 0, duration: 20, easing: Easing.linear }),
                            Animated.timing(this.princeHoveringOpacityValue, { toValue: 1, duration: 5, easing: Easing.linear }),
                        ]),
                        // for some reason loop does not allow me to set an initial state (nor picks up from the previous transformation)
                        // so I had to introduce another layer, with another prince that is going to be doing the hovering.
                        Animated.loop(
                            Animated.sequence([
                                Animated.timing(this.princeHoveringValue, { toValue: { ...assets.prince.intendedPosition, y: assets.prince.intendedPosition.y - 10 }, duration: 500 }),
                                Animated.timing(this.princeHoveringValue, { toValue: assets.prince.intendedPosition, duration: 500 }),
                            ]),
                            { iterations: 1000 }
                        ),
                    ]),
                ])
            ])
        ]).start();
    };

    private initialiseStyles(height: number, width: number): AssetStyles {
        return {
            canvas: { flex: 1, height, width, transform: [{ translateY: height - assets.stars.size.height }] },
            stars: { height: assets.stars.size.height, width: assets.stars.size.width },
            tinkleStars: { height: assets.flickeringStars.size.height, width: assets.flickeringStars.size.width },
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
        assets.cloud.intendedPosition = { x: 0, y: assets.stars.size.height - assets.cloud.size.height };
        assets.world.initialPosition = { x: -assets.world.size.width / 2, y: height };
        assets.world.intendedPosition = { x: 0, y: assets.stars.size.height - assets.world.size.height };
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