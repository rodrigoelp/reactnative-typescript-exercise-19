import { Platform } from "react-native";
import { Asset } from "./models";

export enum AppColors {
    Space = "#303746",
}

export const appFontFamily = Platform.select({
    ios: "Zapfino",
    android: "Roboto",
});

const globalScale = .24;

export const assets = {
    starsOld: new Asset(require("./assets/stars.png"), globalScale, globalScale, { width: 1682 , height: 2480 }),
    flickeringStars: new Asset(require("./assets/stars1.png"), globalScale, globalScale, { width: 1682 , height: 2480 }),
    stars: new Asset(require("./assets/stars2.png"), globalScale, globalScale, { width: 1682 , height: 2480 }),
    prince: new Asset(require("./assets/travelingPrince.png"), globalScale, globalScale, { width: 1264 , height: 1372 }),
    cloud: new Asset(require("./assets/sky.png"), .26, .26, { width: 1654 , height: 1260 }),
    world: new Asset(require("./assets/princeWorld.png"), globalScale, globalScale, { width: 1263 , height: 1100 }),
    planets: new Asset(require("./assets/planets.png"), globalScale, globalScale, { width: 382 , height: 299 }),
};