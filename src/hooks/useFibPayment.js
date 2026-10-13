/**
 * ============================================================================
 * File: src/hooks/useFibPayment.js
 * Description: Custom hook encapsulating FIB payment initiation, deep-linking,
 *              and automatic mobile app launcher.
 * Usage / Imported By: FibPaymentModal, AuthBuyModal.
 * ============================================================================
 */

import { useContext, useCallback } from "react";
import { PaymentContext } from "../context/PaymentContext";

export default function useFibPayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error(
      "useFibPayment must be consumed within a <PaymentProvider>",
    );
  }

  const {
    invoice,
    startPayment,
    isModalOpen,
    setIsModalOpen,
    resetPaymentState,
  } = context;

  const triggerMobileDeepLink = useCallback(() => {
    if (invoice?.deepLink) {
      window.location.href = invoice.deepLink;
    }
  }, [invoice]);

  return {
    ...context,
    triggerMobileDeepLink,
    openModal: () => setIsModalOpen(true),
    closeModal: () => {
      setIsModalOpen(false);
      resetPaymentState();
    },
  };
}
