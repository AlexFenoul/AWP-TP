self.addEventListener("fetch", event => {
	console.log(event.request.url);
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (url.indexOf("https://nostalgic-lamarr-5a666c.netlify.app/images.json") === 0) {
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