import { Button } from "primereact/button";
import React from "react";

const Footer = () => {
  return (
    <footer className="p-p-4 p-text-center bg-primary">
      <div className="mb-4 md:mb-0 w-full flex flex-column justify-content-center align-items-center">
        <h3 className="text-lg font-bold">Footer</h3>
        <div className="flex flex flex-row">
          <Button icon="pi pi-facebook" className="mx-1"/>
          <Button icon="pi pi-instagram" className="mx-1"/>
          <Button icon="pi pi-whatsapp" className="mx-1"/>
          <Button icon="pi pi-youtube" className="mx-1"/>
        </div>
      </div>
      <p>Footer.</p>
    </footer>
  );
};

export default Footer;
