import React, { useContext, useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";
import { StoreContext } from "../../context/StoreContext";

const Home = () => {
  const [category, setCategory] = useState("All");
  const { searchQuery } = useContext(StoreContext);
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div>
      {!isSearching && (
        <>
          <Header />
          <ExploreMenu category={category} setCategory={setCategory} />
        </>
      )}

      <FoodDisplay category={isSearching ? "All" : category} />

      {!isSearching && <AppDownload />}
    </div>
  );
};

export default Home;
