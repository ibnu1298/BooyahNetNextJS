interface Payment {
  id: string;
  user_id: string;
  nominal: number;
  status: boolean;
  [key: string]: any; // opsional, kalau masih banyak properti lain
}
