import { ChevronDown } from "lucide-react";

type SearchableSelectProps = {
  options: string[];
  placeholder?: string;
  onSelect?: (value: string) => void;
};

export default function SearchableSelect({
  options,
  placeholder = "Select an option...",
}: SearchableSelectProps) {
  return (
    <div className="relative w-full text-black">
      <input
        type="text"
        list="searchable-options"
        placeholder={placeholder}
        className="peer w-full rounded-[0.625rem] border border-black px-4 py-3 transition duration-300 hover:border-primary-300 focus:border-primary-300 focus:ring-2 focus:ring-primary-300 focus:outline-none"
      />
      <ChevronDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 duration-150 peer-hover:pointer-events-none peer-hover:opacity-0 peer-focus:pointer-events-none peer-focus:opacity-0" />

      {/* Datalist options */}
      <datalist id="searchable-options">
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </div>
  );
}

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// === USE THIS SELECT COMPONENT IF SEARCH FUNCTIONALITY IS NOT NEEDED ===
// function CustomSelect({
//   options,
//   placeholder = "Select an option...",
//   onSelect,
// }: SearchableSelectProps) {
//   return (
//     <Select onValueChange={onSelect}>
//       <SelectTrigger className="w-full">
//         <SelectValue placeholder={placeholder} />
//       </SelectTrigger>
//       <SelectContent>
//         {options.map((item) => (
//           <SelectItem key={item} value={item}>
//             {item}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   );
// }

// === USE THIS COMPONENT IF CUSTOM SEARCH FUNCTIONALITY IS NEEDED WITH STYLED DROPDOWN LIST ===
// export default function SearchableSelect({
//   options,
//   placeholder = "Select an option...",
//   onSelect,
// }: SearchableSelectProps) {
//   const [query, setQuery] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const dropdownRef = useRef<HTMLUListElement>(null);
//   const debounceRef = useRef<NodeJS.Timeout | null>(null);

//   // Filter options based on the query
//   useEffect(() => {
//     // Debounced options filtering
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(() => {
//       const filtered = options.filter((opt) =>
//         opt.toLowerCase().includes(query.toLowerCase()),
//       );
//       setFilteredOptions(filtered);
//     }, 300);
//   }, [query, options]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         inputRef.current &&
//         !inputRef.current.contains(event.target as Node) &&
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   // handle selecting an option from the dropdown
//   const handleSelect = (value: string) => {
//     setQuery(value);
//     setIsOpen(false);
//     onSelect?.(value);
//   };

//   return (
//     <div className="relative w-full text-black">
//       <input
//         type="text"
//         placeholder={placeholder}
//         value={query}
//         ref={inputRef}
//         onChange={(e) => setQuery(e.target.value)}
//         onFocus={() => {
//           setIsOpen(true);
//           setFilteredOptions(options); // Reset options when focused
//         }}
//         onBlur={() => setTimeout(() => setIsOpen(false), 300)} // Delay to allow click on dropdown items
//         className="w-full rounded-[0.625rem] border border-black px-4 py-3 transition duration-300 hover:border-primary-300 focus:border-primary-300 focus:ring-2 focus:ring-primary-300 focus:outline-none"
//       />
//       <ChevronDown className="absolute top-1/2 right-4 -translate-y-1/2" />

//       {isOpen && (
//         <ul
//           ref={dropdownRef}
//           className="absolute z-10 mt-1 max-h-96 w-full overflow-auto rounded-md border border-gray-200 bg-white p-1.5 shadow-lg"
//         >
//           {filteredOptions.length === 0 ? (
//             <li className="px-4 py-2 text-gray-500">No results found</li>
//           ) : (
//             filteredOptions.map((option) => (
//               <li
//                 key={option}
//                 onClick={() => handleSelect(option)}
//                 className="cursor-pointer rounded-sm px-2.5 py-2 transition hover:bg-primary-300/20"
//               >
//                 {option}
//               </li>
//             ))
//           )}
//         </ul>
//       )}
//     </div>
//   );
// }
