let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
	sections.forEach(sec => {
		let top = window.scrollY;
		let offset = sec.offsetTop - 150;
		let height = sec.offsetHeight;
		let id = sec.getAttribute('id');
		
		if(top >= offset && top < offset + height){
			navLinks.forEach(links => {
				links.classList.remove('active');
				document.querySelector('header nav a[href*=' + id + ' ]').classList.add('active')
			})
		}
	})
}

menuIcon.onclick = () => {
	menuIcon.classList.toggle('bx-x');
	navbar.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (navbar.classList.contains('active') &&
      !e.target.closest('.navbar') && 
      !e.target.closest('#menu-icon')) {
    navbar.classList.remove('active');
    menuIcon.classList.remove('bx-x');
  }
});


// Modal elements
const modal = document.getElementById('project-modal');
const modalContent = document.querySelector('.modal-content');
const modalGif = document.getElementById('modal-gif');
const modalTitle = document.getElementById('modal-title');
const closeBtn = document.querySelector('.close-btn');
const modalPrevBtn = document.querySelector('.modal-nav .prev-btn');
const modalNextBtn = document.querySelector('.modal-nav .next-btn');
const demoBtn = document.querySelector('.demo-btn');
const loadingSpinner = document.querySelector('.loading-spinner');
const allProjectBoxes = document.querySelectorAll('.project-box');

// Project data array
const projects = Array.from(allProjectBoxes).map(box => ({
  title: box.getAttribute('data-title'),
  gif: box.getAttribute('data-gif')
}));

let currentProjectIndex = 0;

// Update modal content with proper spinner and error handling
function updateModal(index) {
  const project = projects[index];

  // Reset modal content
  modalGif.classList.remove('loaded'); // Remove loaded class to hide GIF
  loadingSpinner.style.opacity = '1'; // Show spinner
  modalGif.style.display = 'none'; // Hide GIF initially

  // Update title immediately
  modalTitle.textContent = project.title;

  // Load the GIF
  const img = new Image();
  img.src = project.gif;

  img.onload = () => {
    console.log(`GIF loaded: ${project.gif}`);
    modalGif.src = project.gif; // Set the GIF source
    modalGif.style.display = 'block'; // Show the GIF container
    loadingSpinner.style.opacity = '0'; // Fade out the spinner
    setTimeout(() => {
      modalGif.classList.add('loaded'); // Fade in the GIF
    }, 300); // Short delay for smooth transition
  };

  img.onerror = () => {
    console.error(`Failed to load GIF: ${project.gif}`);
    loadingSpinner.style.opacity = '0'; // Hide spinner on error
    modalTitle.textContent = `${project.title} - Error Loading GIF`; // Show error message
  };
}

// Open modal with first project
demoBtn.addEventListener('click', () => {
  currentProjectIndex = 0;
  updateModal(currentProjectIndex);
  modal.classList.add('active');
});

// Previous project in modal
modalPrevBtn.addEventListener('click', () => {
  currentProjectIndex = (currentProjectIndex - 1 + projects.length) % projects.length;
  updateModal(currentProjectIndex);
});

// Next project in modal
modalNextBtn.addEventListener('click', () => {
  currentProjectIndex = (currentProjectIndex + 1) % projects.length;
  updateModal(currentProjectIndex);
});

// Close modal
closeBtn.addEventListener('click', () => {
  modal.classList.remove('active');
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});

// Project navigation (unchanged)
document.addEventListener('DOMContentLoaded', () => {
  const projectsContainer = document.querySelector('.projects-container');
  const allProjectBoxes = document.querySelectorAll('.project-box');
  const prevBtn = document.querySelector('.project-nav .prev-btn');
  const nextBtn = document.querySelector('.project-nav .next-btn');
  const totalProjects = allProjectBoxes.length;
  const projectsPerPage = 3;
  let currentSet = 0;

  function updateProjects() {
    projectsContainer.innerHTML = '';
    const start = currentSet * projectsPerPage;
    const end = Math.min(start + projectsPerPage, totalProjects);
    const activeCount = end - start;

    for (let i = start; i < end; i++) {
      const box = allProjectBoxes[i].cloneNode(true);
      projectsContainer.appendChild(box);
    }

    projectsContainer.classList.toggle('two-boxes', activeCount === 2);
    projectsContainer.classList.toggle('three-boxes', activeCount === 3);

    prevBtn.classList.toggle('disabled', currentSet === 0);
    nextBtn.classList.toggle('disabled', end >= totalProjects);
  }

  function changeSet(newSet) {
    if (newSet >= 0 && newSet * projectsPerPage < totalProjects) {
      projectsContainer.classList.add('fading');
      setTimeout(() => {
        currentSet = newSet;
        updateProjects();
        projectsContainer.classList.remove('fading');
      }, 500);
    }
  }

  prevBtn.addEventListener('click', () => changeSet(currentSet - 1));
  nextBtn.addEventListener('click', () => changeSet(currentSet + 1));

  updateProjects();
});
