document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".carousel");
  const carouselInner = carousel.querySelector(".carousel-inner");
  const carouselItems = Array.from(carouselInner.children);
  const prevButton = carousel.querySelector(".prev");
  const nextButton = carousel.querySelector(".next");
  const carouselDotsContainer = document.querySelector(".carousel-dots");

  let currentIndex = 0;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  const totalItems = carouselItems.length;

  function updateCarousel() {
    carouselInner.style.transform = `translateX(${currentTranslate}px`;

    if (currentIndex === 0) {
      prevButton.disabled = true;
    } else {
      prevButton.disabled = false;
    }

    if (currentIndex === totalItems - 1) {
      nextButton.disabled = true;
    } else {
      nextButton.disabled = false;
    }

    const dots = carouselDotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot) => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');
  }

  function dragStart(event) {
    if (event.type === "touchstart") {
      startPos = event.touches[0].clientX;
    } else {
      startPos = event.clientX;
      event.preventDefault();
    }

    isDragging = true;

    carouselInner.style.transition = "none";
  }

  function drag(event) {
    if (isDragging) {
      const currentPosition =
        event.type === "touchmove"
          ? event.touches[0].clientX
          : event.clientX;
      const distance = currentPosition - startPos;
      currentTranslate = prevTranslate + distance;

      carouselInner.style.transform = `translateX(${currentTranslate}px)`;
    }
  }

  function dragEnd() {
    isDragging = false;
    carouselInner.style.transition = "";

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && currentIndex < totalItems - 1) {
      currentIndex += 1;
    }

    if (movedBy > 100 && currentIndex > 0) {
      currentIndex -= 1;
    }

    setPositionByIndex();

    updateCarousel();
  }

  function setPositionByIndex() {
    const currentSlide = carouselItems[currentIndex];
    const slideWidth = currentSlide.offsetWidth;
    const centerOffset = (carousel.offsetWidth - slideWidth) / 2;

    if (currentIndex === 0) {
      currentTranslate = 0; // Align the first slide to the left
    } else {
      currentTranslate = -currentSlide.offsetLeft + centerOffset;
    }

    prevTranslate = currentTranslate;

    carouselInner.style.transform = `translateX(${currentTranslate}px)`;
  }

  carouselInner.addEventListener("mousedown", dragStart);
  carouselInner.addEventListener("touchstart", dragStart);
  carouselInner.addEventListener("mousemove", drag);
  carouselInner.addEventListener("touchmove", drag);
  window.addEventListener("mouseup", dragEnd);
  window.addEventListener("touchend", dragEnd);

  prevButton.addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
      setPositionByIndex();
    }
  });

  nextButton.addEventListener("click", function () {
    if (currentIndex < totalItems - 1) {
      currentIndex++;
      updateCarousel();
      setPositionByIndex();
    }
  });

  // Create a dot for each slide
  carouselItems.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (index === currentIndex) {
      dot.classList.add('active');
    }
    dot.addEventListener('click', () => {
      if (index !== currentIndex) {
        currentIndex = index;
        setPositionByIndex();
        updateCarousel();
      }
    });
    carouselDotsContainer.appendChild(dot);
  });

  // Initialize the carousel
  setPositionByIndex();
  updateCarousel();
});
