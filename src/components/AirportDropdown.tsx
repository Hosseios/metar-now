
import { createPortal } from "react-dom";
import { Suggestion, DropdownPosition } from "@/types/airport";

interface AirportDropdownProps {
  suggestions: Suggestion[];
  dropdownPosition: DropdownPosition;
  query: string;
  searching: boolean;
  onSelect: (icao: string) => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

const AirportDropdown = ({
  suggestions,
  dropdownPosition,
  query,
  searching,
  onSelect,
  onMouseDown
}: AirportDropdownProps) => {
  const DropdownContent = () => (
    <div 
      className="dropdown-portal fixed bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-60 overflow-auto"
      style={{
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 999999
      }}
      onMouseDown={onMouseDown}
    >
      {suggestions.length > 0 ? (
        suggestions.map((s, i) => (
          <button
            type="button"
            key={s.icao + i}
            onClick={() => onSelect(s.icao)}
            onMouseDown={onMouseDown}
            className="block w-full text-left px-4 py-3 hover:bg-slate-700 text-white transition-colors border-b border-slate-700 last:border-b-0"
          >
            <span className="text-sm">{s.display}</span>
          </button>
        ))
      ) : query.length >= 2 && !searching ? (
        <div className="p-4 text-slate-400 text-sm">
          No results found for "{query}".
        </div>
      ) : searching ? (
        <div className="p-4 text-slate-400 text-sm">
          Searching...
        </div>
      ) : null}
    </div>
  );

  return createPortal(<DropdownContent />, document.body);
};

export default AirportDropdown;
