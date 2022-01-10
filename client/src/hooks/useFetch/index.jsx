import React, { useEffect, useState } from "react";

const API_KEY = process.env.REACT_APP_GIPHY_API;

const useFetch = ({ keyword }) => {
  const [gifUrl, setGifUrl] = useState("");
  const fetchGiphs = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword
          .split("")
          .join("")}&limit=1`
      );
      const data = await response.json();
      setGifUrl(data[0]?.images?.downsized_medium?.url);
    } catch (error) {
      setGifUrl(
        "https://i.pinimg.com/originals/68/a0/9e/68a09e774e98242871c2db0f99307420.gif"
      );
    }
  };
  useEffect(() => {
    if (keyword) fetchGiphs();
  }, [keyword]);
  return gifUrl;
};

export default useFetch;
