import React, { useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";

const Input = ({ inputText, handleInput, handleInputClick, handleFocus }) => {
  const [img, setImg] = useState(null);
  console.log("img: ", img);
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => handleInput(e.target.value)}
        value={inputText}
        onFocus={handleFocus}
        onTouchEnd={handleFocus}
      />
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleInputClick}>Send</button>
      </div>
    </div>
  );
};

export default Input;
