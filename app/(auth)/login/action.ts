"use server";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

//const checkEmail = (email: string) => email.includes("@zod.com");
//const passwordRegex = new RegExp(/^(?=.*\d).+$/);

// 1. email로 사용자 찾기
const checkEmailExists = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });
    return Boolean(user);
};

const formSchema = z.object({
    //username: z.string({ invalid_type_error: "Username은 텍스트여야 합니다.", required_error: "Username 입력은 필수 입니다." }).min(5, "5글자 이상 입력해주세요.").trim(),
    email: z.string().email().refine(checkEmailExists, "이 이메일을 사용하는 계정이 존재하지 않습니다."),
    //.refine(checkEmail, "'@zod.com' 메일만 가능합니다."),
    password: z.string().min(3, "비밀번호는 3글자 이상이어야 합니다."),
    //.regex(passwordRegex, "비밀번호는 반드시 숫자를 포함해야 합니다."),
});

export async function loginForm(prevState: any, formData: FormData) {
    const data = {
        //username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
    };
    const result = await formSchema.spa(data);
    // spa == safeParseAsync
    if (!result.success) {
        return result.error.flatten();
    } else {
        // 2. 비밀번호 해시값 가져오기
        const user = await db.user.findUnique({
            where: {
                email: result.data.email,
            },
            select: {
                id: true,
                password: true,
            },
        });
        // 3. 비밀번호의 해시값이 일치하는지 확인
        const ok = await bcrypt.compare(result.data.password, user!.password ?? "xxx");
        if (ok) {
            // 3. 비밀번호의 해시값이 일치하면 로그인 시키기 (쿠키 생성)
            const session = await getSession();
            session.id = user!.id;
            await session.save();
            // 4. profile 페이지로 redirect
            redirect("/profile");
        } else {
            // 3-1. 비번이 일치하지 않으면 에러 메시지 표시
            return {
                fieldErrors: {
                    password: ["잘못된 비밀번호 입니다."],
                    email: [],
                },
            };
        }
    }
}
