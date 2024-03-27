
function cargarDatos() {
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
          cover: ""
        };
      });

      let promises = jobs.map(job => {
        return fetch(job.api_repo)
          .then(respon => {
            if (!respon.ok) {
              throw new Error(`HTTP error! Status: ${resp.status}`);
            }
            return respon.json();
          })
          .then(dat => {
            let coverItem = dat.find(item => item.name === "cover.png");
            if (coverItem) {
              job.cover = coverItem.download_url;
            } else {
              job.cover = "noAvailable.jpg";
            }
          });
      });

      Promise.all(promises).then(() => {
        let container = document.querySelector('.card-columns');


        jobs.forEach(project => {

          let newDiv = document.createElement('div');
          newDiv.classList.add('card', 'efecto', 'my-3');

          let img = document.createElement('img');
          img.classList.add('card-img-top');
          img.src = project.cover;
          img.alt = project.nombre;

          let cardBody = document.createElement('div');
          cardBody.classList.add('card-body', 'project-tile');


          let title = document.createElement('h5');
          title.classList.add('project-tile');
          title.textContent = project.nombre;

          let link = document.createElement('a');
          link.classList.add('btn', 'btn-outline-secondary', 'btn-lg', 'btn-block'); // Agrega cada clase individualmente
          link.href = project.html_url;
          link.target = "_blank";
          link.textContent = "Vamos";

          let icon = document.createElement('i');
          icon.classList.add('ml-3', 'fab', 'fa-free-code-camp');

          title.appendChild(icon);
          cardBody.appendChild(title);
          cardBody.appendChild(link);
          newDiv.appendChild(img);
          newDiv.appendChild(cardBody);

          container.appendChild(newDiv);
        });
      });
    })
    .catch(e => console.error("Algo va mal", e));
}


cargarDatos();
