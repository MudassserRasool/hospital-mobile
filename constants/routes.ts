interface Routes {
  ONBOARDING_START: string;
  ONBOARDING_FIRST: string;
  ONBOARDING_SECOND: string;
  ONBOARDING_THIRD: string;
  LOGIN: string;
  SIGNUP: string;
  ENTER_PHONE_TO_GET_OTP: string;
  OTP_VERIFICATION: string;
  CUSTOMER_HOME: string;
}

const ROUTES: Routes = {
  // onboarding
  ONBOARDING_START: '/',
  ONBOARDING_FIRST: 'IntroFirst',
  ONBOARDING_SECOND: 'IntroSecond',
  ONBOARDING_THIRD: 'IntroThird',

  // auth
  LOGIN: 'Login',
  SIGNUP: 'Register',
  ENTER_PHONE_TO_GET_OTP: 'EnterNumber',
  OTP_VERIFICATION: 'OtpVerification',

  // customers
  CUSTOMER_HOME: '/(customer)/Home',
};

export default ROUTES;
