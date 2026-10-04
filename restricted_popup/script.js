document.addEventListener('DOMContentLoaded', () => {
  const dismissButton = document.getElementById('dismiss-button');
  if (dismissButton) {
    dismissButton.addEventListener('click', () => {
      window.close();
    });
  }
}); 