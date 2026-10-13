/**
 * ============================================================================
 * File: src/pages/ProfilePage.jsx
 * Description: Customer portal displaying active VIP card, remaining clinic perks
 *              checklist, and launcher for the C-BOX luxury lottery.
 * Usage / Imported By: App.jsx.
 * ============================================================================
 */

import React, { useState } from "react";
import CustomerQRCard from "../components/customer/CustomerQRCard";
import GiftBoxModal from "../components/customer/GiftBoxModal";
import Button from "../components/common/Button/Button";
import Badge from "../components/common/Badge/Badge";
import BottomNav from "../components/layout/BottomNav";
import useAuth from "../hooks/useAuth";
import useLanguage from "../hooks/useLanguage";
import { GiftBoxIcon } from "../assets/icons";

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isBoxModalOpen, setIsBoxModalOpen] = useState(false);

  // Mocked state of 4 VIP centers in Erbil
  const perks = [
    {
      id: 1,
      center: "Kurd Smile Dental",
      perk: "پشکنین و خاوێنکردنەوەی ددان (١٠٠٪ بێبەرامبەر)",
      used: false,
    },
    {
      id: 2,
      center: "Guli Bahasht Beauty",
      perk: "هایدرۆفەیشڵ و پاککردنەوەی پێست (١٠٠٪ بێبەرامبەر)",
      used: true,
    },
    {
      id: 3,
      center: "Royal Laser Clinic",
      perk: "لێزەری یەک بەش (١٠٠٪ بێبەرامبەر)",
      used: false,
    },
    {
      id: 4,
      center: "Fitness VIP Erbil",
      perk: "یەک هەفتە بەشداری یانەی وەرزشی (١٠٠٪ بێبەرامبەر)",
      used: false,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060b13",
        padding: "20px 20px 100px",
        maxWidth: "520px",
        margin: "0 auto",
      }}
    >
      <CustomerQRCard
        cardId={user?.activeCardId || "SC-8821-4902"}
        customerName={user?.phone || "Ahmad Farhad"}
      />

      <div style={{ margin: "24px 0" }}>
        <Button
          variant="gold"
          fullWidth
          icon={<GiftBoxIcon size={20} />}
          onClick={() => setIsBoxModalOpen(true)}
        >
          🎁 کردنەوەی سندوقی خەڵاتی C-BOX
        </Button>
      </div>

      <div style={{ marginTop: "24px" }}>
        <h4 style={{ color: "#ffc800", marginBottom: "12px" }}>
          خزمەتگوزارییە بێبەرامبەرەکانی تۆ:
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {perks.map((p) => (
            <div
              key={p.id}
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                padding: "14px",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div>
                <strong
                  style={{
                    color: "#fff",
                    fontSize: "0.9rem",
                    display: "block",
                  }}
                >
                  {p.center}
                </strong>
                <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                  {p.perk}
                </span>
              </div>
              <Badge variant={p.used ? "danger" : "success"}>
                {p.used ? "بەکارهێنراوە" : "بەردەستە"}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <GiftBoxModal
        isOpen={isBoxModalOpen}
        onClose={() => setIsBoxModalOpen(false)}
        cardId={user?.activeCardId || "sc_card_39210"}
      />

      <BottomNav onOpenBuyModal={() => {}} />
    </div>
  );
}
