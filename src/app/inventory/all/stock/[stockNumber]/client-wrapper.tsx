"use client";

import VehicleDetailClient from './vehicle-detail-client';

interface ClientWrapperProps {
  stockNumber: string;
}

export default function ClientWrapper({ stockNumber }: ClientWrapperProps) {
  return <VehicleDetailClient stockNumber={stockNumber} />;
}
