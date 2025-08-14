# 🧪 Setting Up Jest with TypeScript and dotenv

This guide walks you through installing Jest in a TypeScript project, configuring it, and writing your first test that loads environment variables using `dotenv`.

---

## 📦 Step 1: Install Jest and Required Dependencies

Run the following command in your project root:

```bash
npm install -D jest ts-jest ts-node @types/jest @types/node
```

---

## ⚙️ Step 2: Initialize Jest

```bash
npm init jest@latest
```

When prompted, choose the following:

```
✔ Would you like to run Jest as your 'test' script in package.json? … Yes
✔ Would you like to use Typescript for the configuration file? … Yes
✔ Choose the test environment that will be used for testing … node
✔ Do you want to add coverage reports? … No
✔ Which provider should be used to instrument code for coverage? … v8
✔ Automatically clear mock calls and instances between every test? … Yes
```

---

## 🛠️ Step 3: Update Jest Configuration

Open `jest.config.ts` and ensure this option is set:

```ts
preset: 'ts-jest',
```

---

## 📝 Step 4: Add Test Scripts to package.json

Update your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

---

## 🌱 Step 5: Load Environment Variables with dotenv

### 1. Install `dotenv`

```bash
npm install -D dotenv
```

### 2. Create a setup file

Create a file called `jest.setup.ts` at the root of your project:

```ts
require("dotenv").config();
```

### 3. Update Jest Config

Add the setup file path in `jest.config.ts`:

```ts
setupFiles: ['<rootDir>/jest.setup.ts'],
```

---

## 🧪 Step 6: Write Your First Test

Create a folder `tests/` in the root directory. Inside it, add a file `paypal.test.ts`:

```ts
import { generateAccessToken } from "../lib/paypal";

test("generates a PayPal access token", async () => {
  const tokenResponse = await generateAccessToken();
  console.log(tokenResponse);
  expect(typeof tokenResponse).toBe("string");
  expect(tokenResponse.length).toBeGreaterThan(0);
});
```

---

## 📤 Step 7: Export the Function to Test

In `lib/paypal.ts`, make sure the function is exported:

```ts
export async function generateAccessToken() {
  // Your implementation here
}
```

---

## 🚀 Step 8: Run the Tests

```bash
npm run test
```

You should see the test run, the access token printed to the console, and your test pass ✅
