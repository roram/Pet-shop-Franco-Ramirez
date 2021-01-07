//FUNCIONES QUE NECESITA BOOTSTRAP PARA FORMULARIOS, LO COPIE Y PEGUE
//VALIDA FORMULARIOS
(function () {
   'use strict'
   // Fetch all the forms we want to apply custom Bootstrap validation styles to
   var forms = document.querySelectorAll('.needs-validation')
 
   // Loop over them and prevent submission
   Array.prototype.slice.call(forms)
     .forEach(function (form) {
       form.addEventListener('submit', function (event) {
         if (!form.checkValidity()) {
           event.preventDefault()
           event.stopPropagation()
         }
         form.classList.add('was-validated')
       }, false)
     })
 })()
//MUESTRA TOASTS
var toastElList = [].slice.call(document.querySelectorAll('.toast'))
var toastList = toastElList.map(function (toastEl) {
  return new bootstrap.Toast(toastEl, option)
})

//LO QUE YO PROGRAME
//FUNCION PARA OBTENER DATOS
function fetchData(){
   fetch('../js/data.json') //https://apipetshop.herokuapp.com/api/articulos
   .then(response => response.json())
   .then(data => funcionPrincipal(data.response) )
}
if(document.getElementById('inicio') || document.getElementById('registro')){

}else{
   fetchData()
}

//COMPRUEBO EN QUE PÁGINA ESTOY

//FUNCION GENERAL PARA UTILIZAR LOS DATOS

function funcionPrincipal(dataRaw){

   if(document.getElementById('farmacia')){

      cargaProductos(dataRaw, document.getElementById('farmacia'), 'Medicamento')

   }else if(document.getElementById('juguetes')){

      cargaProductos(dataRaw, document.getElementById('juguetes'), 'Juguete')

   }else if(document.getElementById('articulo')){
      dataRaw.filter((dataRaw) => {
         if(dataRaw._id == localStorage.getItem("id")){
            return impArti(dataRaw, document.getElementById('articulo'))
         }
      })
   }else if(document.getElementById('carrito')){

      arrArtCarrito = JSON.parse(localStorage.getItem('idComp'))

      if(arrArtCarrito){
         var arrCarrito = dataRaw.filter((art) =>{
            for(var i = 0; i < arrArtCarrito.length; i++){
               if(art._id == arrArtCarrito[i].idComp){
                  return art
               }
            }
         })
         //CREA LOS ELEMENTOS DEL CARRITO
         arrCarrito.map((art) => {
   
            var row = document.createElement('tr')
            row.classList.add('align-center')
            row.innerHTML = `
            <td class="text-center align-middle"><img class="img-fluid img-thumbnail" src="${art.imagen}" alt="Imagen de articulo"></td>
            <td class="text-center align-middle">${art.nombre}</td>
            <td class="text-center align-middle fw-bold">$ ${art.precio}</td>
            `
            var tdEli = document.createElement('td')
            tdEli.classList.add('text-center', 'align-middle', 'col-1')
   
            var btnEli = document.createElement('button')
            btnEli.classList.add('btn', 'btn-danger')
            btnEli.innerText = 'X'
            btnEli.addEventListener('click', function(){
               btnEli.parentElement.parentElement.remove()
            })
   
            tdEli.appendChild(btnEli)
            row.appendChild(tdEli)
            document.getElementById('carrito').appendChild(row)
         })
   
         var btnCompra = document.getElementById('compra')
         var btnCancCompra = document.getElementById('cancCompra')
   
         btnCompra.addEventListener('click', function(){
            localStorage.clear();
         })
   
         btnCancCompra.addEventListener('click', function(){
            localStorage.clear();
         })
   
         var cantidadProducCarrito = document.getElementById('cantProd')
         cantidadProducCarrito.innerHTML = `<i class="fas fa-shopping-cart"></i> ${arrArtCarrito.length}`

      }
   
   }
}
//FUNCION QUE CARGA PRODUCTOS EN CADA PÁGINA
function cargaProductos(dataRaw, rowFather, tipo){
   dataRaw.map((dataRaw) =>{
      if(dataRaw.tipo == tipo){
         return crarArticulo(dataRaw, rowFather)
      }
   })
}
//CREA LAS TARJETAS DE LOS PRODUCTOS
function crarArticulo(dataRaw, rowFather){
   //DISPONIBILIDAD
   var stock = '<div class="badge"><div class="esp"></div></div>'
   //ESTO ES UN PARCHE, BUSCAR MEJOR RESOLUCION
   var border = '-'
   if(dataRaw.stock <= 5){
      stock = '<div class="badge bg-danger rounded-0 text-white">¡¡ULTIMAS UNIDADES!!</div>'
      border = 'border-danger'
   }
   const articulo = document.createElement('div')
   articulo.classList.add('col-3','py-5')

   const articuloContenedor = document.createElement('div')
   articuloContenedor.classList.add('card', border)
   
   articuloContenedor.innerHTML = `
   <img src="${dataRaw.imagen}" class="card-img-top img-thumbnail" alt="Imagen de producto">
   ${stock}
   <div class="card-body">
      <h3 class="card-title bd-highlight text-center">$ ${dataRaw.precio}</h3>
      
      <p class="card-text bd-highlight text-center"> ${dataRaw.nombre}</p> 
   </div>
   `
   const btn = document.createElement('a')
   btn.classList.add('btn', 'btn-amber-acc-4', 'rounded-0') 
   btn.setAttribute('id', dataRaw._id)
   btn.setAttribute('href', './articulo.html')
   btn.innerHTML = '+ Información'
   btn.addEventListener('click', function( ){
      
      const idProd = dataRaw._id
      localStorage.setItem('id', idProd)

   })
   articuloContenedor.appendChild(btn)
   articulo.appendChild(articuloContenedor)

   rowFather.appendChild(articulo)
}
//FUNCION PARA MOSTRAR LOS DATOS EN PAGINA ARTICULO
function impArti(dataRaw, row){
   


   // const articuloDetRow = document.createElement('div')
   // articuloDetRow.classList.add('row', 'mt-5')

   // const articuloDetCol = document.createElement('div')
   // articuloDetCol.classList.add('col-12')


   //CREO ELEMENTO PARA ELEGIR LA CANTIDAD DE PRODUCTOS DEPENDIENDO DEL STOCK
   

   // articuloDetCol.innerHTML =
   //    <div class="col-12 d-flex justify-content-center align-items-center">
   //       <div class="col-5">
   //          <img class="img-fluid img-thumbnail" src="${dataRaw.imagen}" alt="Imagen de artículo">
   //       </div>
   //       <div class="col-4">
   //          <h1>${dataRaw.nombre}</h1>
   //          <h2>${dataRaw.tipo}</h2>
   //          <h2>$ ${dataRaw.precio}</h2>
   //          <h2>
   //             <div class="dropdown">
   //                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
   //                Cantidad de articulos
   //                </button>
   //                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
   //                <li><a class="dropdown-item" href="#">1</a></li>
   //                <li><a class="dropdown-item" href="#">2</a></li>
   //                <li><a class="dropdown-item" href="#">3</a></li>
   //                </ul>
   //             </div>
   //          </h2>
   //          <p>${dataRaw.descripcion}</p>
   //       </div>
   //    </div>
   
// LO QUE TENGO QUE RECREAR
//    <div class="col-4">
//          <h1>${dataRaw.nombre}</h1>
//          <h2>${dataRaw.tipo}</h2>
//          <h2>$ ${dataRaw.precio}</h2>
//          <h2>
//             <div class="dropdown">
//                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
//                Cantidad de articulos
//                </button>
//                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
//                <li><a class="dropdown-item" href="#">1</a></li>
//                <li><a class="dropdown-item" href="#">2</a></li>
//                <li><a class="dropdown-item" href="#">3</a></li>
//                </ul>
//             </div>
//          </h2>
//          <p>${dataRaw.descripcion}</p>
//       </div>

   //BOTON PARA VOLVER ATRAS

   // const rowBoth = document.createElement('div')
   // rowBoth.classList.add('row','d-flex', 'justify-content-center')

   // const colBoth = document.createElement('div')
   // colBoth.classList.add('col-4')
   

   // const btnPrev = document.createElement('a')
   // btnPrev.classList.add('btn','btn-primary' , 'm-3')
   // btnPrev.setAttribute('type','button')
   // btnPrev.innerText = 'Volver al sitio anterior'

   // btnPrev.addEventListener('click', function(){
   //    history.back()
   // })

   // var objArt = {}
   // var arrArti = []

   //BOTON PARA GUARDAR LA COMPRA
   // const btnComp = document.createElement('a')
   // btnComp.classList.add('btn', 'btn-success', 'm-3')
   // btnComp.setAttribute('type','button')

   // btnComp.innerText = 'Añadir al carrito'
   // btnComp.setAttribute('data-bs-toggle','modal')
   // btnComp.setAttribute('data-bs-target','#exampleModal')

   // btnComp.addEventListener('click', function(){
   //    if(localStorage.getItem('idComp')){
   //       arrArti = JSON.parse(localStorage.getItem('idComp'))
   //       objArt['idComp'] = localStorage.getItem('id')
   //       arrArti.push(objArt) 
   //       localStorage.setItem('idComp', JSON.stringify(arrArti))
   //    }else{
   //       objArt['idComp'] = localStorage.getItem('id')
   //       arrArti.push(objArt)
   //       localStorage.setItem('idComp', JSON.stringify(arrArti))
   //    }
   // }) 
   
   // rowBoth.appendChild(btnComp)
   // rowBoth.appendChild(btnPrev)
   // articuloDetCol.appendChild(rowBoth)
   // articuloDetRow.appendChild(articuloDetCol)
   // row.appendChild(articuloDetRow)
}

//EL BOTON DEL CARRITO QUE SE ACTUALICE A LO ÚLTIMO
var contarProd = document.getElementById('cantProd')
var cantProd = JSON.parse(localStorage.getItem('idComp'))
if(cantProd){
   contarProd.innerHTML = `<i class="fas fa-shopping-cart"></i> ${cantProd.length}`
}else{
   contarProd.innerHTML = `<i class="fas fa-shopping-cart"></i> 0`
}

