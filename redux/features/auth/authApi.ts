import { apiSlice } from '@/redux/apiSlice';
import { EndpointBuilder } from '@reduxjs/toolkit/query';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    login: builder.mutation({
      query: (credentials: Login) => ({
        url: '/user/login',
        method: 'POST',
        body: credentials,
      }),
      // invalidatesTags: ['users'],
    }),

    signup: builder.mutation({
      query: (credentials: Signup) => ({
        url: '/user/register',
        method: 'POST',
        body: credentials,
      }),
      // invalidatesTags: ['users'],
    }),

    // verify signup otp
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: '/user/verify-signup-otp',
        method: 'POST',
        body: data,
      }),
      // invalidatesTags: ['users'],
    }),

    // resend signup otp

    resendOtp: builder.mutation({
      query: (email: string) => ({
        url: '/user/resend-otp',
        method: 'POST',
        body: { email },
      }),
      // invalidatesTags: ['users'],
    }),

    // GET OTP FORGOT PASSWORD
    // getOtpForgotPassword: builder.mutation({
    //   query: (email: string) => ({
    //     url: '/user/forget-password',
    //     method: 'POST',
    //     body: { email },
    //   }),
    //   // invalidatesTags: ['users'],
    // }),

    // verify forgot password otp
    verifyResendOtp: builder.mutation({
      query: (data) => ({
        url: '/user/verify-resend-otp',
        method: 'POST',
        body: data,
      }),
      // invalidatesTags: ['users'],
    }),

    // reset password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/user/reset-password',
        method: 'POST',
        body: data,
      }),
      // invalidatesTags: ['users'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  // useGetOtpForgotPasswordMutation,
  useVerifyResendOtpMutation,
  useResetPasswordMutation,
} = authApi;

// how to sue useResetPasswordMutation
// const [resetPassword, { isLoading: resetPasswordLoading }] = useResetPasswordMutation();
