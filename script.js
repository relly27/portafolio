
// Función para obtener y guardar datos en localStorage
const fetchAndStoreData = async (url, storageKey) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const timestamp = new Date().getTime();
    const dataToStore = { data, timestamp };
    localStorage.setItem(storageKey, JSON.stringify(dataToStore));
    return data;
  } catch (error) {
    console.error("Algo va mal", error);
    return null;
  }
};

// Función para obtener datos de localStorage o de la API si es necesario
const getData = async (url, storageKey, hoursToUpdate = 8) => {
  const storedData = localStorage.getItem(storageKey);
  const now = new Date().getTime();

  if (storedData) {
    const { data, timestamp } = JSON.parse(storedData);
    const hoursDiff = (now - timestamp) / (1000 * 60 * 60);

    // Si los datos son recientes, devolverlos sin hacer fetch
    if (hoursDiff < hoursToUpdate) {
      // console.log("Datos obtenidos de localStorage");
      return data;
    }
  }

  // Si no hay datos o están desactualizados, hacer fetch y guardar en localStorage
  // console.log("Haciendo fetch a la API...");
  return await fetchAndStoreData(url, storageKey);
};

// Función principal para actualizar la UI con los datos
const updateUI = (data) => {
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
  business.textContent = data.company || "No especificado";
};

// Función para cargar los datos del usuario
const loadUserData = async () => {
  const url = "https://api.github.com/users/relly27";
  const storageKey = "githubUserData";
  const data = await getData(url, storageKey);
  if (data) {
    updateUI(data);
  }
};

// Función para cargar los repositorios
const loadRepos = async () => {
  const url = "https://api.github.com/users/relly27/repos";
  const storageKey = "githubReposData";
  const data = await getData(url, storageKey);

  if (data) {
    const jobs = data.map(item => ({
      nombre: item.name.replace(/-/g, ' ').replace(/_/g, ' ').replace(/a os/g, 'años'),
      api_repo: item.contents_url.replace(/{\+path}/g, ''),
      html_url: item.html_url,
      cover: ""
    }));

    const promises = jobs.map(async (job) => {
      const response = await fetch(job.api_repo);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const dat = await response.json();
      const coverItem = dat.find(item => item.name === "cover.png");
      job.cover = coverItem ? coverItem.download_url : "noAvailable.jpg";
    });

    await Promise.all(promises);

    const container = document.querySelector('.card-columns');
    container.innerHTML = '';

    jobs.forEach(project => {
      const newDiv = document.createElement('div');
      newDiv.classList.add('card', 'efecto', 'my-3');

      const img = document.createElement('img');
      img.classList.add('card-img-top');
      img.src = project.cover;
      img.alt = project.nombre;

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body', 'project-tile');

      const title = document.createElement('h5');
      title.classList.add('project-tile');
      title.textContent = project.nombre;

      const link = document.createElement('a');
      link.classList.add('btn', 'btn-outline-secondary', 'btn-lg', 'btn-block');
      link.href = project.html_url;
      link.target = "_blank";
      link.textContent = "Vamos";

      const icon = document.createElement('i');
      icon.classList.add('ml-3', 'fab', 'fa-free-code-camp');

      title.appendChild(icon);
      cardBody.appendChild(title);
      cardBody.appendChild(link);
      newDiv.appendChild(img);
      newDiv.appendChild(cardBody);

      container.appendChild(newDiv);
    });
  }
};

// Cargar los datos del usuario y los repositorios al cargar la página
window.onload = async () => {
  await loadUserData();
  await loadRepos();

  // Configurar el formulario de contacto
  document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    emailjs.sendForm('service_c93cg04', 'template_wwnj45i', this)
      .then(() => {
        document.getElementById("alert-success").style.display = "block";
        console.log('SUCCESS!');
      })
      .catch((error) => {
        document.getElementById("alert-error").style.display = "block";
        console.log('FAILED...', error);
      });
  });

  // Configurar el popover
  $('#masonry').popover({
    container: 'body',
    trigger: 'hover'
  });
};

// Inicializar EmailJS
emailjs.init({
  publicKey: "Eiifro0PrNrogPMLv",
});