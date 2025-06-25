export type UserDetail = {
  user_id: string;
  name: string;
  email: string;
  photoUrl: string;
  verify_email: boolean;
  phone: string | null;
  verify_phone: boolean | null;
  address: string | null;
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
