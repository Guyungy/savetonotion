document.addEventListener('DOMContentLoaded', function() {
    const dismissButton = document.getElementById('dismiss-button');
    
    if (dismissButton) {
        dismissButton.addEventListener('click', function() {
            window.close();
        });
    }
});


