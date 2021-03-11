import "./Recipes.css";
import React, { useState, useEffect } from "react";
import ErrorModal from "../../UI/ErrorModal/ErrorModal";
import axios from "../../axiosDefault";
import useDebounce from "../CustomHooks/Debounce/Debounce";
import Recipe from "../Recipes/Recipe/Recipe";

const Recipes = () => {
  const [recipesData, setRecipesData] = useState({
    totalPages: null,
    recipes: [],
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [error, setError] = useState();

  const [enteredFilter, setEnteredFilter] = useState("");

  const debouncedSearchTerm = useDebounce(enteredFilter, 500);

  useEffect(() => {
    fetchRecipes(currentPage, enteredFilter);
    if (debouncedSearchTerm.length) {
      fetchRecipes();
    }
  }, [debouncedSearchTerm, currentPage]);

  const fetchRecipes = async (currentPage, enteredFilter) => {
    try {
      const query =
        enteredFilter.length === 0 ? "" : `&search=${enteredFilter}`;
      const response = await axios.get(`/recipes?page=${currentPage}${query}`);
      const data = await response.data;

      setRecipesData({
        totalPages: data.totalPages,
        recipes: data.recipes,
      });
      setCurrentPage(data.currentPage);
    } catch (error) {
      setError("Something went wrong!");
    }
  };
  const paginate = (pages = recipesData.totalPages) => {
    let pagesArray = [];
    if (pages >= 1) {
      for (let index = 1; index <= pages; index++) {
        pagesArray.push(index);
      }
      return pagesArray.map((el) => (
        <div onClick={() => setCurrentPage(el)} key={el} className="pagination">
          {el}
        </div>
      ));
    }
  };

  const removeRecipe = (id) => {
    axios.delete(`/recipes/${id}`).then((response) => {
      setTimeout(() => {
        fetchRecipes(currentPage);
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
              <Recipe
                key={id}
                title={title}
                description={description}
                clicked={() => removeRecipe(id)}
              />
            );
          })}
        </div>
      </div>
      <div className="paginationWrapper">{paginate()}</div>
    </>
  );
};

export default Recipes;
