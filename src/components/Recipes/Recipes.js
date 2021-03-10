import "./Recipes.css";
import React, { useState, useEffect } from "react";
import ErrorModal from "../../UI/ErrorModal/ErrorModal";
import axios from "axios";
import useDebounce from "../CustomHooks/Debounce/Debounce";

const Recipes = () => {
  const [recipesData, setRecipesData] = useState({
    totalPages: null,
    currentPage: null,
    recipes: [],
  });

  const [error, setError] = useState();
  const [enteredFilter, setEnteredFilter] = useState("");

  const debouncedSearchTerm = useDebounce(enteredFilter, 1000);

  useEffect(() => {
    fetchRecipes();
    if (debouncedSearchTerm.length) {
      fetchRecipes();
    }
  }, [debouncedSearchTerm]);

  const fetchRecipes = (currentPage = 1) => {
    const currentPageString = `?page=${currentPage}`;
    const query = enteredFilter.length === 0 ? "" : `&search=${enteredFilter}`;
    axios
      .get(`http://localhost:8081/recipes${currentPageString}${query}`)

      .then((response) => {
        const { currentPage, totalPages, recipes } = response.data;
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
    axios.delete(`http://localhost:8081/recipes/${id}`).then((response) => {
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
