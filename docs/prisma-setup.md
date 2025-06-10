# Prisma Setup

## Install Prisma

Prisma is an ORM that will help us interact with the database. It is a TypeScript-first ORM that makes it easy to work with databases.

Run the following command to install Prisma:

```bash
npm install -D prisma @prisma/client
```

Now run the following command to initialize Prisma:

```bash
npx prisma init
```

This creates a `prisma` folder with a `schema.prisma` file. This is where we will define our database schema. It also adds a `DATABASE_URL` environment variable to your `.env` file.

Go back to your Vercel Postgres dashboard and click on the "Settings" tab. Copy the `POSTGRES_PRISMA_URL` value and paste it in in the `DATABASE_URL` environment variable in your `.env` file. It will look like this:

```
DATABASE_URL="postgres://default:63TadedqJVbBH@ep-temper-base-a4v0qilv-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15"
```

## Prisma VS Code Extension

We also want to make sure formatting is setup. Open your command pallete(Ctrl+Shift+P) and type "settings" and select "Preferences: Open User Settings (JSON)". Then add the following to the `settings.json` file:

```json
 "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
```

This will make sure the Prisma extension is the default formatter for `.prisma` files.
