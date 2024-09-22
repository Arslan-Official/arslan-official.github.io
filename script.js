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

const showcaseBtn = document.getElementById('showcase-btn');
const dropdownContent = showcaseBtn.nextElementSibling; // Get the dropdown content

showcaseBtn.addEventListener('click', () => {
	dropdownContent.classList.toggle('show'); // Toggle the 'show' class
});

// Optional: Close the dropdown if clicking outside of it
window.addEventListener('click', (event) => {
	if (!showcaseBtn.contains(event.target) && !dropdownContent.contains(event.target)) {
		dropdownContent.classList.remove('show');
	}
});
