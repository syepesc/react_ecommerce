# About Prisma

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

## Prisma VS Code Extension

We also want to make sure formatting is setup. Open your command pallete(Ctrl+Shift+P) and type "settings" and select "Preferences: Open User Settings (JSON)". Then add the following to the `settings.json` file:

```json
 "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
```

This will make sure the Prisma extension is the default formatter for `.prisma` files.

## Prisma Models

Models represent the entities of our application domain, They also map to the tables of our database and we create our migrations from them. When used with TypeScript, the Prisma Client provides generated type definitions for your models and any variations of them to make database access entirely type safe.

Open the `schema.prisma` file in your project and add the following:

```prisma
   model Product {
      id          String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
      name        String
      slug        String       @unique(map: "product_slug_idx")
      category    String
      images      String[]
      brand       String
      description String
      stock       Int
      price       Decimal      @default(0) @db.Decimal(12, 2)
      rating      Decimal      @default(0) @db.Decimal(3, 2)
      numReviews  Int          @default(0)
      isFeatured  Boolean      @default(false)
      banner      String?
      createdAt   DateTime     @default(now()) @db.Timestamp(6)
    }
```

This is the schema for our `Product` model. It has the fields that we went over for the sample data. In addition, it will have a generated `id` field that will be a UUID. We also have a `createdAt` field that will be a timestamp.

Anything that starts with `@` are annotations that define specific constraints, defaults, and database-specific configurations for fields. For instance:

- `@id` - Marks the field as the primary key of the table in the database. cEach record must have a unique value for this field.
- `@unique` - Ensures that the field has a unique value across all rows in the table.
- `@unique(map: "product_slug_idx")` - Adds a unique constraint on the field and assigns a custom name (product_slug_idx) to the database index created for this constraint. Without map, it would generate a default name.
- `@default` - Specifies a default value for the field when a new record is created and no value is explicitly provided.
- `@db` - Maps the field to a specific database type, useful for defining database-specific precision or constraints. For example, `@db.Uuid` maps the id field to a UUID type in the database. `@db.Decimal(12, 2)` maps the price field to a decimal type with precision 12 (total digits) and scale 2 (digits after the decimal point).
- `default(dbgenerated(...))` - This uses a database function (gen_random_uuid()) to generate a UUID for the id field.

In order to create this schema and table in our database, there are some commands we have to run. Before we do that though, there are a few things that I want to do. First, we need to add a postinstall script to our `package.json` file. This will run the Prisma migration commands after we install our dependencies.

Open the `package.json` file and add the following:

```json
  "scripts": {
     "postinstall": "prisma generate",
     //..
  },
```

Now let's run the generate command locally to generate the Prisma client and the Prisma schema.

```bash
npx prisma generate
```

Now we should be able to use the Prisma client to interact with our database.

## Create the Migration

Run the following command to create a migration:

```bash
npx prisma migrate dev --name init
```

This will create a migration file in the `prisma/migrations` directory. you can look at it if you want, it is just a CREATE TABLE sql statement.

## Prisma Studio

Prisma comes with a built-in studio that we can use to view our database. We can run the following command to start the studio:

```bash
npx prisma studio
```

This will open a new browser window with the Prisma Studio. You can use this to view your database and make changes to it.

In the next lesson, we will seed our sample data.

## Run Database Seed

```bash
npx tsx ./db/seed
```

## Going Serverless With Prisma

Traditional databases maintain persistent TCP connections to handle requests. However, serverless environments (like Vercel) are designed to scale automatically and don’t maintain persistent connections between invocations. If you try to connect directly to a database from a serverless function, you might run into issues like:

- **Connection limits**: Serverless environments can spawn many instances simultaneously, exceeding database connection limits.
- **Cold starts**: Connections are slow to initialize in serverless environments.
- **Incompatibility with WebSockets**: Neon uses WebSockets for serverless compatibility, while Prisma assumes a traditional TCP setup.

The Neon adapter solves these problems by adapting Prisma’s behavior to Neon’s serverless architecture. It allows Prisma to manage connections using WebSockets and pooling, so that it works in a serverless context.

## Needed Packages

There are a few packages that we need to install to set this up:

- `@neondatabase/serverless`: Provides a low-level connection interface to interact with the Neon serverless PostgreSQL database using WebSockets. That's why we're also installing the websockets package. This adapter allows us to connect directly to Neon in serverless environments, such as Vercel or Netlify, where maintaining persistent connections to a database can be challenging.
- `@prisma/adapter-neon`: This is an adapter specifically for Prisma to ensure Prisma can operate smoothly with Neon in serverless environments. Prisma by default assumes traditional database connections (over TCP), so this adapter adapts Prisma’s behavior to Neon’s serverless infrastructure, which uses WebSockets and connection pooling.
- `ws`: This is a WebSocket library used by the Neon adapter to establish and manage connections to the Neon serverless database.

Let's install the following packages:

```bash
npm install @neondatabase/serverless @prisma/adapter-neon ws
```

There are a couple dev dependencies we need to install as well:

```bash
npm i -D @types/ws bufferutil
```

- `@types/ws`: This is the TypeScript type definitions for the ws package.
- `bufferutil`: This is a utility package for working with buffers in Node.js.

Now that we have the packages installed, we need to update our Prisma schema to use the Neon adapter. Open the `prisma/schema.prisma` file and update the provider to use the Neon adapter:

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["driverAdapters"]  👈 Add this line
}
```

## Generate Prisma Client

When we make changes like this, we need to regenerate the Prisma Client. Run the following command to generate the Prisma Client:

```bash
npx prisma generate
```
