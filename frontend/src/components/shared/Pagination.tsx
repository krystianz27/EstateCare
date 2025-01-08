import { setCurrentPage } from "@/lib/redux/features/users/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks/typedHooks";
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
}

const PaginationSection = ({ totalPages }: PaginationProps) => {
  const dispatch = useAppDispatch();

  const currentPage = useAppSelector((state) => state.user.page);

  const handlePreviousClick = () => {
    if (currentPage > 1) dispatch(setCurrentPage(currentPage - 1));
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) dispatch(setCurrentPage(currentPage + 1));
  };

  return (
    <Pagination className="bg-platinum dark:bg-eerieBlack dark:text-platinum mt-4 rounded-full">
      <PaginationContent>
        <PaginationItem className="cursor-pointer">
          <PaginationPrevious onClick={handlePreviousClick} />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink className="h3-semibold font-robotoSlab inline-flex items-center rounded-md border border-transparent bg-blue-700 text-white dark:text-white">
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem className="cursor-pointer">
          <PaginationNext onClick={handleNextClick} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationSection;
