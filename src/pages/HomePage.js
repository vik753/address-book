import { useHistory } from "react-router-dom";

export const HomePage = () => {
  let history = useHistory();

  const goToEditPage = () => {
    history.push("/edit");
  }

  return (
    <div>
      <h1>Home page</h1>
      <p onClick={goToEditPage}>Go to Edit page</p>
    </div>
  );
};
