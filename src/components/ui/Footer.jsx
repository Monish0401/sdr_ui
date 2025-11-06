import React from "react";

const Footer = () => {
  return (
    <footer style={{
      textAlign: "center",
      padding: "20px",
      // backgroundColor: "#f5f5f5",
      position: "sticky",
      left: 0,
      bottom: 0,
      width: "100%",
      boxShadow: "0 -2px 5px rgba(0,0,0,0.1)"
    }}>
      <h4>Note: This is not an Official Application. It's still in development....</h4>
      <code>
        <b style={{ color: "#000011", padding: "0 10px" }}>
          © Copyright {new Date().getFullYear()} | Designed & Developed by SAC-ISRO.
        </b>
        <br />
        <b style={{ color: "#000011", padding: "0 10px" }}>
          Space Application Center(Indian Space Research Organisation). All rights reserved.
        </b>
      </code>
    </footer>
  );
};

export default Footer;
