/*
 * @Author: Thomas Léger 
 * @Date: 2018-10-12 13:20:35 
 * @Last Modified by:   Thomas Léger 
 * @Last Modified time: 2018-10-12 13:20:35 
 */

import { Comic } from "../models";

export interface ComicsProvider {
	getLatestStripFor(comicName: string): Promise<Comic>;
	getStripsFor(comicName: string): Promise<Comic[]>;
	post(comic: Comic): Promise<void>;
}