import { auth } from "@clerk/nextjs/server";
import Navbar from "../_components/navbar";
import { redirect } from "next/navigation";
import { ScrollArea } from "../_components/ui/scroll-area";
import SearchBar from "../_components/searchBar";
import CryptoTable from "./_components/cryptoTable";

const CryptoPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <div className="space-y-4 md:space-y-6 p-4 md:p-6 flex flex-1 min-h-0 flex-col overflow-hidden">
        {/* Título e botão */}
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-3 md:gap-4 animate-fade-in">
          <h1 className="text-xl md:text-2xl font-bold">Crypto</h1>
          <SearchBar />
        </div>
        <ScrollArea className="h-full animate-fade-in-up animation-delay-100">
          <CryptoTable />
        </ScrollArea>
      </div>
    </>
  );
};

export default CryptoPage;
