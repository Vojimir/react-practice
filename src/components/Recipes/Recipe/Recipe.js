const recipe = (props) => {
  return (
    <div className="recipeContainer">
      <button className="deleteButton" onClick={props.clicked}>
        Delete
      </button>
      <h2>{props.title}</h2>
      <p>{props.description}</p>
    </div>
  );
};

export default recipe;
