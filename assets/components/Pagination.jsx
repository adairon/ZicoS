import React from "react";

const Pagination = ({ currentPage, itemsPerPage, length, onPageChanged }) => {
  //sur combien de pages seront affichés les profils :
  const pagesCount = Math.ceil(length / itemsPerPage);
  // Création d'un tableau pour le mapper dans la pagination :
  // tableau vide au départ
  const pages = [];
  //Qu'on alimente avec une boucle en fonction du nb de pages :
  for (let i = 1; i <= pagesCount; i++) {
    pages.push(i);
  }

  return (
    <div className="pages_list d-flex justify-content-center">
      <ul className="pagination mb-0 pb-3">
        {/* Si on est sur la 1ère page, le bouton page précédente est désactivé */}
        <li className={"page-item" + (currentPage === 1 && " disabled")}>
          {/* bouton pour aller sur la page précédente avec la fct handlePageChange - 1 page */}
          <button
            className="page-link"
            onClick={() => onPageChanged(currentPage - 1)}
          >
            &laquo;
          </button>
        </li>
        {/* On "mape" sur le tableau des pages pour générer la bonne pagination */}
        {pages.map(page => (
          <li
            key={page}
            // condition : si la page en court est la même que la page affichée sur la pagination, alors c'est la page active
            className={"page-item" + (currentPage === page && " active")}
          >
            <button className="page-link" onClick={() => onPageChanged(page)}>
              {page}
            </button>
          </li>
        ))}
        {/* Si on est sur la dernière page, le bouton page précédente est désactivé */}
        <li
          className={"page-item" + (currentPage === pagesCount && " disabled")}
        >
          {/* bouton pour aller sur la page suivante avec la fct onPageChanged + 1 page */}
          <button
            className="page-link"
            onClick={() => onPageChanged(currentPage + 1)}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </div>
  );
};

Pagination.getData = (items, currentPage, itemsPerPage) => {
  //pour gérer les profils à afficher par page :
  //d'où on part (start) et pendant combien (itemsPerPage)
  const start = currentPage * itemsPerPage - itemsPerPage;
  return items.slice(start, start + itemsPerPage);
};

export default Pagination;
