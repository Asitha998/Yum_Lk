import React, { useEffect, useState } from "react";
import "./Header.css";

const Header = () => {
  const slides = [
    {
      id: "classic-favorites",
      title: "Order your favorite food here",
      description:
        "Choose from chef-crafted comfort foods and global specialties, delivered fast wherever you are.",
      cta: "View Menu",
      image: "/header_img.png",
    },
    {
      id: "fresh-prep",
      title: "Freshly made, always delicious",
      description:
        "Seasonal ingredients prepared to order so every bite arrives vibrant, hot, and ready to enjoy.",
      cta: "Explore Specials",
      image: "/header_img2.png",
    },
    {
      id: "on-time",
      title: "Right on time, every time",
      description:
        "Track your delivery in real time and count on reliable arrivals for work, home, or celebrations.",
      cta: "Track Delivery",
      image: "/header_img1.png",
      hideContent: true,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = (index) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="header">
      <div
        className="header-track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="header-slide"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.32) 55%, rgba(0,0,0,0.44) 100%), url(${slide.image})`,
            }}
          >
            {!slide.hideContent && (
              <div className="header-contents">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
                <button>{slide.cta}</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="header-controls">
        <button
          className="header-arrow"
          onClick={() => goToSlide(activeIndex - 1)}
          aria-label="Previous slide"
        >
          ‹
        </button>

        <div className="header-dots" role="tablist" aria-label="Hero slides">
          {slides.map((_, index) => (
            <button
              key={_.id ?? index}
              className={`header-dot ${index === activeIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-pressed={index === activeIndex}
            />
          ))}
        </div>

        <button
          className="header-arrow"
          onClick={() => goToSlide(activeIndex + 1)}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Header;
