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