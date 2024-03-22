let url = "https://api.github.com/users/relly27/repos";
let repos;

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

    })
    .catch(e => console.error("Algo va mal", e));