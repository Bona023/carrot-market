"use server";
import { z } from "zod";

const checkEmail = (email: string) => email.includes("@zod.com");
const passwordRegex = new RegExp(/^(?=.*\d).+$/);

const formSchema = z.object({
    username: z.string({ invalid_type_error: "Username은 텍스트여야 합니다.", required_error: "Username 입력은 필수 입니다." }).min(5, "5글자 이상 입력해주세요.").trim(),
    email: z.string().email().refine(checkEmail, "'@zod.com' 메일만 가능합니다."),
    password: z.string().min(10, "비밀번호는 10글자 이상이어야 합니다.").regex(passwordRegex, "비밀번호는 반드시 숫자를 포함해야 합니다."),
});

export async function loginForm(prevState: any, formData: FormData) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
    };
    const result = formSchema.safeParse(data);
    if (!result.success) {
        console.log(result.error.flatten());
        return result.error.flatten();
    } else {
        return undefined;
    }
}
