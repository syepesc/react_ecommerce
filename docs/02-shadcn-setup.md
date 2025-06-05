# Setup Shadcn UI

Unlike other UI libraries where you import all components from a single package (e.g., Material UI, Chakra UI), ShadCN works differently. It allows you to selectively install and use only the components you need. This gives you more control over your codebase and makes customization easier.

Let's install it.

```bash
npx shadcn@latest init
```

The init command generates a ShadCN component setup in your project. It doesn't install the entire library as a package but instead gives you access to a system where you can pick and choose specific components that will be installed directly into your project’s codebase. This contrasts with typical UI libraries like Material UI or Chakra UI, where you import components from a single package. ShadCN, however, generates the components locally.

- Select `default` for the style.
- Select `Slate` for the base color.
- Select `yes` for CSS variables for theming.
- Select the `--legacy-peer-deps` option

Now Shadcn has been initialized.
