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


// Modal elements
const modal = document.getElementById('project-modal');
const modalContent = document.querySelector('.modal-content');
const modalGif = document.getElementById('modal-gif');
const modalTitle = document.getElementById('modal-title');
const closeBtn = document.querySelector('.close-btn');
const modalPrevBtn = document.querySelector('.modal-nav .prev-btn');
const modalNextBtn = document.querySelector('.modal-nav .next-btn');
const demoBtn = document.querySelector('.demo-btn');
const loadingSpinner = document.querySelector('.loading-spinner'); // Reference to spinner
const allProjectBoxes = document.querySelectorAll('.project-box');

// Project data array
const projects = Array.from(allProjectBoxes).map(box => ({
  title: box.getAttribute('data-title'),
  gif: box.getAttribute('data-gif')
}));

let currentProjectIndex = 0;

// Update modal content with fade animation and loading spinner
function updateModal(index) {
  modalContent.classList.add('fade-out');
  loadingSpinner.style.display = 'block';
  modalGif.style.display = 'none';
  setTimeout(() => {
    const project = projects[index];
    const img = new Image();
    img.onload = () => {
      modalTitle.textContent = project.title; // Update title here
      modalGif.src = project.gif;
      modalGif.style.display = 'block';
      loadingSpinner.style.display = 'none';
      modalContent.classList.remove('fade-out');
      modalContent.classList.add('fade-in');
      setTimeout(() => modalContent.classList.remove('fade-in'), 300);
    };
    img.onerror = () => {
      modalTitle.textContent = project.title; // Update title even on error
      loadingSpinner.style.display = 'none';
      modalGif.style.display = 'none';
      modalContent.classList.remove('fade-out');
      modalContent.classList.add('fade-in');
      setTimeout(() => modalContent.classList.remove('fade-in'), 300);
    };
    img.src = project.gif;
  }, 300);
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

// Project navigation
document.addEventListener('DOMContentLoaded', () => {
  const projectsContainer = document.querySelector('.projects-container');
  const allProjectBoxes = document.querySelectorAll('.project-box');
  const prevBtn = document.querySelector('.project-nav .prev-btn');
  const nextBtn = document.querySelector('.project-nav .next-btn');
  const totalProjects = allProjectBoxes.length;
  const projectsPerPage = 3;
  let currentSet = 0;

  function updateProjects() {
    // Clear current boxes
    projectsContainer.innerHTML = '';

    // Determine start and end indices
    const start = currentSet * projectsPerPage;
    const end = Math.min(start + projectsPerPage, totalProjects);
    const activeCount = end - start;

    // Clone and append only the current set
    for (let i = start; i < end; i++) {
      const box = allProjectBoxes[i].cloneNode(true);
      projectsContainer.appendChild(box);
    }

    // Adjust classes based on active count
    projectsContainer.classList.toggle('two-boxes', activeCount === 2);
    projectsContainer.classList.toggle('three-boxes', activeCount === 3);

    // Toggle arrow visibility
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
      }, 500); // Matches transition duration
    }
  }

  prevBtn.addEventListener('click', () => changeSet(currentSet - 1));
  nextBtn.addEventListener('click', () => changeSet(currentSet + 1));

  // Initial setup
  updateProjects();
});
