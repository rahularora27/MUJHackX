import { getAuth, RecaptchaVerifier } from "firebase/auth";
import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer';
import { useLoginMutation, usersApiSlice } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import {toast} from 'react-toastify'
import Loader from '../components/Loader.jsx'
import { signInWithPhoneNumber } from "firebase/auth";
import firebaseConfig from "../../firebase"

const LoginScreen = () => {
    const [number, setNumber] = useState('');
    const [otp, setOTP] = useState('');
    const [isDisabled,setDisabled] = useState(true);


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector((state)=> state.auth)

    useEffect(() => {
        if(userInfo){
            navigate('/profile')
        }
    }, [navigate, userInfo]);


    const submitHandler = async (e) =>{
        try{
            const res = await login({ number }).unwrap();
            dispatch(setCredentials({...res}))
            navigate('/profile')
        }catch(error){
            toast.error(error?.data?.message || error.error)
        }
    }
    const setUpRecaptcha = () => {
        const auth = getAuth();
        window.recaptchaVerifier = new RecaptchaVerifier(
          "sign-in-button",
          {
            size: "invisible",
            callback: (response) => {
              console.log("Captcha Resolved");
              onSignInSubmit();
            },
          },
          auth
        );
      };
    
      const onSignInSubmit = (e) => {
        e.preventDefault();
        const auth = getAuth();
        const phoneNumber = "+91" + number;
        console.log(phoneNumber);
        window.recaptchaVerifier = new RecaptchaVerifier(
          "sign-in-button",
          {
            size: "invisible",
            callback: (response) => {
              console.log("Captcha Resolved");
            },
          },
          auth
        );
        const appVerifier = window.recaptchaVerifier;
    
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
          .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            // console.log(confirmationResult);
            toast.success("OTP is sent");
            setDisabled(false);
          })
          .catch((error) => {
            console.log(error);
          });
      };
    
      const onSubmitOtp = (e) => {
        e.preventDefault();
        const otpInput = otp;
        
        // console.log(code);
        confirmationResult
          .confirm(otpInput)
          .then((result) => {
            const user = result.user;
            toast.success('OTP Correct!')
            submitHandler();
          })
          .catch((error) => {
            console.log(error);
            alert("Incorrect OTP");
          });
      };

  return (
    <FormContainer>
        <h1>Sign In</h1>

        <Form onSubmit={onSubmitOtp}>
            <Form.Group className='my-2' controlId='email'>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type='text' placeholder='Enter Phone Number'
                value={number}
                onChange={(e)=> setNumber(e.target.value)}
                >
                </Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='otp'>
                <Form.Label>OTP</Form.Label>
                <Form.Control type='text' placeholder='OTP'
                value={otp}
                onChange={(e)=> setOTP(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
            
            {isLoading && <Loader/>}

            <Button disabled={isDisabled} type='submit' variant='primary' className='mt-3'>
                Sign In
            </Button>

            <Button id="sign-in-button" onClick={onSignInSubmit} type='button' variant='primary' className='mx-2 mt-3'>
                Get OTP
            </Button>

            <Row className='py-3'>
                <Col>
                New Customer? <Link to='/register'>Register</Link> 
                </Col>
            </Row>
        </Form>
    </FormContainer>
  )
}

export default LoginScreen