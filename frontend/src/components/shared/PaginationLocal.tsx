import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

const PaginationLocal = ({ totalPages, currentPage }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const type = searchParams.get("type") || "owned";
    router.push(`?page=${newPage}&type=${type}`, { scroll: false });
  };

  return (
    <Pagination className="bg-platinum dark:bg-eerieBlack dark:text-platinum mt-4 rounded-full">
      <PaginationContent>
        <PaginationItem className="cursor-pointer">
          <PaginationPrevious
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink className="h3-semibold font-robotoSlab inline-flex items-center rounded-md border border-transparent bg-blue-700 text-white dark:text-white">
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem className="cursor-pointer">
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && handlePageChange(currentPage + 1)
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationLocal;
