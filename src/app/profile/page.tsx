import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="w-full min-h-screen pt-4">
      <div className="w-full flex justify-center items-center">
        <Image
          src="/"
          alt=""
          width={2000}
          height={300}
          className="w-auto mx-auto"
        />
      </div>
      <h3 className="font-normal text-2xl text-center mx-8">
        Perfil  
      </h3>
    </div>
  );
};

export default page;
