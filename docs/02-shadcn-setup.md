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

## Test With a Button

Let's test it with a button. We can use the `Button` component from Shadcn. You can read more about the button component [here](https://ui.shadcn.com/docs/components/button).

Run the following command:

```bash
npx shadcn@latest add button
```

This will create a `components/ui` folder in the root of the project with the `button.tsx` file.

In your `app/page.tsx` file, import the button component and use it:

```tsx
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return <Button>Button</Button>;
};

export default HomePage;
```

You should see the button on the page.

So this will be the process anytime we want to use a component from Shadcn. We will install the component and import it in the file we want to use it.

## TypeScript Rule

There is a TypeScript error that gets thrown with the `input` component that has to do with the `no-empty-object-type rule`. I want to fix that by adding a rule to the `eslintrc.json` file. Open it up and add the following:

```json
"rules": { "@typescript-eslint/no-empty-object-type": "off" }
```

This will disable the rule for the empty object type.
