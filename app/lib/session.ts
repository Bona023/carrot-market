import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
    id?: number;
}

export default function getSession() {
    // iron-session 초기화
    return getIronSession<SessionContent>(cookies(), {
        cookieName: "carrot-cookie",
        password: process.env.COOKIE_PASSWORD!,
    }); //getIronSession(현재 쿠키,초기설정)
}
