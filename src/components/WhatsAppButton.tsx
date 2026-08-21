import Link from "next/link";

const WHATSAPP_NUMBER = "2347041041810"; // 0704 104 1810
const WHATSAPP_MESSAGE = "Hi Gramel Education, I'd like to find out more.";

export default function WhatsAppButton() {
  return (
    <Link
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Gramel Education on WhatsApp"
      prefetch={false}
      className="fixed right-6 bottom-6 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg duration-300 hover:scale-110 hover:bg-[#20bd5a]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="1.75em"
        height="1.75em"
        fill="currentColor"
      >
        <path d="M12.04 2c-5.52 0-10 4.48-10 10c0 1.76.46 3.48 1.34 5L2 22l5.13-1.35c1.46.8 3.1 1.22 4.77 1.22h.01c5.52 0 10-4.48 10-10c0-2.67-1.04-5.18-2.93-7.07A9.94 9.94 0 0 0 12.04 2m0 18.15h-.01c-1.5 0-2.97-.4-4.25-1.15l-.3-.18l-3.05.8l.82-2.97l-.2-.31a8.15 8.15 0 0 1-1.25-4.35c0-4.5 3.66-8.16 8.16-8.16c2.18 0 4.23.85 5.77 2.39a8.1 8.1 0 0 1 2.39 5.78c0 4.5-3.67 8.15-8.08 8.15m4.47-6.11c-.24-.12-1.45-.72-1.68-.8c-.22-.08-.39-.12-.55.13c-.16.24-.63.8-.78.96c-.14.16-.28.18-.53.06c-.24-.12-1.02-.38-1.95-1.2c-.72-.64-1.2-1.44-1.35-1.68c-.14-.24-.02-.37.11-.49c.11-.11.24-.28.36-.42s.16-.24.24-.4c.08-.16.04-.3-.02-.42c-.06-.12-.55-1.32-.75-1.81c-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3c-.22.24-.85.83-.85 2.02s.87 2.35.99 2.51c.12.16 1.71 2.61 4.14 3.66c.58.25 1.03.4 1.38.51c.58.18 1.11.16 1.53.1c.47-.07 1.45-.59 1.65-1.16c.2-.57.2-1.06.14-1.16c-.06-.1-.22-.16-.46-.28"></path>
      </svg>
    </Link>
  );
}
