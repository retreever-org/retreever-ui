import type { FieldMetadata } from "../../types/response.types";

interface MetadataProp {
  data: Record<string, FieldMetadata>;
  closeMetadata: (value: boolean) => void;
}

const Metadata: React.FC<MetadataProp> = ({ data, closeMetadata }) => {
  const entries = Object.entries(data);

  return (
    <section className="text-sm text-surface-200">
      <table className="w-full border-collapse bg-black/10">
        <thead>
          <tr className="border border-surface-500 bg-black/20">
            <th className="py-2 px-3 text-left border-r border-surface-500">
              Field
            </th>
            <th className=" flex items-center py-2 px-3 text-left">
              <span>Metadata</span>
              <button
                onClick={() => closeMetadata(false)}
                className="
                    ml-auto transition-opacity 
                    text-[0.65rem] font-normal text-surface-200 px-1.5 py-0.5 rounded-sm border border-surface-500 
                    hover:bg-surface-600/40
                "
              >
                VIEW SCHEMA
              </button>
            </th>
          </tr>
        </thead>

        <tbody className="text-surface-200">
          {entries.map(([field, meta]) => (
            <tr key={field} className="border border-surface-500">
              <td className="py-2 px-3 border-r border-surface-500">
                {field}
              </td>

              <td className="p-3">
                <SubTable {...meta} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Metadata;

/* -------------------------- Sub Table Component --------------------------- */

const SubTable: React.FC<FieldMetadata> = ({
  description,
  required,
  constraints,
}) => {
  return (
    <table className="w-full border-collapse bg-transparent">
      <tbody>
        <tr className="border-b border-surface-500/50">
          <td className="py-1 px-2 border-r border-surface-500/50 w-24">
            Description
          </td>
          <td className="py-1 px-2">{description}</td>
        </tr>

        <tr className="border-b border-surface-500/50">
          <td className="py-1 px-2 border-r border-surface-500/50 w-24">Required</td>
          <td className="py-1 px-2">{required ? "Yes" : "No"}</td>
        </tr>

        <tr>
          <td className="py-1 px-2 border-r border-surface-500/50 w-24">
            Constraints
          </td>
          <td className="py-1 px-2">
            {constraints.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {constraints.map((c) => {
                  const fixed = c.replace(/:/g, ": ");
                  return (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded-full bg-surface-500/10 border border-surface-500/50 text-xs"
                    >
                      {fixed}
                    </span>
                  );
                })}
              </div>
            ) : (
              "None"
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
