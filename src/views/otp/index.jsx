/* eslint-disable react/prop-types */
import { useState, useRef } from 'react';

const OtpInput = ({ length = 6, onVerify }) => {
    const [otp, setOtp] = useState(Array(length).fill(''));
    const inputs = useRef([]);

    const handleChange = (e, index) => {
        const { value } = e.target;
        if (/^[0-9]$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < length - 1) {
                inputs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (onVerify) {
            onVerify(otpValue);
        }
    };

    return (
        <div>
            <form onSubmit={handleVerifyOtp}>
                {otp.map((_, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={otp[index]}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={(el) => (inputs.current[index] = el)}
                        className='w-[40px] h-[40px] mx-2 text-center text-md border border-green-500 rounded-md text-white'
                    />
                ))}
                <button
                    onClick={handleVerifyOtp}
                    type='submit' className='w-full px-4 py-2 rounded-md bg-green-500 text-white font-medium my-4 hover:bg-green-600 transition'
                >
                    Verify OTP
                </button>
            </form>

        </div>
    );
};

export default OtpInput;
