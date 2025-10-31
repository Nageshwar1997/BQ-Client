import { Link } from "react-router-dom";

const ShippingInfo = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <header className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Shipping Information (India)
        </h1>
        <p className="text-base sm:text-lg text-tertiary">
          Learn about our domestic shipping policies, delivery times, and order
          handling within India.
        </p>
      </header>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Order Processing</h2>
        <p className="text-sm sm:text-base">
          Once you place an order with{" "}
          <Link to="/">
            <strong className="bg-clip-text bg-accent-duo text-transparent">
              Beautinique
            </strong>
          </Link>
          , our team processes it within 1–2 business days. You will receive a
          confirmation email once your order is ready for shipment.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Shipping Methods & Delivery Time
        </h2>
        <p className="text-sm sm:text-base">
          We offer standard and express shipping options within India:
        </p>
        <ul className="list-disc pl-5 text-sm sm:text-base space-y-1">
          <li>Standard Shipping: 3–6 business days.</li>
          <li>Express Shipping: 1–3 business days.</li>
        </ul>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Shipping Charges</h2>
        <p className="text-sm sm:text-base">
          Shipping charges are calculated at checkout based on your location and
          selected shipping method. Free standard shipping is available for
          orders above ₹1,500.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Tracking Your Order
        </h2>
        <p className="text-sm sm:text-base">
          Once your order is shipped, you will receive a tracking number via
          email or SMS. Use this number to track your package online.
        </p>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Delivery Restrictions
        </h2>
        <p className="text-sm sm:text-base">
          Some remote or rural areas may have longer delivery times. We
          recommend checking your PIN code at checkout for estimated delivery
          availability.
        </p>
      </section>

      <p className="text-sm sm:text-base text-center font-semibold">
        Last updated: {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default ShippingInfo;
