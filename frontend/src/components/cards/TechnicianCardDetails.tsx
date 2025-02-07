import { capitalizeFirstLetter, formatDate } from "@/utils";
import { Briefcase, CalendarDays, Map, Star } from "lucide-react";

interface TechnicianCardDetailsProps {
  country_of_origin: string;
  occupation: string;
  date_joined: string;
  average_rating: number;
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center space-x-0">
      {[...Array(5)].map((_, index) => {
        const fullStar = index + 1 <= rating;
        const halfStar = index + 0.5 <= rating;
        return (
          <Star
            key={index}
            className={`fill-current text-pumpkin ${!fullStar && halfStar ? "fill-opacity-50" : ""}`}
          />
        );
      })}
    </span>
  );
}

export default function TechnicianCardDetails({
  country_of_origin,
  occupation,
  date_joined,
  average_rating,
}: TechnicianCardDetailsProps) {
  return (
    <div className="space-y-2">
      <p className="flex items-center space-x-2">
        <Map className="card-icon" />
        <span className="tab-font">Country: </span>
        <span className="tab-font">{country_of_origin}</span>
      </p>

      <p className="flex items-center space-x-2">
        <Briefcase className="card-icon" />
        <span className="tab-font">Occupation: </span>
        <span className="tab-font">{capitalizeFirstLetter(occupation)}</span>
      </p>

      <p className="flex items-center space-x-2">
        <Star className="card-icon" />
        <span className="tab-font">Average Rating: </span>
        <RatingStars rating={average_rating} />
      </p>

      <p className="flex items-center space-x-2">
        <CalendarDays className="card-icon" />
        <span className="tab-font">Joined Date: </span>
        <span className="tab-font">{formatDate(date_joined).toString()}</span>
      </p>
    </div>
  );
}
