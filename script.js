
var cart = JSON.parse(localStorage.getItem('cart'));
// var cart = {'iphone-14-pro-max': 1, 'galaxy-s23-ultra': 1}

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
    renderCart(products);
  });
});

function renderCart() {
  $('#cart-items').empty()
  for (const id in cart) {
    const product = products[id];
    // console.log(product);
    let HTML = 
     `<div class="d-flex gap-2">
        <img class="align-self-center" src="data/products-images/${id}.jpg" height="100">
        <div class="d-flex flex-grow-1 flex-column justify-content-between">
          <p class="m-0">${product.name}</p>
          <div class="d-flex flex-wrap mb-2 gap-1">`;
    
    // Adding tags
    for (const tag of ['ram', 'storage', 'display']) {
      if (product[tag]) {
        HTML += '<span class="badge rounded-1 text-secondary-emphasis border-secondary border fw-medium">';
        HTML += {
          ram: `<i class="bi bi-memory"></i> ${product.ram} GB`,
          storage: `<i class="bi bi-hdd-fill"></i> ${product.storage} GB`,
          display: `<i class="fi fi-rr-arrow-up-right-and-arrow-down-left-from-center"></i><span class='ps-1'>${product.display}"</span>`
        }[tag]
        HTML += '</span>'
      }
    }

    HTML +=
         `</div>
          <div class="input-group justify-content-end" style="min-width: max-content;">
            ${cart[id] > 1 ?
              `<button type="button" class="btn btn-primary pt-2" onclick="reduceProduct('${id}')">
                <i class="fi fi-rs-minus-small"></i>
              </button>`
              :
             `<button type="button" class="btn btn-primary pt-2" style="pointer-events: all; cursor: not-allowed" disabled>
                <i class="fi fi-rs-minus-small"></i>
              </button>`

            }
            
            <input type="number" class="form-control text-center" value="${cart[id]}" style="max-width: 40px;">
            <button type="button" class="btn btn-primary pt-2" onclick="addToCart('${id}')">
              <i class="fi fi-rs-plus-small"></i>
            </button>
          </div>
        </div>
        <div class="d-flex flex-column justify-content-between">
          <div class="text-end">
            ${parseInt(product['discount-price']) ?
             `<p class="text-danger fw-bold" style="margin-bottom: -5px;">$${product['discount-price']}</p>
              <small class="text-decoration-line-through text-secondary fw-normal">$${product.price}</small>`
            :
             `<p class='m-0 w-max'>$${product.price}</p>`
            }
          </div>
          <button type="button" class="btn btn-outline-danger pt-2 w-min" onclick="removeConfirm('${id}')">
            <i class="fi fi-bs-cart-minus"></i>
          </button>
        </div>
      </div>`
      $('#cart-items').append(HTML);
  }
}

function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Thêm / tăng số lượng sản phẩm giỏ hàng
function addToCart(id) {
  if (cart.hasOwnProperty(id)) { cart[id] += 1;}
  else { cart[id] = 1; }
  updateCart();
}

// Giảm số lượng sản phẩm trong giỏ hàng
function reduceProduct(id) {
  cart[id] -= 1;
  updateCart();
}

// Xóa sản phẩm khỏi giỏ hàng
function removeProduct(id) {
  delete cart[id];
  updateCart();
}


function Toast(target) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance($('#' + target));
  toastBootstrap.show();
}

function removeConfirm(id) {
  console.log(id);
  const modal = bootstrap.Modal.getOrCreateInstance($('#removeConfirmation'));
  
  $('#removeConfirmation .modal-footer')
  .empty()
  .append(`
    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cancel</button>
    <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal" onclick="removeProduct('${id}'); Toast('removedFromCart')">Remove</button>
  `)
  modal.show();
}

