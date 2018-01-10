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
    cloud: new Asset(require("./assets/clouds.png"), .26, .26, { width: 1473 , height: 1122 }),
    cosmos: new Asset(require("./assets/cosmos.png"), globalScale, globalScale, { width: 1473 , height: 2208 }),
    fixedStars: new Asset(require("./assets/stars2.png"), globalScale, globalScale, { width: 1473 , height: 2208 }),
    flickeringStars1: new Asset(require("./assets/stars1.png"), globalScale, globalScale, { width: 1473 , height: 2208 }),
    flickeringStars2: new Asset(require("./assets/stars3.png"), globalScale, globalScale, { width: 1473 , height: 2208 }),
    flickeringStars3: new Asset(require("./assets/stars4.png"), globalScale, globalScale, { width: 1473 , height: 2208 }),
    prince: new Asset(require("./assets/prince.png"), globalScale, globalScale, { width: 1126 , height: 1222 }),
    world: new Asset(require("./assets/world.png"), globalScale, globalScale, { width: 1125 , height: 980 }),
    planets: new Asset(require("./assets/planets.png"), globalScale, globalScale, { width: 342 , height: 267 }),
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