import config from "../config.ts";
import postgre from "npm:postgres"

export default function report() {
    $dbh = postgre.connect(config as string);
} 