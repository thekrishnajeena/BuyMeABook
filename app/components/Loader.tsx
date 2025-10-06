import React from "react";
import styled, { keyframes } from "styled-components";

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="preloader">
        <div className="crack crack1" />
        <div className="crack crack2" />
        <div className="crack crack3" />
        <div className="crack crack4" />
        <div className="crack crack5" />
      </div>
    </StyledWrapper>
  );
};

// Keyframes for rotation
const rotateClockwise = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const rotateCounter = keyframes`
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
`;

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  .preloader {
    position: relative;
    width: 120px;
    height: 120px;
  }

  .crack {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #fef3fc;
    clip-path: polygon(
      50% 0%,
      61% 35%,
      98% 35%,
      68% 57%,
      79% 91%,
      50% 70%,
      21% 91%,
      32% 57%,
      2% 35%,
      39% 35%
    );
    filter: drop-shadow(0 0 6px #fff);
    transform-origin: 50% 50%;
    transition: transform 0.3s ease, filter 0.3s ease;
  }

  /* Randomized rotation speeds & directions */
  .crack1 {
    animation: ${rotateClockwise} 5s linear infinite;
    transform: scale(1);
  }
  .crack2 {
    animation: ${rotateCounter} 6s linear infinite;
    transform: scale(1.2);
  }
  .crack3 {
    animation: ${rotateClockwise} 4.2s linear infinite;
    transform: scale(1.4);
  }
  .crack4 {
    animation: ${rotateCounter} 7s linear infinite;
    transform: scale(1.6);
  }
  .crack5 {
    animation: ${rotateClockwise} 5.7s linear infinite;
    transform: scale(1.8);
  }

  /* Interactive hover effect */
  .crack:hover {
    transform: scale(1.1) rotate(15deg);
    filter: drop-shadow(0 0 12px #28CC9D);
  }
`;

export default Loader;
