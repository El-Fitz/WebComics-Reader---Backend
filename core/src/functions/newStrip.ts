/*
 * @Author: Thomas Léger 
 * @Date: 2018-10-12 13:20:48 
 * @Last Modified by: Thomas Léger
 * @Last Modified time: 2018-10-12 13:46:01
 */

import { ComicNames, Comics, Comic } from "../models";
import { ComicsProvider } from "../providers";

export function handlePost(comicName: string, strip: object, provider: ComicsProvider): Promise<void> {
    const comicType = comicFrom(comicName);
    const comic = comicType.parse(comicName, strip);
    return provider.post(comic);
}

function comicFrom(comicName: string) {
    switch (comicName) {
        case ComicNames.xkcd: return Comics.XKCD;
        case ComicNames.questionnableContent: return Comics.QuestionnableContent;
        default: throw new Error("Unknow or unavailable Comic: " + comicName);
    }
}