export type access =
  | "user"
  | "admin"
  | "blockForLogin"
  | "blockForVerify"
  | "blockForDuplicate"
  | "blockForAccess"
  | "blockForToken"
  | "blockForUpdate";

export interface user {
  tel?: string;
  name?: string;
  company?: string;
  position?: string;
  code?: string;
  access?: access;
  verified?: boolean;
  lastCode?: number;
  lastVerify?: number;
  lastSignup?: number;
  lastSignin?: number;
  lastProfileUpdate?: number;
  lastMobileToken?: string;
  lastMobileTokenGenerate?: number;
  lastDesktopToken?: string;
  lastDesktopTokenGenerate?: number;
  lastDeveloperVerify?: number;
  lastDeveloperSignin?: number;
  lastDeveloperToken?: string;
  lastDeveloperTokenGenerate?: number;
}

export interface request {
  tel: string;
  token: string;
}

export type accessRequest = request;

export interface signinRequest {
  tel: string;
}

export interface verifyRequest {
  tel: string;
  code: string;
}

export interface response {
  ok: boolean;
  msg?: string;
  nextOrd?: "goToLogin";
}

export interface accessResponse extends response {
  token?: string;
  access?: access;
  serverMsg?: string;
}

export type signinResponse = response;

export interface verifyResponse extends response {
  token?: string;
  user?: user;
}

export interface accessFile {
  tel: string;
  token: string;
}
