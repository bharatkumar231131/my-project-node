import env from "dotenv";
env.config();
import { init } from "./server/index.js";
import cluster from "cluster";
import { } from './models/index.js';

if (cluster.isPrimary) {
    for (let i = 1; i <= process.env.CPU; i++) {
        cluster.fork();
    }
} else {
    init();
}