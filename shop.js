
var products = {};
$.get("./data/products.csv", function(data) {
	const lines = data.trim().split('\r\n');
	const header = lines[0].split(',').slice(1);

	for (let line of lines.slice(1)) {
	var product = {};
	const values = line.split(',');
	for (let i in header) {
		product[header[i]] = values[parseInt(i) + 1];
	}
	products[values[0]] = product;
	}
}, 'text').done(function() {
	$(document).ready(function() {
    
		renderProducts(Object.keys(products));
	})
});

function renderProducts(product_list) {
  $('#product-container').empty()
  for (const id of product_list) {
    const product = products[id];
    
    let HTML =
    `<div class="card pt-3 flex-shrink-1" style="max-width: 14rem;">
      <img src="data/products-images/${id}.jpg" class="card-img-top p-3">
      <div class="card-body d-flex flex-column">
      <p class="card-title">${product.name}</p>
      <div class="flex-wrap mb-2 d-inline-flex gap-1">`;

    // Adding tags
    for (const tag of ['brand', 'ram', 'storage', 'display']) {
      if (product[tag]) {
        HTML += '<span class="badge rounded-1 text-secondary-emphasis text-bg-secondary bg-opacity-25 fw-medium">';
        HTML += {
          brand: {
            Apple: `<i class="fi fi-brands-apple"></i> ${product.brand}`,
            Samsung: '<i class="fi fi-brands-samsung"></i>'
          }[product.brand],
          ram: `<i class="bi bi-memory"></i> ${product.ram} GB`,
          storage: `<i class="bi bi-hdd-fill"></i> ${product.storage} GB`,
          display: `<i class="fi fi-rr-arrow-up-right-and-arrow-down-left-from-center"></i><span class='ps-1'>${product.display}"</span>`
        }[tag]
        HTML += '</span>'
      }
    }

    HTML +=  
      `</div>
        <div class="d-flex flex-column flex-grow-1 justify-content-end">
          <div class="mt-2 mb-1">
            ${parseInt(product['discount-price']) ?
             `<p class="text-danger fw-bold d-inline">$${product['discount-price']}</p>
              <small class="text-decoration-line-through text-secondary fw-normal">$${product.price}</small>`
            :
             `<p class='m-0'>$${product.price}</p>`
            }
          </div>
          <div class="d-flex gap-1">
            <button type="button" class="btn btn-outline-primary flex-grow-1">Buy now</button>
            <button type="button" class="btn btn-primary float-end" onclick="addToCart('${id}'); Toast('addedToCart')">
              <i class="bi bi-cart-plus-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>`
    $('#product-container').append(HTML);
  }
}

// function updateFilters() {
//   console.log("Update filter please");
  
// }

function filterByTag(productList) {
  $("[id^='filter-ram-'], [id^='filter-storage-']").each(function() {
    console.log($(this).prop('checked'));
    console.log($(this));
  })
  
  return [];
}

// $("[id^='filter-ram-'], [id^='filter-storage-']").on("change", function() {
  
// });

$("[id^='filter-']").on("change", function() {
  const filteredByTag = filterByTag(products);


  renderProducts(Object.keys(products));
})