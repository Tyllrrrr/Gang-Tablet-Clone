$(document).ready(function () {
  // Navigation click handler
  $(".nav-item").click(function () {
      // Hide all sections and remove active-nav class
      $(".main-container > div").hide(); // Hide all page containers
      $(".nav-item").removeClass("active-nav");

      // Show the selected page
      let selectedPage = $(this).data("page");
      $(selectedPage).show();  // Show selected page container
      if (selectedPage === '.dashboard-page-container') {
        $(selectedPage).css('display', 'flex');
    }
      $(this).addClass("active-nav");

      // Special case for members page
      if (selectedPage === ".members-page-container") {
          renderMembers(); // Render members only when navigating to Members page
      }
  });

  // Initial load - show home page only
  $(".main-container > div").hide(); // Hide all sections initially
  $(".dashboard-page-container").show().css('display', 'flex'); // Show only the home page
  $(".nav-item[data-page='.dashboard-page-container']").addClass("active-nav");
});

// JavaScript code to manage members and their ranks dynamically
const members = [
  { id: 1, name: 'Member 1', rank: 1 },
  { id: 2, name: 'Member 2', rank: 2 },
  // Add more members as needed
];

function renderMembers() {
  const membersList = $("#members-list");
  membersList.empty(); // Clear the list before re-rendering
  members
      .sort((a, b) => a.rank - b.rank) // Sort members by rank
      .forEach(member => {
          const li = $('<li></li>').text(`Rank ${member.rank}: ${member.name}`);
          membersList.append(li);
      });
  console.log('Rendered Members List');
}

function promoteMember(memberId) {
  const member = members.find(m => m.id === memberId);
  if (member && member.rank > 1) {
      const previousMember = members.find(m => m.rank === member.rank - 1);
      if (previousMember) {
          previousMember.rank += 1;
          member.rank -= 1;
          renderMembers(); // Re-render the updated list
      }
  }
}

function demoteMember(memberId) {
  const member = members.find(m => m.id === memberId);
  if (member && member.rank < members.length) {
      const nextMember = members.find(m => m.rank === member.rank + 1);
      if (nextMember) {
          nextMember.rank -= 1;
          member.rank += 1;
          renderMembers(); // Re-render the updated list
      }
  }
}

// Initial setup to show the home page by default
window.onload = function() {
console.log('Page loaded, ensuring proper initialization');
navigateTo('home');
};


// Handle updating the gang logo by allowing the player to choose their image
function updateGangLogo() {
  const fileInput = document.getElementById('logo-upload');
  const gangsLogo = document.getElementById('gangs-logo');

  // Ensure a file was selected
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();
      img.src = e.target.result; // Set the image source to the uploaded file

      // Show the image to the player before resizing
      const previewContainer = document.createElement('div');
      previewContainer.style.position = 'fixed';
      previewContainer.style.top = '50%';
      previewContainer.style.left = '50%';
      previewContainer.style.transform = 'translate(-50%, -50%)';
      previewContainer.style.zIndex = '1000';
      previewContainer.style.backgroundColor = '#333';
      previewContainer.style.padding = '20px';
      previewContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
      previewContainer.style.display = 'flex';
      previewContainer.style.flexDirection = 'column';
      previewContainer.style.alignItems = 'center';

      // Create an image element to preview the selected image
      const previewImage = document.createElement('img');
      previewImage.src = img.src;
      previewImage.style.maxWidth = '300px'; // Limit preview image size
      previewImage.style.marginBottom = '10px'; // Space between image and buttons

      // Create OK button to confirm the image selection
      const confirmButton = document.createElement('button');
      confirmButton.innerText = 'Confirm';
      confirmButton.onclick = function() {
        // Proceed to resize the image
        resizeAndSetImage(img);
        document.body.removeChild(previewContainer); // Remove preview container
      };

      // Create Cancel button to discard selection
      const cancelButton = document.createElement('button');
      cancelButton.innerText = 'Cancel';
      cancelButton.onclick = function() {
        document.body.removeChild(previewContainer); // Remove preview container
      };

      // Append elements to the preview container
      previewContainer.appendChild(previewImage);
      previewContainer.appendChild(confirmButton);
      previewContainer.appendChild(cancelButton);
      document.body.appendChild(previewContainer); // Add to body
    };

    reader.readAsDataURL(fileInput.files[0]); // Read the selected file as a Data URL
  } else {
    console.error("No file selected or file is invalid.");
  }
}

// Function to resize the image and set it as the gang logo
function resizeAndSetImage(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size to 180x180
  const canvasSize = 180;
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  // Calculate the scaling
  const scale = Math.min(canvasSize / img.width, canvasSize / img.height);
  const x = (canvasSize / 2) - (img.width / 2) * scale;
  const y = (canvasSize / 2) - (img.height / 2) * scale;

  // Clear the canvas before drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw the image with scaling
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

  // Set the resized image as the logo
  const resizedImage = canvas.toDataURL();
  document.getElementById('gangs-logo').src = resizedImage; // Update the image source
  localStorage.setItem('gangsLogo', resizedImage); // Save the image in local storage
}

// Handle clicking on the tooltip to trigger file upload
document.querySelector('.tooltip').addEventListener('click', function() {
  const tooltip = document.querySelector('.tooltip');
  tooltip.classList.add('animate'); // Add animation class
  document.getElementById('logo-upload').click(); // Trigger the hidden file input

  // Remove animation class after animation ends
  setTimeout(() => {
    tooltip.classList.remove('animate');
  }, 500); // Match the duration of the animation
});

// On page load, check if a logo is stored in local storage
window.onload = function () {
  const savedLogo = localStorage.getItem('gangsLogo');
  if (savedLogo) {
    document.getElementById('gangs-logo').src = savedLogo; // Load the stored logo
  } else {
    document.getElementById('gangs-logo').src = "default-logo.png"; // Default logo if none is stored
  }
};