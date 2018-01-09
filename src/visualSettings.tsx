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
    flickeringStars1: new Asset(require("./assets/stars1.png"), globalScale, globalScale, { width: 1682 , height: 2480 }),
    flickeringStars2: new Asset(require("./assets/stars3.png"), globalScale, globalScale, { width: 1682 , height: 2480 }),
    flickeringStars3: new Asset(require("./assets/stars4.png"), globalScale, globalScale, { width: 1682 , height: 2480 }),
    fixedStars: new Asset(require("./assets/stars2.png"), globalScale, globalScale, { width: 1682 , height: 2480 }),
    prince: new Asset(require("./assets/travelingPrince.png"), globalScale, globalScale, { width: 1264 , height: 1372 }),
    cloud: new Asset(require("./assets/sky.png"), .26, .26, { width: 1654 , height: 1260 }),
    world: new Asset(require("./assets/princeWorld.png"), globalScale, globalScale, { width: 1263 , height: 1100 }),
    planets: new Asset(require("./assets/planets.png"), globalScale, globalScale, { width: 382 , height: 299 }),
    messages: [
        "This is the story of a little space child",
        "That became my acquaintance... \n\nMy friend.",
        "Little did I know... \nHe was hitchhiking shooting stars...\nGoing from planet to planet",
        "His planet had a rose which he loved very much...",
        "But left it behind looking for a way to stop baobab trees",
        "Those were destroying his planet and irritating the rose.",
        "He met several grown-ups on his journey...",
        "'Grown-ups are very very odd!' he said...",
        "After a while...\nHe wanted to go back but was unable to...",
        "So he asked for help of a snake \n\n'Release me from my body so I can go to my rose.'",
        "He said farewell to me and soundlessly the snake fulfilled his wish.",
        "I always look up at the stars, remembering his lovable laughter."
    ],
};