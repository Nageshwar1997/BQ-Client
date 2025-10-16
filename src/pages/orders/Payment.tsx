import toast from "react-hot-toast";
import { getUserToken, toINRCurrency } from "../../utils";
import axios from "axios";
import { toastErrorMessage } from "../../utils/toasts";
import { envs } from "../../envs/index.env";
import { useUserStore } from "../../store/user.store";
import usePathParams from "../../hooks/usePathParams";
import AddressInfo from "../address/children/AddressInfo";
import Button from "../../components/button/Button";
import { RightArrowIcon } from "../../icons";
import { IAddress } from "../../types";
import useCartStore from "../../store/cart.store";
import { useMemo } from "react";

const Payment = () => {
  const BACKEND_URL = "http://localhost:8080/api";
  const { user } = useUserStore();
  const { cart } = useCartStore();
  const { state, navigate } = usePathParams();

  const baseAddresses = state?.addresses;

  const addresses: IAddress[] = Object.values(baseAddresses ?? {});
  const products = useMemo(() => cart?.products || [], [cart?.products]);

  const subtotal = useMemo(() => {
    return products.reduce(
      (acc, item) => acc + item?.product?.sellingPrice * item?.quantity,
      0
    );
  }, [products]);

  const shipping = subtotal > 499 ? 0 : 40;
  const total = subtotal + shipping;

  const handlePayment = async () => {
    if (
      (!baseAddresses?.billing || !baseAddresses?.shipping) &&
      !baseAddresses?.both
    )
      return toastErrorMessage(
        "Please select billing and shipping address or a 'both' address."
      );

    try {
      // 1️⃣ Create order on backend
      const { data: orderData } = await axios.post(
        `${BACKEND_URL}/orders/create`,
        {
          addresses: {
            ...(baseAddresses?.billing?.address && {
              billing: baseAddresses?.billing?.address?._id,
            }),
            ...(baseAddresses?.shipping?.address && {
              shipping: baseAddresses?.shipping.address?._id,
            }),
            ...(baseAddresses?.both?.address && {
              both: baseAddresses?.both.address?._id,
            }),
          },
        },
        { headers: { Authorization: `Bearer ${getUserToken()}` } }
      );
      const options = {
        key: envs.RAZORPAY_KEY_ID,
        key_secret: envs.RAZORPAY_KEY_SECRET,
        amount: orderData.razorpayOrder.amount,
        currency: orderData.razorpayOrder.currency,
        name: "Beautinique (Beauty Unique)",
        description: `Ordered by ${user?.firstName} ${user?.lastName}, with Razorpay secure payment gateway.`,
        image: "/images/logo/BQ_gradient_logo.webp",
        order_id: orderData.razorpayOrder.id,
        handler: async function (response: Record<string, string>) {
          console.log("response", response);
          try {
            const { data: verifyData } = await axios.patch(
              `${BACKEND_URL}/orders/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDBId: orderData.order._id,
              },
              { headers: { Authorization: `Bearer ${getUserToken()}` } }
            );
            toast.success("Payment Successful!");
            console.log("Payment verified:", verifyData);
          } catch (err) {
            console.error("Payment verification failed:", err);
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email,
          contact: user?.phoneNumber,
        },
        theme: { color: "#6700EE" },
        modal: {
          ondismiss: () => console.log("Checkout dismissed"),
        },
        method: {
          card: true,
          netbanking: true,
          upi: true,
          wallet: true,
          emi: false,
          paylater: false,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log("Error from mutation:", error);
      toast.error("Failed to initiate payment.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Left - Cart Items */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold text-secondary mb-6">
          Order Summary
        </h2>
        <div className="h-full space-y-6">
          {products.map((item) => {
            return (
              <div
                key={item._id}
                className="p-2 flex gap-4 border shadow-md shadow-primary-10 border-primary-30 rounded-xl opacity-90 items-stretch"
              >
                <div
                  className="w-24 rounded-sm shadow cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/product/${item?.product?._id}`)}
                >
                  <img
                    src={
                      item?.shade?.images?.[0] ||
                      item?.product?.commonImages?.[0]
                    }
                    alt={item?.shade?.shadeName || item?.product?.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                </div>
                <div className="flex-1 grow flex flex-col justify-between">
                  <h3
                    className="text-base font-medium text-primary opacity-90 hover:opacity-100 line-clamp-1 cursor-pointer"
                    onClick={() => navigate(`/product/${item?.product?._id}`)}
                  >
                    {item?.product?.title}
                  </h3>
                  {item?.shade && (
                    <p className="text-[13px] text-tertiary">
                      {item?.shade?.shadeName}
                    </p>
                  )}
                  <p className="text-[13px] text-tertiary">
                    {item?.product?.brand}
                  </p>
                  <p className="text-[13px] text-secondary">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    Price: {toINRCurrency(item?.product?.sellingPrice)}
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    Total:{" "}
                    {toINRCurrency(item?.product?.sellingPrice * item.quantity)}
                  </p>
                </div>
              </div>
            );
          })}
          <div className="w-full flex flex-col border shadow-md shadow-primary-10 border-primary-30 rounded-xl opacity-90">
            {addresses &&
              addresses?.map((address, index) => (
                <div key={address._id} className="">
                  <h3
                    className={`text-lg text-center p-2 font-bold capitalize bg-clip-text text-transparent bg-accent-duo ${
                      index === 0
                        ? "border-b border-b-primary-30"
                        : "border-y border-y-primary-30"
                    }`}
                  >
                    {address.type === "both"
                      ? "Shipping & Billing"
                      : address.type}{" "}
                    Address
                  </h3>
                  <AddressInfo address={address} className="p-2" />
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* Right - Order Summary */}
      <div className="p-6 h-fit lg:sticky top-16">
        <h2 className="text-2xl font-semibold text-secondary mb-6">
          Payment Summary
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between text-tertiary">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-tertiary">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
          </div>
          <div className="border-t border-t-primary-30 pt-4 flex justify-between text-lg font-semibold text-primary">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
        <Button
          pattern="primary"
          content="Pay Now"
          className="!rounded-lg mt-4 !p-3 gap-2"
          rightIcon={<RightArrowIcon className="stroke-white" />}
          buttonProps={{ onClick: handlePayment }}
        />
        <p className="mt-3 text-sm text-silver-jet text-center">
          Secure checkout • 100% satisfaction guaranteed
        </p>
      </div>
    </div>
  );
};

export default Payment;
