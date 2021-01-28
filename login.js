function login(){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjAxMjg1MDg0Mjg5NTUwMGJhYTMwNTFkIiwicHNldWRvIjoic2NvdHQifSwiaWF0IjoxNjExODI2NTc1LCJleHAiOjE2MTE4MzczNzV9.OVqz5x3MEX8kaHd5r3L71STWhnX7d5bYjrAsgzB3Aso");
    myHeaders.append("Content-Type", "application/json");


    var pseudo = document.getElementById('pseudo').value
    var pwd = document.getElementById('password').value
  
    var raw = JSON.stringify({"pseudo": pseudo, "password": pwd});
  
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
  
    fetch("http://localhost:8080/auth/login", requestOptions)
      .then(response => response.text())
      .then((data) => {
        localforage.setItem("token", data.access_token)
        window.location.replace("https://awp-tp.netlify.app/");
      })
      .catch(error => console.log('error', error));
  }
  (data) => localforage.setItem("data", data)