# Minty

## General Information
This project will allow users to link their institutional bank accounts using the Plaid API and gain access to their transactional data in a searchable and filterable table. Users will also be able to add, update, and delete individual cash transactions. This app will have a complete Node.js authentication API with Register, Login, Logout, Email Verification, and Password Reset using JWT, Passport.js, and Sendgrid.    

## Technologies
This project uses the following technologies:
* React and React Router for the frontend
* Express and Node for the backend
* MongoDB and Mongoose for the database
* Redux for state management
* Plaid for bank account linkage and transaction data
* Jsonwebtoken and Passport for authentication
* Sendgrid for emails
* Axios for HTTP client requests to backend 
* Express-validator for server side validation and sanitization
* Bcryptjs for hashing of passwords
* Material-table for data table
* Styled Components for component level styles 
* Webpack for module bundling of JS and CSS files
* Babel for JS transpiler to convert ES6+ code to ES5

## Visual Studio Code Plugins
* ES7 React/Redux/JS snippets
* Bracket Pair Colorize
* Prettier formatter for Visual Studio Code
* Live Server
* Node.js Modules Intellisense

## Chrome Extensions
* React Developer Tools
* Redux Developer Tools
* Allow-Control-Allow-Origin

## Configuration
### Mongo
Add your own `MONGOURI` from your mLab database in `configs/keys.js`

### JWT
Add your `JWT_SECRET` in `configs/keys.js`

### Plaid
Add your Plaid API keys (`PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_PUBLIC_KEY`, and `PLAID_REDIRECT_URI`) in `configs/keys.js`

### Google API
Add your `GOOGLE_API_KEY`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` in `configs/keys.js`

### Send Grid
Add your `SENDGRID_API_KEY_ID`, `SENDGRID_API_KEY`, and `from_email` in `configs/keys.js`

## Quick Start
To run this project, install dependencies for server and client
`npm install`

Run Webpack
`npm run build:dev`

Run Server
`npm run start`

## API Documentation
### Authentication Routes
* **Route**:    *`POST`* `/users`
* **Description**:  Signup user and create new user profile
* **Access**:   Public
* **Request Body**:
```javascript
    {
        email: string,
        password: string,
        firstName: string,
        lastName: string
    }
```
* **Response Body**:
```javascript
    {
        message: string
    }
```
![createTransaction](https://github.com/donchen225/Minty/tree/main/public/images/postman/createTransaction.png) 

* **Route**:   *`POST`* `/users/login`
* **Description**:    Login user
* **Access**:  Public
* **Request Body**: 
```javascript
    {
        email: string,
        password: string
    }
```
* **Response Body**:
```javascript
    {
        user: {
            isVerified,
            _id: string,
            firstName: string,
            lastName: string,
            email: string,
            createdAt: date,
            updatedAt: date
        },
        token: string
    }
```
![loginUser](https://github.com/donchen225/Minty/tree/main/public/images/postman/loginUser.png)

* **Route**:   *`POST`* `/auth/google`
* **Description**:    Authenicate with Google 
* **Access**:  Private
* **Request Body**: 
```javascript
    {
        googleTokenId: string
    }
```
* **Response Body**:
```javascript
    {
        user: {
            isVerified,
            _id: string,
            firstName: string,
            lastName: string,
            email: string,
            createdAt: date,
            updatedAt: date
        },
        token: string
    }
```

* **Route**:   *`POST`* `/users/logout`
* **Description**:    Logout currently authenticated user of current session
* **Access**:  Private
* **Request Body**: 
    `null`
* **Response Body**:
```javascript
    {
        success: true
    }  
```
![logoutUser](https://github.com/donchen225/Minty/tree/main/public/images/postman/logoutUser.png)

* **Route**:   *`POST`* `/auth/remove`
* **Description**:    Logout a specific user of a specific session
* **Access**:  Public
* **Request Body**: 
```javascript
    {
        id_token: string, 
        auth_token: string
    }
```
* **Response Body**:
```javascript
    {
        success: true
    }
```
![unAuthenticateUser](https://github.com/donchen225/Minty/tree/main/public/images/postman/unAuthenticateUser.png)

* **Route**:   *`POST`* `/users/logoutAll`
* **Description**:    Logout currently authenticated user of all sessions
* **Access**:  Private
* **Request Body**: 
    `null`
* **Response Body**:
```javascript
    {
        success: true
    }
```
![logoutAll](https://github.com/donchen225/Minty/tree/main/public/images/postman/logoutAll.png)

## Email Verification Routes
* **Route**:    *`GET`* `/verify/:token`
* **Description**:     Verify user
* **Access**:   Public
* **Params**:   `token=[string]`
* **Response Body**:
```javascript
    {
        message: string
    }
```
![verifyUser](https://github.com/donchen225/Minty/tree/main/public/images/postman/verifyUser.png)

* **Route**:    *`POST`* `/resend`
* **Description**:     Resend Verification Email
* **Access**:   Public
* **Request Body**: 
```javascript
    {
        email: string
    }
```
* **Response Body**:
```javascript
    {
        message: string
    }
```
![resendVerificationEmail](https://github.com/donchen225/Minty/tree/main/public/images/postman/resendVerificationEmail.png)

### User Routes
* **Route**:   *`GET`* `/users/me`
* **Description**:    Read profile of currently authenticated user
* **Access**:  Private
* **Request Body**:
    `null` 
* **Response Body**: 
```javascript
    {
        user: {
            isVerified,
            _id: string,
            firstName: string,
            lastName: string,
            email: string,
            createdAt: date,
            updatedAt: date
        },
        token: string
    }
```
![readProfile](https://github.com/donchen225/Minty/tree/main/public/images/postman/readProfile.png)

* **Route**:   *`PATCH`* `/users/me`
* **Description**:    Update profile of currently authenticated user
* **Access**:  Private
* **Request Body**:
```javascript
    {
        email: string,
        password: string,
        firstName: string,
        lastName: string
    }
```
* **Response Body**:
```javascript
    {
        user: {
            isVerified,
            _id: string,
            firstName: string,
            lastName: string,
            email: string,
            createdAt: date,
            updatedAt: date
        },
        token: string
    }
```
![updateUser](https://github.com/donchen225/Minty/tree/main/public/images/postman/updateUser.png)

* **Route**:   *`DELETE`* `/users/me`
* **Description**:    Delete profile of currently authenticated user
* **Access**:  Private
* **Request Body**: 
    `null`
* **Response Body**:
```javascript
    {
        user: {
            isVerified,
            _id: string,
            firstName: string,
            lastName: string,
            email: string,
            createdAt: date,
            updatedAt: date
        },
        token: string
    }
```
![deleteUser](https://github.com/donchen225/Minty/tree/main/public/images/postman/deleteUser.png)

### Password Reset Routes
* **Route**:    *`POST`* `/auth/recover`
* **Description**:     Recover Password - Generate password reset token and send password reset email
* **Access**:   Public
* **Request Body**:
```javascript
    {
        email: string
    }
```
* **Response Body**:
```javascript
    {
        message: string
    }
```
![recoverPassword](https://github.com/donchen225/Minty/tree/main/public/images/postman/recoverPassword.png)

* **Route**:    *`GET`* `/auth/reset/:token`
* **Description**:     Validate password reset token and show the password reset view
* **Access**:   Public
* **Params**:   `token=[string]`
* **Response Body**:
    `null`    

![getPasswordResetView](https://github.com/donchen225/Minty/tree/main/public/images/postman/getPasswordResetView.png)

* **Route**:    *`POST`* `/auth/reset/:token`
* **Description**:     Confirm and reset password
* **Access**:   Public
* **Params**:   `token=[string]`
* **Request Body**: 
```javascript
    {
        password: string
    }
```
* **Response Body**:
```javascript
    {
        message: string
    }
```
![confirmPassword](https://github.com/donchen225/Minty/tree/main/public/images/postman/confirmPassword.png)

### Plaid API Routes
* **Route**:    *`POST`* `/link/token/create`
* **Description**:     Create link token and send back to client 
* **Access**:   Private
* **Request Body**: 
    `null`
* **Response Body**:
```javascript
    {
        link_token: string
    }
```
![createLinkToken](https://github.com/donchen225/Minty/tree/main/public/images/postman/createLinkToken.png)

* **Route**:    *`POST`* `/item/public_token/exchange`
* **Description**:     Trades public token for access token and stores credentials in database
* **Access**:   Private
* **Request Body**:
```javascript
    {
        institution: {
            name: string,
            institution_id: string
        },
        account_id: string,a
        account: {
            id: string,
            name: string,
            type: string,
            subtype: string,
            mask: string
        },
        accounts: [
            {
                id: string,
                mask: string,
                name: string,
                subtype: string,
                type: string 
            }
        ],
        link_session_id: string,
        public_token: string
    }
``` 
* **Response Body**:
```javascript
    {
        ownerId: string,
        accessToken: string,
        itemId: string,
        institutionId: string,
        institutionName: string
    }
```

* **Route**:    *`POST`* `/transactions/get`
* **Description**:     Fetch transactions from past 30 days from all linked accounts from plaid API
* **Access**:   Private
* **Request Body**:
```javascript
    [
        {
            ownerId: string,
            accessToken: string,
            itemId: string,
            institutionId: string,
            institutionName: string
        }
    ]
```
* **Response Body**:
```javascript
    [
        {
            accountName: string,
            transactions: [
                date: date,
                category: string,
                name: string,
                amount: integer
            ]
        }
    ]
```
![getPlaidTransactions](https://github.com/donchen225/Minty/tree/main/public/images/postman/getPlaidTransactions.png)

### Account Routes
* **Route**:    *`GET`* `/accounts`
* **Description**:     Get all accounts linked with plaid of currently authenticated user
* **Access**:   Private
* **Request Body**:
    `null`
* **Response Body**:
```javascript
    [
        {
            ownerId: string,
            accessToken: string,
            itemId: string,
            institutionId: string,
            institutionName: string
        }
    ]
``` 
![getAccounts](https://github.com/donchen225/Minty/tree/main/public/images/postman/getAccounts.png)

* **Route**:    *`DELETE`* `/accounts/:id`
* **Description**:     Delete account with given id
* **Access**:   Private
* **Params**:   `id = [string]`
* **Response Body**:
```javascript
    {
        success: true
    }
```
![deleteAccount](https://github.com/donchen225/Minty/tree/main/public/images/postman/deleteAccount.png)

### Cash Transaction Routes
* **Route**:   *`POST`* `/transactions`
* **Description**:    Create transaction for currently authenticated user
* **Access**:  Private
* **Request Body**:  
```javascript
    {
        description: string,
        amount: integer,
        date: date,
        type: string
    }
```
* **Response Body**:
```javascript
    {
        ownerId: string,
        description: string,
        amount: integer,
        date: date,
        type: string
    }
```
![createCashTransaction](https://github.com/donchen225/Minty/tree/main/public/images/postman/createCashTransaction.png)

* **Route**:   *`GET`* `/transactions`
* **Description**:    Retrieve transactions for currently authenticated user
* **Access**:  Private
* **Query**:   
```javascript
    {
        category: string,
        text: string,
        limit: integer,
        sortBy: string,
    }
```
* **Response Body**:
```javascript
    [
        {
            ownerId: string,
            description: string,
            amount: integer,
            date: date,
            type: string
        }
    ]
```
![getCashTransactions1](https://github.com/donchen225/Minty/tree/main/public/images/postman/getCashTransactions1.png)

![getCashTransactions2](https://github.com/donchen225/Minty/tree/main/public/images/postman/getCashTransactions2.png)

* **Route**:   *`GET`* `/transactions/:id`
* **Description**:    Retrieve transaction if transaction belongs to currently authenticated user
* **Access**:  Private
* **Params**:   `id = [string]`
* **Response Body**:
```javascript
    {
        ownerId: string,
        description: string,
        amount: integer,
        date: date,
        type: string
    }
```
![getCashTransaction](https://github.com/donchen225/Minty/tree/main/public/images/postman/getCashTransaction.png)

* **Route**:   *`PATCH`* `/transactions/:id`
* **Description**:    Update transaction if transaction belongs to currently authenticated user
* **Access**:  Private
* **Params**:   `id = [string]`
* **Response Body**:
```javascript
    {
        ownerId: string,
        description: string,
        amount: integer,
        date: date,
        type: string
    }
```
![updateCashTransaction](https://github.com/donchen225/Minty/tree/main/public/images/postman/updateCashTransaction.png)

* **Route**:   *`DELETE`* `/transactions/:id`
* **Description**:    Delete transaction if transaction belongs to currently authenticated user
* **Access**:  Private
* **Params**:   `id = [string]`
* **Response Body**:
```javascript
    {
        ownerId: string,
        description: string,
        amount: integer,
        date: date,
        type: string
    }
```
![deleteCashTransaction](https://github.com/donchen225/Minty/tree/main/public/images/postman/deleteCashTransaction.png)