import React, { useState } from "react";
import { useHistory } from "react-router-dom";
const Home = () => {
  const [cid, setCid] = useState("");
  const history = useHistory();
  return (
    <>
      <h1>Home</h1>
      <div>
        <input type="text" onChange={(event) => setCid(event.target.value)} />
        <button
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
          onClick={() => history.push(`/note/${cid}`)}
        >
          Load note
        </button>
      </div>
      */
    </>
  );
};

export default Home;
