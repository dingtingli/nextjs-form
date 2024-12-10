This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

1. install the project

```bash
npx create-next-app@latest
```

2. install shadcn ui

```bash
npx shadcn@latest init
```

3. install shadcn form

```bash
npx shadcn@latest add form

? How would you like to proceed? » - Use arrow-keys. Return to submit.
>   Use --force
```

"react": "^19.0.0",
"react-dom": "^19.0.0",
"react-hook-form": "^7.54.0",
"zod": "^3.23.8",

4. install shadcn input

```bash
npx shadcn@latest add input
```


form01 前端验证

form02 服务器段验证

ctrl+ shift+ p 快捷键 JavaScript 设置前端的JavaScript disabled/enabled

form01 在前端js disabled 时，无法实现验证；form02 在前端js disabled 时，接收不到数据。

form03 浏览器设置成 JavaScript disabled 后如何实现验证

#  Form 表单测试项目

本项目旨在演示如何在实际开发中集成并使用 shadcn/ui 提供的表单组件。

项目中同时引入了 React Hook Form 作为表单状态管理工具，以及 Zod 作为表单数据的类型校验方案。

项目不仅仅使用客户端验证，而且同时使用服务器端验证，当客户端浏览器禁用 JavaScript 时，服务器端仍然完成所有验证。

在本项目中，我们将使用 Next.js 作为服务端渲染，并使用 TypeScript 作为编程语言。

Zod 官网地址：https://zod.dev/

Reack hook form 官网地址：https://www.react-hook-form.com/get-started/#Quickstart

## 安装依赖

1. 使用 nextjs 创建一个原始项目

```bash
npx create-next-app@latest
```

2. 安装 shadcn/ui 作为前端组件库

```bash
npx shadcn@latest init
```

3.  安装 shadcn/ui form 组件

```bash
npx shadcn@latest add form

? How would you like to proceed? » - Use arrow-keys. Return to submit.
>   Use --force
```

此时，用于验证的的 Zod 库以及 React Hook Form 库将会被安装到项目中。

你会在 package.json 中看到如下内容：

```json
"react": "^19.0.0",
"react-dom": "^19.0.0",
"react-hook-form": "^7.54.0",
"zod": "^3.23.8",
```

4. 安装 shadcn/ui label 组件

```bash
npx shadcn@latest add input
```

## form01 表单验证

这是一个简单的表单，它包含一个名称字段 firstName lastName 和一个邮箱字段 email。

在表单中，我们将使用 React Hook Form 作为表单状态管理工具，并使用 Zod 作为表单数据的类型校验方案，实现前端验证。


### form01 表单验证

1. 在 form01 目录下创建 formSchema.ts 文件，并将其内容如下所示：

```ts
import { z } from "zod";

export const schema = z.object({
    first:z.string().trim().min(1,{message:"First Name is required"}),
    last:z.string().trim().min(1,{message:"Last Name is required"}),
    email:z.string().trim().email({message:"invalid email address."}),
});
```

在对象内部，我们定义了三个字段：first、last 和 email。每个字段都有自己的验证规则：
`first: z.string().trim().min(1, { message: "First Name is required" })`

 - `z.string()`: 指定这个字段必须是字符串类型。
 - `.trim()`: 在验证之前会去除字符串两端的空白字符。
 - `.min(1, { ... })`: 指定字符串的最小长度为1（即不能为空），如果为空则显示指定的错误消息。

 如果需要regular expression 验证，可以使用 `.regex()` 方法。

 详情可以参考 Zod 官网：https://zod.dev/

 可以使用如下代码来验证表单数据：

```ts
const result = schema.safeParse({
  first: "John",
  last: "Doe",
  email: "john.doe@example.com"
});

if (result.success) {
  console.log("Data is valid:", result.data);
} else {
  console.log("Validation errors:", result.error.errors);
}
```

如果数据有错误，则会返回错误信息，并且可以通过 result.error.errors 获取错误信息。

2. 在 form01 目录下创建 form01.tsx 文件，表单的主要内容都在这个文件中。

