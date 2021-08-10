import axios from "axios";

export const setAuthToken = () => {
    console.log("setAuthToken is called");
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        // Apply authorization token to every request if logged in
        axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    } else {
        // Delete auth header
        delete axios.defaults.headers.common["Authorization"];
    }
};