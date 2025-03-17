import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type UserState = {
  avatar?: string
  userName?: string
  id?: string | number
  email?: string
  authority?: string[]
}

const initialState: UserState = {
  avatar: '',
  userName: '',
  id: '',
  email: '',
  authority: [],
}

const userSlice = createSlice({
  name: `${SLICE_BASE_NAME}/user`,
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.avatar = action.payload?.avatar
      state.email = action.payload?.email
      state.userName = action.payload?.userName
      state.id = action.payload?.id
      state.authority = action.payload?.authority
    },
  },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
