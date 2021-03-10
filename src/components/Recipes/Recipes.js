import "./Recipes.css";
import React, { useState, useEffect, useRef } from "react";
import ErrorModal from "../../UI/ErrorModal/ErrorModal";

const Recipes = () => {
  const [recipesData, setRecipesData] = useState({
    totalPages: null,
    currentPage: null,
    recipes: [],
  });

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

      //parsovati
      .then((data) => {
        const { currentPage, totalPages, recipes } = data;
        setRecipesData({
          currentPage,
          totalPages,
          recipes,
        });
      })
      .catch((error) => {
        setError("Something went wrong!");
      });
  };

  const paginate = (pages = recipesData.totalPages) => {
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
  const removeRecipe = (id) => {
    fetch(`http://localhost:8081/recipes/${id}`, {
      method: "DELETE",
    }).then((response) => {
      setTimeout(() => {
        fetchRecipes(recipesData.currentPage);
      }, 200);
    });
  };

  const clearErrors = () => {
    setError(null);
  };

  return (
    <>
      {error && <ErrorModal onClose={clearErrors}>{error}</ErrorModal>}
      <div className="mainContainer">
        <div className="recipesContainerMain">
          <h1>Recipes overview</h1>
          <input
            ref={inputRef}
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
            placeholder="Search recipes"
          ></input>
          {recipesData.recipes.map((el) => {
            const { id, title, description } = el;
            return (
              <div key={id} className="recipeContainer">
                <button
                  className="deleteButton"
                  onClick={() => removeRecipe(id)}
                >
                  Delete
                </button>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="paginationWrapper">{paginate()}</div>
    </>
  );
};

export default Recipes;
