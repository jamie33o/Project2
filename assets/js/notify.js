/**
 * This function creates an animated drop down notification
 * @param {text} message - text shown in the drop down notification
 * @param {message type} type - type of message success/error changes color of background
 */
function showNotification(message, type) {
    const notificationDiv = document.getElementById("notification");
    notificationDiv.style.display = "flex"
    notificationDiv.animate(
        [
            { top: "-215px" },
            { top: "-30px" }
        ],
        {
            duration: 1000, // 1000ms (1 second)
            fill: "forwards" 
        }
    );

    notificationDiv.innerHTML = `<p>${message}</P>`;

    if (type === "success") {
        notificationDiv.style.backgroundColor = "green";
        notificationDiv.style.color = "white";
    } else if (type === "error") {
        notificationDiv.style.backgroundColor = "red";
        notificationDiv.style.color = "white";
    }

    // Hide the notification after a short delay (e.g., 3 seconds)
    setTimeout(() => {
        notificationDiv.animate(
            [
                { top: "-30px" },
                { top: "-265px" }
            ],
            {
                duration: 1000, // 1000ms (1 second)
                fill: "forwards" 
            }
        );
    }, 3000);
}





