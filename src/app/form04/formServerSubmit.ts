"use server";

import { schema } from "./formSchema";

export type FormState = {
    message: string;
    fields?: Record<string, string>;
    issues?: Record<string, string>;
};

export async function onSubmitAction(
    prevState: FormState,
    data: FormData): Promise<FormState> {
    "use server";
    const formData = Object.fromEntries(data);
    const parsed = schema.safeParse(formData);

    //test 
    //console.log(parsed);

    if (!parsed.success) {
        console.log(JSON.stringify({
            success: false,
            error: {
              issues: parsed.error.issues,
              errors: parsed.error.errors,
            }
          }, null, 2));

        const fields: Record<string, string> = {};

        for (const key of Object.keys(formData)) {
            fields[key] = formData[key].toString();
        }

        // 将 zod 返回的错误信息（parsed.error.issues）重新组织成 {fieldName: message} 的结构
        const fieldsErrors: Record<string, string> = {};
        parsed.error.issues.forEach((issue) => {
            if (issue.path.length > 0) {
                fieldsErrors[issue.path[0]] = issue.message;
            }
        });

        return {
            message: "parsed.error.message",
            fields: fields,
            issues: fieldsErrors
        };
    } else {
        console.log(parsed); // This will log the successful result as before
    }

    if (parsed.data.email.includes("a")) {
        return {
            message: "Email address is not valid a from server message",
            fields: parsed.data,
            issues: { email: "Email address is not valid a from server issue" }
        };
    }

    return {
        message: "Form submitted successfully",
    };
}