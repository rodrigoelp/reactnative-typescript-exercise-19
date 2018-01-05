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
    starsFlickering: Asset;
    planets: Asset;
    sky: Asset;
    world: Asset;
    prince: Asset;
}

class AppShell extends React.Component<{}, AppShellState> {
    private canvasOpacity2: Animated.Value;

    constructor(props: any) {
        super(props);

        this.canvasOpacity2 = new Animated.Value(0);

        this.state = {
            // definiting assets
            starsOld: new Asset(require("./assets/stars.png"), globalScale, globalScale, { width: 1682 , height: 2480 }),
            starsFlickering: new Asset(require("./assets/stars1.png"), globalScale, globalScale, { width: 1682 , height: 2480 }),
            stars: new Asset(require("./assets/stars2.png"), globalScale, globalScale, { width: 1682 , height: 2480 }),
            planets: new Asset(require("./assets/planets.png"), globalScale, globalScale, { width: 382 , height: 299 }),
            sky: new Asset(require("./assets/sky.png"), .26, .26, { width: 1654 , height: 1260 }),
            world: new Asset(require("./assets/princeWorld.png"), globalScale, globalScale, { width: 1263 , height: 1100 }),
            prince: new Asset(require("./assets/travelingPrince.png"), globalScale, globalScale, { width: 1264 , height: 1372 }),
        };
    }

    public render() {
        const h = window.height, w = window.width;
        const { stars, starsFlickering, starsOld, planets, sky, world, prince } = this.state;
        // defining some of the styles.
        const canvasStyle: ViewStyle = { flex: 1, height: h, width: w, transform: [{ translateY: h - stars.size.height }] };
        const starsStyle: ViewStyle = { height: stars.size.height, width: stars.size.width };
        const flickeringStarStyle: ViewStyle = { height: starsFlickering.size.height, width: starsFlickering.size.width };
        const skyStyle: ViewStyle = { height: sky.size.height, width: sky.size.width, transform: [{ translateX: 0 }, { translateY: stars.size.height - sky.size.height }], };
        const worldStyle: ViewStyle = { height: world.size.height, width: world.size.width, transform: [{ translateX: 0 }, { translateY: stars.size.height - world.size.height }], };
        const planetStyle: ViewStyle = { height: planets.size.height, width: planets.size.width, transform: [{ translateX: w - planets.size.width }, { translateY: (h - 150) - planets.size.height }], };
        const princeStyle: ViewStyle = { height: prince.size.height, width: prince.size.width, transform: [{ translateX: 60 }, { translateY: 22 }], };

        // unfortunately, typescript definition does not accept the animated types, meaning we need to do this hack while that is fixed.
        return (
            <View style={styles.container}>
                <View style={canvasStyle}>
                    <Image source={stars.asset} style={[styles.customPosition , starsStyle]} />
                    <Image source={starsFlickering.asset} style={[styles.customPosition, flickeringStarStyle]} />
                    <Animated.Image source={sky.asset} style={[styles.customPosition, skyStyle]} />
                    <Image source={world.asset} style={[styles.customPosition, worldStyle]} />
                    <Image source={planets.asset} style={[styles.customPosition, planetStyle]} />
                    <Image source={prince.asset} style={[styles.customPosition, princeStyle]} />
                </View>
                <View style={[styles.starterArea]}>
                    <View style={styles.starterTextView}>
                        <Text style={styles.starterTitle}>
                            Do you know{"\n"}who is{"\n"}Le Petit Prince??
                        </Text>
                    </View>
                    <View style={styles.containerWithCentredItems}>
                        <Button title="Sure, why not" backgroundColor="#8ad2c4" borderRadius={8} iconRight={{ name: "question", type: "font-awesome" }} large={true} onPress={this.showMeTheCharacter} />
                    </View>
                </View>
            </View>
        );
    }

    showMeTheCharacter = () => {
        this.canvasOpacity2.setValue(0);
        Animated.timing(
            this.canvasOpacity2,
            {
                toValue: 1,
                duration: 1500,
                easing: Easing.bounce
            }
        ).start();
    };
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: AppColors.Space, },
    containerWithCentredItems: { alignItems: "center" },
    customPosition: { position: "absolute" },
    starterArea: { flex: 1, marginBottom: 16, marginHorizontal: 16, backgroundColor: "transparent" },
    starterTextView: { flex: 1, alignItems: "center", justifyContent: "center" },
    starterTitle: { fontSize: 20, fontFamily: appFontFamily, textAlign: "center", textAlignVertical: "center", color: "white" }
});

AppRegistry.registerComponent("basicAnimations", () => AppShell);