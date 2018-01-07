import * as React from "react";
import { AppRegistry, View, Dimensions, Image, ScaledSize, Animated, Text, Platform, ViewStyle, Easing, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

interface AssetSize { height: number, width: number }
interface Point { x: number, y: number };

class Asset {
    private _originalSize: AssetSize;

    public asset: any;
    public size: AssetSize;
    public initialPosition: Point;
    public intendedPosition: Point;

    constructor(resource: any, scaleX: number, scaleY: number, imgSize: AssetSize, initialPos: Point = { x: 0, y: 0 }, intendedPos: Point = { x: 0, y: 0 }) {
        this.asset = resource;

        this._originalSize = imgSize;
        this.size = { height: imgSize.height * scaleY, width: imgSize.width * scaleX };
        this.initialPosition = initialPos;
        this.intendedPosition = intendedPos;
    }
}

const window = Dimensions.get("window");
const designSize = { width: 1682 , height: 2480 }; // this was the canvas size of the image
const scaleX = window.width / designSize.width;
const scaleY = window.height / designSize.height;
const globalScale = .24;

enum AppColors {
    Space = "#303746",
}

const appFontFamily = Platform.select({
    ios: "Zapfino",
    android: "Roboto",
});

interface AppShellState {
    starsOld: Asset;
    stars: Asset;
    flickeringStars: Asset;
    planets: Asset;
    cloud: Asset;
    world: Asset;
    prince: Asset;
}

class AppShell extends React.Component<{}, AppShellState> {
    // properties dealing with the styles
    private canvasStyle: ViewStyle;
    private starsStyle: ViewStyle;
    private flickeringStarsStyle: ViewStyle;
    private cloudStyle: ViewStyle;
    private worldStyle: ViewStyle;
    private planetStyle: ViewStyle;
    private princeStyle: ViewStyle;

    private cloud: Asset;
    private world: Asset;
    private planets: Asset;
    private prince: Asset;

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

        const starsOld = new Asset(require("./assets/stars.png"), globalScale, globalScale, { width: 1682 , height: 2480 });
        const flickeringStars = new Asset(require("./assets/stars1.png"), globalScale, globalScale, { width: 1682 , height: 2480 });
        const stars = new Asset(require("./assets/stars2.png"), globalScale, globalScale, { width: 1682 , height: 2480 });
        this.prince = new Asset(require("./assets/travelingPrince.png"), globalScale, globalScale, { width: 1264 , height: 1372 });
        this.cloud = new Asset(require("./assets/sky.png"), .26, .26, { width: 1654 , height: 1260 });
        this.world = new Asset(require("./assets/princeWorld.png"), globalScale, globalScale, { width: 1263 , height: 1100 });
        this.planets = new Asset(require("./assets/planets.png"), globalScale, globalScale, { width: 382 , height: 299 });

        const h = window.height, w = window.width;
        this.canvasStyle = { flex: 1, height: h, width: w, transform: [{ translateY: h - stars.size.height }] };
        this.starsStyle = { height: stars.size.height, width: stars.size.width };
        this.flickeringStarsStyle = { height: flickeringStars.size.height, width: flickeringStars.size.width };
        this.cloudStyle = { height: this.cloud.size.height, width: this.cloud.size.width };
        this.planetStyle = { height: this.planets.size.height, width: this.planets.size.width };
        this.princeStyle = { height: this.prince.size.height, width: this.prince.size.width };
        this.worldStyle = { height: this.world.size.height, width: this.world.size.width };

        this.cloud.initialPosition = { x: 0, y: h };
        this.cloud.intendedPosition = { x: 0, y: stars.size.height - this.cloud.size.height };

        this.world.initialPosition = { x: -30, y: h };
        this.world.intendedPosition = { x: 0, y: stars.size.height - this.world.size.height };

        this.planets.initialPosition = { x: w, y: (h - 180) - this.planets.size.height };
        this.planets.intendedPosition = { x: w - this.planets.size.width, y: (h - 150) - this.planets.size.height };

        this.prince.initialPosition = { x: w, y: - this.prince.size.height };
        this.prince.intendedPosition = { x: 60, y: 22 };

        this.introOpacityValue = new Animated.Value(1);
        this.flickerOpacityValue = new Animated.Value(1);
        this.cloudTranslationValue = new Animated.ValueXY(this.cloud.initialPosition);
        this.cloudOpacityValue = new Animated.Value(0);
        this.worldTranslationValue = new Animated.ValueXY(this.world.initialPosition);
        this.planetsOpacityValue = new Animated.Value(0);
        this.planetsTranslationValue = new Animated.ValueXY(this.planets.initialPosition);
        this.princeTranslationValue = new Animated.ValueXY(this.prince.initialPosition);
        this.princeTranslationOpacityValue = new Animated.Value(1);
        this.princeHoveringValue = new Animated.ValueXY(this.prince.intendedPosition);
        this.princeHoveringOpacityValue = new Animated.Value(0);

        this.state = {
            // definiting assets
            starsOld, stars, flickeringStars, planets: this.planets, prince: this.prince, cloud: this.cloud, world: this.world
        };
    }

    public render() {
        const { stars, flickeringStars, starsOld, planets, cloud, world, prince } = this.state;
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
                <View style={this.canvasStyle}>
                    <Image source={stars.asset} style={[styles.customPosition, this.starsStyle]} />
                    <Animated.Image source={flickeringStars.asset} style={[styles.customPosition, this.flickeringStarsStyle, { opacity: flickerOpacity }]} />
                    <Animated.Image source={cloud.asset} style={[styles.customPosition, this.cloudStyle, { opacity: cloudOpacity, transform: cloudTransform }]} />
                    <Animated.Image source={world.asset} style={[styles.customPosition, this.worldStyle, { transform: worldTransform }]} />
                    <Animated.Image source={planets.asset} style={[styles.customPosition, this.planetStyle, { opacity: planetsOpacity, transform: planetTransform }]} />
                    <Animated.Image source={prince.asset} style={[styles.customPosition, this.princeStyle, { transform: landingPrinceTransform, opacity: landingPrinceOpacity }]} />
                    <Animated.Image source={prince.asset} style={[styles.customPosition, this.princeStyle, { transform: hoveringPrinceTransform, opacity: hoveringPrinceOpacity }]} />
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
            Animated.timing(this.introOpacityValue, { toValue: 0, duration: 1500, easing: Easing.linear }),
            Animated.parallel([
                Animated.loop(Animated.timing(this.flickerOpacityValue, { easing: Easing.linear, duration: 5000, toValue: 0 }), { iterations: 6000 }),
                Animated.sequence([
                    Animated.parallel([
                        Animated.timing(this.cloudOpacityValue, { toValue: 1, duration: 1500, easing: Easing.linear }),
                        Animated.timing(this.cloudTranslationValue, { toValue: this.cloud.intendedPosition, duration: 1500, easing: Easing.circle })
                    ]),
                    Animated.parallel([
                        Animated.timing(this.planetsOpacityValue, { toValue: 1, duration: 1500, easing: Easing.exp }),
                        Animated.timing(this.planetsTranslationValue, { toValue: this.planets.intendedPosition, duration: 2000, easing: Easing.bounce }),
                    ]),
                    Animated.timing(this.worldTranslationValue, { toValue: this.world.intendedPosition, duration: 2000, easing: Easing.ease }),
                    Animated.sequence([
                        Animated.timing(this.princeTranslationValue, { toValue: this.prince.intendedPosition, duration: 3000, easing: Easing.linear }),
                        Animated.parallel([
                            Animated.timing(this.princeTranslationOpacityValue, { toValue: 0, duration: 20, easing: Easing.linear }),
                            Animated.timing(this.princeHoveringOpacityValue, { toValue: 1, duration: 5, easing: Easing.linear }),
                        ]),
                        // for some reason loop does not allow me to set an initial state (nor picks up from the previous transformation)
                        // so I had to introduce another layer, with another prince that is going to be doing the hovering.
                        Animated.loop(
                            Animated.sequence([
                                Animated.timing(this.princeHoveringValue, { toValue: { ...this.prince.intendedPosition, y: this.prince.intendedPosition.y - 10 }, duration: 500 }),
                                Animated.timing(this.princeHoveringValue, { toValue: this.prince.intendedPosition, duration: 500 }),
                            ]),
                            { iterations: 1000 }
                        ),
                    ]),
                ])
            ])
        ]).start();
    };
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