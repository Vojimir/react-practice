import "./Recipes.css";
import React, { useState, useEffect, useRef } from "react";
import Spinner from "../../UI/Spinner/Spinner";
import ErrorModal from "../../UI/ErrorModal/ErrorModal";

//Da li je ok da setujem 3 property-ja dojednom zbog prirode useStejta ?
const Recipes = () => {
  const [recipes, setRecipes] = useState({
    totalPages: null,
    currenPage: null,
    recipes: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [enteredFilter, setEnteredFilter] = useState("");

  const inputRef = useRef();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        fetchRecipes();
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef]);

  const fetchRecipes = (currentPage = 1) => {
    const currentPageString = `?page=${currentPage}`;
    const query = enteredFilter.length === 0 ? "" : `&search=${enteredFilter}`;
    fetch(`http://localhost:8081/recipes${currentPageString}${query}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipes({
          currenPage: Object.values(data)[0],
          totalPages: Object.values(data)[1],
          recipes: Object.values(data)[2],
        });
      })
      .catch((error) => {
        setError("Something went wrong!");
      });
  };

  const paginate = (pages = recipes.totalPages) => {
    let pagesArray = [];
    if (pages >= 1) {
      for (let index = 1; index <= pages; index++) {
        pagesArray.push(index);
      }

      return pagesArray.map((el) => (
        <div onClick={() => fetchNewPage(el)} key={el} className="pagination">
          {el}
        </div>
      ));
    }
  };
  const fetchNewPage = (pageId) => {
    fetchRecipes(pageId);
  };
  //DA LI U OVOJ METODI MOGU OVAKO DA PONOVO POZIVAM FETCHRECIPES? IMA DA , IMA LI EFIKASNIJE RESENJE?
  const removeRecipe = (id) => {
    fetch(`http://localhost:8081/recipes/${id}`, {
      method: "DELETE",
    }).then((response) => {
      fetchRecipes(recipes.currenPage);
    });
  };

  const clearErrors = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      {error && <ErrorModal onClose={clearErrors}>{error}</ErrorModal>}
      <div className="mainContainer">
        <Spinner show={isLoading} />
        <div className="recipesContainerMain">
          <h1>Recipes overview</h1>
          <input
            ref={inputRef}
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
            placeholder="Search recipes"
          ></input>
          {recipes.recipes
            ? Object.keys(recipes.recipes).map((el) => (
                <div key={recipes.recipes[el].id} className="recipeContainer">
                  <button
                    className="deleteButton"
                    onClick={() => removeRecipe(recipes.recipes[el].id)}
                  >
                    Delete
                  </button>
                  <h2>{recipes.recipes[el].title}</h2>

                  <p>{recipes.recipes[el].description}</p>
                </div>
              ))
            : null}
        </div>
      </div>
      <div className="paginationWrapper">{paginate()}</div>
    </React.Fragment>
  );
};

export default Recipes;
