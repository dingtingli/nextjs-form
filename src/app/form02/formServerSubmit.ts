"use server";

import { schema } from "./formSchema";

export type FormState = {
    message: string;
};

export async function onSubmitAction(data: FormData): Promise<FormState> {
    "use server";
    const formData = Object.fromEntries(data);
    const parsed = schema.safeParse(formData);

    //test 
    console.log(parsed);

    if (!parsed.success) {
        return {
            message: parsed.error.message,
        };
    }

    if(parsed.data.email.includes("a")){
        return {
            message: "Email address is not valid",
        };
    }

    return {
        message: "Form submitted successfully",
    };
}