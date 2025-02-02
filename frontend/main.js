const record = document.querySelector('.record');

let rotation = 0;

function rotateVinyl() {
    rotation += 1;
    record.style.transform = `rotate(${rotation}deg)`;
    requestAnimationFrame(rotateVinyl)
}

rotateVinyl();