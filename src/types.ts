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
  _id: string;
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

export interface makeAppIdRequest extends request {
  name: string;
}

//Response
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

export interface makeAppIdResponse extends response {
  _id?: string;
}

export interface accessFile {
  token: string;
}

export interface appConfig {
  _id?: string;
  name: string;
  label: string;
  version?: string;
}
