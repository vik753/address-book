import {Link, useParams} from "react-router-dom";

export const EditPage = () => {
  let { id } = useParams();

  return (
    <div>
      <h1>Edit Page</h1>
      <p>Current id: {id}</p>
      <Link to={"/"}>Go to Home Page</Link>
    </div>
  );
};