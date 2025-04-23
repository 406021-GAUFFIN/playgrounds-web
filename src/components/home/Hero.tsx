/* eslint-disable @next/next/no-img-element */
import { Button } from "primereact/button";
import React from "react";

const Hero = () => {
  return (
    <div className="grid grid-nogutter surface-0 text-800 height-to-hero">
      <div className="col-12 md:col-5 xl:col-4 p-6 text-center md:text-left flex align-items-center height-to-hero">
        <section>
          <span className="block text-6xl font-bold mb-1">
            Hero
          </span>
          <div className="text-6xl text-primary font-bold mb-3">
            Hero
          </div>
          <p className="mt-0 mb-4 text-700 line-height-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          {/* <Button
            label="Tienda"
            type="button"
            className="mr-3 p-button-raised"
          />
          <Button
            label="Academia"
            type="button"
            className="p-button-outlined"
          /> */}
        </section>
      </div>
      <div className="col-12 md:col-7 xl:col-8 height-to-hero hidden md:block">
        <img
          src="/image.webp"
          alt="hero-1"
          className="block height-to-hero w-full image-hero"
          style={{ clipPath: "polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" }}
        />
      </div>
    </div>
  );
};

export default Hero;
