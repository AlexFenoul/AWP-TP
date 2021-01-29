if(!localforage.getItem("token")){
  window.location.replace("https://awp-tp.netlify.app/login");
}

function reduireArray(array, size) {
  if (array.length <= size) {
    return [array];
  }
  return [array.slice(0, size), ...reduireArray(array.slice(size), size)];
}

const dateTimeFormat = Intl.DateTimeFormat("fr");

function afficher(json){
  console.log(json)
	const selections = json

  let html = "";

  selections.forEach(selection => {
    html += '<div class="columns">';
      html += `
            <div class="column">
            <div class="card grow">
              <div class="card-image">
                <figure class="image is-4by3">
                  <img
                    src="${selection.url}"
                    alt="Placeholder image"
                  />
                </figure>
              </div>
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-48x48">
                      <img
                        src="https://via.placeholder.com/30"
                        alt="Placeholder image"
                      />
                    </figure>
                  </div>
                  <div class="media-content">
                    <p class="title is-4">${selection.name}</p>
                  </div>
                </div>
  
                <div class="content">
                   ${selection.description}
                  <br />
                </div>
              </div>
            </div>
          </div>`;
    html += "</div>";
  });

  document.querySelector(".container").innerHTML = html;
}

document.addEventListener("DOMContentLoaded", function() {
  localforage.getItem('token', function(err, value) {
    var myHeaders = new Headers(); 
    myHeaders.append("Authorization", value );
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };  
    
    fetch("http://localhost:8080/image", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      localforage.setItem("data", data)
      afficher(data);
    });
});
});

window.addEventListener('beforeinstallprompt', e => { 
  e.preventDefault() ; 
  deferredPrompt = e ; 
  const btn = document.getElementById('boutton') ; 
 
  btn.addEventListener('click', e  =>{ 
    deferredPrompt.prompt() ; 
    deferredPrompt.userChoice 
      .then((choiceResult) => { 
         if (choiceResult.outcome === 'accepted') {
           console.log('A2HS prompt accepté'); 
         } else { 
            console.log('A2HS prompt décliné'); 
       } 
    deferredPrompt = null; 
   }); 
  }) ; 
}) ;

window.addEventListener('appinstalled', e => { 
	console.log('application installée') ; 
}) ;

window.addEventListener('online', (e) => {
  if(Notification.permission === "granted"){
    registerBackgroundSync();
  }
});

document.addEventListener("DOMContentLoaded", function () {
	if (navigator.onLine) {
	document.querySelector(".notification").setAttribute("hidden", "");
	}

	window.addEventListener("online", () => {
	document.querySelector(".notification").setAttribute("hidden", "");
	});
	window.addEventListener("offline", () => {
	document.querySelector(".notification").removeAttribute("hidden");
	});

	let fetchData;
	if (navigator.onLine) {
    localforage.getItem('token', function(err, value) {
      var myHeaders = new Headers(); 
      myHeaders.append("Authorization", value );
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };  
      
      fetch("http://localhost:8080/image", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        localforage.setItem("data", data)
	      afficher(data);
      });
    });
	} 
	else {
    fetchData = localforage.getItem("data");
	  fetchData.then((json) => afficher(json));
	}
});

function registerBackgroundSync() {
  if (!navigator.serviceWorker) {
    return console.error("Service Worker not supported");
  }
  navigator.serviceWorker.ready
    .then(registration => {  registration.sync.register("syncAttendees")})
    .catch(err => console.error("Error registering background sync", err));
}

function putFavorite(){
  var token = localforage.getItem("token")
  var myHeaders = new Headers(); 
  myHeaders.append("Authorization", token );
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({"favorite":[]});

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("localhost:8080/user", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}