import { generateAccessToken, paypal } from "../lib/paypal";

// Generate a PayPal access token
test("generates a PayPal access token", async () => {
  const tokenResponse = await generateAccessToken();
  // Should be a string that is not empty
  expect(typeof tokenResponse).toBe("string");
  expect(tokenResponse.length).toBeGreaterThan(0);
});

test("creates a PayPal order", async () => {
  const token = await generateAccessToken();
  const price = 10.0; // Example price for testing

  const orderResponse = await paypal.createOrder(price);

  // Ensure the order response contains expected fields
  expect(orderResponse).toHaveProperty("id");
  expect(orderResponse).toHaveProperty("status");
  expect(orderResponse.status).toBe("CREATED"); // PayPal returns 'CREATED' for new orders
});

test("simulates capturing a PayPal order", async () => {
  const orderId = "100"; // Mock order ID

  // Mock the capturePayment function to return a successful response
  // `jest.spyOn(paypal, 'capturePayment')` creates a "spy" on the capturePayment method within the paypal object. A spy is a function that monitors and records calls made to another function. With a spy, you can control the return values. In this case, we're using it to simulate a successful API response by returning an object { status: 'COMPLETED' } when capturePayment is called.
  // Then we proceed to call the capturePayment method with the mock order ID. The test should pass.
  // We now know that our PayPal functions are working as expected. We can now move on to integrating them into our application.
  const mockCapturePayment = jest.spyOn(paypal, "capturePayment").mockResolvedValue({
    status: "COMPLETED",
  });

  // Call the capturePayment function with the mock order ID
  const captureResponse = await paypal.capturePayment(orderId);
  // Ensure the capture response contains expected fields
  expect(captureResponse).toHaveProperty("status", "COMPLETED");

  // Clean up mock
  mockCapturePayment.mockRestore();
});
