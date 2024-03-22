let url = "https://api.github.com/users/relly27/repos";
let jobs;



fetch(url)
    .then(resp => {
      if (!resp.ok) {
        throw new Error(`HTTP error! Status: ${resp.status}`);
      }
      return resp.json();
    })
    .then(data => {
      
      jobs = data.map(item => {
        return {
            nombre: item.name,
            api_repo: item.contents_url.replace(/{\+path}/g, ''),
            html_url: item.html_url,
            // cover: `https://raw.githubusercontent.com/relly27/${item.name}/${item.default_branch}/cover.png`
            cover: ""
        };
    });

    for (let i = 0; i < jobs.length; i++) {

      fetch(jobs[i].api_repo)
          .then(respon => {
              if (!respon.ok) {
                  throw new Error(`HTTP error! Status: ${resp.status}`);
              }
              return respon.json();
          })
          .then(dat => {

            dat.forEach(item => {
               if (item.name === "cover.png") {
                    jobs[i].cover = item.download_url
                }
            });

          })
      
      for (let j = 0; j < jobs.length; j++) {
        if(jobs[i].cover == ""){
          jobs[i].cover = "noAvailable.jpg";
        }
        
      }

    }

    })
    .catch(e => console.error("Algo va mal", e));

    

    