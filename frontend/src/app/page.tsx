import Chess from "@/chess/chess";

export default function Home() {
  return (
    <main className="relative">
      <div className="bg-[#00000080] absolute w-full h-full z-10 flex items-center justify-center">
        <a
          href="/login"
          className="bg-[#ffd59b] cursor-pointer px-[6px] py-[4px] rounded-[6px] border-2 border-solid border-[#000] font-[500] text-[#b26e41]"
        >
          Login to play
        </a>
      </div>
      <Chess />
    </main>
  );
}
