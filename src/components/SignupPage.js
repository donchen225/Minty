import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from '../actions/auth';
import { BoxLayout, BoxLayoutBox, Title, Form, Input, SubmitButton, LoginLink, ButtonContainer, FacebookButton, GoogleButton, ButtonText, Footer, FooterText, Message, ErrorMessage, Line } from '../styles/Authentication';

const SignupPage = () => {
    const dispatch = useDispatch();

    const message = useSelector(state => state.auth.message);
    const errorMessage = useSelector(state => state.auth.errorMessage);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onFirstNameChange = (e) => {
        console.log('first name changed');
        setFirstName(e.target.value);
    }
    const onLastNameChange = (e) => {
        console.log('last name changed');
        setLastName(e.target.value);
    }
    const onEmailChange = (e) => {
        console.log('email changed');
        setEmail(e.target.value);
    }
    const onPasswordChange = (e) => {
        console.log('password changed');
        setPassword(e.target.value);
    }
    const onSubmit = (e) => {
        console.log('onSubmit in SignupPage is called');
        e.preventDefault();
        dispatch(registerUser({ firstName, lastName, email, password }));
    }

    return (
        <BoxLayout>
            <BoxLayoutBox>
                <Title> Join Minty </Title>
                <Form onSubmit={onSubmit}>
                    <Input
                        placeholder="First name"
                        type="text"
                        autoFocus
                        value={firstName}
                        onChange={onFirstNameChange}
                    />
                    <Input
                        placeholder="Last name"
                        type="text"
                        autoFocus
                        value={lastName}
                        onChange={onLastNameChange}   
                    />
                    <Input 
                        placeholder="Email"
                        type="email"
                        autoFocus
                        value={email}
                        onChange={onEmailChange}
                    />    
                    <Input 
                        placeholder="Password"
                        type="text"
                        autoFocus
                        value={password}
                        onChange={onPasswordChange}
                    />
                    {
                        errorMessage ? <ErrorMessage> {errorMessage} </ErrorMessage> :
                        (message ? <Message> {message} </Message> : null)
                    }
                    <SubmitButton 
                        type="submit" 
                    > 
                        Continue 
                    </SubmitButton>
                </Form>
                <Line/>
                <ButtonContainer>
                    <FacebookButton> 
                        <img src="/images/facebook.svg" alt="facebook-logo" width="20" height="30"/>
                        <ButtonText> Continue </ButtonText>
                    </FacebookButton>
                    <GoogleButton> 
                        <img src="/images/google.svg" alt="google-logo" width="20" height="30"/>
                        <ButtonText> Continue </ButtonText> 
                    </GoogleButton>
                </ButtonContainer>
                <Line/>
                <Footer>
                    <FooterText> Already a member? </FooterText>
                    <LoginLink to="/"> Log in </LoginLink>
                </Footer>
            </BoxLayoutBox>
        </BoxLayout>
    )
}

export default SignupPage;

