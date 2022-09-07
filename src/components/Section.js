import React from "react";

const section = ({ flexDirection, children }) => {

  const childrenMargin = "2vw";

  return (
    <div className="section" style={{ flexDirection: flexDirection, textAlign: flexDirection === "row" ? "left" : "right" }}>
      <div className="children_wrapper" style={{ marginLeft: flexDirection === "row" ? childrenMargin : "0vw", marginRight: flexDirection === "row" ? "0vw" : childrenMargin, }}>
        {children}
      </div>
    </div>
  );
};

export default section;