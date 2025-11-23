import { Service } from "@/lib/db";

export default function PrintView({ services }: { services: Service[] }) {
  return (
    <div className="hidden print:block p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black mb-2">Fairfax Housing Helper - Service List</h1>
        <p className="text-gray-600 text-sm">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="py-2 pr-4 font-bold text-black w-1/4">Service / Organization</th>
            <th className="py-2 pr-4 font-bold text-black w-1/4">Category</th>
            <th className="py-2 pr-4 font-bold text-black w-1/4">Contact</th>
            <th className="py-2 font-bold text-black w-1/4">Description</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="border-b border-gray-300 break-inside-avoid">
              <td className="py-4 pr-4 align-top">
                <div className="font-bold text-black">{service.title}</div>
                <div className="text-gray-600 text-sm">{service.organization}</div>
              </td>
              <td className="py-4 pr-4 align-top text-black">
                {service.category}
              </td>
              <td className="py-4 pr-4 align-top text-sm">
                {service.phone && (
                  <div className="mb-1"><span className="font-semibold">Tel:</span> {service.phone}</div>
                )}
                {service.email && (
                  <div className="mb-1"><span className="font-semibold">Email:</span> {service.email}</div>
                )}
                {service.website && (
                  <div className="break-all"><span className="font-semibold">Web:</span> {service.website}</div>
                )}
              </td>
              <td className="py-4 align-top text-sm text-gray-800">
                {service.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {services.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-t border-gray-300">
          No services found.
        </div>
      )}
      
      <div className="mt-8 text-xs text-gray-500 text-center border-t border-gray-300 pt-4">
        Fairfax Housing Helper - Community Resource List
      </div>
    </div>
  );
}
