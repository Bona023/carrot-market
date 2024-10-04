import getSession from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

interface Routes {
    [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
    "/choose": true,
    "/login": true,
    "/sms": true,
    "/create-account": true,
};

export async function middleware(request: NextRequest) {
    const session = await getSession();
    const exists = publicOnlyUrls[request.nextUrl.pathname];
    if (!session.id) {
        if (!exists) {
            return NextResponse.redirect(new URL("/choose", request.url));
        }
    } else {
        if (exists) {
            return NextResponse.redirect(new URL("/products", request.url));
        }
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
