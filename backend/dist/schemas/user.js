"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const zod_1 = require("zod");
exports.UserSchema = zod_1.z.object({
    profile_picture: zod_1.z.string().url().optional(),
    name: zod_1.z.string().min(1),
    username: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    score: zod_1.z.number().int().default(0),
    password: zod_1.z.string(),
    lastLogInDate: zod_1.z.date().default(() => new Date()),
    match_played: zod_1.z.number().int().default(0),
    match_failed: zod_1.z.number().int().default(0),
    match_win: zod_1.z.number().int().default(0),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().default(() => new Date()),
});
