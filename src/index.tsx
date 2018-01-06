import * as React from "react";
import { AppRegistry, View, Dimensions, Image, ScaledSize, Animated, Text, Platform, ViewStyle, Easing, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

interface AssetSize { height: number, width: number }

class Asset {
    private _originalSize: AssetSize;

    public asset: any;
    public size: AssetSize;
    public location: Animated.ValueXY;

    constructor(resource: any, scaleX: number, scaleY: number, imgSize: AssetSize) {
        this.asset = resource;

        this._originalSize = imgSize;
        this.size = { height: imgSize.height * scaleY, width: imgSize.width * scaleX };
        this.location = new Animated.ValueXY({ x: 0, y: 0 });
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

    private introOpacityValue: Animated.Value;
    private flickerOpacityValue: Animated.Value;
    private worldOpacityValue: Animated.Value;
    private princeOpacityValue: Animated.Value;
    private cloudOpacityValue: Animated.Value;
    private planetsOpacityValue: Animated.Value;

    constructor(props: any) {
        super(props);

        const starsOld = new Asset(require("./assets/stars.png"), globalScale, globalScale, { width: 1682 , height: 2480 });
        const flickeringStars = new Asset(require("./assets/stars1.png"), globalScale, globalScale, { width: 1682 , height: 2480 });
        const stars = new Asset(require("./assets/stars2.png"), globalScale, globalScale, { width: 1682 , height: 2480 });
        const planets = new Asset(require("./assets/planets.png"), globalScale, globalScale, { width: 382 , height: 299 });
        const cloud = new Asset(require("./assets/sky.png"), .26, .26, { width: 1654 , height: 1260 });
        const world = new Asset(require("./assets/princeWorld.png"), globalScale, globalScale, { width: 1263 , height: 1100 });
        const prince = new Asset(require("./assets/travelingPrince.png"), globalScale, globalScale, { width: 1264 , height: 1372 });

        const h = window.height, w = window.width;
        this.canvasStyle = { flex: 1, height: h, width: w, transform: [{ translateY: h - stars.size.height }] };
        this.starsStyle = { height: stars.size.height, width: stars.size.width };
        this.flickeringStarsStyle = { height: flickeringStars.size.height, width: flickeringStars.size.width };
        this.cloudStyle = { height: cloud.size.height, width: cloud.size.width, transform: [{ translateX: 0 }, { translateY: stars.size.height - cloud.size.height }], };
        this.worldStyle = { height: world.size.height, width: world.size.width, transform: [{ translateX: 0 }, { translateY: stars.size.height - world.size.height }], };
        this.planetStyle = { height: planets.size.height, width: planets.size.width, transform: [{ translateX: w - planets.size.width }, { translateY: (h - 150) - planets.size.height }], };
        this.princeStyle = { height: prince.size.height, width: prince.size.width, transform: [{ translateX: 60 }, { translateY: 22 }], };

        this.introOpacityValue = new Animated.Value(1);
        this.flickerOpacityValue = new Animated.Value(1);
        this.worldOpacityValue = new Animated.Value(0);
        this.cloudOpacityValue = new Animated.Value(0);
        this.princeOpacityValue = new Animated.Value(0);
        this.planetsOpacityValue = new Animated.Value(0);

        this.state = {
            // definiting assets
            starsOld, stars, flickeringStars, planets, prince, cloud, world
        };
    }

    public render() {
        const { stars, flickeringStars, starsOld, planets, cloud, world, prince } = this.state;
        const princeOpacity = this.princeOpacityValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
        const worldOpacity = this.worldOpacityValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
        const cloudOpacity = this.cloudOpacityValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
        const planetsOpacity = this.planetsOpacityValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
        const introOpacity = this.introOpacityValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
        const flickerOpacity = this.flickerOpacityValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] });

        return (
            <View style={styles.container}>
                <View style={this.canvasStyle}>
                    <Image source={stars.asset} style={[styles.customPosition, this.starsStyle]} />
                    <Animated.Image source={flickeringStars.asset} style={[styles.customPosition, this.flickeringStarsStyle]} />
                    <Animated.Image source={cloud.asset} style={[styles.customPosition, this.cloudStyle, { opacity: cloudOpacity }]} />
                    <Animated.Image source={world.asset} style={[styles.customPosition, this.worldStyle, { opacity: worldOpacity }]} />
                    <Animated.Image source={planets.asset} style={[styles.customPosition, this.planetStyle, { opacity: planetsOpacity }]} />
                    <Animated.Image source={prince.asset} style={[styles.customPosition, this.princeStyle, { opacity: princeOpacity }]} />
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
        this.princeOpacityValue.setValue(0);
        this.worldOpacityValue.setValue(0);
        this.cloudOpacityValue.setValue(0);
        this.planetsOpacityValue.setValue(0);
        this.flickerOpacityValue.setValue(0);

        Animated.parallel([
            Animated.timing(this.introOpacityValue, { toValue: 0, duration: 2000, easing: Easing.linear }),
            Animated.loop(Animated.timing(this.flickerOpacityValue, { easing: Easing.linear, duration: 5000, toValue: 0 }), { iterations: 6000 }),
            Animated.sequence([
                Animated.timing(this.planetsOpacityValue, { toValue: 1, duration: 1000, easing: Easing.exp }),
                Animated.timing(this.cloudOpacityValue, { toValue: 1, duration: 1000, easing: Easing.exp }),
                Animated.timing(this.worldOpacityValue, { toValue: 1, duration: 1000, easing: Easing.exp }),
                Animated.timing(this.princeOpacityValue, { toValue: 1, duration: 1000, easing: Easing.exp }),
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