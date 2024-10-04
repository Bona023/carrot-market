"use server";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkPassword = ({ password, confirmPassword }: { password: string; confirmPassword: string }) => password === confirmPassword;
/* 비번 정규식
const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/);
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
/^(소문자포함)(대문자포함)(숫자포함)(특수문자포함).+$/
*/

/*
const checkUniqueUsername = async (username: string) => {
    // 이미 가입한 username인지 확인
    const user = await db.user.findUnique({
        where: {
            username,
        },
        select: {
            // user 정보 중 가져올 데이터 선별
            id: true,
        },
    });
    //if (user) {
    //    return false
    //} else {
    //    return true
    //} 위 코드를 좀 더 간단하게 작성하자면 아래 코드가 된다.
    return !Boolean(user);
};
const checkUniqueEmail = async (email: string) => {
    // 이미 가입한 email인지 확인
    const user = await db.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });
    return !Boolean(user);
};
*/
const formSchema = z
    .object({
        username: z
            .string({ invalid_type_error: "Username은 텍스트여야 합니다.", required_error: "Username 입력은 필수 입니다." })
            .min(3, "3글자 이상 입력해주세요.")
            .max(20, "20글자 이하로 입력해주세요.")
            .trim(),
        //.refine(checkUniqueUsername, "사용 중인 username 입니다."),
        email: z.string().email(),
        //.refine(checkUniqueEmail, "이미 가입한 email 입니다."),
        password: z.string().min(3, "3글자 이상 입력해주세요."),
        confirmPassword: z.string(),
    })
    .superRefine(async ({ username }, ctx) => {
        //.suerRefine((검사할 값 맨위에 .object({}), RefinementCtx))
        // RefinementCtx == 에러묶음
        const user = await db.user.findUnique({
            where: { username },
            select: { id: true },
        });
        if (user) {
            ctx.addIssue({
                code: "custom",
                message: "이미 사용 중인 username 입니다.",
                path: ["username"],
                fatal: true,
            });
            return z.NEVER;
        }
    })
    .superRefine(async ({ email }, ctx) => {
        const user = await db.user.findUnique({
            where: { email },
            select: { id: true },
        });
        if (user) {
            ctx.addIssue({
                code: "custom",
                message: "이미 사용 중인 email 입니다.",
                path: ["email"],
                fatal: true,
            });
            return z.NEVER;
        }
    })
    .refine(checkPassword, { message: "Password와 Confirm Password는 동일해야 합니다.", path: ["confirmPassword"] });

export async function createAccount(prevState: any, formData: FormData) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    };
    const result = await formSchema.safeParseAsync(data);
    /* safeParseAsync 
    => checkUniqueUsername, checkUniqueEmail 모두 async와 await를 가지고 있으므로
    Zod도 checkUniqueUsername, checkUniqueEmail를 체크할 때 await를 하도록 
    해야 한다. 이를 위해서 .safeParse를 .safeParseAsync 메소드로 바꿔야 한다. 
    safeParseAsync를 사용하기 위해서는 앞에 await를 붙여야 한다. */
    if (!result.success) {
        //console.log(result.error.flatten());
        return result.error.flatten();
    } else {
        // 1. hash password
        // : 1234 => hashFunction(1234) => s-dkjd907(무작위문자열)
        // hash함수는 단방향 함수이다
        // 위와 반대 방향으로는 안됨 hashFunction(s-dkjd907) => 1234 (X)
        const hashedPassword = await bcrypt.hash(result.data.password, 12);
        // bcrypt.hash(hash할 데이터, 해싱 알고리즘 실행 횟수)

        // 2. 데이터베이스에 저장
        const user = await db.user.create({
            data: {
                username: result.data.username,
                email: result.data.email,
                password: hashedPassword,
            },
            select: {
                id: true,
            },
        });

        // 3. user 로그인 시키기
        const session = await getSession();
        session.id = user.id;
        await session.save();
        // home으로 redirect
        redirect("/profile");
    }
}
