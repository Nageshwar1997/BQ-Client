import { useEffect, useState } from "react";
import { useUserStore } from "../../store/user.store";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import useRequireAuth from "../../hooks/useRequireAuth";

const ReferFriend = () => {
  const requireAuth = useRequireAuth();
  const { isAuthenticated, user } = useUserStore();
  const [referralLink, setReferralLink] = useState(
    "https://beautinique.com/referral"
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const action = () => {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (!requireAuth(action)) return;
    action();
  };

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      setReferralLink(`https://beautinique.com/referral/${user._id}`);
    }
  }, [isAuthenticated, user?._id]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <header className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Refer a Friend & Earn Rewards
        </h1>
        <p className="text-base sm:text-lg text-tertiary">
          Invite your friends to Beautinique and both of you will receive
          exclusive rewards.
        </p>
      </header>

      {/* How It Works */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-center">
          How It Works
        </h2>
        <ul className="list-decimal list-inside space-y-3 text-sm sm:text-base">
          <li>
            Share your unique referral link with friends via social media,
            email, or messaging apps.
          </li>
          <li>
            Your friend signs up and makes their first purchase on Beautinique.
          </li>
          <li>
            Both you and your friend receive a reward – such as a discount or
            loyalty points.
          </li>
        </ul>
      </section>

      {/* Referral Link */}
      <section className="space-y-3 sm:space-y-4 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Your Referral Link
        </h2>
        {/* Todo: Disabled for Temporary */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <Input
            inputProps={{
              name: "referral-link",
              value: referralLink,
              type: "url",
              disabled: true,
              className: "!select-none pointer-events-none",
            }}
            containerClassName="max-w-lg"
          />
          <Button
            content={copied ? "Copied!" : "Copy Link"}
            pattern="primary"
            className="max-w-40 !py-3 !rounded-lg"
            buttonProps={{ disabled: true, onClick: handleCopy }}
          />
        </div>
      </section>

      {/* Reward Details */}
      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-center">
          Rewards
        </h2>
        <p className="text-sm sm:text-base text-center">
          For every friend who signs up and makes their first purchase, you both
          get ₹200 off your next order. There’s no limit – invite as many
          friends as you like!
        </p>
      </section>

      {/* FAQ */}
      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-center">FAQ</h2>
        <p className="text-sm sm:text-base">
          <span className="font-semibold">Q:</span> Can I refer multiple
          friends?
          <br />
          <span className="font-semibold">A:</span> Yes! You can share your link
          with as many friends as you want.
        </p>
        <p className="text-sm sm:text-base">
          <span className="font-semibold">Q:</span> How do I redeem my rewards?
          <br />
          <span className="font-semibold">A:</span> Rewards will automatically
          apply to your next order once your referred friend completes their
          first purchase.
        </p>
        <p className="text-sm sm:text-base">
          <span className="font-semibold">Q:</span> Do rewards expire?
          <br />
          <span className="font-semibold">A:</span> Rewards must be used within
          6 months from the date they are earned.
        </p>
      </section>

      {/* Footer */}
      <p className="text-sm sm:text-base text-center font-semibold">
        Last updated: {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default ReferFriend;
