import { UserData } from "@/types";
import React from "react";

interface TenantsSectionProps {
  tenants: UserData[];
}

const TenantsSection: React.FC<TenantsSectionProps> = ({ tenants }) => {
  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold">Tenants</h3>
      <ul className="mt-2">
        {tenants.length > 0 ? (
          tenants.map((tenant) => (
            <li key={tenant.id} className="text-gray-700">
              {tenant.first_name} {tenant.last_name}
            </li>
          ))
        ) : (
          <p>No tenants assigned.</p>
        )}
      </ul>
    </section>
  );
};

export default TenantsSection;
