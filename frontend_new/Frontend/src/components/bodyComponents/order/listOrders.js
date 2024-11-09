import productList from "../inventory/productList";

const customer = {
    firstName: "Unostar",
    lastName: "Value Chain Pvt Ltd",
    mobile: "+020 - 27451946",
  };

  const orders = [
    {
      id: 1,
      products: [{quantity:5,product:productList[0]}, {quantity:5,product:productList[1]},{quantity:5,product: productList[2]}],
      customer: customer,
    },
    {
      id: 2,
    
      products: [{quantity:5,product:productList[1]}, {quantity:5,product:productList[1]},{quantity:5,product: productList[2]}],
      customer: customer,
    },
    {
      id: 3,
     
      products: [{quantity:5,product:productList[2]}, {quantity:5,product:productList[1]},{quantity:5,product: productList[2]}],
      customer: customer,
    },
    {
      id: 4,
    
      products: [{quantity:5,product:productList[3]}, {quantity:5,product:productList[1]},{quantity:5,product: productList[2]}],
      customer: customer,
    },
    {
      id: 5,
    
      products: [{quantity:5,product:productList[4]}, {quantity:5,product:productList[1]},{quantity:5,product: productList[2]}],
      customer: customer,
    },
    {
      id: 6,
   
      products: [{quantity:5,product:productList[5]}, {quantity:5,product:productList[1]},{quantity:5,product: productList[2]}],
      customer: customer,
    },
    {
      id: 7,
  
      products: [{quantity:5,product:productList[6]}, {quantity:5,product:productList[1]},{quantity:5,product: productList[2]}],
      customer: customer,
    },
    {
      id: 8,
     
      products: [{quantity:5,product:productList[7]}, {quantity:5,product:productList[1]},{quantity:5,product: productList[2]}],
      customer: customer,
    },
    {
      id: 9,
    
      products: [{quantity:5,product:productList[8]}, {quantity:5,product:productList[1]},{quantity:5,product: productList[2]}],
      customer: customer,
    },
    {
      id: 10,
    
      products: [{quantity:5,product:productList[9]}, {quantity:5,product:productList[1]},{quantity:5,product: productList[2]}],
      customer: customer,
    },
   
  ];

  export default orders;