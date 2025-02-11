import { setCurrentPage as setUserCurrentPage } from "@/lib/redux/features/users/userSlice";
import { setCurrentPage as setPostCurrentPage } from "@/lib/redux/features/posts/postSlice";
import { setCurrentPage as setDocumentCurrentPage } from "@/lib/redux/features/document/documentSlice";

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
  entityType: "user" | "post" | "document";
}

const PaginationSection = ({ totalPages, entityType }: PaginationProps) => {
  const dispatch = useAppDispatch();

  const currentPage = useAppSelector((state) => {
    if (entityType === "user") return state.user.page;
    if (entityType === "post") return state.post.page;
    if (entityType === "document") return state.document.page;
    return 1;
  });

  const setCurrentPageAction =
    entityType === "user"
      ? setUserCurrentPage
      : entityType === "post"
        ? setPostCurrentPage
        : setDocumentCurrentPage;

  const handlePreviousClick = () => {
    if (currentPage > 1) dispatch(setCurrentPageAction(currentPage - 1));
  };

  const handleNextClick = () => {
    if (currentPage < totalPages)
      dispatch(setCurrentPageAction(currentPage + 1));
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
