# Stripe Webhook Setup Guide 💳

This guide explains how to configure Stripe Webhooks for the Tokova Marketplace to handle payment confirmations and vendor usage fees.

## 1. Local Development (Testing)

To test webhooks locally, you need to forward events from Stripe to your local machine using the Stripe CLI.

### Prerequisites
*   [Stripe CLI](https://stripe.com/docs/stripe-cli) installed
*   Logged in via CLI (`stripe login`)

### Steps
1.  **Forward Events**:
    Run the following command in your terminal:
    ```bash
    stripe listen --forward-to localhost:4000/api/payments/webhook
    ```

2.  **Get Webhook Secret**:
    The CLI will output a webhook signing secret (starting with `whsec_...`).
    Example output:
    ```
    > Ready! You are using Stripe API Version [current-date]. Your webhook signing secret is whsec_test_12345...
    ```

3.  **Update Environment**:
    Copy this secret and put it in your `apps/server/.env` file:
    ```env
    STRIPE_WEBHOOK_SECRET=whsec_test_12345...
    ```

4.  **Test**:
    Trigger events via the CLI or make a purchase in the Customer App. You should see "201 Created" in the CLI output.

---

## 2. Production Setup

For the live server, you need to add the endpoint in the Stripe Dashboard.

### Steps
1.  Go to **Stripe Dashboard** > **Developers** > **Webhooks**.
2.  Click **Add endpoint**.
3.  **Endpoint URL**:
    Enter your production backend URL appended with `/api/payments/webhook`.
    Example: `https://api.tokova.com/api/payments/webhook`
4.  **Select Events**:
    Select the following events to listen to:
    *   `checkout.session.completed` (Required for confirming orders)
    *   `payment_intent.payment_failed` (Optional, for error handling)
    *   `payment_intent.succeeded` (Optional)
5.  Click **Add endpoint**.
6.  **Get Secret**:
    Reveal the **Signing secret** (top right of the webhook details page).
7.  **Update Environment**:
    Add this secret to your production environment variables (`.env` or server config):
    ```env
    STRIPE_WEBHOOK_SECRET=whsec_live_...
    ```

---

## 3. Implementation Details

The webhook handling logic is located in:
*   **Controller**: `apps/server/src/modules/payments/payments.controller.ts`
*   **Service**: `apps/server/src/modules/payments/payments.service.ts`

### Main logic:
*   **Event Construction**: Verifies the `stripe-signature` header using the `STRIPE_WEBHOOK_SECRET`.
*   **Event Handling**:
    *   `checkout.session.completed`: Updates order status to `PAID` in the database.
    *   `payment_intent.payment_failed`: Logs failure and updates status if needed.
