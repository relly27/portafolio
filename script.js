// Set Personal Portfolio to LocalStorage
const projectName = "portfolio";
localStorage.setItem("my_personal_portfolio", "Personal Portfolio");

// myCode
const myFunction = () => {
  const url = "https://api.github.com/users/relly27";
  const nombre = document.getElementsByClassName("name");
  const imagen = document.getElementById("avatar");
  const nickname = document.getElementById("nickname");
  const bio = document.getElementById("bio");
  const followers = document.getElementById("follower_number");
  const location = document.getElementById("location");
  const business = document.getElementById("business");
  const following = document.getElementById("following_number");
  const repos = document.getElementById("repos");
  const git_url = document.getElementById("git_link");

  fetch(url)
    .then(resp => {
      if (!resp.ok) {
        throw new Error(`HTTP error! Status: ${resp.status}`);
      }
      return resp.json();
    })
    .then(data => {
      // console.info(data);
      // implementar destructuring, para actualizar el codigo!
      /* const {
        name,
        bio: userBio,
        avatar_url,
        followers: followersCount,
        following: followingCount,
        public_repos,
        html_url
      } = data; */

      const iterar = (val1, val2) => {
        for (let i = 0; i < val1.length; i++) {
          val1[i].textContent = val2;
        }
      };

      iterar(nombre, data.name);

      bio.textContent = data.bio;
      imagen.src = data.avatar_url;
      location.textContent = data.location;
      followers.textContent = data.followers;
      following.textContent = data.following;
      repos.textContent = data.public_repos;
      git_url.href = data.html_url;
      business.textContent = (data.company == null) ? "No especificado" : data.company;
    })
    .catch(e => console.error("Algo va mal", e));
};

myFunction();

$(function () {
  $('#masonry').popover({
    container: 'body',
    trigger: 'hover'
  });
});



////////send email//

(function() {
  // https://dashboard.emailjs.com/admin/account
  emailjs.init({
    publicKey: "Eiifro0PrNrogPMLv",
  });
})();

window.onload = function() {
  document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // these IDs from the previous steps
    emailjs.sendForm('service_c93cg04', 'template_wwnj45i', this)
      .then(() => {
        // Mostrar la alerta de éxito
        document.getElementById("alert-success").style.display = "block";
        console.log('SUCCESS!');
      })
      .catch((error) => {
        // Mostrar la alerta de error
        document.getElementById("alert-error").style.display = "block";
        console.log('FAILED...', error);
      });
  });
}

///////jobs///////////

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




