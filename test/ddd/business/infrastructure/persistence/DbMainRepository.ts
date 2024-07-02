import MainRepository from "../../domain/model/MainRepository.ts";
import Main from "../../domain/model/Main.ts";
import business from "../../config.ts";
import mongodb from "npm:mongodb^5.0"
import { escape } from "https://deno.land/std@0.224.0/regexp/escape.ts";
export default class DbMainRepository implements MainRepository {
    public save(main: Main) {
        mongodb.connect(escape(business as string));
    }
}