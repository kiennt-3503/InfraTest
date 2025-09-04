export interface UserLocationResponse {
  data: {
    user_id?: number;
  };
}

export interface UserLocationBody {
  user_id: string | number;
  location_type?: string;
  location_ids?: number[];
  is_live?: boolean;
}
