document.addEventListener("DOMContentLoaded", (event) => {
    var ProgressBar = {
        init: function () {
            this.progressLabel = document.getElementById("progress-label");
            this.progressPercentage = document.getElementById("progress-percentage");
            this.progressBar = document.getElementById("progress-bar");
            this.progressContainer = document.querySelector(".progress-container");
            this.animationFrameRequest = null;
            this.cancelledTimer = null; // Ensure this is defined
            this.setupListeners();
        },

        setupListeners: function () {
            window.addEventListener("message", (event) => {
                if (event.data.action === "progress") {
                    ProgressBar.update(event.data);
                } else if (event.data.action === "cancel") {
                    ProgressBar.cancel();
                }
            });
        },

        update: function (data) {
            if (this.animationFrameRequest) {
                cancelAnimationFrame(this.animationFrameRequest);
            }
            clearTimeout(this.cancelledTimer);

            this.progressContainer.style.transition = "opacity 0.3s ease-in";
            this.progressContainer.style.opacity = "1";

            this.progressLabel.textContent = data.label;
            this.progressPercentage.textContent = "0%"; // Reset percentage
            this.progressContainer.style.display = "block";
            
            let startTime = Date.now();
            let duration = parseInt(data.duration, 10);

            // If duration is not valid, set a default value
            if (isNaN(duration) || duration <= 0) {
                duration = 5000; // Default to 5 seconds
            }

            // Initialize progress bar height to 0
            this.progressBar.style.height = "0%"; 

            const animateProgress = () => {
                let timeElapsed = Date.now() - startTime;
                let progress = timeElapsed / duration;
                if (progress > 1) progress = 1;
                let percentage = Math.round(progress * 100);
                
                // Update the height of the progress bar instead of width
                this.progressBar.style.height = percentage + "%"; // Set height to percentage

                // Update the percentage text
                this.progressPercentage.textContent = percentage + "%"; 

                if (progress < 1) {
                    this.animationFrameRequest = requestAnimationFrame(animateProgress);
                } else {
                    this.onComplete();
                }
            };

            this.animationFrameRequest = requestAnimationFrame(animateProgress);
        },

        cancel: function () {
            if (this.animationFrameRequest) {
                cancelAnimationFrame(this.animationFrameRequest);
                this.animationFrameRequest = null;
            }
            this.progressLabel.textContent = "CANCELLED";
            this.progressPercentage.textContent = ""; // Clear percentage
            this.progressBar.style.height = "100%";

            this.progressContainer.style.transition = "opacity 0.3s ease-out";
            this.progressContainer.style.opacity = "0";
            
            this.cancelledTimer = setTimeout(this.onCancel.bind(this), 1000);
            clearInterval(interval); 
            var items = document.querySelectorAll('.item');
            items.forEach(item => {
                item.classList.remove('filled');
            });
        },

        onComplete: function () {
            setTimeout(() => {
                this.progressBar.style.height = "0";
                this.progressContainer.style.transition = "opacity 0.3s ease-out";
                this.progressContainer.style.opacity = "0";
                this.postAction("FinishAction");
                clearInterval(interval); 
                var items = document.querySelectorAll('.item');
                items.forEach(item => {
                    item.classList.remove('filled');
                });
            }, 100);
        },

        onCancel: function () {
            this.progressContainer.style.display = "none";
            this.progressBar.style.height = "0";
            clearInterval(interval); 
            var items = document.querySelectorAll('.item');
            items.forEach(item => {
                item.classList.remove('filled');
            });
        },

        postAction: function (action) {
            fetch(`https://progressbar/${action}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });
        },

        closeUI: function () {
            let mainContainer = document.querySelector(".main-container");
            if (mainContainer) {
                mainContainer.style.display = "none";
            }
        },
    };

    ProgressBar.init();
});

var interval; // Declare interval outside the function

function updateBar(kne, duration) {
    var kneBar = document.getElementById('kneBar');
    var progressPercentage = document.getElementById("progress-percentage");

    if (kneBar) {
        kneBar.innerHTML = '';
        for (var i = 0; i < kne; i++) {
            var item = document.createElement('div');
            item.className = 'item';
            kneBar.appendChild(item);
        }
        var i = 0;
        clearInterval(interval);
        interval = setInterval(function() {
            if (i >= kne) {
                clearInterval(interval);
            } else {
                var item = kneBar.children[i];
                item.classList.add('filled');
                i++;
                var percentage = Math.round((i / kne) * 100);
                progressPercentage.textContent = percentage + '%'; 
            }
        }, duration / kne);
    }
}
