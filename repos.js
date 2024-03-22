let url = "https://api.github.com/users/relly27/repos";
let repos;
let jobs;

fetch(url)
    .then(resp => {
      if (!resp.ok) {
        throw new Error(`HTTP error! Status: ${resp.status}`);
      }
      return resp.json();
    })
    .then(data => {
      console.info(data);
      repos = data;
      
      jobs = repos.map(item => {
        return {
            nombre: item.name,
            api_repo: item.contents_url.replace(/{\+path}/g, ''),
            html_url: item.html_url,
            cover: `https://raw.githubusercontent.com/relly27/${item.name}/main/cover.png`
        };
    });


    })
    .catch(e => console.error("Algo va mal", e));

    