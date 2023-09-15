// findAndPaginate
const findAndPaginate = async function (limit, req, queryObj = {}, pageQueryParam = "page") {
  if (!req) {
    throw new Error("Request object (req) is required.");
  }

  const page = req.query[pageQueryParam] || 1; // Get the page from query parameters

  if (+page == 0 || isNaN(+page)) {
    return null;
  }

  const offset = (page - 1) * limit;

  //   const results = await model.findAndCountAll({
  //     ...queryObj,
  //     offset,
  //     limit,
  //   });

  const results = await this.findAndCountAll({
    ...queryObj,
    offset,
    limit,
  });

  const totalItems = results.count;
  const totalPages = Math.ceil(totalItems / limit);

  if (+page > +totalPages) {
    return null;
  }

  // const baseUrl = `${req.protocol}://${req.get("host")}${req.url}`;
  const baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl.split("?")[0]}`;

  function generatePaginationLinks(baseUrl, currentPage, totalPages, pageQueryParam) {
    const links = [];

    // Function to add ellipsis link
    function addEllipsis() {
      links.push({
        url: null,
        label: "...",
        active: false,
      });
    }

    // Previous page link
    links.push({
      url: currentPage > 1 ? `${baseUrl}?${pageQueryParam}=${currentPage - 1}` : null,
      label: "&laquo; Previous",
      active: currentPage > 1,
    });

    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        links.push({
          url: `${baseUrl}?${pageQueryParam}=${i}`,
          label: i.toString(),
          active: i === currentPage,
        });
      }
    } else {
      // Display page links based on current page
      if (currentPage < 8) {
        for (let i = 1; i <= 10; i++) {
          links.push({
            url: `${baseUrl}?${pageQueryParam}=${i}`,
            label: i.toString(),
            active: i === currentPage,
          });
        }

        if (totalPages > 10) {
          addEllipsis();
          links.push({
            url: `${baseUrl}?${pageQueryParam}=${totalPages - 1}`,
            label: (totalPages - 1).toString(),
            active: currentPage === totalPages - 1,
          });
          links.push({
            url: `${baseUrl}?${pageQueryParam}=${totalPages}`,
            label: totalPages.toString(),
            active: currentPage === totalPages,
          });
        }
      } else {
        links.push({
          url: `${baseUrl}?${pageQueryParam}=1`,
          label: "1",
          active: false,
        });
        links.push({
          url: `${baseUrl}?${pageQueryParam}=2`,
          label: "2",
          active: false,
        });

        // Conditionally add ellipsis
        if (currentPage > totalPages - 6) {
          addEllipsis();
          for (let i = totalPages - 10; i <= totalPages - 2; i++) {
            links.push({
              url: `${baseUrl}?${pageQueryParam}=${i}`,
              label: i.toString(),
              active: i === currentPage,
            });
          }
        } else {
          addEllipsis();
          const startRange = Math.max(currentPage - 3, 3);
          const endRange = Math.min(currentPage + 3, totalPages - 2);
          for (let i = startRange; i <= endRange; i++) {
            links.push({
              url: `${baseUrl}?${pageQueryParam}=${i}`,
              label: i.toString(),
              active: i === currentPage,
            });
          }
          addEllipsis();
        }
        links.push({
          url: `${baseUrl}?${pageQueryParam}=${totalPages - 1}`,
          label: (totalPages - 1).toString(),
          active: currentPage === totalPages - 1,
        });
        links.push({
          url: `${baseUrl}?${pageQueryParam}=${totalPages}`,
          label: totalPages.toString(),
          active: currentPage === totalPages,
        });
      }
    }

    // Next page link
    links.push({
      url: currentPage < totalPages ? `${baseUrl}?${pageQueryParam}=${currentPage + 1}` : null,
      label: "Next &raquo;",
      active: currentPage < totalPages,
    });

    return links;
  }

  const response = {
    current_page: +page,
    data: results.rows,
    first_page_url: `${baseUrl}?${pageQueryParam}=1`,
    from: offset + 1,
    last_page: totalPages,
    last_page_url: `${baseUrl}?${pageQueryParam}=${totalPages}`,
    links: generatePaginationLinks(baseUrl, +page, totalPages, pageQueryParam),
    next_page_url: page < totalPages ? `${baseUrl}?${pageQueryParam}=${+page + 1}` : null,
    path: baseUrl,
    per_page: limit,
    prev_page_url: page > 1 ? `${baseUrl}?${pageQueryParam}=${+page - 1}` : null,
    to: offset + limit,
    total: totalItems,
  };

  return response;
};

// bootstrapLinks
const bootstrapLinks = function (links) {
  let html = '<nav aria-label=""><ul class="pagination">';

  links.forEach((link) => {
    if (link.url) {
      const label = link.label === "..." ? "<span>&hellip;</span>" : link.label;
      const classAttr = link.label === "&laquo; Previous" || link.label === "Next &raquo;" ? (link.active ? "" : "disabled") : link.active ? "active" : "";
      html += `
        <li class="page-item ${classAttr}">
          <a class="page-link" href="${link.url}" ${link.label === "&laquo; Previous" || link.label === "Next &raquo;" ? (link.active ? "" : "disabled") : ""}>
            ${label}
          </a>
        </li>
      `;
    } else {
      // Handle the case of null URL (ellipsis or disabled)
      const label = link.label === "..." ? "<span>&hellip;</span>" : link.label;
      const disabledAttr = !link.active ? "disabled" : "";
      html += `
        <li class="page-item">
          <span class="page-link" ${disabledAttr}>
            ${label}
          </span>
        </li>
      `;
    }
  });

  html += "</ul></nav>";
  return html;
};

// bootstrapLinks

const tailwindLinks = function (links) {
  let html = '<nav aria-label="Page navigation example"><ul class="inline-flex -space-x-px text-base h-10">';

  links.forEach((link) => {
    if (link.url) {
      const label = link.label === "..." ? "<span>&hellip;</span>" : link.label;
      const classAttr =
        link.label === "&laquo; Previous" || link.label === "Next &raquo;"
          ? link.active
            ? "text-blue-600"
            : "text-gray-500 cursor-not-allowed"
          : link.active
          ? "text-blue-600 bg-blue-50 border border-gray-300 hover:bg-blue-100 hover:text-blue-700"
          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
      const liClassAttr = link.label === "Previous" ? "rounded-l-lg" : link.label === "Next" ? "rounded-r-lg" : "";
      const ariaCurrentAttr = link.active ? 'aria-current="page"' : "";

      html += `
        <li>
          <a href="${link.url}" ${ariaCurrentAttr} class="flex items-center justify-center px-4 h-10 leading-tight ${classAttr} ${liClassAttr}">
            ${label}
          </a>
        </li>
      `;
    } else {
      // Handle the case of null URL (ellipsis or disabled)
      const label = link.label === "..." ? "<span>&hellip;</span>" : link.label;
      const classAttr =
        link.label === "&laquo; Previous" || link.label === "Next &raquo;"
          ? link.active
            ? "text-blue-600"
            : "text-gray-500 cursor-not-allowed"
          : link.active
          ? "text-blue-600 bg-blue-50 border border-gray-300 hover:bg-blue-100 hover:text-blue-700"
          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
      const liClassAttr = link.label === "Previous" ? "rounded-l-lg" : link.label === "Next" ? "rounded-r-lg" : "";
      const disabledAttr = !link.active ? 'aria-disabled="true"' : "";
      html += `
        <li>
          <a ${disabledAttr} class="flex items-center justify-center px-4 h-10 leading-tight ${classAttr} ${liClassAttr}">
            ${label}
          </a>
        </li>
      `;
    }
  });

  html += "</ul></nav>";
  return html;
};

// addQueryString

const addQueryString = function (links, query, pageQuery = "page") {
  // Remove the "page" query parameter if it exists
  delete query[pageQuery];

  const queryString = buildQueryString(query);

  return links.map((link) => {
    if (link.url) {
      // Append the query string to the URL if it's not null
      const url = link.url + (queryString ? `&${queryString}` : "");
      return { ...link, url };
    }
    return link; // Return unchanged if it's not a URL link
  });
};

// buildQueryString
const buildQueryString = function (queryObj) {
  const queryString = Object.keys(queryObj)
    .map((key) => `${key}=${queryObj[key]}`)
    .join("&");
  return queryString;
};

module.exports = { findAndPaginate, bootstrapLinks, tailwindLinks, addQueryString };
