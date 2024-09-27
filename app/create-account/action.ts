"use server";
import { z } from "zod";

const checkUsername = (username: string) => !username.includes("potato");
const checkPassword = ({ password, confirmPassword }: { password: string; confirmPassword: string }) => password === confirmPassword;
const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/);
// /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
// /^(소문자포함)(대문자포함)(숫자포함)(특수문자포함).+$/

const formSchema = z
    .object({
        username: z
            .string({ invalid_type_error: "Username은 텍스트여야 합니다.", required_error: "Username 입력은 필수 입니다." })
            .min(3, "3글자 이상 입력해주세요.")
            .max(10, "10글자 이하로 입력해주세요.")
            .trim()
            .refine(checkUsername, "No 'potato'!!"),
        email: z.string().email(),
        password: z.string().min(5).regex(passwordRegex, "password는 소문자, 대문자, 숫자, 특수문자를 모두 포함해야 합니다."),
        confirmPassword: z.string().min(5),
    })
    .refine(checkPassword, { message: "Password와 Confirm Password는 동일해야 합니다.", path: ["confirmPassword"] });

export async function createAccount(prevState: any, formData: FormData) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    };
    const result = formSchema.safeParse(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        console.log(result.data);
    }
}
