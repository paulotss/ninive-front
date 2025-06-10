export type SignInCredential = {
  email: string
  password: string
}

export type SignInResponse = {
  token: string
  user: {
    email: string
    id: number
    authority: string[]
  }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
  userName: string
  email: string
  password: string
}

export type ForgotPassword = {
  email: string
}

export type ResetPassword = {
  password: string
}
