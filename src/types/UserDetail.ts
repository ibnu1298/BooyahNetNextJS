export type UserDetail = {
  user_id: string;
  name: string | null;
  email: string | null;
  photoUrl: string | null;
  verify_email: boolean;
  phone: string | null;
  verify_phone: boolean | null;
  address: string | null;
  role_name: string | null;
  billing_date: string | null;
};

export type ListUser = {
  id: string;
  name: string;
  email: string;
  role_name: string;
  unpaid_payments: string;
  paid_payments: string;
  total_payments: string;
};
export interface GetUserResponse {
  success: boolean;
  message: string;
  data: UserDetail;
}
