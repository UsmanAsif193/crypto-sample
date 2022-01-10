import React from "react";

import Logo from "../../images/logo.png";

const Footer = () => {
  return (
    <div className="w-full flex md:justify-center items-center justify-betweeen flex-col p-4 gradient-bg-footer">
      <div className="w-full flex sm:flex-row flex-col jusitfy-between items-center my-4">
        <div className="flex flex-[0.5] items-center justify-center">
          <img src={Logo} alt="logo" className="w-32" />
        </div>
        <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
          <p className="text-white text-base text-center mx-2 cursor-pointer">
            Market
          </p>
          <p className="text-white text-base text-center mx-2 cursor-pointer">
            Exchange
          </p>
          <p className="text-white text-base text-center mx-2 cursor-pointer">
            Tutorials
          </p>
          <p className="text-white text-base text-center mx-2 cursor-pointer">
            Wallets
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center mt-5 flex-col">
        <p className="text-white text-sm text-center">Come join us</p>
        <p className="text-white text-sm text-center">usmanasif193@gmail.com</p>
      </div>
      <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5" />
      <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
        <p className="text-white text-sm text-center">@usmanasif193</p>
        <p className="text-white text-sm text-center">All right reserved</p>
      </div>
    </div>
  );
};

export default Footer;
