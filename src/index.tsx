import * as React from "react";
import { AppRegistry, View, Dimensions, Image, ScaledSize, Animated, Text, Platform } from "react-native";
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
    // all: Asset;
    canvasOpacity: number;
    starterOpacity: number;
}

class AppShell extends React.Component<{}, AppShellState> {
    constructor(props: any) {
        super(props);

        this.state = {
            // definiting assets
            starsOld: new Asset(require("./assets/stars.png"), globalScale, globalScale, { width: 1682 , height: 2480 }),
            starsFlickering: new Asset(require("./assets/stars1.png"), globalScale, globalScale, { width: 1682 , height: 2480 }),
            stars: new Asset(require("./assets/stars2.png"), globalScale, globalScale, { width: 1682 , height: 2480 }),
            planets: new Asset(require("./assets/planets.png"), globalScale, globalScale, { width: 382 , height: 299 }),
            sky: new Asset(require("./assets/sky.png"), .26, .26, { width: 1654 , height: 1260 }),
            world: new Asset(require("./assets/princeWorld.png"), globalScale, globalScale, { width: 1263 , height: 1100 }),
            prince: new Asset(require("./assets/travelingPrince.png"), globalScale, globalScale, { width: 1264 , height: 1372 }),
            // all: new Asset(require("./assets/fullImage.png"), scaleX, scaleY, { width: 1682 , height: 2480 }),

            // animation attributes
            canvasOpacity: 0,
            starterOpacity: 1,
        };
    }

    public render() {
        const h = window.height, w = window.width;
        const { stars, starsFlickering, starsOld, planets, sky, world, prince } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: AppColors.Space, }}>
                <View style={{ flex: 1, position: "absolute", height: h, width: w, transform: [{ translateY: h - stars.size.height }] }}>
                    <Image source={stars.asset}
                        style={{ position: "absolute", height: stars.size.height, width: stars.size.width }}
                    />
                    <Image source={starsFlickering.asset}
                        style={{ position: "absolute", height: starsFlickering.size.height, width: starsFlickering.size.width }}
                    />
                    <Image source={sky.asset}
                        style={{
                            position: "absolute",
                            height: sky.size.height, width: sky.size.width,
                            transform: [{ translateX: 0 }, { translateY: stars.size.height - sky.size.height }],
                            opacity: this.state.canvasOpacity
                        }}
                    />
                    <Image source={world.asset}
                        style={{
                            position: "absolute",
                            height: world.size.height, width: world.size.width,
                            transform: [{ translateX: 0 }, { translateY: stars.size.height - world.size.height }],
                            opacity: this.state.canvasOpacity
                        }}
                    />
                    <Image source={planets.asset}
                        style={{
                            position: "absolute",
                            height: planets.size.height, width: planets.size.width,
                            transform: [{ translateX: w - planets.size.width }, { translateY: (h - 150) - planets.size.height }],
                            opacity: this.state.canvasOpacity
                        }}
                    />
                    <Image source={prince.asset}
                        style={{
                            position: "absolute",
                            height: prince.size.height, width: prince.size.width,
                            transform: [{ translateX: 60 }, { translateY: 22 }],
                            opacity: this.state.canvasOpacity
                        }}
                    />
                </View>
                <View style={{ flex: 1, marginBottom: 16, marginHorizontal: 16, backgroundColor: "transparent", opacity: this.state.starterOpacity }}>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 20, fontFamily: appFontFamily, textAlign: "center", color: "white" }}>
                            Do you know{"\n"}who is{"\n"}Le Petit Prince??
                        </Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Button title="Sure, why not" backgroundColor="#8ad2c4" borderRadius={8} iconRight={{ name: "question", type: "font-awesome" }} large={true} onPress={this.showMeTheCharacter} />
                    </View>
                </View>
            </View>
        );
    }

    showMeTheCharacter = () => {
        this.setState({
            ...this.state,
            canvasOpacity: 1,
            starterOpacity: 0
        });
    };
}

AppRegistry.registerComponent("basicAnimations", () => AppShell);