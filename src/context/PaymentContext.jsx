/**
 * ============================================================================
 * File: src/context/PaymentContext.jsx
 * Description: Manages FIB transaction lifecycle, invoice initiation, real-time
 *              polling loops, and active modal UI visibility.
 * Usage / Imported By: FibPaymentModal, AuthBuyModal, useFibPayment.
 * ============================================================================
 */

import React, { createContext, useState, useCallback, useRef } from "react";
import * as paymentService from "../services/paymentService";
import { FIB_PAYMENT_STATUS } from "../utils/constants";

export const PaymentContext = createContext(null);

export const PaymentProvider = ({ children }) => {
  const [invoice, setInvoice] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("IDLE"); // IDLE | CREATING | PENDING | PAID | FAILED
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pollingTimerRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
  }, []);

  const startPayment = useCallback(
    async (customerPhone) => {
      setPaymentStatus("CREATING");
      setErrorMessage("");
      setIsModalOpen(true);

      try {
        const response = await paymentService.initiateFibPayment(customerPhone);
        setInvoice(response);
        setPaymentStatus("PENDING");

        // Start active status polling (every 3 seconds)
        stopPolling();
        pollingTimerRef.current = setInterval(async () => {
          try {
            const check = await paymentService.checkPaymentStatus(
              response.invoiceId,
            );
            if (check.status === FIB_PAYMENT_STATUS.PAID) {
              setPaymentStatus("PAID");
              stopPolling();
            } else if (
              check.status === FIB_PAYMENT_STATUS.DECLINED ||
              check.status === FIB_PAYMENT_STATUS.EXPIRED
            ) {
              setPaymentStatus("FAILED");
              setErrorMessage("Payment was declined or timed out.");
              stopPolling();
            }
          } catch (err) {
            // Tolerate momentary polling dropouts
          }
        }, 3000);
      } catch (err) {
        setPaymentStatus("FAILED");
        setErrorMessage(
          err.message || "Failed to initiate FIB payment invoice.",
        );
        stopPolling();
      }
    },
    [stopPolling],
  );

  const resetPaymentState = useCallback(() => {
    stopPolling();
    setInvoice(null);
    setPaymentStatus("IDLE");
    setErrorMessage("");
    setIsModalOpen(false);
  }, [stopPolling]);

  const value = {
    invoice,
    paymentStatus,
    errorMessage,
    isModalOpen,
    setIsModalOpen,
    startPayment,
    resetPaymentState,
    stopPolling,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};
