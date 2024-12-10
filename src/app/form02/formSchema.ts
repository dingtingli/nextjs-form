import { z } from "zod";

export const schema = z.object({
    first:z.string().trim().min(1,{message:"First Name is required"}),
    last:z.string().trim().min(1,{message:"Last Name is required"}),
    email:z.string().trim().email({message:"invalid email address."}),
});