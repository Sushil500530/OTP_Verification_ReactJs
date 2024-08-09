import { useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import OtpInput from './views/otp';
import { SiWelcometothejungle } from "react-icons/si";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { app } from './firebase/firebase.config';
import { ImSpinner2 } from "react-icons/im";
function App() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const auth = getAuth(app);

  const onCaptchaVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha', {
        'size': 'invisible',
        'callback': (response) => {
          console.log(response)
          handleSubmit()
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
        'expired-callback': () => {
          console.log("reCAPTCHA expired. Please solve it again.")
          alert("reCAPTCHA expired. Please solve it again.")
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
        }
      }, auth);
      
      // Set a timer to trigger the 'expired-callback' after 2 minutes
      setTimeout(() => {
        window.recaptchaVerifier.clear(); 
      }, 120000); // 120000 milliseconds = 2 minutes
      
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    onCaptchaVerify()
    console.log(phone)
    const appVerifier = window.recaptchaVerifier
    await signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        alert("OTP sended successfully")
        // ...
      }).catch((error) => {
        console.log(error)
        alert(error.message)
        setLoading(false);

      });
  }

  const handleVerifyOtp = (otp) => {
    console.log('Entered OTP:', otp);
    setLoading(true);
    window.confirmationResult.confirm(otp)
      .then(async (result) => {
        // User signed in successfully.
        const user = result.user;
        setUser(user)
        console.log(user, result)
        // ...
      }).catch((error) => {
        alert(error.message)
        console.log(error)
      });
  };
  
  console.log("user is :" ,user)

  return (
    <div className='w-[350px] mx-auto text-white'>
      {
        user ? (
          <div className='flex items-center justify-center flex-col gap-2 pt-10'>
            
              <SiWelcometothejungle className='h-20 w-20 text-green-500' />  {/* Icon */}
              <h1 className='text-[2.3rem] font-bold'>Welcome,</h1>
              <button onClick={() => setUser(null)}
                className='w-full px-4 py-2 rounded-md bg-green-500 text-white font-medium my-4 hover:bg-green-600 transition'
                >Logout</button>  {/* Logout functionality */}
              <p>This is your verified phone number</p> 
              <strong>{user?.user?.phoneNumber}</strong>
          </div>
        ) : (
          <>
            <h1 className='text-[1.8rem] text-center align-baseline my-8'>Phone Number Verification!</h1 >

            <div className='text-black'>
              {showOTP ? (
                <OtpInput length={6} onVerify={handleVerifyOtp} />
              ) : (
                <form onSubmit={handleSubmit}>
                  <PhoneInput
                    country={'bd'}
                    value={phone}
                    onChange={phone => setPhone("+" + phone)}
                  />
                  <button type='submit' className='w-full px-4 py-2 rounded-md bg-green-500 text-white font-medium my-4 hover:bg-green-600 transition flex items-center justify-center gap-2'>
                    {loading ? (<span className='flex items-center justify-center gap-2 '><ImSpinner2 className=' animate-spin' /> Loading...</span>)
                      :
                      (" Send code via SMS")
                    }
                  </button>
                  <div id='recaptcha'></div>
                </form>
              )}

            </div>
          </>
        )
      }

    </div>
  )
}

export default App
