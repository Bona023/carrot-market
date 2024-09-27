"use client";
import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { loginForm } from "./action";

export default function LogIn() {
    const [state, action] = useFormState(loginForm, null);
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Log in with email and password.</h2>
            </div>
            <form
                action={action}
                className="flex flex-col gap-3"
            >
                <FormInput
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    errors={state?.fieldErrors.email}
                />
                <FormInput
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                    errors={state?.fieldErrors.username}
                />
                <FormInput
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    errors={state?.fieldErrors.password}
                />
                <FormButton text="Log in" />
                {state === undefined ? <div className="bg-green-500 text-white  font-medium  rounded-md text-center py-2">Welcome!!</div> : null}
            </form>
            <SocialLogin />
        </div>
    );
}
