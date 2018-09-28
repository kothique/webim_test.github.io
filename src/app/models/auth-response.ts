interface Success {
  access_token: string;
  expires_in: string;
  user_id: string;
  state: string;
}

interface Failure {
  error: string;
  error_reason?: string;
  error_description: string;
  state: string;
}

export type AuthResponse = Success | Failure;
