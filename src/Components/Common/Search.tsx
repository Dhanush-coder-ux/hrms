import type { ChangeEvent } from "react";
import { FiSearch as SearchIcon } from "react-icons/fi";

interface SearchQueryProps {
  S1: string;
  S2: (value: string) => void;
}

export const SearchQuery: React.FC<SearchQueryProps> = ({ S1, S2 }) => {
  return (
    <div className="flex items-center border rounded-xl border-white-100 px-3">
      <SearchIcon className="text-gray-500 mr-2" />

      <input
        type="text"
        placeholder="EMP_ID and NAME "
        value={S1}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          S2(event.target.value)
        }
        className="outline-none w-full ml-2"
      />
    </div>
  );
};