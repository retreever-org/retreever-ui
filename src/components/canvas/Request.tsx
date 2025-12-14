import { getBaseURL } from "../../api/axios/axios-instance";
import { useViewingDocStore } from "../../stores/viewing-doc-store";
import { getMethodColor } from "./EndpointTabUtil";

const Request: React.FC = () => {
  const { endpoint } = useViewingDocStore();
  const baseUrl = getBaseURL();
  return (
    <div data-request-bar className="flex justify-center items-center w-full h-12 gap-2">
      <div className="w-full flex items-center border border-surface-500 rounded-md">
        <div
          className={`text-center w-24 py-1 my-2 text-sm font-semibold uppercase ${getMethodColor(
            endpoint?.method ?? "GET"
          )} border-r border-surface-500/30`}
        >
          {endpoint?.method ?? "GET"}
        </div>

        <input
          type="url"
          value={baseUrl + endpoint?.path}
          className="py-3 px-2 w-full text-[0.8rem] text-surface-200 font-normal outline-0 focus:outline-2 rounded-md outline-primary-300 focus:outline-primary-300 focus:ring-0 hover:outline-primary-300"
          placeholder="https://api.example.com/your-endpoint"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
        />
      </div>
      <button
        className="
                    h-[92%] w-24 rounded-md text-white font-semibold
                    bg-linear-to-r from-primary-400 to-primary-500 
                    hover:bg-linear-to-r hover:from-primary-500 hover:to-primary-600
                    focus:outline-2 focus:outline-primary-300 
                    transition-all duration-200 transition-none
                    cursor-pointer"
      >
        Send
      </button>
    </div>
  );
};

export default Request;