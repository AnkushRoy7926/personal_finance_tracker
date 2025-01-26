"use client";

import React from "react";
import withAuth from "@/utils/protectRoutes";
import Dashboard from "@/components/dashboard/Dashboard";

const dashboard = () => {
  return (
    <Dashboard />
  );
};

export default withAuth(dashboard);
