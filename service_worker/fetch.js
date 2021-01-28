self.addEventListener("fetch", event => {
	console.log(event.request.url);
});

self.addEventListener('favorites', function(event){
  var data = JSON.parse(event.data);

  console.log("SW Received Message:");
  console.log(data);

  self.userID = data.uid;
  self.userToken = data.token;

});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (url.indexOf("./images.json") === 0) {
    event.respondWith(
      fetch(event.request).then((response) => {
        if(response.status !== 200) {
          console.error(
            "Service Worker",
            "Error when fetching",
            event.request.url
          );
		  
          return response;
        }
        console.info("Formatting data");

        return response.json().then((json) => {
			const formattedResponse = json.map((j) => ({
				name: j.name,
				description: j.description || "",
				updated_at: j.updated_at,
				url: j.url
			}));

			//return new Response(JSON.stringify(formattedResponse));
			const finalResponse = new Response(JSON.stringify(formattedResponse));
			let savedResponse = finalResponse.clone();

			caches.open(cacheName).then(cache => {
			cache.put(event.request,savedResponse);
			});

			return finalResponse;
        });
      })
    );
  }
  else {
    event.respondWith(
      caches
        .open(cacheName)
        .then(cache => cache.match(event.request))
        .then(response => response || fetch(event.request))
    );
  }
});

self.addEventListener("sync", function(event) {
  if (event.tag === "syncAttendees") {
    event.waitUntil(syncAttendees().then(res => {
      console.log("res : ", res);
  })); // on lance la requête de synchronisation
  }
});

async function syncAttendees() {
  // todo url de notre serveur NodeJS
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjAxMjg1MDg0Mjg5NTUwMGJhYTMwNTFkIiwicHNldWRvIjoic2NvdHQifSwiaWF0IjoxNjExODM3OTU5LCJleHAiOjE2MTE4NDg3NTl9.Z8_X-AmRIbKjd_qGRtDHrPSCnpwZmq2SR4SLs--YGjw");
  
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const responce = await fetch("http://localhost:8080/user/favorites", requestOptions)
    .then(response =>  response.text())
    .catch(error => console.log('error', error));

  return responce
}