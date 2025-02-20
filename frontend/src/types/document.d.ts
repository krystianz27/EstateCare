export interface UploadedByUserData {
  id: string;
  username: string;
  full_name: string;
}

export interface SharedWithUserData {
  id: string;
  username: string;
  full_name: string;
}

export interface DocumentData {
  title: string;
  file: File;
  apartment_uuid?: string | null;
  shared_with_users?: SharedWithUserData[];
}

export type AddDocumentData = DocumentData;

export interface DocumentResponseData {
  id: string;
  title: string;
  created_at: string;
  file_url: string;
  uploaded_by_user_data: UploadedByUserData;
  apartment_uuid: string | null;
  shared_with_users: SharedWithUserData[];
}

export interface DocumentResponse {
  document: DocumentResponseData;
}

export interface MyDocumentsResponse {
  document: {
    count: number;
    next?: string;
    previous?: string;
    results: DocumentResponseData[];
  };
}

export interface ShareOrRevokeDocumentRequest {
  id: string;
  shared_with: string[];
}

export interface DocumentState {
  document: {
    page: number;
  };
}
