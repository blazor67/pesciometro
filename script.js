document.addEventListener('DOMContentLoaded', function() {
    const fishes = document.querySelectorAll('.fish-rating .fish');
    let selectedRating = 0;

    let volumeSlider=document.getElementById("volume");
    let volume=volumeSlider.value;

    volumeSlider.addEventListener("change",()=>{
        volume=volumeSlider.value;
        console.log(volume+" listener")
    });

    fishes.forEach(fish => {
        fish.addEventListener('mousemove', function(event) {
            const value = parseFloat(this.getAttribute('data-value'));
            const half = isMouseInLeftHalf(event, this) ? -0.5 : 0;
            fillFishes(value + half);
        });

        fish.addEventListener('mouseleave', function() {
            fillFishes(selectedRating);
        });

        fish.addEventListener('click', function(event) {
            const value = parseFloat(this.getAttribute('data-value'));
            const half = isMouseInLeftHalf(event, this) ? -0.5 : 0;
            selectedRating = value + half;
            fillFishes(selectedRating);
            animateFish(this);
            playRatingAudio(selectedRating); // Riproduce gli audio in base al voto
        });
    });

    function fillFishes(value) {
        fishes.forEach(fish => {
            const fishValue = parseInt(fish.getAttribute('data-value'));
            const filledFish = fish.querySelector('.filled-fish');
            if (value >= fishValue) {
                filledFish.style.width = '100%';
            } else if (value + 0.5 === fishValue) {
                filledFish.style.width = '50%';
            } else {
                filledFish.style.width = '0%';
            }
        });
    }

    function isMouseInLeftHalf(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        return x < rect.width / 2;
    }

    function animateFish(fish) {
        fish.classList.add('animate');
        setTimeout(() => {
            fish.classList.remove('animate');
        }, 1000);
    }

    // Funzione per riprodurre gli audio in base al voto
    function playRatingAudio(rating) {
        const audioFiles = getAudioFilesForRating(rating);
        if (audioFiles.length > 0) {
            playAudioSequence(audioFiles);
        }
    }

    // Crea la sequenza di audio da riprodurre
    function getAudioFilesForRating(rating) {
        const audioFiles = [];

        const integerPart = Math.floor(rating);
        const hasHalf = (rating % 1) !== 0;

        if (integerPart === 0 && hasHalf) {
            // Caso di mezzo pesce
            audioFiles.push('MEZZO.mp3');
        } else {
            if (integerPart === 1) {
                audioFiles.push('UN.mp3');
            } else if (integerPart === 2) {
                audioFiles.push('DUE.mp3');
            } else if (integerPart === 3) {
                audioFiles.push('TRE.mp3');
            }
            else if (integerPart === 0) {
                audioFiles.push('ZERO.mp3');
            }

            if (integerPart === 1) {
                audioFiles.push('PESCE.mp3');
            } else {
                audioFiles.push('PESCI.mp3');
            }

            if (hasHalf) {
                audioFiles.push('E.mp3');
                audioFiles.push('MEZZO.mp3');
            }
        }

        return audioFiles;
    }

    // Riproduce gli audio in sequenza
    function playAudioSequence(files) {
        let index = 0;

        function playNext() {
            if (index < files.length) {
                const audio = new Audio(files[index]);
                audio.addEventListener('ended', function() {
                    index++;
                    playNext();
                });
                audio.volume=volume/100;
                console.log(volume);
                audio.play();
            }
        }

        playNext();
    }
});
