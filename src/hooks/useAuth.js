/**
 * ============================================================================
 * File: src/hooks/useAuth.js
 * Description: Convenience hook consuming AuthContext.
 * Usage / Imported By: All components requiring user state or session management.
 * ============================================================================
 */

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be consumed within an <AuthProvider>");
  }
  return context;
}
