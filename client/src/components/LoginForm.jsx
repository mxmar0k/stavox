import { useState } from "react";
import { Eye, EyeClose } from '@styled-icons/remix-line';
import {Link, useNavigate} from "react-router-dom";
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import {
  MainWrapper,
  Form,
  Title,
  Input,
  PasswordInput,
  TogglePasswordVisibility,
  InputWrapper,
  Button,
  NotLoggedIn,
  NotLoggedInSpan,
  ButtonLink,
  ModalBackdrop,
  ModalContainer,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../assets/style/Login-Signup-Forms/Login-SingupStyle.js";

import AuthService from "../utils/auth.js";

export function LoginForm({setIsLoggedIn}) {
  // State hooks for input values
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN_USER);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Function to check if button should be disabled
  const isDisabled = email === '' || password === '';

  // Function to handle password visibility
  const handlePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Function to toggle modal visibility
  const toggleModal = () => setShowModal(!showModal);

  // Function to navigate to home page
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(formState);

    try {
      const { data } = await login({
        variables: { ...formState }
      })
      AuthService.login(data.login.token);
    } catch (e) {
      console.error(e);
    }
    setIsLoggedIn(true);
    navigate('/')
  };

  return (
    <MainWrapper>
      {data ? (
      <Form name={'loginForm'} onSubmit={handleLogin}>
        <Title>Login</Title>
        <Input type="email" placeholder="Email" value={email} name={'email'} autoComplete={'email'}
               onChange={handleChange} required />
        <InputWrapper>
          <PasswordInput type={isPasswordVisible ? 'text' : 'password'} placeholder="Password" value={password}
                         name={'password'} autoComplete={'current-password'}
                 onChange={handleChange} required />
          <TogglePasswordVisibility onClick={e => {
            e.preventDefault()
            handlePasswordVisibility()
          }}>
            {isPasswordVisible ? <Eye size={24} /> : <EyeClose size={24} />}
          </TogglePasswordVisibility>
        </InputWrapper>
        <Button type="submit" disabled={isDisabled}>Login</Button>

        {/*Section if the user doesn't have an account*/}
        <NotLoggedIn>
          <NotLoggedInSpan>
            <span>Don't have an account?</span>
            <ButtonLink onClick={(e) => {
              e.preventDefault()
            }}><Link to={'/signup'}>Sign Up</Link></ButtonLink>
          </NotLoggedInSpan>
          {/*End of section if the user doesn't have an account*/}

          {/*Section if the user forgot the password*/}
          <NotLoggedInSpan>
            <ButtonLink onClick={(e) => {
              e.preventDefault()
              toggleModal()
            }}>Forgot password?</ButtonLink>
          </NotLoggedInSpan>
        </NotLoggedIn>
        {/*End of section if the user forgot the password*/}
      </Form>
      ) : error ( <p>PUTO</p> )}
      {/*Modal for forgot password*/}
      {showModal && (
        <ModalBackdrop onClick={toggleModal}> {/* Clicking on the backdrop will close the modal */}
          <ModalContainer onClick={e => e.stopPropagation()}> {/* Stops click from propagating to the backdrop */}
            <ModalHeader>RESTORE ACCESS</ModalHeader>
            <ModalBody>
              <p>If you have an OnlyFeet account, you will receive a password reset link to this e-mail.</p>
              <Input type="email" placeholder="Email" name={'emailForgot'} autoComplete={'email'} />
            </ModalBody>
            <ModalFooter>
              <Button onClick={toggleModal}>Cancel</Button>
              <Button>Send</Button>
            </ModalFooter>
          </ModalContainer>
        </ModalBackdrop>
      )}
      {/*End of modal for forgot password*/}
    </MainWrapper>
  );
}
