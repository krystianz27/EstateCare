import { ElementType } from "react";

interface TenantInfoProps {
  label: string;
  value: string | number;
  icon: ElementType;
}

export default function TenantInfo({
  label,
  value,
  icon: Icon,
}: TenantInfoProps) {
  return (
    <p className="flex items-center space-x-2 space-y-1">
      <Icon className="card-icon" />
      <span className="tab-font">{label}</span>
      <span className="tab-font">{value}</span>
    </p>
  );
}
