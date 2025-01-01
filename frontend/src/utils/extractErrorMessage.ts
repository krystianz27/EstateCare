interface ErrorData {
  detail?: string;
  [key: string]: string | string[] | { [key: string]: string[] } | undefined;
}

export default function extractErrorMessage(error: unknown): string | null {
  if (typeof error === "object" && error !== null && "data" in error) {
    const errorData = (error as { data: ErrorData }).data;

    if ("detail" in errorData && typeof errorData.detail === "string") {
      return errorData.detail;
    }

    const messages: string[] = [];

    Object.keys(errorData).forEach((key) => {
      if (key !== "status_code") {
        const fieldError = errorData[key];
        if (Array.isArray(fieldError)) {
          messages.push(...fieldError);
        } else if (typeof fieldError === "object" && fieldError !== null) {
          Object.values(fieldError).forEach(
            (errorMessages: string | string[]) => {
              if (Array.isArray(errorMessages)) {
                messages.push(...errorMessages);
              } else if (typeof errorMessages === "string") {
                messages.push(errorMessages);
              }
            },
          );
        }
      }
    });
    return messages.length > 0 ? messages.join(", ") : null;
  }
  return null;
}
